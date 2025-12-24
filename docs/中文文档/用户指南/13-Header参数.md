# Header 参数

你可以像定义 `Query`, `Path` 和 `Cookie` 参数一样定义 Header 参数。

## 1. 导入 `Header`

首先导入 `Header`:

### Python 3.10+

```python
# 从 typing 模块导入 Annotated, 用于添加参数元数据
from typing import Annotated

# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取请求头中的 User-Agent
@app.get("/items/")
async def read_items(user_agent: Annotated[str | None, Header()] = None):
    # 返回包含 User-Agent 的字典
    return {"User-Agent": user_agent}
```

### Python 3.9+

```python
# 从 typing 模块导入 Annotated 和 Union
from typing import Annotated, Union

# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取请求头中的 User-Agent
# Union[str, None] 表示参数可以是字符串或 None
@app.get("/items/")
async def read_items(user_agent: Annotated[Union[str, None], Header()] = None):
    # 返回包含 User-Agent 的字典
    return {"User-Agent": user_agent}
```

### Python 3.8+

```python
# 从 typing 模块导入 Union
from typing import Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 typing_extensions 导入 Annotated (Python 3.8 需要)
from fastapi import FastAPI, Header
from typing_extensions import Annotated

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取请求头中的 User-Agent
@app.get("/items/")
async def read_items(user_agent: Annotated[Union[str, None], Header()] = None):
    # 返回包含 User-Agent 的字典
    return {"User-Agent": user_agent}
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

### Python 3.10+ - non-Annotated

```python
# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取请求头中的 User-Agent
# 使用 Header() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(user_agent: str | None = Header(default=None)):
    # 返回包含 User-Agent 的字典
    return {"User-Agent": user_agent}
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

### Python 3.8+ - non-Annotated

```python
# 从 typing 模块导入 Union
from typing import Union

# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取请求头中的 User-Agent
# 使用 Header() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(user_agent: Union[str, None] = Header(default=None)):
    # 返回包含 User-Agent 的字典
    return {"User-Agent": user_agent}
```

## 2. 声明 `Header` 参数

然后使用与 `Path`, `Query` 和 `Cookie` 相同的结构声明 header 参数。

你可以定义默认值以及所有额外的验证或注释参数:

### Python 3.10+

```python
# 从 typing 模块导入 Annotated, 用于添加参数元数据
from typing import Annotated

# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取请求头中的 User-Agent
@app.get("/items/")
async def read_items(user_agent: Annotated[str | None, Header()] = None):
    # 返回包含 User-Agent 的字典
    return {"User-Agent": user_agent}
```

### Python 3.9+

```python
# 从 typing 模块导入 Annotated 和 Union
from typing import Annotated, Union

# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取请求头中的 User-Agent
@app.get("/items/")
async def read_items(user_agent: Annotated[Union[str, None], Header()] = None):
    # 返回包含 User-Agent 的字典
    return {"User-Agent": user_agent}
```

### Python 3.8+

```python
# 从 typing 模块导入 Union
from typing import Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 typing_extensions 导入 Annotated (Python 3.8 需要)
from fastapi import FastAPI, Header
from typing_extensions import Annotated

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取请求头中的 User-Agent
@app.get("/items/")
async def read_items(user_agent: Annotated[Union[str, None], Header()] = None):
    # 返回包含 User-Agent 的字典
    return {"User-Agent": user_agent}
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

### Python 3.10+ - non-Annotated

```python
# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取请求头中的 User-Agent
# 使用 Header() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(user_agent: str | None = Header(default=None)):
    # 返回包含 User-Agent 的字典
    return {"User-Agent": user_agent}
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

### Python 3.8+ - non-Annotated

```python
# 从 typing 模块导入 Union
from typing import Union

# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取请求头中的 User-Agent
# 使用 Header() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(user_agent: Union[str, None] = Header(default=None)):
    # 返回包含 User-Agent 的字典
    return {"User-Agent": user_agent}
```

## 3. 技术细节

`Header` 是 `Path`, `Query` 和 `Cookie` 的"姐妹"类。它也继承自同一个公共的 `Param` 类。

但请记住, 当你从 `fastapi` 导入 `Query`, `Path`, `Header` 等时, 这些实际上是返回特殊类的函数。

> **信息**: 要声明 headers, 你需要使用 `Header`, 否则参数将被解释为查询参数。

## 4. 自动转换

`Header` 在 `Path`, `Query` 和 `Cookie` 提供的功能之上还有一些额外的功能。

大多数标准 headers 由"连字符"字符分隔, 也称为"减号" (`-`)。

但是在 Python 中像 `user-agent` 这样的变量是无效的。

因此, 默认情况下, `Header` 会将参数名称字符从下划线 (`_`) 转换为连字符 (`-`) 来提取和记录 headers。

此外, HTTP headers 是不区分大小写的, 因此你可以使用标准的 Python 风格 (也称为 "snake_case") 来声明它们。

所以, 你可以像通常在 Python 代码中那样使用 `user_agent`, 而不需要将首字母大写为 `User_Agent` 或类似的名称。

如果由于某种原因你需要禁用下划线到连字符的自动转换, 请将 `Header` 的参数 `convert_underscores` 设置为 `False`:

### Python 3.10+

```python
# 从 typing 模块导入 Annotated, 用于添加参数元数据
from typing import Annotated

# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取自定义请求头
# 设置 convert_underscores=False 禁用自动转换
@app.get("/items/")
async def read_items(
    strange_header: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    # 返回包含自定义 header 的字典
    return {"strange_header": strange_header}
```

