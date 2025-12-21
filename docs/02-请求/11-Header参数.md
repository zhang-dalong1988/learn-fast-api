# Header 参数

你可以定义 Header 参数，就像你定义 `Query`、`Path` 和 `Cookie` 参数一样。

## 导入 `Header`

首先，从 `fastapi` 导入 `Header`：

```python
from typing import Annotated

from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(user_agent: Annotated[str, Header()]):
    return {"User-Agent": user_agent}
```

## 声明 Header 参数

然后，使用与 `Path`、`Query` 和 `Cookie` 相同的方式声明 Header 参数。

第一个值是默认值，你可以传递所有额外的验证或注释参数：

```python
from typing import Annotated

from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(user_agent: Annotated[str, Header()]):
    return {"User-Agent": user_agent}
```

### 技术细节

`Header` 是 `Path`、`Query` 和 `Cookie` 的 sibling 类，它们都继承自相同的 `Param` 类。

但是要记住，当你从 `fastapi` 导入 `Query`、`Path`、`Header` 等时，这些实际上是返回特殊类的函数。

## 自动转换

Header 在 HTTP 规范中被称为 "sensitive" headers，这些 headers 在 Python 中会被转换为下划线并转为小写。

所以，你可以像在 Python 代码中通常那样使用标准的 Python 风格（例如 `user_agent` 而不是 `User-Agent`），而不需要担心 headers 的大小写。

FastAPI 会转换 `user_agent` 以匹配 headers 中的 `User-Agent`。

如果你出于某种原因需要禁用自动转换，可以设置参数 `convert_underscores=False`：

```python
from typing import Annotated

from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(user_agent: Annotated[str, Header(convert_underscores=False)]):
    return {"user_agent": user_agent}
```

### 警告

在设置 `convert_underscores=False` 之前，请记住一些 HTTP 代理和服务器不允许使用带有下划线的 headers。

## 重复的 headers

可以接收重复的 headers。这意味着，你可以从同一个 header 接收多个值，这些值作为一个 Python `list` 来接收。

要定义这种类型，使用 `list` 来声明类型，例如：

```python
from typing import Annotated

from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(x_token: Annotated[list[str] | None, Header()] = None):
    return {"X-Token values": x_token}
```

如果你以路径操作的方式与那个路径操作通信，有两个 HTTP headers，如：

```
X-Token: foo
X-Token: bar
```

响应将是：

```json
{
    "X-Token values": [
        "foo",
        "bar"
    ]
}
```

### Python 3.9+

```python
from typing import Annotated, List

from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(x_token: Annotated[List[str] | None, Header()] = None):
    return {"X-Token values": x_token}
```

### Python 3.8+

```python
from typing import Annotated, List, Union

from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(x_token: Annotated[Union[List[str], None], Header()] = None):
    return {"X-Token values": x_token}
```

### Python 3.8+ non-Annotated

如果你不使用 `Annotated`，可以使用 `List` 或 `list`：

```python
from typing import List, Union

from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(x_token: Union[List[str], None] = Header(default=None)):
    return {"X-Token values": x_token}
```

## Python 3.10+ non-Annotated

```python
from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(x_token: list[str] | None = Header(default=None)):
    return {"X-Token values": x_token}
```

## 总结

你可以使用 `Header` 来声明 header 参数，就像 `Query`、`Path` 和 `Cookie` 一样。

- 不用担心 HTTP headers 的大小写
- Python 中的下划线会被自动转换为连字符
- 可以接收重复的 headers，它们会被转换为 `list`
