# Response Model

You can declare the model used for the response with the parameter `response_model` in the path operation decorator.

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: list[str] = []


class UserIn(BaseModel):
    username: str
    password: str
    full_name: str | None = None
    email: str | None = None


class UserOut(BaseModel):
    username: str
    full_name: str | None = None
    email: str | None = None


@app.post("/user/", response_model=UserOut)
async def create_user(user: UserIn):
    return user
```

## Return the same input data

In this example, the model `UserIn` has a `password` field, but we don't want to return it in the response.

By using `response_model=UserOut`, FastAPI will:
* Convert the data to the model declared in `response_model`
* Validate the data
* Add it to the OpenAPI schema
* And use it in the automatic documentation UI

## Response Model encoding

Your response model could have default values, like:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float = 10.5
    tags: list[str] = []


items = {
    "foo": {"name": "Foo", "price": 50.2},
    "bar": {"name": "Bar", "description": "The bartenders", "price": 62, "tax": 20.2},
    "baz": {"name": "Baz", "description": None, "price": 50.2, "tax": 10.5, "tags": []},
}


@app.get(
    "/items/{item_id}",
    response_model=Item,
    response_model_exclude_unset=True,
)
async def read_item(item_id: str):
    return items[item_id]
```

## Recap

With `response_model` you can:

* Declare the response model
* Exclude fields that weren't explicitly set
* Have different input and output models

And more!
