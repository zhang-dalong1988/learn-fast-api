# Cookie 参数

你可以像定义 `Query` 和 `Path` 参数一样定义 Cookie 参数。

## 1. 导入 `Cookie`

首先导入 `Cookie`:

### Python 3.10+

```python
# 从 typing 模块导入 Annotated, 用于添加参数元数据
from typing import Annotated

# 从 fastapi 导入 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取 Cookie 中的 ads_id
@app.get("/items/")
async def read_items(ads_id: Annotated[str | None, Cookie()] = None):
    # 返回包含 ads_id 的字典
    return {"ads_id": ads_id}
```

### Python 3.9+

```python
# 从 typing 模块导入 Annotated 和 Union
from typing import Annotated, Union

# 从 fastapi 导入 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取 Cookie 中的 ads_id
# Union[str, None] 表示参数可以是字符串或 None
@app.get("/items/")
async def read_items(ads_id: Annotated[Union[str, None], Cookie()] = None):
    # 返回包含 ads_id 的字典
    return {"ads_id": ads_id}
```

### Python 3.8+

```python
# 从 typing 模块导入 Union
from typing import Union

# 从 fastapi 导入 Cookie 和 FastAPI
# 从 typing_extensions 导入 Annotated (Python 3.8 需要)
from fastapi import Cookie, FastAPI
from typing_extensions import Annotated

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取 Cookie 中的 ads_id
@app.get("/items/")
async def read_items(ads_id: Annotated[Union[str, None], Cookie()] = None):
    # 返回包含 ads_id 的字典
    return {"ads_id": ads_id}
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

### Python 3.10+ - non-Annotated

```python
# 从 fastapi 导入 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取 Cookie 中的 ads_id
# 使用 Cookie() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(ads_id: str | None = Cookie(default=None)):
    # 返回包含 ads_id 的字典
    return {"ads_id": ads_id}
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

### Python 3.8+ - non-Annotated

```python
# 从 typing 模块导入 Union
from typing import Union

# 从 fastapi 导入 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取 Cookie 中的 ads_id
# 使用 Cookie() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(ads_id: Union[str, None] = Cookie(default=None)):
    # 返回包含 ads_id 的字典
    return {"ads_id": ads_id}
```

## 2. 声明 `Cookie` 参数

然后使用与 `Path` 和 `Query` 相同的结构声明 cookie 参数。

你可以定义默认值以及所有额外的验证或注释参数:

### Python 3.10+

```python
# 从 typing 模块导入 Annotated, 用于添加参数元数据
from typing import Annotated

# 从 fastapi 导入 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取 Cookie 中的 ads_id
@app.get("/items/")
async def read_items(ads_id: Annotated[str | None, Cookie()] = None):
    # 返回包含 ads_id 的字典
    return {"ads_id": ads_id}
```

### Python 3.9+

```python
# 从 typing 模块导入 Annotated 和 Union
from typing import Annotated, Union

# 从 fastapi 导入 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取 Cookie 中的 ads_id
@app.get("/items/")
async def read_items(ads_id: Annotated[Union[str, None], Cookie()] = None):
    # 返回包含 ads_id 的字典
    return {"ads_id": ads_id}
```

### Python 3.8+

```python
# 从 typing 模块导入 Union
from typing import Union

# 从 fastapi 导入 Cookie 和 FastAPI
# 从 typing_extensions 导入 Annotated (Python 3.8 需要)
from fastapi import Cookie, FastAPI
from typing_extensions import Annotated

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取 Cookie 中的 ads_id
@app.get("/items/")
async def read_items(ads_id: Annotated[Union[str, None], Cookie()] = None):
    # 返回包含 ads_id 的字典
    return {"ads_id": ads_id}
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

### Python 3.10+ - non-Annotated

```python
# 从 fastapi 导入 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取 Cookie 中的 ads_id
# 使用 Cookie() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(ads_id: str | None = Cookie(default=None)):
    # 返回包含 ads_id 的字典
    return {"ads_id": ads_id}
```

> **提示**: 如果可能, 优先使用 `Annotated` 版本。

### Python 3.8+ - non-Annotated

```python
# 从 typing 模块导入 Union
from typing import Union

# 从 fastapi 导入 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义路径操作函数, 读取 Cookie 中的 ads_id
# 使用 Cookie() 作为默认值, 不使用 Annotated
@app.get("/items/")
async def read_items(ads_id: Union[str, None] = Cookie(default=None)):
    # 返回包含 ads_id 的字典
    return {"ads_id": ads_id}
```

## 3. 技术细节

`Cookie` 是 `Path` 和 `Query` 的"姐妹"类。它也继承自同一个公共的 `Param` 类。

但请记住, 当你从 `fastapi` 导入 `Query`, `Path`, `Cookie` 等时, 这些实际上是返回特殊类的函数。

> **信息**: 要声明 cookies, 你需要使用 `Cookie`, 否则参数将被解释为查询参数。

> **信息**: 请记住, 由于浏览器以特殊方式并在幕后处理 cookies, 它们不允许 JavaScript 轻松访问它们。

如果你访问 `/docs` 的 API 文档界面, 你将能够看到路径操作的 cookies 文档。

但是即使你填写数据并点击"Execute", 由于文档界面使用 JavaScript, cookies 也不会被发送, 你将看到一条错误消息, 就像你没有写入任何值一样。

## 4. 总结

使用 `Cookie` 声明 cookies, 使用与 `Query` 和 `Path` 相同的通用模式。
