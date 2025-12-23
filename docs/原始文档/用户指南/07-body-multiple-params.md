# Body - Multiple Parameters

## Mix Path, Query and Body parameters

First, of course, you can mix `Path`, `Query` and request body parameter declarations freely and FastAPI will know what to do.

And you can also declare body parameters as optional, by setting the default to `None`:

```python
from fastapi import FastAPI
from fastapi import Path, Query
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


@app.put("/items/{item_id}")
async def update_item(
    *,
    item_id: int = Path(..., title="The ID of the item to get", ge=0, le=1000),
    q: str | None = Query(None, alias="item-query"),
    item: Item | None = None,
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    if item:
        results.update({"item": item})
    return results
```

## Multiple body parameters

In the previous example, the path operations would expect a JSON body with the attributes of the Item model, like:

```json
{
    "name": "Foo",
    "description": "The pretender",
    "price": 42.0,
    "tax": 3.2
}
```

But you can also declare multiple body parameters, e.g. `item` and `user`:

```python
from fastapi import FastAPI
from fastapi import Path
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


class User(BaseModel):
    username: str
    full_name: str | None = None


@app.put("/items/{item_id}")
async def update_item(
    *,
    item_id: int = Path(..., title="The ID of the item to get", ge=0, le=1000),
    item: Item,
    user: User,
):
    results = {"item_id": item_id, "item": item, "user": user}
    return results
```

In this case FastAPI would expect a body like:

```json
{
    "item": {
        "name": "Foo",
        "description": "The pretender",
        "price": 42.0,
        "tax": 3.2
    },
    "user": {
        "username": "dave"
    }
}
```

## Singular values in body

The same way you can declare additional query parameters and path parameters using `Query` and `Path`, you can declare additional body parameters using `Body`:

```python
from fastapi import FastAPI, Body, Path
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


class User(BaseModel):
    username: str
    full_name: str | None = None


@app.put("/items/{item_id}")
async def update_item(
    *,
    item_id: int = Path(..., title="The ID of the item to get", ge=0, le=1000),
    item: Item,
    user: User,
    importance: int = Body(..., gt=0),
    q: str | None = Body(None),
):
    results = {"item_id": item_id, "item": item, "user": user, "importance": importance}
    if q:
        results.update({"q": q})
    return results
```

In this case FastAPI would expect a body like:

```json
{
    "item": {
        "name": "Foo",
        "description": "The pretender",
        "price": 42.0,
        "tax": 3.2
    },
    "user": {
        "username": "dave"
    },
    "importance": 5
}
```

## Embed a single body parameter

If you want to embed a single body parameter, you can use `Body` with the `embed` parameter:

```python
from fastapi import FastAPI, Body, Path
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


@app.put("/items/{item_id}")
async def update_item(
    *,
    item_id: int = Path(..., title="The ID of the item to get", ge=0, le=1000),
    item: Item = Body(..., embed=True),
):
    results = {"item_id": item_id, "item": item}
    return results
```

Instead of:

```json
{
    "name": "Foo",
    "price": 42.0
}
```

FastAPI would expect:

```json
{
    "item": {
        "name": "Foo",
        "price": 42.0
    }
}
```

## Recap

You can:

* Declare multiple body parameters (`item`, `user`, etc.)
* Use `Body` to declare additional singular values in the body
* Use `Body` with `embed=True` to embed a single body parameter

And more!
