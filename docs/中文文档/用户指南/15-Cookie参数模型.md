# Cookie 参数模型

如果你有一组相关的 __cookie__, 你可以创建一个 __Pydantic 模型__ 来声明它们。

这允许你在 __多个地方__ __重用该模型__, 并且可以一次性为所有参数声明验证和元数据。

## 注意

自 FastAPI 版本 `0.115.0` 开始支持此功能。

## 提示

同样的技术适用于 `Query`、`Cookie` 和 `Header`。

## 1. 使用 Pydantic 模型声明 Cookies

在 __Pydantic 模型__ 中声明你需要的 __cookie__ 参数, 然后将参数声明为 `Cookie`:

### 1.1 Python 3.10+ 版本

```python
# 导入 Annotated 类型注解
from typing import Annotated

# 导入 FastAPI 的 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI
# 导入 Pydantic 的 BaseModel
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义 Cookies 模型, 用于声明相关的 cookie 参数
class Cookies(BaseModel):
    # session_id 是必需的字符串类型 cookie
    session_id: str
    # fatebook_tracker 是可选的字符串类型 cookie, 默认为 None
    fatebook_tracker: str | None = None
    # googall_tracker 是可选的字符串类型 cookie, 默认为 None
    googall_tracker: str | None = None

# 定义路由处理函数, 获取 cookies 参数
@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    # 直接返回 cookies 对象, FastAPI 会自动将其转换为 JSON 响应
    return cookies
```

#### 其他版本和变体

### Python 3.9+ 版本

```python
# 导入 Annotated 和 Union 类型注解
from typing import Annotated, Union

# 导入 FastAPI 的 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI
# 导入 Pydantic 的 BaseModel
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义 Cookies 模型
class Cookies(BaseModel):
    # session_id 是必需的字符串
    session_id: str
    # fatebook_tracker 是可选的字符串, 使用 Union 语法
    fatebook_tracker: Union[str, None] = None
    # googall_tracker 是可选的字符串, 使用 Union 语法
    googall_tracker: Union[str, None] = None

# 定义路由处理函数
@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    # 返回 cookies 对象
    return cookies
```

### Python 3.8+ 版本

```python
# 导入 Union 类型注解
from typing import Union

# 导入 FastAPI 的 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI
# 导入 Pydantic 的 BaseModel
from pydantic import BaseModel
# 从 typing_extensions 导入 Annotated (Python 3.8 需要)
from typing_extensions import Annotated

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义 Cookies 模型
class Cookies(BaseModel):
    # session_id 是必需的字符串
    session_id: str
    # fatebook_tracker 是可选的字符串
    fatebook_tracker: Union[str, None] = None
    # googall_tracker 是可选的字符串
    googall_tracker: Union[str, None] = None

# 定义路由处理函数
@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    # 返回 cookies 对象
    return cookies
```

## 提示

如果可能, 优先使用 `Annotated` 版本。

### Python 3.10+ - 非 Annotated 版本

```python
# 导入 FastAPI 的 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI
# 导入 Pydantic 的 BaseModel
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义 Cookies 模型
class Cookies(BaseModel):
    # session_id 是必需的字符串
    session_id: str
    # fatebook_tracker 是可选的字符串
    fatebook_tracker: str | None = None
    # googall_tracker 是可选的字符串
    googall_tracker: str | None = None

# 定义路由处理函数, 使用默认值方式声明 Cookie
@app.get("/items/")
async def read_items(cookies: Cookies = Cookie()):
    # 返回 cookies 对象
    return cookies
```

## 提示

如果可能, 优先使用 `Annotated` 版本。

### Python 3.8+ - 非 Annotated 版本

```python
# 导入 Union 类型注解
from typing import Union

# 导入 FastAPI 的 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI
# 导入 Pydantic 的 BaseModel
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义 Cookies 模型
class Cookies(BaseModel):
    # session_id 是必需的字符串
    session_id: str
    # fatebook_tracker 是可选的字符串
    fatebook_tracker: Union[str, None] = None
    # googall_tracker 是可选的字符串
    googall_tracker: Union[str, None] = None

# 定义路由处理函数
@app.get("/items/")
async def read_items(cookies: Cookies = Cookie()):
    # 返回 cookies 对象
    return cookies
```

__FastAPI__ 会从请求中接收的 __cookies__ 中 __提取__ __每个字段__ 的数据, 并给你定义的 Pydantic 模型。

## 2. 检查文档

你可以在 `/docs` 的文档 UI 中看到定义的 cookies:

