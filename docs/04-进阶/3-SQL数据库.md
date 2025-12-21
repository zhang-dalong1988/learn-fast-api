# SQL 数据库

FastAPI 不直接与数据库交互,但你可以使用任何数据库库,如 SQLAlchemy、Databases、Tortoise-ORM 等.

本指南将展示如何使用 SQLAlchemy(最流行的 Python ORM)来集成 SQL 数据库.

## 安装依赖

```bash
pip install sqlalchemy
pip install psycopg2-binary  # PostgreSQL
# 或者
pip install pymysql          # MySQL
# 或者
pip install sqlite3          # SQLite (通常已内置)
```

## 基本设置

### 1. 创建数据库模型

使用 SQLAlchemy 创建模型:

```python
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
```

### 2. 数据库连接配置

```python
from sqlalchemy import create_engine

# SQLite 示例
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# PostgreSQL 示例
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建数据库表
Base.metadata.create_all(bind=engine)
```

### 3. 依赖项获取数据库会话

```python
from fastapi import Depends
from sqlalchemy.orm import Session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## Pydantic 模型

创建 Pydantic 模型用于数据验证和序列化:

```python
from pydantic import BaseModel

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True
```

## CRUD 操作

创建基本的 CRUD 操作:

```python
from sqlalchemy.orm import Session
from typing import List

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

## 路由操作

创建 FastAPI 路由操作:

```python
from fastapi import Depends, FastAPI, HTTPException
from typing import List

app = FastAPI()

@app.post("/users/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db=db, user=user)

@app.get("/users/", response_model=List[User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
```

## 完整示例

```python
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    items = relationship("Item", back_populates="owner")

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="items")
```

## 异步数据库操作

如果你使用异步数据库驱动(如 `asyncpg` 或 `aiomysql`),可以使用异步方式:

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# 异步数据库 URL
SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://user:password@postgresserver/db"

engine = create_async_engine(SQLALCHEMY_DATABASE_URL)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_async_db():
    async with async_session() as session:
        yield session

# 异步 CRUD 操作
async def async_get_user(async_db: AsyncSession, user_id: int):
    result = await async_db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()

# 异步路由
@app.get("/async-users/{user_id}", response_model=User)
async def async_read_user(user_id: int, async_db: AsyncSession = Depends(get_async_db)):
    user = await async_get_user(async_db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

## 使用 Alembic 进行数据库迁移

Alembic 是 SQLAlchemy 的数据库迁移工具:

```bash
# 安装 Alembic
pip install alembic

# 初始化迁移环境
alembic init alembic

# 配置 alembic.ini 中的 sqlalchemy.url

# 创建迁移
alembic revision --autogenerate -m "Initial migration"

# 应用迁移
alembic upgrade head
```

## 连接池配置

配置数据库连接池以提高性能:

```python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    poolclass=QueuePool,
)
```

## 最佳实践

1. **使用连接池**:配置适当的连接池参数以提高性能
2. **异步操作**:对于高并发应用,考虑使用异步数据库操作
3. **使用迁移工具**:使用 Alembic 管理数据库架构变更
4. **环境变量**:使用环境变量存储数据库连接信息
5. **错误处理**:适当处理数据库连接错误
6. **索引**:为经常查询的字段创建索引
7. **事务管理**:确保正确提交或回滚事务

## 示例环境变量

使用 `.env` 文件管理配置:

```bash
# .env
DATABASE_URL=postgresql://user:password@localhost/dbname
```

```python
# 在代码中使用
from dotenv import load_dotenv
import os

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
```

## 总结

FastAPI 可以与任何 SQL 数据库很好地集成.SQLAlchemy 提供了强大的 ORM 功能,使得数据库操作更加 Pythonic.记住:

1. 使用依赖注入管理数据库会话
2. 使用 Pydantic 模型进行数据验证
3. 考虑使用异步操作提高性能
4. 使用迁移工具管理数据库变更
5. 始终正确关闭数据库连接