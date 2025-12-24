# Header Parameter Models

If you have a group of related __header parameters__, you can create a __Pydantic model__ to declare them.

This would allow you to __re-use the model__ in __multiple places__ and also to declare validations and metadata for all the parameters at once. 😎

Note

This is supported since FastAPI version `0.115.0`. 🤓

Declare the __header parameters__ that you need in a __Pydantic model__, and then declare the parameter as `Header`:

### Python 3.10+

```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: str | None = None
    traceparent: str | None = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return headers
```

#### Python 3.9+

```python
from typing import Annotated, Union

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: Union[str, None] = None
    traceparent: Union[str, None] = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return headers
```

#### Python 3.8+

```python
from typing import List, Union

from fastapi import FastAPI, Header
from pydantic import BaseModel
from typing_extensions import Annotated

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: Union[str, None] = None
    traceparent: Union[str, None] = None
    x_tag: List[str] = []

@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return headers
```

Tip

Prefer to use the `Annotated` version if possible.

#### Python 3.10+ - non-Annotated

```python
from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: str | None = None
    traceparent: str | None = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(headers: CommonHeaders = Header()):
    return headers
```

Tip

Prefer to use the `Annotated` version if possible.

#### Python 3.9+ - non-Annotated

```python
from typing import Union

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: Union[str, None] = None
    traceparent: Union[str, None] = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(headers: CommonHeaders = Header()):
    return headers
```

Tip

Prefer to use the `Annotated` version if possible.

#### Python 3.8+ - non-Annotated

```python
from typing import List, Union

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: Union[str, None] = None
    traceparent: Union[str, None] = None
    x_tag: List[str] = []

@app.get("/items/")
async def read_items(headers: CommonHeaders = Header()):
    return headers
```

__FastAPI__ will __extract__ the data for __each field__ from the __headers__ in the request and give you the Pydantic model you defined.

## Check the Docs

You can see the required headers in the docs UI at `/docs`:

![Image 1](https://fastapi.tiangolo.com/img/tutorial/header-param-models/image01.png)

## Forbid Extra Headers

In some special use cases (probably not very common), you might want to __restrict__ the headers that you want to receive.

You can use Pydantic's model configuration to `forbid` any `extra` fields:

### Python 3.10+

```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    model_config = {"extra": "forbid"}

    host: str
    save_data: bool
    if_modified_since: str | None = None
    traceparent: str | None = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return headers
```

#### Python 3.9+

```python
from typing import Annotated, Union

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    model_config = {"extra": "forbid"}

    host: str
    save_data: bool
    if_modified_since: Union[str, None] = None
    traceparent: Union[str, None] = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return headers
```

#### Python 3.8+

```python
from typing import List, Union

from fastapi import FastAPI, Header
from pydantic import BaseModel
from typing_extensions import Annotated

app = FastAPI()

class CommonHeaders(BaseModel):
    model_config = {"extra": "forbid"}

    host: str
    save_data: bool
    if_modified_since: Union[str, None] = None
    traceparent: Union[str, None] = None
    x_tag: List[str] = []

@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return headers
```

Tip

Prefer to use the `Annotated` version if possible.

#### Python 3.10+ - non-Annotated

```python
from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    model_config = {"extra": "forbid"}

    host: str
    save_data: bool
    if_modified_since: str | None = None
    traceparent: str | None = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(headers: CommonHeaders = Header()):
    return headers
```

Tip

Prefer to use the `Annotated` version if possible.

#### Python 3.9+ - non-Annotated

```python
from typing import Union

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    model_config = {"extra": "forbid"}

    host: str
    save_data: bool
    if_modified_since: Union[str, None] = None
    traceparent: Union[str, None] = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(headers: CommonHeaders = Header()):
    return headers
```

Tip

Prefer to use the `Annotated` version if possible.

#### Python 3.8+ - non-Annotated

```python
from typing import List, Union

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    model_config = {"extra": "forbid"}

    host: str
    save_data: bool
    if_modified_since: Union[str, None] = None
    traceparent: Union[str, None] = None
    x_tag: List[str] = []

@app.get("/items/")
async def read_items(headers: CommonHeaders = Header()):
    return headers
```

If a client tries to send some __extra headers__, they will receive an __error__ response.

For example, if the client tries to send a `tool` header with a value of `plumbus`, they will receive an __error__ response telling them that the header parameter `tool` is not allowed:

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

## Disable Convert Underscores

The same way as with regular header parameters, when you have underscore characters in the parameter names, they are __automatically converted to hyphens__.

For example, if you have a header parameter `save_data` in the code, the expected HTTP header will be `save-data`, and it will show up like that in the docs.

If for some reason you need to disable this automatic conversion, you can do it as well for Pydantic models for header parameters.

### Python 3.10+

```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: str | None = None
    traceparent: str | None = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(
    headers: Annotated[CommonHeaders, Header(convert_underscores=False)],
):
    return headers
```

#### Python 3.9+

```python
from typing import Annotated, Union

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: Union[str, None] = None
    traceparent: Union[str, None] = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(
    headers: Annotated[CommonHeaders, Header(convert_underscores=False)],
):
    return headers
```

#### Python 3.8+

```python
from typing import List, Union

from fastapi import FastAPI, Header
from pydantic import BaseModel
from typing_extensions import Annotated

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: Union[str, None] = None
    traceparent: Union[str, None] = None
    x_tag: List[str] = []

@app.get("/items/")
async def read_items(
    headers: Annotated[CommonHeaders, Header(convert_underscores=False)],
):
    return headers
```

Tip

Prefer to use the `Annotated` version if possible.

#### Python 3.10+ - non-Annotated

```python
from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: str | None = None
    traceparent: str | None = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(headers: CommonHeaders = Header(convert_underscores=False)):
    return headers
```

Tip

Prefer to use the `Annotated` version if possible.

#### Python 3.9+ - non-Annotated

```python
from typing import Union

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: Union[str, None] = None
    traceparent: Union[str, None] = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(headers: CommonHeaders = Header(convert_underscores=False)):
    return headers
```

Tip

Prefer to use the `Annotated` version if possible.

#### Python 3.8+ - non-Annotated

```python
from typing import List, Union

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: Union[str, None] = None
    traceparent: Union[str, None] = None
    x_tag: List[str] = []

@app.get("/items/")
async def read_items(headers: CommonHeaders = Header(convert_underscores=False)):
    return headers
```

Warning

Before setting `convert_underscores` to `False`, bear in mind that some HTTP proxies and servers disallow the usage of headers with underscores.

## Summary

You can use __Pydantic models__ to declare __headers__ in __FastAPI__. 😎
