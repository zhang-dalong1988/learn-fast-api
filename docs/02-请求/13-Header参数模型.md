# Header 参数模型

当有多个 header 参数时，你可能不想为每个 header 参数都声明一个单独的函数参数。

相反，你可以使用 Pydantic 模型来声明所有 header 参数。

## 使用 Pydantic 模型

首先，导入 Pydantic 的 `BaseModel` 和 FastAPI 的 `Header`：

```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class Headers(BaseModel):
    host: str
    user_agent: str
    accept: str
    accept_language: str | None = None

@app.get("/items/")
async def read_items(headers: Annotated[Headers, Header()]):
    return headers
```

### Python 3.8+

```python
from typing import Union

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class Headers(BaseModel):
    host: str
    user_agent: str
    accept: str
    accept_language: Union[str, None] = None

@app.get("/items/")
async def read_items(headers: Headers = Header()):
    return headers
```

## 工作原理

FastAPI 会检查 header 参数，并将它们转换为 Pydantic 模型。

在这个例子中：
- `host` 是必需的
- `user_agent` 是必需的
- `accept` 是必需的
- `accept_language` 是可选的

如果客户端发送了这些 headers：

```
Host: example.com
User-Agent: Mozilla/5.0
Accept: application/json
Accept-Language: en-US,en;q=0.9
```

Pydantic 模型会创建如下实例：

```python
Headers(
    host="example.com",
    user_agent="Mozilla/5.0",
    accept="application/json",
    accept_language="en-US,en;q=0.9"
)
```

## Header 名称转换

记住，FastAPI 会自动将下划线转换为连字符：

```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class Headers(BaseModel):
    x_api_key: str
    x_client_id: str

@app.get("/items/")
async def read_items(headers: Annotated[Headers, Header()]):
    return headers
```

### Python 3.8+

```python
from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class Headers(BaseModel):
    x_api_key: str
    x_client_id: str

@app.get("/items/")
async def read_items(headers: Headers = Header()):
    return headers
```

## 验证

你也可以获得 Pydantic 的所有验证功能：

```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel, Field

app = FastAPI()

class Headers(BaseModel):
    x_api_key: str = Field(min_length=10)
    x_client_id: str = Field(regex=r"^client-[\w-]+$")
    authorization: str = Field(regex=r"^Bearer .+$")

@app.get("/items/")
async def read_items(headers: Annotated[Headers, Header()]):
    return headers
```

### Python 3.8+

```python
from fastapi import FastAPI, Header
from pydantic import BaseModel, Field

app = FastAPI()

class Headers(BaseModel):
    x_api_key: str = Field(min_length=10)
    x_client_id: str = Field(regex=r"^client-[\w-]+$")
    authorization: str = Field(regex=r"^Bearer .+$")

@app.get("/items/")
async def read_items(headers: Headers = Header()):
    return headers
```

## 嵌套模型

你还可以使用嵌套的 Pydantic 模型来组织相关的 headers：

```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class Auth(BaseModel):
    authorization: str
    x_api_key: str

class Client(BaseModel):
    x_client_id: str
    x_client_version: str

class Headers(BaseModel):
    auth: Auth
    client: Client
    user_agent: str

@app.get("/items/")
async def read_items(headers: Annotated[Headers, Header()]):
    return headers
```

### Python 3.8+

```python
from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class Auth(BaseModel):
    authorization: str
    x_api_key: str

class Client(BaseModel):
    x_client_id: str
    x_client_version: str

class Headers(BaseModel):
    auth: Auth
    client: Client
    user_agent: str

@app.get("/items/")
async def read_items(headers: Headers = Header()):
    return headers
```

## 提示

- 使用 Pydantic 模型来组织 header 参数可以让代码更清晰
- 你可以获得所有 Pydantic 的验证功能
- 嵌套模型需要使用 JSON 格式的 header
- 记住下划线会被自动转换为连字符
