# Union 和 Annotated 类型注解

在 Python 类型系统中，`Union` 和 `Annotated` 是两个重要的类型注解工具，特别是在 FastAPI 中广泛使用。

## 1. Union 类型

`Union` 用于表示一个变量可以是多种类型之一。

### 1.1 基本语法

```python
from typing import Union

# 表示变量可以是 int 或 str 类型
age: Union[int, str] = 25  # 可以是整数
age: Union[int, str] = "25岁"  # 也可以是字符串
```

### 1.2 在 FastAPI 中的应用

#### 查询参数示例

```python
from typing import Union
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/user/")
async def get_user(age: Union[int, str] = None):
    """获取用户信息，年龄可以是数字或字符串"""
    return {"age": age}
```

#### 请求体示例

```python
from typing import Union
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: Union[int, str]  # 年龄可以是整数或字符串

@app.post("/users/")
async def create_user(user: User):
    return user
```

### 1.3 可选类型

在 Python 3.10 之前，使用 `Union[Type, None]` 表示可选类型：

```python
from typing import Union
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/")
async def read_items(q: Union[str, None] = None):
    """q 是可选的字符串参数"""
    return {"q": q}
```

## 2. Annotated 类型

`Annotated` 是 Python 3.9+ 引入的类型注解，允许为类型添加额外的元数据。

### 2.1 基本语法

```python
from typing import Annotated

# Annotated[类型, 元数据1, 元数据2, ...]
age: Annotated[int, "用户年龄", "大于等于0"]
```

### 2.2 在 FastAPI 中的应用

#### Query 参数校验

```python
from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
async def read_items(
    q: Annotated[str | None, Query(
        min_length=3,
        max_length=50,
        description="搜索关键词"
    )] = None
):
    """使用 Annotated 进行参数校验"""
    return {"q": q}
```

#### 请求体校验

```python
from typing import Annotated
from pydantic import BaseModel, Field

class User(BaseModel):
    name: Annotated[str, Field(min_length=2, max_length=50)]
    age: Annotated[int, Field(ge=0, le=120, description="年龄必须在0-120之间")]

@app.post("/users/")
async def create_user(user: User):
    return user
```

### 2.3 自定义元数据

```python
from typing import Annotated
from pydantic import BaseModel

# 自定义元数据
Sensitive = Annotated[str, "敏感信息", "需要加密"]

class UserData(BaseModel):
    username: str
    password: Sensitive
    phone: Sensitive

# 获取元数据的函数
def get_metadata(annotation):
    if hasattr(annotation, '__metadata__'):
        return annotation.__metadata__
    return []
```

## 3. Python 版本兼容性

### 3.1 Python 3.8 及以下

```python
from typing import Union, Optional
from fastapi import FastAPI

app = FastAPI()

# 使用 Union 表示可选
@app.get("/items/")
async def read_items(q: Union[str, None] = None):
    return {"q": q}

# 或者使用 Optional（Optional[X] 等同于 Union[X, None]）
@app.get("/products/")
async def read_products(name: Optional[str] = None):
    return {"name": name}
```

### 3.2 Python 3.9+

```python
# 可以使用新的类型联合语法
from typing import Optional
from fastapi import FastAPI

app = FastAPI()

# 使用 | 操作符
@app.get("/items/")
async def read_items(q: str | None = None):
    return {"q": q}
```

### 3.3 Python 3.9+ 推荐使用 Annotated

```python
from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
async def read_items(
    q: Annotated[str | None, Query(
        min_length=3,
        max_length=50
    )] = None
):
    return {"q": q}
```

## 4. 实际应用示例

### 4.1 复杂的查询参数

