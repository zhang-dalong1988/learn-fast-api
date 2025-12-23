# Header Parameters

You can define header parameters the same way you define `Query` or `Path` parameters.

## Import Header

```python
from fastapi import FastAPI, Header
from typing import Union

app = FastAPI()


@app.get("/items/")
async def read_items(user_agent: Union[str, None] = Header(None)):
    return {"User-Agent": user_agent}
```

## Automatic conversion

FastAPI will automatically convert header parameter names from `user_agent` to `User-Agent`.

If you don't want this automatic conversion, you can use `convert_underscores=False`:

```python
from fastapi import FastAPI, Header

app = FastAPI()


@app.get("/items/")
async def read_items(
    strange_header: str | None = Header(None, convert_underscores=False)
):
    return {"strange_header": strange_header}
```

## Recap

With `Header` you can:

* Define header parameters
* Get automatic conversion to names with hyphens
* Disable automatic conversion if needed

And more!
