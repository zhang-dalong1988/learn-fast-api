# Body - Fields

## Use Pydantic's `Field` to declare additional validation and metadata for request body attributes.

```python
from fastapi import Body, FastAPI
from pydantic import BaseModel, Field

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = Field(
        None, title="The description of the item", max_length=300
    )
    price: float = Field(..., gt=0, description="The price must be greater than zero")
    tax: float | None = Field(None, ge=0, description="Tax percentage (0-100)")


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item = Body(..., embed=True)):
    return {"item_id": item_id, "item": item}
```

## Field vs Query, Path, Body

`Field` works similarly to `Query`, `Path`, and `Body`, but it's specifically for Pydantic model fields.

All the parameters that can be passed to `Field` can also be passed to `Query`, `Path`, and `Body`.

But `Query`, `Path`, and `Body` are specifically for FastAPI parameters (path, query, body).

And `Field` is specifically for Pydantic model fields.

## Recap

With `Field` you can:

* Declare additional validation and metadata for request body attributes
* Use all the same parameters as `Query`, `Path`, and `Body`

And more!
