# Cookie Parameters

You can define cookie parameters the same way you define `Query` or `Path` parameters.

## Import Cookie

```python
from fastapi import Cookie, FastAPI
from typing import Union

app = FastAPI()


@app.get("/items/")
async def read_items(ads_id: Union[str, None] = Cookie(None)):
    return {"ads_id": ads_id}
```

## Cookie parameters are defined

Cookie parameters are defined similarly to query parameters:

* The type annotation is used to define the type
* You can use `Cookie` to add additional validation and metadata
* You can use `None` to make them optional

## Recap

With `Cookie` you can:

* Define cookie parameters
* Add validation and metadata
* Set default values

And more!
