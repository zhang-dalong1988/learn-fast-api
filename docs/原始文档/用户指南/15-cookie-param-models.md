# Cookie Parameter Models - FastAPI

If you have a group of __cookies__ that are related, you can create a __Pydantic model__ to declare them. 🍪

This would allow you to __re-use the model__ in __multiple places__ and also to declare validations and metadata for all the parameters at once. 😎

Note

This is supported since FastAPI version `0.115.0`. 🤓

Tip

This same technique applies to `Query`, `Cookie`, and `Header`. 😎

## Cookies with a Pydantic Model¶

Declare the __cookie__ parameters that you need in a __Pydantic model__, and then declare the parameter as `Cookie`:

Python 3.10+

```
from typing import Annotated

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cookies(BaseModel):
    session_id: str
    fatebook_tracker: str | None = None
    googall_tracker: str | None = None

@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

🤓 Other versions and variants

Python 3.9+Python 3.8+Python 3.10+ - non-AnnotatedPython 3.8+ - non-Annotated

```
from typing import Annotated, Union

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cookies(BaseModel):
    session_id: str
    fatebook_tracker: Union[str, None] = None
    googall_tracker: Union[str, None] = None

@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

```
from typing import Union

from fastapi import Cookie, FastAPI
from pydantic import BaseModel
from typing_extensions import Annotated

app = FastAPI()

class Cookies(BaseModel):
    session_id: str
    fatebook_tracker: Union[str, None] = None
    googall_tracker: Union[str, None] = None

@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

Tip

Prefer to use the `Annotated` version if possible.

```
from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cookies(BaseModel):
    session_id: str
    fatebook_tracker: str | None = None
    googall_tracker: str | None = None

@app.get("/items/")
async def read_items(cookies: Cookies = Cookie()):
    return cookies
```

Tip

Prefer to use the `Annotated` version if possible.

```
from typing import Union

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cookies(BaseModel):
    session_id: str
    fatebook_tracker: Union[str, None] = None
    googall_tracker: Union[str, None] = None

@app.get("/items/")
async def read_items(cookies: Cookies = Cookie()):
    return cookies
```

__FastAPI__ will __extract__ the data for __each field__ from the __cookies__ received in the request and give you the Pydantic model you defined.

## Check the Docs¶

You can see the defined cookies in the docs UI at `/docs`:

![Image 1](https://example.com/img/tutorial/cookie-param-models/image01.png)

Info

Have in mind that, as __browsers handle cookies__ in special ways and behind the scenes, they __don't__ easily allow __JavaScript__ to touch them.

If you go to the __API docs UI__ at `/docs` you will be able to see the __documentation__ for cookies for your _path operations_.

But even if you __fill the data__ and click "Execute", because the docs UI works with __JavaScript__, the cookies won't be sent, and you will see an __error__ message as if you didn't write any values.

In some special use cases (probably not very common), you might want to __restrict__ the cookies that you want to receive.

Your API now has the power to control its own cookie consent. 🤪🍪

You can use Pydantic's model configuration to `forbid` any `extra` fields:

Python 3.9+

```
from typing import Annotated, Union

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cookies(BaseModel):
    model_config = {"extra": "forbid"}

    session_id: str
    fatebook_tracker: Union[str, None] = None
    googall_tracker: Union[str, None] = None

@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

🤓 Other versions and variants

Python 3.10+Python 3.8+Python 3.10+ - non-AnnotatedPython 3.8+ - non-Annotated

```
from typing import Annotated

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cookies(BaseModel):
    model_config = {"extra": "forbid"}

    session_id: str
    fatebook_tracker: str | None = None
    googall_tracker: str | None = None

@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

```
from typing import Union

from fastapi import Cookie, FastAPI
from pydantic import BaseModel
from typing_extensions import Annotated

app = FastAPI()

class Cookies(BaseModel):
    model_config = {"extra": "forbid"}

    session_id: str
    fatebook_tracker: Union[str, None] = None
    googall_tracker: Union[str, None] = None

@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

Tip

Prefer to use the `Annotated` version if possible.

```
from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cookies(BaseModel):
    model_config = {"extra": "forbid"}

    session_id: str
    fatebook_tracker: str | None = None
    googall_tracker: str | None = None

@app.get("/items/")
async def read_items(cookies: Cookies = Cookie()):
    return cookies
```

Tip

Prefer to use the `Annotated` version if possible.

```
from typing import Union

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cookies(BaseModel):
    model_config = {"extra": "forbid"}

    session_id: str
    fatebook_tracker: Union[str, None] = None
    googall_tracker: Union[str, None] = None

@app.get("/items/")
async def read_items(cookies: Cookies = Cookie()):
    return cookies
```

If a client tries to send some __extra cookies__, they will receive an __error__ response.

Poor cookie banners with all their effort to get your consent for the API to reject it. 🍪

For example, if the client tries to send a `santa_tracker` cookie with a value of `good-list-please`, the client will receive an __error__ response telling them that the `santa_tracker` cookie is not allowed:

```
{
    "detail": [
        {
            "type": "extra_forbidden",
            "loc": ["cookie", "santa_tracker"],
            "msg": "Extra inputs are not permitted",
            "input": "good-list-please",
        }
    ]
}
```

## Summary¶

You can use __Pydantic models__ to declare __cookies__ in __FastAPI__. 😎
