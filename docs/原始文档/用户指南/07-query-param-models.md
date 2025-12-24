# Query Parameter Models

If you have a group of __query parameters__ that are related, you can create a __Pydantic model__ to declare them.

This would allow you to __re-use the model__ in __multiple places__ and also to declare validations and metadata for all the parameters at once.

**Note**

This is supported since FastAPI version `0.115.0`.

## Query Parameters with a Pydantic Model

Declare the __query parameters__ that you need in a __Pydantic model__, and then declare the parameter as `Query`:

### Python 3.10+

```python
from typing import Annotated, Literal

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

app = FastAPI()


class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []


@app.get("/items/")
async def read_items(filter_query: Annotated[FilterParams, Query()]):
    return filter_query
```

#### Python 3.9+

```python
from typing import Annotated, Literal

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field
from typing_extensions import Annotated, Literal

app = FastAPI()


class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []


@app.get("/items/")
async def read_items(filter_query: Annotated[FilterParams, Query()]):
    return filter_query
```

#### Python 3.8+

```python
from typing import List

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field
from typing_extensions import Annotated, Literal

app = FastAPI()


class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: List[str] = []


@app.get("/items/")
async def read_items(filter_query: Annotated[FilterParams, Query()]):
    return filter_query
```

**Tip**

Prefer to use the `Annotated` version if possible.

##### Python 3.10+ - non-Annotated

```python
from typing import Literal

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

app = FastAPI()


class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []


@app.get("/items/")
async def read_items(filter_query: FilterParams = Query()):
    return filter_query
```

**Tip**

Prefer to use the `Annotated` version if possible.

##### Python 3.9+ - non-Annotated

```python
from fastapi import FastAPI, Query
from pydantic import BaseModel, Field
from typing_extensions import Literal

app = FastAPI()


class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []


@app.get("/items/")
async def read_items(filter_query: FilterParams = Query()):
    return filter_query
```

**Tip**

Prefer to use the `Annotated` version if possible.

##### Python 3.8+ - non-Annotated

```python
from typing import List

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field
from typing_extensions import Literal

app = FastAPI()


class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: List[str] = []


@app.get("/items/")
async def read_items(filter_query: FilterParams = Query()):
    return filter_query
```

__FastAPI__ will __extract__ the data for __each field__ from the __query parameters__ in the request and give you the Pydantic model you defined.

## Check the Docs

You can see the query parameters in the docs UI at `/docs`.

## Restrict Extra Query Parameters

In some special use cases (probably not very common), you might want to __restrict__ the query parameters that you want to receive.

You can use Pydantic's model configuration to `forbid` any `extra` fields:

### Python 3.10+

```python
from typing import Annotated, Literal

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

app = FastAPI()


class FilterParams(BaseModel):
    model_config = {"extra": "forbid"}

    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []


@app.get("/items/")
async def read_items(filter_query: Annotated[FilterParams, Query()]):
    return filter_query
```

#### Python 3.9+

```python
from fastapi import FastAPI, Query
from pydantic import BaseModel, Field
from typing_extensions import Annotated, Literal

app = FastAPI()


class FilterParams(BaseModel):
    model_config = {"extra": "forbid"}

    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []


@app.get("/items/")
async def read_items(filter_query: Annotated[FilterParams, Query()]):
    return filter_query
```

#### Python 3.8+

```python
from typing import List

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field
from typing_extensions import Annotated, Literal

app = FastAPI()


class FilterParams(BaseModel):
    model_config = {"extra": "forbid"}

    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: List[str] = []


@app.get("/items/")
async def read_items(filter_query: Annotated[FilterParams, Query()]):
    return filter_query
```

**Tip**

Prefer to use the `Annotated` version if possible.

##### Python 3.10+ - non-Annotated

```python
from typing import Literal

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

app = FastAPI()


class FilterParams(BaseModel):
    model_config = {"extra": "forbid"}

    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []


@app.get("/items/")
async def read_items(filter_query: FilterParams = Query()):
    return filter_query
```

**Tip**

Prefer to use the `Annotated` version if possible.

##### Python 3.9+ - non-Annotated

```python
from fastapi import FastAPI, Query
from pydantic import BaseModel, Field
from typing_extensions import Literal

app = FastAPI()


class FilterParams(BaseModel):
    model_config = {"extra": "forbid"}

    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []


@app.get("/items/")
async def read_items(filter_query: FilterParams = Query()):
    return filter_query
```

**Tip**

Prefer to use the `Annotated` version if possible.

##### Python 3.8+ - non-Annotated

```python
from typing import List

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field
from typing_extensions import Literal

app = FastAPI()


class FilterParams(BaseModel):
    model_config = {"extra": "forbid"}

    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: List[str] = []


@app.get("/items/")
async def read_items(filter_query: FilterParams = Query()):
    return filter_query
```

If a client tries to send some __extra__ data in the __query parameters__, they will receive an __error__ response.

For example, if the client tries to send a `tool` query parameter with a value of `plumbus`, like:

```
https://example.com/items/?limit=10&tool=plumbus
```

They will receive an __error__ response telling them that the query parameter `tool` is not allowed:

```json
{
    "detail": [
        {
            "type": "extra_forbidden",
            "loc": ["query", "tool"],
            "msg": "Extra inputs are not permitted",
            "input": "plumbus"
        }
    ]
}
```

## Recap

You can use __Pydantic models__ to declare __query parameters__ in __FastAPI__.

**Tip**

Spoiler alert: you can also use Pydantic models to declare cookies and headers, but you will read about that later in the tutorial.
