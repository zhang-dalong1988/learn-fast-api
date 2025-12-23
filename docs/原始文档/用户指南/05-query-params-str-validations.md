# Query Parameters and String Validations

## Declare more metadata

You can declare additional validation and metadata for query parameters.

```python
from fastapi import FastAPI, Query

app = FastAPI()


@app.get("/items/")
async def read_items(
    q: str | None = Query(None, min_length=3, max_length=50),
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

## Add regular expressions

You can define a regular expression pattern that the parameter should match:

```python
from fastapi import FastAPI, Query

app = FastAPI()


@app.get("/items/")
async def read_items(
    q: str | None = Query(None, min_length=3, max_length=50, pattern="^fixedquery$"),
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

The specified regular expression `^fixedquery$` checks that the parameter `q` receives the value `fixedquery`.

## Default values

You can define a default value for the query parameter:

```python
from fastapi import FastAPI, Query

app = FastAPI()


@app.get("/items/")
async def read_items(q: str = Query("fixedquery", min_length=3)):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

## Make it required

To make a query parameter required, you can just not declare a default value (or use `...`):

```python
from fastapi import FastAPI, Query

app = FastAPI()


@app.get("/items/")
async def read_items(q: str = Query(min_length=3)):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

## Query parameter list / multiple values

You can define a query parameter to receive multiple values:

```python
from fastapi import FastAPI, Query
from typing import List

app = FastAPI()


@app.get("/items/")
async def read_items(q: List[str] = Query(["foo", "bar"])):
    query_items = {"q": q}
    return query_items
```

With the URL `http://localhost:8000/items/?q=foo&q=bar`, you would receive:

```json
{
    "q": [
        "foo",
        "bar"
    ]
}
```

## Query parameter list / multiple values with defaults

You can also define a list of default values:

```python
from fastapi import FastAPI, Query
from typing import List

app = FastAPI()


@app.get("/items/")
async def read_items(q: List[str] = Query(["foo", "bar"], min_length=2)):
    query_items = {"q": q}
    return query_items
```

## Declare more metadata

You can add more information about the parameter:

```python
from fastapi import FastAPI, Query

app = FastAPI()


@app.get("/items/")
async def read_items(
    q: str
    | None = Query(
        None,
        title="Query string",
        min_length=3,
        max_length=50,
        pattern="^fixedquery$",
    ),
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

## Alias parameters

You can declare an alias for a query parameter:

```python
from fastapi import FastAPI, Query

app = FastAPI()


@app.get("/items/")
async def read_items(q: str | None = Query(None, alias="item-query")):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

Now you can use the URL `http://localhost:8000/items/?item-query=foo`.

## Deprecated parameters

You can mark a query parameter as deprecated:

```python
from fastapi import FastAPI, Query

app = FastAPI()


@app.get("/items/")
async def read_items(
    q: str | None = Query(
        None,
        alias="item-query",
        title="Query string",
        description="Query string for the items to search in the database that have a good match",
        min_length=3,
        max_length=50,
        pattern="^fixedquery$",
        deprecated=True,
    ),
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

## Include `Query` in `Path` declarations

The `Query`, `Path`, and other classes you'll see next are siblings of `Param`. And all of them inherit from a common `Param` class.

So, you can import `Query` from `fastapi`, and that's it.

When you need to declare query parameters with validations, you use `Query`. Similarly for `Path`, `Body`, etc.

## Recap

With `Query` you can:

* Declare additional validation and metadata for query parameters
* Declare default values
* Make parameters required
* Declare parameters as deprecated
* Add aliases
* Use regular expressions
* Declare parameters to receive multiple values

And more!
