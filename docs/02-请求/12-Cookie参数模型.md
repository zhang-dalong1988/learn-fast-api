# Cookie 参数模型

当有多个 cookie 参数时,你可能不想为每个 cookie 参数都声明一个单独的函数参数.

相反,你可以使用 Pydantic 模型来声明所有 cookie 参数.

## 使用 Pydantic 模型

首先,导入 Pydantic 的 `BaseModel` 和 FastAPI 的 `Cookie`:

```python
from typing import Annotated

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cookies(BaseModel):
    session_id: str
    user_agent: str
    last_visit: str | None = None

@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

### Python 3.8+

```python
from typing import Union

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cookies(BaseModel):
    session_id: str
    user_agent: str
    last_visit: Union[str, None] = None

@app.get("/items/")
async def read_items(cookies: Cookies = Cookie()):
    return cookies
```

## 工作原理

FastAPI 会检查 cookie 参数,并将它们转换为 Pydantic 模型.

在这个例子中:
- `session_id` 是必需的
- `user_agent` 是必需的
- `last_visit` 是可选的

如果客户端发送了这些 cookie:

```
Cookie: session_id=abc123; user_agent=Mozilla/5.0; last_visit=2023-01-01
```

Pydantic 模型会创建如下实例:

```python
Cookies(
    session_id="abc123",
    user_agent="Mozilla/5.0",
    last_visit="2023-01-01"
)
```

## 验证

你也可以获得 Pydantic 的所有验证功能:

```python
from typing import Annotated

from fastapi import Cookie, FastAPI
from pydantic import BaseModel, Field

app = FastAPI()

class Cookies(BaseModel):
    session_id: str = Field(min_length=10, max_length=50)
    user_agent: str
    last_visit: str | None = Field(None, regex=r"^\d{4}-\d{2}-\d{2}$")

@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

### Python 3.8+

```python
from typing import Union

from fastapi import Cookie, FastAPI
from pydantic import BaseModel, Field

app = FastAPI()

class Cookies(BaseModel):
    session_id: str = Field(min_length=10, max_length=50)
    user_agent: str
    last_visit: Union[str, None] = Field(None, regex=r"^\d{4}-\d{2}-\d{2}$")

@app.get("/items/")
async def read_items(cookies: Cookies = Cookie()):
    return cookies
```

## 嵌套模型

你还可以使用嵌套的 Pydantic 模型:

```python
from typing import Annotated

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Preferences(BaseModel):
    theme: str = "light"
    language: str = "en"

class Cookies(BaseModel):
    session_id: str
    user_agent: str
    preferences: Preferences

@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

### Python 3.8+

```python
from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Preferences(BaseModel):
    theme: str = "light"
    language: str = "en"

class Cookies(BaseModel):
    session_id: str
    user_agent: str
    preferences: Preferences

@app.get("/items/")
async def read_items(cookies: Cookies = Cookie()):
    return cookies
```

## 提示

- 使用 Pydantic 模型来组织 cookie 参数可以让代码更清晰
- 你可以获得所有 Pydantic 的验证功能
- 嵌套模型需要使用 JSON 格式的 cookie