```python
from typing import Annotated, Union
from fastapi import FastAPI, Query
from datetime import datetime

app = FastAPI()

@app.get("/search/")
async def search_items(
    q: Annotated[str | None, Query(
        min_length=1,
        max_length=100,
        description="搜索关键词"
    )] = None,
    category: Annotated[
        Union[str, None],
        Query(description="产品类别")
    ] = None,
    price_min: Annotated[
        Union[float, None],
        Query(ge=0, description="最低价格")
    ] = None,
    created_after: Annotated[
        Union[datetime, None],
        Query(description="创建时间之后")
    ] = None
):
    """复杂搜索接口"""
    return {
        "query": q,
        "category": category,
        "price_min": price_min,
        "created_after": created_after
    }
```

### 4.2 多种类型的响应

```python
from typing import Annotated, Union, Dict, List
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    id: int
    name: str

class Product(BaseModel):
    id: int
    title: str
    price: float

# 定义响应可以是多种类型
ResponseData = Union[User, Product, List[User], Dict[str, str]]

@app.get("/data/{data_type}")
async def get_data(data_type: str) -> ResponseData:
    """根据类型返回不同格式的数据"""
    if data_type == "user":
        return User(id=1, name="张三")
    elif data_type == "product":
        return Product(id=1, title="商品", price=99.99)
    elif data_type == "users":
        return [User(id=1, name="张三"), User(id=2, name="李四")]
    else:
        return {"message": "未知数据类型"}
```

### 4.3 使用 Annotated 添加验证规则

```python
from typing import Annotated, Union
from pydantic import BaseModel, Field, field_validator

# 定义常用的约束类型
PositiveInt = Annotated[int, Field(gt=0, description="必须为正整数")]
NonEmptyString = Annotated[str, Field(min_length=1, description="不能为空")]
EmailStr = Annotated[str, Field(regex=r'^[^@]+@[^@]+\.[^@]+$', description="必须是有效的邮箱地址")]

class User(BaseModel):
    id: PositiveInt
    username: NonEmptyString
    email: EmailStr
    age: Annotated[int, Field(ge=0, le=150)]

    @field_validator('username')
    def username_alphanumeric(cls, v):
        if not v.isalnum():
            raise ValueError('用户名只能包含字母和数字')
        return v

@app.post("/users/")
async def create_user(user: User):
    return user
```

## 5. 最佳实践

### 5.1 选择合适的语法

- **Python 3.8-**: 使用 `Union[X, Y]` 或 `Optional[X]`
- **Python 3.9+**: 使用 `X | Y` 语法更简洁
- **需要元数据**: 优先使用 `Annotated`

### 5.2 保持一致性

```python
# 好的做法：统一使用一种风格
from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()

# 所有参数都使用 Annotated
@app.get("/items/")
async def read_items(
    q: Annotated[str | None, Query(min_length=3)] = None,
    limit: Annotated[int, Query(le=100, ge=1)] = 10
):
    pass
```

### 5.3 为复杂的类型创建别名

```python
from typing import Annotated, Union
from pydantic import BaseModel, Field

# 创建可重用的类型别名
UserID = Annotated[int, Field(gt=0, description="用户ID")]
Username = Annotated[str, Field(min_length=3, max_length=20)]
OptionalStr = Union[str, None]

class User(BaseModel):
    id: UserID
    name: Username
    bio: OptionalStr = None
```

## 6. 总结

| 特性            | Union              | Annotated              |
| --------------- | ------------------ | ---------------------- |
| 基本用途        | 表示多种可能的类型 | 为类型添加元数据       |
| 语法简洁性      | 简单               | 稍复杂                 |
| 表达能力        | 基础               | 强大                   |
| FastAPI 集成    | 良好               | 优秀                   |
| Python 版本要求 | 3.5+               | 3.9+                   |
| 推荐场景        | 简单的类型联合     | 需要额外约束或元数据时 |

### 使用建议：

1. **简单的类型联合**：使用 `Union` 或 `|` 操作符
2. **需要添加验证规则**：使用 `Annotated`
3. **需要额外的元数据**：使用 `Annotated`
4. **Python 3.9+ 项目**：优先考虑使用 `Annotated`
5. **保持向后兼容**：Python 3.8 项目使用 `Union`

通过合理使用 `Union` 和 `Annotated`，可以让您的 FastAPI 应用更加健壮和易于维护。
