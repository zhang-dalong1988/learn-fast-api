# Form Models

You can use __Pydantic models__ to declare __form fields__ in FastAPI.

Note

This is supported since FastAPI version `0.113.0`.

## 1. Pydantic Models for Forms

You just need to declare a __Pydantic model__ with the fields you want to receive as __form fields__, and then declare the parameter as `Form`:

### Python 3.9+

```python
from typing import Annotated

from fastapi import FastAPI, Form
from pydantic import BaseModel

app = FastAPI()


class FormData(BaseModel):
    username: str
    password: str


@app.post("/login/")
async def login(data: Annotated[FormData, Form()]):
    return data
```

#### Python 3.8+ non-Annotated

```python
from fastapi import FastAPI, Form
from pydantic import BaseModel
from typing_extensions import Annotated

app = FastAPI()


class FormData(BaseModel):
    username: str
    password: str


@app.post("/login/")
async def login(data: Annotated[FormData, Form()]):
    return data
```

Tip

Prefer to use the `Annotated` version if possible.

```python
from fastapi import FastAPI, Form
from pydantic import BaseModel

app = FastAPI()


class FormData(BaseModel):
    username: str
    password: str


@app.post("/login/")
async def login(data: FormData = Form()):
    return data
```

__FastAPI__ will __extract__ the data for __each field__ from the __form data__ in the request and give you the Pydantic model you defined.

## 2. Check the Docs

You can verify it in the docs UI at `/docs`:

## 3. Forbid Extra Fields

In some special use cases (probably not very common), you might want to __restrict__ the form fields to only those declared in the Pydantic model. And __forbid__ any __extra__ fields.

Note

This is supported since FastAPI version `0.114.0`.

You can use Pydantic's model configuration to `forbid` any `extra` fields:

### Python 3.9+

```python
from typing import Annotated

from fastapi import FastAPI, Form
from pydantic import BaseModel

app = FastAPI()


class FormData(BaseModel):
    username: str
    password: str

    model_config = {"extra": "forbid"}


@app.post("/login/")
async def login(data: Annotated[FormData, Form()]):
    return data
```

#### Python 3.8+ non-Annotated

```python
from fastapi import FastAPI, Form
from pydantic import BaseModel
from typing_extensions import Annotated

app = FastAPI()


class FormData(BaseModel):
    username: str
    password: str

    model_config = {"extra": "forbid"}


@app.post("/login/")
async def login(data: Annotated[FormData, Form()]):
    return data
```

Tip

Prefer to use the `Annotated` version if possible.

```python
from fastapi import FastAPI, Form
from pydantic import BaseModel

app = FastAPI()


class FormData(BaseModel):
    username: str
    password: str

    model_config = {"extra": "forbid"}


@app.post("/login/")
async def login(data: FormData = Form()):
    return data
```

If a client tries to send some extra data, they will receive an __error__ response.

For example, if the client tries to send the form fields:

- `username`: `Rick`
- `password`: `Portal Gun`
- `extra`: `Mr. Poopybutthole`

They will receive an error response telling them that the field `extra` is not allowed:

```json
{
    "detail": [
        {
            "type": "extra_forbidden",
            "loc": ["body", "extra"],
            "msg": "Extra inputs are not permitted",
            "input": "Mr. Poopybutthole"
        }
    ]
}
```

## 4. Summary

You can use Pydantic models to declare form fields in FastAPI.
