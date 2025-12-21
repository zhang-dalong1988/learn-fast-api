# Pydantic 简要介绍

Pydantic 是一个强大的 Python 数据验证和设置管理库,使用 Python 类型提示进行数据验证.它是 FastAPI 的核心依赖,提供了自动的数据验证、序列化和文档生成功能.

## 核心特性

- **类型安全**:基于 Python 类型注解进行验证
- **高性能**:使用 Rust 编写的核心,速度极快
- **易用性**:直观的 API,最小化样板代码
- **集成性**:与主流框架完美集成
- **自动文档**:自动生成 JSON Schema

## 基础使用

### 1. 定义模型

```python
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class User(BaseModel):
    id: int
    name: str
    email: str
    age: Optional[int] = None
    is_active: bool = True
    tags: List[str] = []
    created_at: datetime

# 创建实例
user = User(
    id=1,
    name="John Doe",
    email="john@example.com",
    age=30,
    tags=["developer", "python"]
)

print(user.name)  # John Doe
print(user.dict())  # 转换为字典
print(user.json())  # 转换为 JSON 字符串
```

### 2. 数据验证

```python
from pydantic import BaseModel, ValidationError, Field

class Product(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    price: float = Field(..., gt=0, description="Price must be positive")
    discount: float = Field(0, ge=0, le=1)
    tags: List[str] = Field(default=[], max_items=10)

# 正确的数据
product = Product(name="Laptop", price=999.99, discount=0.1)
print(product)

# 错误的数据
try:
    invalid_product = Product(name="", price=-100)
except ValidationError as e:
    print(e.json(indent=2))
```

### 3. 类型转换

```python
from pydantic import BaseModel
from datetime import datetime

class Event(BaseModel):
    name: str
    start_time: datetime
    duration: int  # 分钟

# Pydantic 自动转换类型
event = Event(
    name="Meeting",
    start_time="2024-01-01T10:00:00",  # 字符串转 datetime
    duration="120"  # 字符串转 int
)

print(type(event.start_time))  # <class 'datetime.datetime'>
print(event.duration)  # 120 (int)
```

## 高级功能

### 1. 自定义验证器

```python
from pydantic import BaseModel, field_validator

class User(BaseModel):
    username: str
    password: str

    @field_validator('username')
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError('Username too short')
        return v.lower()

    @field_validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password too short')
        return v
```

### 2. 嵌套模型

```python
from typing import List

class Address(BaseModel):
    street: str
    city: str
    country: str

class User(BaseModel):
    name: str
    addresses: List[Address]

user = User(
    name="John",
    addresses=[
        {"street": "123 Main St", "city": "New York", "country": "USA"},
        {"street": "456 Oak Ave", "city": "Boston", "country": "USA"}
    ]
)
```

### 3. 配置选项

```python
from pydantic import BaseModel, ConfigDict

class Model(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,  # 去除字符串两端空格
        validate_assignment=True,   # 赋值时验证
        use_enum_values=True,       # 使用枚举值
        frozen=True,               # 实例创建后不可修改
        extra='forbid'            # 禁止额外字段
    )

    name: str
    value: int
```

## 常用 Field 参数

```python
from pydantic import BaseModel, Field, EmailStr, HttpUrl

class Item(BaseModel):
    # 基础验证
    name: str = Field(..., min_length=1, max_length=100)

    # 数值验证
    price: float = Field(..., gt=0, le=10000)
    quantity: int = Field(1, ge=1, le=100)

    # 字符串验证
    code: str = Field(..., regex=r'^[A-Z]{3}-\d{4}$')

    # 特殊类型
    email: EmailStr  # 需要安装 email-validator
    website: HttpUrl  # 需要安装 httpx

    # 默认值和工厂
    created_at: datetime = Field(default_factory=datetime.now)
    tags: List[str] = Field(default_factory=list)

    # 描述
    description: str = Field(None, description="Item description")
```

## 数据导出

