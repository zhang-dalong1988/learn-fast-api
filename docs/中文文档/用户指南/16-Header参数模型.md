# Header 参数模型

如果你有一组相关的 __header 参数__, 你可以创建一个 __Pydantic 模型__ 来声明它们。

这将允许你在 __多个地方重用该模型__, 并且可以一次性为所有参数声明验证和元数据。😎

> **注意**: 此功能从 FastAPI 版本 `0.115.0` 开始支持。🤓

在 __Pydantic 模型__ 中声明你需要的 __header 参数__, 然后将参数声明为 `Header`:

## 1. 声明 Header 参数模型

### Python 3.10+

```python
# 从 typing 模块导入 Annotated, 用于添加参数元数据
from typing import Annotated

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: str | None = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: str | None = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: list[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    # 返回接收到的 headers
    return headers
```

#### Python 3.9+

```python
# 从 typing 模块导入 Annotated 和 Union
from typing import Annotated, Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: Union[str, None] = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: Union[str, None] = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: list[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    # 返回接收到的 headers
    return headers
```

#### Python 3.8+

```python
# 从 typing 模块导入 List 和 Union
from typing import List, Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
# 从 typing_extensions 导入 Annotated (Python 3.8 需要)
from fastapi import FastAPI, Header
from pydantic import BaseModel
from typing_extensions import Annotated

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: Union[str, None] = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: Union[str, None] = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: List[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    # 返回接收到的 headers
    return headers
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

#### Python 3.10+ - non-Annotated

```python
# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: str | None = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: str | None = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: list[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
# 使用 Header() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(headers: CommonHeaders = Header()):
    # 返回接收到的 headers
    return headers
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

#### Python 3.9+ - non-Annotated

