# JSON 兼容编码器

在某些情况下, 你可能需要将一种数据类型 (如 Pydantic 模型) 转换为与 JSON 兼容的内容 (如 `dict`, `list` 等)。

例如, 如果你需要将它存储在数据库中。

为此, **FastAPI** 提供了一个 `jsonable_encoder()` 函数。

## 1. 使用 `jsonable_encoder`

让我们想象一下, 你有一个数据库 `fake_db`, 它只接收 JSON 兼容的数据。

例如, 它不接收 `datetime` 对象, 因为那些与 JSON 不兼容。

因此, `datetime` 对象必须转换为包含 ISO 格式数据的 `str`。

同样, 这个数据库不会接收 Pydantic 模型 (一个具有属性的对象), 只接收 `dict`。

你可以使用 `jsonable_encoder` 来做到这一点。

它接收一个对象, 比如 Pydantic 模型, 并返回一个 JSON 兼容的版本:

### 1.1 Python 3.10+

```python
# 从 datetime 模块导入 datetime 类
from datetime import datetime

# 从 fastapi 包中导入 FastAPI
from fastapi import FastAPI
# 从 fastapi.encoders 中导入 jsonable_encoder
from fastapi.encoders import jsonable_encoder
# 从 pydantic 中导入 BaseModel
from pydantic import BaseModel

# 模拟数据库, 使用字典存储
fake_db = {}

# 定义 Item 模型, 继承自 BaseModel
class Item(BaseModel):
    title: str  # title 字段, 字符串类型
    timestamp: datetime  # timestamp 字段, datetime 类型
    description: str | None = None  # description 字段, 可选字符串

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义一个 PUT 路径操作, 更新 item
@app.put("/items/{id}")
# 使用 def 声明同步函数, 接收 id 参数和 Item 类型的请求体
def update_item(id: str, item: Item):
    # 使用 jsonable_encoder 将 Pydantic 模型转换为 JSON 兼容的字典
    json_compatible_item_data = jsonable_encoder(item)
    # 将转换后的数据存储到 fake_db 中
    fake_db[id] = json_compatible_item_data
```

### 1.2 Python 3.8+

```python
# 从 datetime 模块导入 datetime 类
from datetime import datetime
# 从 typing 中导入 Union 用于类型注解
from typing import Union

# 从 fastapi 包中导入 FastAPI
from fastapi import FastAPI
# 从 fastapi.encoders 中导入 jsonable_encoder
from fastapi.encoders import jsonable_encoder
# 从 pydantic 中导入 BaseModel
from pydantic import BaseModel

# 模拟数据库, 使用字典存储
fake_db = {}

# 定义 Item 模型, 继承自 BaseModel
class Item(BaseModel):
    title: str  # title 字段, 字符串类型
    timestamp: datetime  # timestamp 字段, datetime 类型
    description: Union[str, None] = None  # description 字段, 可选字符串 (使用 Union)

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义一个 PUT 路径操作, 更新 item
@app.put("/items/{id}")
# 使用 def 声明同步函数, 接收 id 参数和 Item 类型的请求体
def update_item(id: str, item: Item):
    # 使用 jsonable_encoder 将 Pydantic 模型转换为 JSON 兼容的字典
    json_compatible_item_data = jsonable_encoder(item)
    # 将转换后的数据存储到 fake_db 中
    fake_db[id] = json_compatible_item_data
```

在这个示例中, 它会将 Pydantic 模型转换为 `dict`, 将 `datetime` 转换为 `str`。

调用它的结果是可以用 Python 标准库 `json.dumps()` 编码的内容。

它不返回包含 JSON 格式数据的大型 `str` (作为字符串)。它返回 Python 标准数据结构 (例如 `dict`), 其值和子值都与 JSON 兼容。

注意

`jsonable_encoder` 实际上被 **FastAPI** 内部用于转换数据。但它在许多其他场景中也很有用。
