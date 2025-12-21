# JSON 兼容编码器

有些数据类型（如 `datetime` 对象）不能直接转换为 JSON。

**FastAPI** 使用 `jsonable_encoder` 将不能转换为 JSON 的数据类型转换为兼容的版本。

## 何时使用 `jsonable_encoder`

当您需要将数据转换为 JSON 兼容格式时，可以使用 `jsonable_encoder`。

常见的使用场景包括：

- 将 Pydantic 模型转换为 JSON
- 将 `datetime` 对象转换为字符串
- 将 UUID 对象转换为字符串

## 示例

### 基本用法

```python
from datetime import datetime
from typing import Optional
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    title: str
    description: Optional[str] = None
    timestamp: datetime
    date: datetime

@app.post("/items/")
async def create_item(item: Item):
    json_compatible_item_data = jsonable_encoder(item)
    # 这里可以将数据保存到数据库
    # 或者返回 JSONResponse
    return json_compatible_item_data
```

### 在返回响应之前转换数据

```python
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

items = {
    "foo": {"name": "Foo", "price": 50.2},
    "bar": {"name": "Bar", "price": 62},
}

@app.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: str):
    item_data = items[item_id]
    item = Item(**item_data)
    return item

@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: str, item: Item):
    json_compatible_item_data = jsonable_encoder(item)
    items[item_id] = json_compatible_item_data
    return JSONResponse(content=json_compatible_item_data)
```

## 转换规则

`jsonable_encoder` 会进行以下转换：

### Pydantic 模型

转换为字典

```python
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder

class Item(BaseModel):
    name: str

item = Item(name="Foo")
encoded = jsonable_encoder(item)
# 结果: {"name": "Foo"}
```

### `datetime` 对象

转换为 ISO 格式字符串

```python
from datetime import datetime
from fastapi.encoders import jsonable_encoder

dt = datetime.now()
encoded = jsonable_encoder(dt)
# 结果: "2024-01-01T12:00:00.000000"
```

### UUID 对象

转换为字符串

```python
from uuid import UUID
from fastapi.encoders import jsonable_encoder

uid = UUID("12345678-1234-1234-1234-123456789012")
encoded = jsonable_encoder(uid)
# 结果: "12345678-1234-1234-1234-123456789012"
```

### `Decimal` 对象

转换为浮点数

```python
from decimal import Decimal
from fastapi.encoders import jsonable_encoder

decimal_value = Decimal("3.14159")
encoded = jsonable_encoder(decimal_value)
# 结果: 3.14159
```

### `Enum` 对象

转换为枚举值

```python
from enum import Enum
from fastapi.encoders import jsonable_encoder

class Color(str, Enum):
    RED = "red"
    GREEN = "green"
    BLUE = "blue"

color = Color.RED
encoded = jsonable_encoder(color)
# 结果: "red"
```

## 嵌套数据类型

`jsonable_encoder` 可以处理嵌套的数据结构：

```python
from datetime import datetime
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

class Author(BaseModel):
    name: str
    email: str

class Book(BaseModel):
    title: str
    author: Author
    tags: List[str]
    published: Optional[datetime] = None

book = Book(
    title="FastAPI Guide",
    author=Author(name="John Doe", email="john@example.com"),
    tags=["programming", "web"],
    published=datetime.now()
)

encoded = jsonable_encoder(book)
# 结果: {
#     "title": "FastAPI Guide",
#     "author": {"name": "John Doe", "email": "john@example.com"},
#     "tags": ["programming", "web"],
#     "published": "2024-01-01T12:00:00.000000"
# }
```

## 在数据库操作中使用

```python
from fastapi import FastAPI, HTTPException, status
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float

# 假设这是数据库中的数据
fake_db = {}

@app.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item(item: Item):
    json_compatible_item = jsonable_encoder(item)
    fake_db["item"] = json_compatible_item
    return json_compatible_item

@app.get("/items/{item_id}")
async def read_item(item_id: str):
    item = fake_db.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
```

## 自定义转换器

如果您需要自定义转换逻辑，可以创建自定义的 JSON 编码器：

```python
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import Any, Dict

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

def custom_encoder(obj: Any) -> Any:
    if isinstance(obj, Item):
        return {"item_name": obj.name, "item_price": obj.price}
    return jsonable_encoder(obj)

@app.get("/items/{item_id}")
async def read_item(item_id: str):
    item = Item(name="Test Item", price=42.0)
    encoded_item = custom_encoder(item)
    return JSONResponse(content=encoded_item)
```

## 注意事项

1. **性能考虑**：对于大型数据结构，`jsonable_encoder` 可能需要一些时间来转换数据。

2. **精度丢失**：`Decimal` 类型的数据会被转换为浮点数，可能会丢失精度。

3. **数据类型改变**：原始的数据类型会改变，例如 `datetime` 对象会变成字符串。

4. **深度嵌套**：对于深度嵌套的数据结构，转换可能会递归进行。

## 总结

`jsonable_encoder` 是 **FastAPI** 的一个实用工具，用于将不兼容 JSON 的数据类型转换为 JSON 兼容的格式。它：

- 将 Pydantic 模型转换为字典
- 将 `datetime` 对象转换为字符串
- 将 UUID 转换为字符串
- 将 `Decimal` 转换为浮点数
- 处理嵌套的数据结构

这个工具在需要序列化数据到 JSON 或保存到数据库时非常有用。