![Image 1](https://example.com/img/tutorial/cookie-param-models/image01.png)

## 信息

请记住, 由于 __浏览器以特殊方式在后台处理 cookies__, 它们 __不容易__ 允许 __JavaScript__ 访问它们。

如果你访问 `/docs` 的 __API 文档 UI__, 你将能够看到你的 _路径操作_ 的 cookies __文档__。

但是, 即使你 __填写数据__ 并点击 "Execute", 由于文档 UI 使用 __JavaScript__ 工作, cookies 不会被发送, 你会看到一条 __错误__ 消息, 就好像你没有写任何值一样。

## 3. 禁止额外的 Cookies

在某些特殊用例中 (可能不常见), 你可能想要 __限制__ 你想要接收的 cookies。

你的 API 现在有能力控制自己的 cookie 同意。

你可以使用 Pydantic 的模型配置来 `forbid` (禁止) 任何 `extra` (额外的) 字段:

### 3.1 Python 3.9+ 版本

```python
# 导入 Annotated 和 Union 类型注解
from typing import Annotated, Union

# 导入 FastAPI 的 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI
# 导入 Pydantic 的 BaseModel
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义 Cookies 模型, 配置禁止额外字段
class Cookies(BaseModel):
    # 配置模型禁止额外的字段
    model_config = {"extra": "forbid"}

    # session_id 是必需的字符串
    session_id: str
    # fatebook_tracker 是可选的字符串
    fatebook_tracker: Union[str, None] = None
    # googall_tracker 是可选的字符串
    googall_tracker: Union[str, None] = None

# 定义路由处理函数
@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    # 返回 cookies 对象
    return cookies
```

#### 其他版本和变体

### Python 3.10+ 版本

```python
# 导入 Annotated 类型注解
from typing import Annotated

# 导入 FastAPI 的 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI
# 导入 Pydantic 的 BaseModel
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义 Cookies 模型, 配置禁止额外字段
class Cookies(BaseModel):
    # 配置模型禁止额外的字段
    model_config = {"extra": "forbid"}

    # session_id 是必需的字符串
    session_id: str
    # fatebook_tracker 是可选的字符串
    fatebook_tracker: str | None = None
    # googall_tracker 是可选的字符串
    googall_tracker: str | None = None

# 定义路由处理函数
@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    # 返回 cookies 对象
    return cookies
```

### Python 3.8+ 版本

```python
# 导入 Union 类型注解
from typing import Union

# 导入 FastAPI 的 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI
# 导入 Pydantic 的 BaseModel
from pydantic import BaseModel
# 从 typing_extensions 导入 Annotated (Python 3.8 需要)
from typing_extensions import Annotated

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义 Cookies 模型, 配置禁止额外字段
class Cookies(BaseModel):
    # 配置模型禁止额外的字段
    model_config = {"extra": "forbid"}

    # session_id 是必需的字符串
    session_id: str
    # fatebook_tracker 是可选的字符串
    fatebook_tracker: Union[str, None] = None
    # googall_tracker 是可选的字符串
    googall_tracker: Union[str, None] = None

# 定义路由处理函数
@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    # 返回 cookies 对象
    return cookies
```

## 提示

如果可能, 优先使用 `Annotated` 版本。

### Python 3.10+ - 非 Annotated 版本

```python
# 导入 FastAPI 的 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI
# 导入 Pydantic 的 BaseModel
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义 Cookies 模型, 配置禁止额外字段
class Cookies(BaseModel):
    # 配置模型禁止额外的字段
    model_config = {"extra": "forbid"}

    # session_id 是必需的字符串
    session_id: str
    # fatebook_tracker 是可选的字符串
    fatebook_tracker: str | None = None
    # googall_tracker 是可选的字符串
    googall_tracker: str | None = None

# 定义路由处理函数, 使用默认值方式声明 Cookie
@app.get("/items/")
async def read_items(cookies: Cookies = Cookie()):
    # 返回 cookies 对象
    return cookies
```

## 提示

如果可能, 优先使用 `Annotated` 版本。

### Python 3.8+ - 非 Annotated 版本

```python
# 导入 Union 类型注解
from typing import Union

# 导入 FastAPI 的 Cookie 和 FastAPI
from fastapi import Cookie, FastAPI
# 导入 Pydantic 的 BaseModel
from pydantic import BaseModel

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义 Cookies 模型, 配置禁止额外字段
class Cookies(BaseModel):
    # 配置模型禁止额外的字段
    model_config = {"extra": "forbid"}

    # session_id 是必需的字符串
    session_id: str
    # fatebook_tracker 是可选的字符串
    fatebook_tracker: Union[str, None] = None
    # googall_tracker 是可选的字符串
    googall_tracker: Union[str, None] = None

# 定义路由处理函数
@app.get("/items/")
async def read_items(cookies: Cookies = Cookie()):
    # 返回 cookies 对象
    return cookies
```

如果客户端尝试发送一些 __额外的 cookies__, 它们将收到一个 __错误__ 响应。

可怜的 cookie 横幅, 它们努力获得你的同意, 却被 API 拒绝了。

### 3.2 错误响应示例

例如, 如果客户端尝试发送一个值为 `good-list-please` 的 `santa_tracker` cookie, 客户端将收到一个 __错误__ 响应, 告诉他们 `santa_tracker` cookie 是不允许的:

```json
{
    // 详细错误信息列表
    "detail": [
        {
            // 错误类型: 额外的字段被禁止
            "type": "extra_forbidden",
            // 错误位置: cookie 参数中的 santa_tracker
            "loc": ["cookie", "santa_tracker"],
            // 错误消息: 不允许额外的输入
            "msg": "Extra inputs are not permitted",
            // 客户端发送的输入值
            "input": "good-list-please"
        }
    ]
}
```

## 4. 总结

你可以在 __FastAPI__ 中使用 __Pydantic 模型__ 来声明 __cookies__。