### Python 3.9+

```python
# 从 typing 模块导入 Annotated 和 Union
from typing import Annotated, Union

# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取自定义请求头
# 设置 convert_underscores=False 禁用自动转换
@app.get("/items/")
async def read_items(
    strange_header: Annotated[
        Union[str, None], Header(convert_underscores=False)
    ] = None,
):
    # 返回包含自定义 header 的字典
    return {"strange_header": strange_header}
```

### Python 3.8+

```python
# 从 typing 模块导入 Union
from typing import Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 typing_extensions 导入 Annotated (Python 3.8 需要)
from fastapi import FastAPI, Header
from typing_extensions import Annotated

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取自定义请求头
# 设置 convert_underscores=False 禁用自动转换
@app.get("/items/")
async def read_items(
    strange_header: Annotated[
        Union[str, None], Header(convert_underscores=False)
    ] = None,
):
    # 返回包含自定义 header 的字典
    return {"strange_header": strange_header}
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

### Python 3.10+ - non-Annotated

```python
# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取自定义请求头
# 使用 Header() 作为默认值, 不使用 Annotated
# 设置 convert_underscores=False 禁用自动转换
@app.get("/items/")
async def read_items(
    strange_header: str | None = Header(default=None, convert_underscores=False),
):
    # 返回包含自定义 header 的字典
    return {"strange_header": strange_header}
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

### Python 3.8+ - non-Annotated

```python
# 从 typing 模块导入 Union
from typing import Union

# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取自定义请求头
# 使用 Header() 作为默认值, 不使用 Annotated
# 设置 convert_underscores=False 禁用自动转换
@app.get("/items/")
async def read_items(
    strange_header: Union[str, None] = Header(default=None, convert_underscores=False),
):
    # 返回包含自定义 header 的字典
    return {"strange_header": strange_header}
```

> **警告**: 在将 `convert_underscores` 设置为 `False` 之前, 请记住, 某些 HTTP 代理和服务器不允许使用带有下划线的 headers。

## 5. 不带自动转换的 Header

可能会收到重复的 headers。这意味着, 同一个 header 有多个值。

你可以在类型声明中使用列表来定义这些情况。

你将作为 Python `list` 接收到来自重复 header 的所有值。

例如, 要声明一个可以出现多次的 `X-Token` header, 你可以这样写:

### Python 3.10+

```python
# 从 typing 模块导入 Annotated, 用于添加参数元数据
from typing import Annotated

# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取可能重复的 X-Token header
# 使用 list[str] 表示该 header 可以有多个值
@app.get("/items/")
async def read_items(x_token: Annotated[list[str] | None, Header()] = None):
    # 返回包含所有 X-Token 值的列表
    return {"X-Token values": x_token}
```

### Python 3.9+

```python
# 从 typing 模块导入 Annotated, List 和 Union
from typing import Annotated, List, Union

# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取可能重复的 X-Token header
# 使用 List[str] 表示该 header 可以有多个值
@app.get("/items/")
async def read_items(x_token: Annotated[Union[List[str], None], Header()] = None):
    # 返回包含所有 X-Token 值的列表
    return {"X-Token values": x_token}
```

### Python 3.8+

```python
# 从 typing 模块导入 List 和 Union
from typing import List, Union

# 从 fastapi 导入 Header 和 FastAPI
# 从 typing_extensions 导入 Annotated (Python 3.8 需要)
from fastapi import FastAPI, Header
from typing_extensions import Annotated

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取可能重复的 X-Token header
# 使用 List[str] 表示该 header 可以有多个值
@app.get("/items/")
async def read_items(x_token: Annotated[Union[List[str], None], Header()] = None):
    # 返回包含所有 X-Token 值的列表
    return {"X-Token values": x_token}
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

### Python 3.10+ - non-Annotated

```python
# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取可能重复的 X-Token header
# 使用 list[str] 表示该 header 可以有多个值
# 使用 Header() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(x_token: list[str] | None = Header(default=None)):
    # 返回包含所有 X-Token 值的列表
    return {"X-Token values": x_token}
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

### Python 3.9+ - non-Annotated

```python
# 从 typing 模块导入 Union
from typing import Union

# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取可能重复的 X-Token header
# 使用 list[str] 表示该 header 可以有多个值
# 使用 Header() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(x_token: Union[list[str], None] = Header(default=None)):
    # 返回包含所有 X-Token 值的列表
    return {"X-Token values": x_token}
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

### Python 3.8+ - non-Annotated

```python
# 从 typing 模块导入 List 和 Union
from typing import List, Union

# 从 fastapi 导入 Header 和 FastAPI
from fastapi import FastAPI, Header

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取可能重复的 X-Token header
# 使用 List[str] 表示该 header 可以有多个值
# 使用 Header() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(x_token: Union[List[str], None] = Header(default=None)):
    # 返回包含所有 X-Token 值的列表
    return {"X-Token values": x_token}
```

如果你与该路径操作通信, 发送两个 HTTP headers, 如:

```
X-Token: foo
X-Token: bar
```

响应将是这样的:

```json
{
    "X-Token values": [
        "bar",
        "foo"
    ]
}
```

## 6. 总结

使用 `Header` 声明 headers, 使用与 `Query`, `Path` 和 `Cookie` 相同的通用模式。

不要担心变量中的下划线, FastAPI 会处理它们的转换。
