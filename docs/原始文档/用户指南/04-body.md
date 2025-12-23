# Request Body

To send data to a FastAPI path operation (like a POST, PUT, DELETE or PATCH operation), you can use **Pydantic models**.

```python
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
```

And declare it as the parameter of your path operation:

```python
from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


app = FastAPI()


@app.post("/items/")
async def create_item(item: Item):
    return item
```

## What is a Pydantic model?

Pydantic is a Python library for data validation and settings management using Python type annotations.

A Pydantic model is a class that inherits from `BaseModel` and defines fields with type annotations.

FastAPI uses Pydantic to:
- Validate the data in the request
- Convert the data to the declared types
- Generate JSON Schema for the API documentation
- Automatically generate API documentation

## Request Body vs Path Parameters

- **Path parameters**: Part of the URL path, like `/items/{item_id}`
- **Query parameters**: Key-value pairs in the URL after `?`, like `?skip=0&limit=10`
- **Request body**: Data sent in the body of the request (typically JSON)

## Example

Here's a complete example with all types of parameters:

```python
from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


app = FastAPI()


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    return {"item_id": item_id, **item.dict()}
```

In this example:
- `item_id` is a path parameter (integer)
- `item` is a request body (Pydantic model)

The JSON body would look like:

```json
{
    "name": "Foo",
    "description": "The description",
    "price": 45.2,
    "tax": 3.5
}
```

## Optional fields

Fields with default values (like `description: str | None = None`) are optional.

In the JSON, you can omit them:

```json
{
    "name": "Foo",
    "price": 45.2
}
```

Or include them with `null`:

```json
{
    "name": "Foo",
    "description": null,
    "price": 45.2
}
```

## Request Body + Path Parameters + Query Parameters

You can also declare path parameters, query parameters, and request body all at once:

```python
from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


app = FastAPI()


@app.put("/items/{item_id}")
async def update_item(
    item_id: int,
    item: Item,
    q: str | None = None
):
    result = {"item_id": item_id, **item.dict()}
    if q:
        result.update({"q": q})
    return result
```

In this example:
- `item_id` is a path parameter
- `item` is a request body
- `q` is an optional query parameter

## Multiple Request Body Parameters

You can also declare multiple request body parameters (e.g., `item` and `user`):

```python
from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


class User(BaseModel):
    username: str
    full_name: str | None = None


app = FastAPI()


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item, user: User):
    return {
        "item_id": item_id,
        "item": item,
        "user": user
    }
```

FastAPI will expect a request body like:

```json
{
    "item": {
        "name": "Foo",
        "price": 45.2
    },
    "user": {
        "username": "johndoe"
    }
}
```

Note that the keys `item` and `user` are the parameter names from the function.

## Singular values in body

If you want to receive a single value as a body (not a JSON object), you can use `Body`:

```python
from fastapi import FastAPI, Body
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


app = FastAPI()


@app.put("/items/{item_id}")
async def update_item(
    item_id: int,
    item: Item,
    user: User,
    importance: int = Body(...)
):
    return {
        "item_id": item_id,
        "item": item,
        "user": user,
        "importance": importance
    }
```

The `Body(...)` (with `...` which is equivalent to `Ellipsis`) makes the parameter required in the body.

The JSON would look like:

```json
{
    "item": {
        "name": "Foo",
        "price": 45.2
    },
    "user": {
        "username": "johndoe"
    },
    "importance": 5
}
```

## How to declare a required field

You can declare a field as required by not providing a default value:

```python
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
```

Here, `name` and `price` are required. `description` and `tax` are optional (they have default values of `None`).