```python
# 从 typing 模块导入 Union
from typing import Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: Union[str, None] = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: Union[str, None] = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: list[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
# 使用 Header() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(headers: CommonHeaders = Header()):
    # 返回接收到的 headers
    return headers
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

#### Python 3.8+ - non-Annotated

```python
# 从 typing 模块导入 List 和 Union
from typing import List, Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: Union[str, None] = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: Union[str, None] = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: List[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
# 使用 Header() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(headers: CommonHeaders = Header()):
    # 返回接收到的 headers
    return headers
```

__FastAPI__ 会从请求的 __headers__ 中 __提取__ __每个字段__ 的数据, 并返回你定义的 Pydantic 模型。

## 2. 检查文档

你可以在 `/docs` 的文档 UI 中查看所需的 headers:

![Header 参数模型文档示例](https://fastapi.tiangolo.com/img/tutorial/header-param-models/image01.png)

## 3. 禁止额外的 Headers

在某些特殊用例中 (可能不常见), 你可能想要 __限制__ 你想要接收的 headers。

你可以使用 Pydantic 的模型配置来 `forbid` (禁止) 任何 `extra` (额外) 字段:

### Python 3.10+

```python
# 从 typing 模块导入 Annotated, 用于添加参数元数据
from typing import Annotated

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # 配置模型禁止额外的字段
    model_config = {"extra": "forbid"}

    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: str | None = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: str | None = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: list[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    # 返回接收到的 headers
    return headers
```

#### Python 3.9+

```python
# 从 typing 模块导入 Annotated 和 Union
from typing import Annotated, Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # 配置模型禁止额外的字段
    model_config = {"extra": "forbid"}

    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: Union[str, None] = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: Union[str, None] = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: list[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    # 返回接收到的 headers
    return headers
```

#### Python 3.8+

```python
# 从 typing 模块导入 List 和 Union
from typing import List, Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
# 从 typing_extensions 导入 Annotated (Python 3.8 需要)
from fastapi import FastAPI, Header
from pydantic import BaseModel
from typing_extensions import Annotated

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # 配置模型禁止额外的字段
    model_config = {"extra": "forbid"}

    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: Union[str, None] = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: Union[str, None] = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: List[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    # 返回接收到的 headers
    return headers
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

#### Python 3.10+ - non-Annotated

```python
# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # 配置模型禁止额外的字段
    model_config = {"extra": "forbid"}

    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: str | None = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: str | None = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: list[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
# 使用 Header() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(headers: CommonHeaders = Header()):
    # 返回接收到的 headers
    return headers
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

#### Python 3.9+ - non-Annotated

```python
# 从 typing 模块导入 Union
from typing import Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # 配置模型禁止额外的字段
    model_config = {"extra": "forbid"}

    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: Union[str, None] = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: Union[str, None] = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: list[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
# 使用 Header() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(headers: CommonHeaders = Header()):
    # 返回接收到的 headers
    return headers
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

#### Python 3.8+ - non-Annotated

```python
# 从 typing 模块导入 List 和 Union
from typing import List, Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # 配置模型禁止额外的字段
    model_config = {"extra": "forbid"}

    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: Union[str, None] = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: Union[str, None] = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: List[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
# 使用 Header() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(headers: CommonHeaders = Header()):
    # 返回接收到的 headers
    return headers
```

如果客户端尝试发送一些 __额外的 headers__, 它们将收到一个 __错误__ 响应。

例如, 如果客户端尝试发送一个值为 `plumbus` 的 `tool` header, 它们将收到一个 __错误__ 响应, 告诉它们 header 参数 `tool` 是不允许的:

```json
{
    "detail": [
        {
            "type": "extra_forbidden",
            "loc": ["header", "tool"],
            "msg": "Extra inputs are not permitted",
            "input": "plumbus",
        }
    ]
}
```

## 4. 禁用下划线转换

与常规 header 参数的方式相同, 当你在参数名称中有下划线字符时, 它们会 __自动转换为连字符__。

例如, 如果你在代码中有一个 header 参数 `save_data`, 预期的 HTTP header 将是 `save-data`, 并且在文档中会这样显示。

如果由于某种原因你需要禁用此自动转换, 你也可以为 header 参数的 Pydantic 模型这样做。

### Python 3.10+

```python
# 从 typing 模块导入 Annotated, 用于添加参数元数据
from typing import Annotated

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段 (不会转换为 save-data)
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: str | None = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: str | None = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: list[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
# 设置 convert_underscores=False 禁用下划线到连字符的自动转换
@app.get("/items/")
async def read_items(
    headers: Annotated[CommonHeaders, Header(convert_underscores=False)],
):
    # 返回接收到的 headers
    return headers
```

#### Python 3.9+

```python
# 从 typing 模块导入 Annotated 和 Union
from typing import Annotated, Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段 (不会转换为 save-data)
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: Union[str, None] = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: Union[str, None] = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: list[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
# 设置 convert_underscores=False 禁用下划线到连字符的自动转换
@app.get("/items/")
async def read_items(
    headers: Annotated[CommonHeaders, Header(convert_underscores=False)],
):
    # 返回接收到的 headers
    return headers
```

#### Python 3.8+

```python
# 从 typing 模块导入 List 和 Union
from typing import List, Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
# 从 typing_extensions 导入 Annotated (Python 3.8 需要)
from fastapi import FastAPI, Header
from pydantic import BaseModel
from typing_extensions import Annotated

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段 (不会转换为 save-data)
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: Union[str, None] = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: Union[str, None] = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: List[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
# 设置 convert_underscores=False 禁用下划线到连字符的自动转换
@app.get("/items/")
async def read_items(
    headers: Annotated[CommonHeaders, Header(convert_underscores=False)],
):
    # 返回接收到的 headers
    return headers
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

#### Python 3.10+ - non-Annotated

```python
# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段 (不会转换为 save-data)
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: str | None = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: str | None = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: list[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
# 使用 Header() 作为默认值, 不使用 Annotated
# 设置 convert_underscores=False 禁用下划线到连字符的自动转换
@app.get("/items/")
async def read_items(headers: CommonHeaders = Header(convert_underscores=False)):
    # 返回接收到的 headers
    return headers
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

#### Python 3.9+ - non-Annotated

```python
# 从 typing 模块导入 Union
from typing import Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段 (不会转换为 save-data)
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: Union[str, None] = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: Union[str, None] = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: list[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
# 使用 Header() 作为默认值, 不使用 Annotated
# 设置 convert_underscores=False 禁用下划线到连字符的自动转换
@app.get("/items/")
async def read_items(headers: CommonHeaders = Header(convert_underscores=False)):
    # 返回接收到的 headers
    return headers
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

#### Python 3.8+ - non-Annotated

```python
# 从 typing 模块导入 List 和 Union
from typing import List, Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 pydantic 导入 BaseModel, 用于创建数据模型
from fastapi import FastAPI, Header
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义通用 headers 的 Pydantic 模型
class CommonHeaders(BaseModel):
    # host: 主机名, 必需字段
    host: str
    # save_data: 是否保存数据, 必需字段 (不会转换为 save-data)
    save_data: bool
    # if_modified_since: 资源最后修改时间, 可选字段
    if_modified_since: Union[str, None] = None
    # traceparent: 分布式追踪的父 span ID, 可选字段
    traceparent: Union[str, None] = None
    # x_tag: 标签列表, 可选字段, 默认为空列表
    x_tag: List[str] = []

# 定义路径操作函数, 使用 CommonHeaders 模型接收 headers
# 使用 Header() 作为默认值, 不使用 Annotated
# 设置 convert_underscores=False 禁用下划线到连字符的自动转换
@app.get("/items/")
async def read_items(headers: CommonHeaders = Header(convert_underscores=False)):
    # 返回接收到的 headers
    return headers
```

> **警告**: 在将 `convert_underscores` 设置为 `False` 之前, 请记住, 某些 HTTP 代理和服务器不允许使用带有下划线的 headers。

## 5. 总结

你可以使用 __Pydantic 模型__ 在 __FastAPI__ 中声明 __headers__。😎
