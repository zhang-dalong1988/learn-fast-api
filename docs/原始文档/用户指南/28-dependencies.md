# Dependencies

__FastAPI__ has a very powerful but intuitive __Dependency Injection__ system.

It is designed to be very simple to use, and to make it very easy for any developer to integrate other components with __FastAPI__.

## What is "Dependency Injection"

__"Dependency Injection"__ means, in programming, that there is a way for your code (in this case, your _path operation functions_) to declare things that it requires to work and use: "dependencies".

And then, that system (in this case __FastAPI__) will take care of doing whatever is needed to provide your code with those needed dependencies ("inject" the dependencies).

This is very useful when you need to:

- Have shared logic (the same code logic again and again).
- Share database connections.
- Enforce security, authentication, role requirements, etc.
- And many other things...

All these, while minimizing code repetition.

## First Steps

Let's see a very simple example. It will be so simple that it is not very useful, for now.

But this way we can focus on how the __Dependency Injection__ system works.

### 1. Create a dependency, or "dependable"

Let's first focus on the dependency.

It is just a function that can take all the same parameters that a _path operation function_ can take:

#### Python 3.10+

```python
from typing import Annotated

from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons

@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

#### Python 3.9+

```python
from typing import Annotated, Union

from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons

@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

#### Python 3.8+

```python
from typing import Union

from fastapi import Depends, FastAPI
from typing_extensions import Annotated

app = FastAPI()

async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons

@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

#### Python 3.10+ - non-Annotated

```python
from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons

@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    return commons
```

#### Python 3.8+ - non-Annotated

```python
from typing import Union

from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons

@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    return commons
```

That's it.

__2 lines__.

And it has the same shape and structure that all your _path operation functions_ have.

You can think of it as a _path operation function_ without the "decorator" (without the `@app.get("/some-path")`).

And it can return anything you want.

In this case, this dependency expects:

- An optional query parameter `q` that is a `str`.
- An optional query parameter `skip` that is an `int`, and by default is `0`.
- An optional query parameter `limit` that is an `int`, and by default is `100`.

And then it just returns a `dict` containing those values.

Info

FastAPI added support for `Annotated` (and started recommending it) in version 0.95.0.

If you have an older version, you would get errors when trying to use `Annotated`.

Make sure you Upgrade the FastAPI version to at least 0.95.1 before using `Annotated`.

### 2. Import `Depends`

#### Python 3.10+

```python
from typing import Annotated

from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons

@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

#### Python 3.9+

```python
from typing import Annotated, Union

from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons

@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

#### Python 3.8+

```python
from typing import Union

from fastapi import Depends, FastAPI
from typing_extensions import Annotated

app = FastAPI()

async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons

@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

#### Python 3.10+ - non-Annotated

```python
from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons

@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    return commons
```

#### Python 3.8+ - non-Annotated

```python
from typing import Union

from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons

@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    return commons
```

### 3. Declare the dependency, in the "dependant"

The same way you use `Body`, `Query`, etc. with your _path operation function_ parameters, use `Depends` with a new parameter:

#### Python 3.10+

```python
from typing import Annotated

from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons

@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

#### Python 3.9+

```python
from typing import Annotated, Union

from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons

@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

#### Python 3.8+

```python
from typing import Union

from fastapi import Depends, FastAPI
from typing_extensions import Annotated

app = FastAPI()

async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons

@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

#### Python 3.10+ - non-Annotated

```python
from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons

@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    return commons
```

#### Python 3.8+ - non-Annotated

```python
from typing import Union

from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons

@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    return commons
```

Although you use `Depends` in the parameters of your function the same way you use `Body`, `Query`, etc, `Depends` works a bit differently.

You only give `Depends` a single parameter.

This parameter must be something like a function.

You __don't call it__ directly (don't add the parenthesis at the end), you just pass it as a parameter to `Depends()`.

And that function takes parameters in the same way that _path operation functions_ do.

Tip

You'll see what other "things", apart from functions, can be used as dependencies in the next chapter.

Whenever a new request arrives, __FastAPI__ will take care of:

- Calling your dependency ( "dependable") function with the correct parameters.
- Get the result from your function.
- Assign that result to the parameter in your _path operation function_.

```
graph TB

common_parameters(["common_parameters"])
read_items["/items/"]
read_users["/users/"]

common_parameters --> read_items
common_parameters --> read_users
```

This way you write shared code once and __FastAPI__ takes care of calling it for your _path operations_.

Check

Notice that you don't have to create a special class and pass it somewhere to __FastAPI__ to "register" it or anything similar.

You just pass it to `Depends` and __FastAPI__ knows how to do the rest.

In the examples above, you see that there's a tiny bit of __code duplication__.

When you need to use the `common_parameters()` dependency, you have to write the whole parameter with the type annotation and `Depends()`:

```
commons: Annotated[dict, Depends(common_parameters)]
```

But because we are using `Annotated`, we can store that `Annotated` value in a variable and use it in multiple places:

#### Python 3.10+

```python
from typing import Annotated

