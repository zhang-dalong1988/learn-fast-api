# Path Parameters and Numeric Validations

You can declare metadata and validations for path parameters the same way as with `Query`.

## Import Path

```python
from fastapi import FastAPI, Path

app = FastAPI()


@app.get("/items/{item_id}")
async def read_items(
    item_id: int = Path(..., title="The ID of the item to get"),
):
    results = {"item_id": item_id}
    return results
```

## Order matters

When you declare a required path parameter with `Path`, the order of parameters matters.

If you have a function like:

```python
from fastapi import FastAPI, Path

app = FastAPI()


@app.get("/items/{item_id}")
async def read_items(
    item_id: int = Path(..., title="The ID of the item to get"),
    name: str | None = None,
):
    results = {"item_id": item_id}
    if name:
        results.update({"name": name})
    return results
```

Python will complain that `name` has a default value but `item_id` doesn't come before it.

You can solve this by reordering the parameters, or by using the `*` trick:

```python
from fastapi import FastAPI, Path

app = FastAPI()


@app.get("/items/{item_id}")
async def read_items(
    *,
    item_id: int = Path(..., title="The ID of the item to get"),
    name: str | None = None,
):
    results = {"item_id": item_id}
    if name:
        results.update({"name": name})
    return results
```

## Number validations

You can declare numeric constraints:

```python
from fastapi import FastAPI, Path

app = FastAPI()


@app.get("/items/{item_id}")
async def read_items(
    item_id: int = Path(..., gt=0, le=100),
):
    results = {"item_id": item_id}
    return results
```

The parameters `gt`, `le` are:
- `gt`: greater than
- `le`: less than or equal

You can also use:
- `lt`: less than
- `ge`: greater than or equal

## Recap

With `Path` you can:

* Declare metadata for path parameters
* Declare numeric validations like `gt`, `ge`, `lt`, `le`
* Use the `*` trick to handle parameter order

And more!