```python
# Pydantic v2
user = User(name="John", email="john@example.com")

# 转换为字典
user_dict = user.model_dump()

# 转换为 JSON
user_json = user.model_dump_json()

# 包含/排除字段
user_dict = user.model_dump(include={"name", "email"})
user_dict = user.model_dump(exclude={"id", "password"})

# 处理未设置的字段
update_data = user.model_dump(exclude_unset=True)

# 别名
class User(BaseModel):
    internal_id: str = Field(alias="id")
    user_name: str = Field(alias="name")

user = User(id=123, name="John")  # 使用别名
print(user.internal_id)  # 123
print(user.model_dump(by_alias=True))  # {"id": 123, "name": "John"}
```

## 错误处理

```python
from pydantic import ValidationError, BaseModel

try:
    user = User(name="", email="invalid-email")
except ValidationError as e:
    print("Validation errors:")
    for error in e.errors():
        print(f"  - {error['loc']}: {error['msg']}")

    # 输出 JSON 格式错误
    print(e.json(indent=2))
```

## 最佳实践

### 1. 模型分离

```python
# 输入模型
class UserCreate(BaseModel):
    username: str
    password: str
    email: EmailStr

# 更新模型(所有字段可选)
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None

# 数据库模型(包含所有字段)
class UserInDB(BaseModel):
    id: int
    username: str
    hashed_password: str
    email: EmailStr
    is_active: bool
    created_at: datetime

# 响应模型(排除敏感信息)
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool
    created_at: datetime
```

### 2. 使用 Mixin

```python
from pydantic import BaseModel

class TimestampMixin(BaseModel):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class SoftDeleteMixin(BaseModel):
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None

class User(TimestampMixin, SoftDeleteMixin):
    name: str
    email: str
```

### 3. 通用验证器

```python
from typing import Any
from pydantic import field_validator

class BaseModel(BaseModel):
    @field_validator('*', mode='before')
    def empty_str_to_none(cls, v: Any) -> Any:
        if isinstance(v, str) and v == "":
            return None
        return v

class Product(BaseModel):
    name: str
    description: Optional[str] = None

# "" 字符串会被转换为 None
product = Product(name="Laptop", description="")
print(product.description)  # None
```

## 性能优化

```python
from pydantic import BaseModel, ConfigDict

# 使用配置优化性能
class OptimizedModel(BaseModel):
    model_config = ConfigDict(
        validate_assignment=True,  # 赋值时验证
        use_enum_values=True,     # 避免枚举转换开销
        str_strip_whitespace=True,
    )

    name: str
    status: str

# 对于大量数据,使用 construct 跳过验证
data = [{"name": "item1", "status": "active"}, ...]
items = [OptimizedModel.construct(**item) for item in data]
```

## 与 FastAPI 集成

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.post("/items/")
async def create_item(item: Item):
    # FastAPI 自动验证请求体
    return {"item": item}

@app.get("/items/", response_model=list[Item])
async def list_items():
    # FastAPI 自动验证响应
    return [{"name": "Laptop", "price": 999.99}]
```

## 常见问题

### 1. 版本差异

```python
# Pydantic v1
user.dict()
user.json()

# Pydantic v2
user.model_dump()
user.model_dump_json()
```

### 2. 日期时间处理

```python
from datetime import datetime
from pydantic import BaseModel

class Model(BaseModel):
    # 自动解析各种格式
    dt: datetime

# 接受的格式:
# - ISO 8601 字符串
# - timestamp
# - datetime 对象
m = Model(dt="2024-01-01T00:00:00")
```

### 3. 可选字段

```python
from typing import Optional, Union

# 推荐写法(Pydantic v2)
field: Optional[str] = None

# 或者
field: str | None = None

# 明确指定 None 也是有效值
field: Union[str, None] = None
```

## 总结

Pydantic 通过 Python 类型提示提供了强大而优雅的数据验证方案:

- **类型驱动**:利用 Python 的类型系统
- **自动验证**:无需手写验证代码
- **高性能**:Rust 实现的核心
- **易集成**:与 FastAPI 等框架无缝集成

它是现代 Python 开发中处理数据验证的首选工具!