from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

CommonsDep = Annotated[dict, Depends(common_parameters)]

@app.get("/items/")
async def read_items(commons: CommonsDep):
    return commons

@app.get("/users/")
async def read_users(commons: CommonsDep):
    return commons
```

#### Python 3.9+

```python
from typing import Annotated, Union

from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}

CommonsDep = Annotated[dict, Depends(common_parameters)]

@app.get("/items/")
async def read_items(commons: CommonsDep):
    return commons

@app.get("/users/")
async def read_users(commons: CommonsDep):
    return commons
```

#### Python 3.8+

```python
from typing import Union

from fastapi import Depends, FastAPI
from typing_extensions import Annotated

app = FastAPI()

async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}

CommonsDep = Annotated[dict, Depends(common_parameters)]

@app.get("/items/")
async def read_items(commons: CommonsDep):
    return commons

@app.get("/users/")
async def read_users(commons: CommonsDep):
    return commons
```

Tip

This is just standard Python, it's called a "type alias", it's actually not specific to __FastAPI__.

But because __FastAPI__ is based on the Python standards, including `Annotated`, you can use this trick in your code.

The dependencies will keep working as expected, and the __best part__ is that the __type information will be preserved__, which means that your editor will be able to keep providing you with __autocompletion__, __inline errors__, etc. The same for other tools like `mypy`.

This will be especially useful when you use it in a __large code base__ where you use __the same dependencies__ over and over again in __many _path operations___.

## 4. To `async` or not to `async`

As dependencies will also be called by __FastAPI__ (the same as your _path operation functions_), the same rules apply while defining your functions.

You can use `async def` or normal `def`.

And you can declare dependencies with `async def` inside of normal `def` _path operation functions_, or `def` dependencies inside of `async def` _path operation functions_, etc.

It doesn't matter. __FastAPI__ will know what to do.

## 5. Integrated with OpenAPI

All the request declarations, validations and requirements of your dependencies (and sub-dependencies) will be integrated in the same OpenAPI schema.

So, the interactive docs will have all the information from these dependencies too:

![Interactive API docs with dependencies](https://fastapi.tiangolo.com/img/tutorial/dependencies/image01.png)

## 6. Simple usage

If you look at it, _path operation functions_ are declared to be used whenever a _path_ and _operation_ matches, and then __FastAPI__ takes care of calling the function with the correct parameters, extracting the data from the request.

Actually, all (or most) of the web frameworks work in this same way.

You never call those functions directly. They are called by your framework (in this case, __FastAPI__).

With the Dependency Injection system, you can also tell __FastAPI__ that your _path operation function_ also "depends" on something else that should be executed before your _path operation function_, and __FastAPI__ will take care of executing it and "injecting" the results.

Other common terms for this same idea of "dependency injection" are:

- resources
- providers
- services
- injectables
- components

## 7. __FastAPI__ plug-ins

Integrations and "plug-ins" can be built using the __Dependency Injection__ system. But in fact, there is actually __no need to create "plug-ins"__, as by using dependencies it's possible to declare an infinite number of integrations and interactions that become available to your _path operation functions_.

And dependencies can be created in a very simple and intuitive way that allows you to just import the Python packages you need, and integrate them with your API functions in a couple of lines of code, _literally_.

You will see examples of this in the next chapters, about relational and NoSQL databases, security, etc.

## 8. __FastAPI__ compatibility

The simplicity of the dependency injection system makes __FastAPI__ compatible with:

- all the relational databases
- NoSQL databases
- external packages
- external APIs
- authentication and authorization systems
- API usage monitoring systems
- response data injection systems
- etc.

## 9. Simple and Powerful

Although the hierarchical dependency injection system is very simple to define and use, it's still very powerful.

You can define dependencies that in turn can define dependencies themselves.

In the end, a hierarchical tree of dependencies is built, and the __Dependency Injection__ system takes care of solving all these dependencies for you (and their sub-dependencies) and providing (injecting) the results at each step.

For example, let's say you have 4 API endpoints (_path operations_):

- `/items/public/`
- `/items/private/`
- `/users/{user_id}/activate`
- `/items/pro/`

then you could add different permission requirements for each of them just with dependencies and sub-dependencies:

```
graph TB

current_user(["current_user"])
active_user(["active_user"])
admin_user(["admin_user"])
paying_user(["paying_user"])

public["/items/public/"]
private["/items/private/"]
activate_user["/users/{user_id}/activate"]
pro_items["/items/pro/"]

current_user --> active_user
active_user --> admin_user
active_user --> paying_user

current_user --> public
active_user --> private
admin_user --> activate_user
paying_user --> pro_items
```

## 10. Integrated with __OpenAPI__

All these dependencies, while declaring their requirements, also add parameters, validations, etc. to your _path operations_.

__FastAPI__ will take care of adding it all to the OpenAPI schema, so that it is shown in the interactive documentation systems.
