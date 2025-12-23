# Query Parameters

When you declare other function parameters that are not part of the path parameters, they are automatically interpreted as "query" parameters.

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/{item_id}")
async def read_item(item_id: str, name: str | None = None, age: int | None = None):
    return {"item_id": item_id, "name": name, "age": age}
```

Or with Python 3.8+:

```python
from typing import Union
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/{item_id}")
async def read_item(item_id: str, name: Union[str, None] = None, age: Union[int, None] = None):
    return {"item_id": item_id, "name": name, "age": age}
```

The query is the set of key-value pairs that go after the `?` in a URL, separated by `&` characters.

For example, in the URL:
`http://127.0.0.1:8000/items/?name=foo&age=25`

the query parameters are:
- `name: foo`
- `age: 25`

These are parsed by FastAPI and the types are validated.

## Defaults

Since the query parameters `name` and `age` are not part of the path, they are optional and can have a default value of `None`, or any other default value.

You can also declare them to be required, by not setting a default value:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/{item_id}")
async def read_user(item_id: str, name: str, age: int = 0):
    return {"item_id": item_id, "name": name, "age": age}
```

Here, the function parameters `name` is required (no default value), while `age` has a default value of `0`, so it's optional.

## Type conversions

FastAPI will automatically convert the query parameters to the type declared in the function.

For example, `http://127.0.0.1:8000/items/?name=foo&age=25` will have:
- `name` as `"foo"` (string)
- `age` as `25` (integer, not string)

If you don't declare the types or declare them as `str`, FastAPI will treat them as strings.

## Multiple values for query parameters

You can also receive multiple values for the same query parameter:

```python
from fastapi import FastAPI
from typing import List

app = FastAPI()


@app.get("/items/")
async def read_items(short: bool = False):
    results = {
        "items": [
            {"item_id": "foo"},
            {"item_id": "bar"}
        ]
    }
    if short:
        results = {
            "items": [
                {"item_id": "foo"}
            ]
        }
    return results
```

In this case, the URL could be:
`http://127.0.0.1:8000/items/?short=true`
or
`http://127.0.0.1:8000/items/?short=False`
or
`http://127.0.0.1:8000/items/?short=1`
or
`http://127.0.0.1:8000/items/?short=0`
or even
`http://127.0.0.1:8000/items/?short=yes`
or
`http://127.0.0.1:8000/items/?short=no`

FastAPI will interpret these as boolean values.

## Required query parameters

When you declare a default value (like `name: str = None` or `age: int = 0`), the parameter is optional.

If you want to make a query parameter required, just don't declare a default value:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/{item_id}")
async def read_user(item_id: str, name: str):
    return {"item_id": item_id, "name": name}
```

Here, the parameter `name` is required.

If you open the URL:
`http://127.0.0.1:8000/items/foo`

You will get an error like:

```json
{
    "detail": [
        {
            "loc": [
                "query",
                "name"
            ],
            "msg": "field required",
            "type": "value_error.missing"
        }
    ]
}
```

Because the query parameter `name` was not provided.

But if you go to:
`http://127.0.0.1:8000/items/foo?name=Frank`

It will work:

```json
{
    "item_id": "foo",
    "name": "Frank"
}
```

## Query Parameter Type Conversion

You can also declare query parameters with types like `int`, `float`, `bool`, etc.

FastAPI will automatically parse and convert the query parameters to the declared types.

For example:
- `http://127.0.0.1:8000/items/?page=1&limit=10`
- The parameter `page` will be `1` (integer)
- The parameter `limit` will be `10` (integer)
