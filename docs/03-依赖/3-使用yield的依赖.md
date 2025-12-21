# 使用yield的依赖

FastAPI 支持在完成后执行一些额外步骤的依赖项。

要做到这一点，使用 `yield` 而不是 `return`，并在之后编写额外的步骤（代码）。

> 提示
>
> 确保每个依赖项只使用一次 `yield`。

## 使用 `yield` 的数据库依赖项

例如，你可以使用它来创建数据库会话并在完成后关闭它。

只有在创建响应之前执行 `yield` 语句之前和包括 `yield` 语句的代码：

**Python 3.8+**

```python
async def get_db():
    db = DBSession()
    try:
        yield db
    finally:
        db.close()
```

yield 的值是注入到路径操作和其他依赖项中的内容：

**Python 3.8+**

```python
async def get_db():
    db = DBSession()
    try:
        yield db
    finally:
        db.close()
```

`yield` 语句之后的代码在创建响应之后但在发送之前执行：

**Python 3.8+**

```python
async def get_db():
    db = DBSession()
    try:
        yield db
    finally:
        db.close()
```

> 提示
>
> 你可以使用 `async` 或普通函数。
>
> FastAPI 会对每个函数做正确的事情，与普通依赖项相同。

## 使用 `yield` 和 `try` 的依赖项

如果你在使用 `yield` 的依赖项中使用 `try` 块，你将收到在使用该依赖项时抛出的任何异常。

例如，如果在某个中间点，在另一个依赖项或路径操作中，某些代码执行了数据库事务"回滚"或创建任何其他错误，你将在你的依赖项中收到该异常。

因此，你可以在依赖项内部使用 `except SomeException` 查找特定的异常。

同样，你可以使用 `finally` 来确保退出步骤被执行，无论是否有异常。

**Python 3.8+**

```python
async def get_db():
    db = DBSession()
    try:
        yield db
    finally:
        db.close()
```

## 使用 `yield` 的子依赖项

你可以拥有任意大小和形状的子依赖项和子依赖项的"树"，它们中的任何一个或全部都可以使用 `yield`。

FastAPI 将确保每个带有 `yield` 的依赖项中的"退出代码"以正确的顺序运行。

例如，`dependency_c` 可以依赖于 `dependency_b`，而 `dependency_b` 依赖于 `dependency_a`：

**Python 3.9+**

```python
from typing import Annotated

from fastapi import Depends

async def dependency_a():
    dep_a = generate_dep_a()
    try:
        yield dep_a
    finally:
        dep_a.close()

async def dependency_b(dep_a: Annotated[DepA, Depends(dependency_a)]):
    dep_b = generate_dep_b()
    try:
        yield dep_b
    finally:
        dep_b.close(dep_a)

async def dependency_c(dep_b: Annotated[DepB, Depends(dependency_b)]):
    dep_c = generate_dep_c()
    try:
        yield dep_c
    finally:
        dep_c.close(dep_b)
```

**Python 3.8+**

```python
from fastapi import Depends
from typing_extensions import Annotated

async def dependency_a():
    dep_a = generate_dep_a()
    try:
        yield dep_a
    finally:
        dep_a.close()

async def dependency_b(dep_a: Annotated[DepA, Depends(dependency_a)]):
    dep_b = generate_dep_b()
    try:
        yield dep_b
    finally:
        dep_b.close(dep_a)

async def dependency_c(dep_b: Annotated[DepB, Depends(dependency_b)]):
    dep_c = generate_dep_c()
    try:
        yield dep_c
    finally:
        dep_c.close(dep_b)
```

**Python 3.8+ - non-Annotated**

```python
from fastapi import Depends

async def dependency_a():
    dep_a = generate_dep_a()
    try:
        yield dep_a
    finally:
        dep_a.close()

async def dependency_b(dep_a=Depends(dependency_a)):
    dep_b = generate_dep_b()
    try:
        yield dep_b
    finally:
        dep_b.close(dep_a)

async def dependency_c(dep_b=Depends(dependency_b)):
    dep_c = generate_dep_c()
    try:
        yield dep_c
    finally:
        dep_c.close(dep_b)
```

> 提示：如果可能，优先使用 `Annotated` 版本。

它们都可以使用 `yield`。

在这种情况下，`dependency_c` 要执行其退出代码，需要 `dependency_b` 的值（这里命名为 `dep_b`）仍然可用。

而反过来，`dependency_b` 需要 `dependency_a` 的值（这里命名为 `dep_a`）可用于其退出代码。

同样，你可以拥有一些带有 `yield` 的依赖项和一些其他带有 `return` 的依赖项，并且其中一些依赖于其他的。

你可以拥有一个依赖于多个其他带有 `yield` 的依赖项的单个依赖项，等等。

你可以拥有你想要的任何依赖项组合。

FastAPI 将确保一切以正确的顺序运行。

> 技术细节
>
> 这得益于 Python 的上下文管理器。
>
> FastAPI 在内部使用它们来实现这一点。

## 使用 `yield` 和 `HTTPException` 的依赖项

你已经看到你可以使用带有 `yield` 的依赖项，并拥有捕获异常的 `try` 块。

同样，你可以在 `yield` 之后的退出代码中抛出 `HTTPException` 或类似的异常。

> 提示
>
> 这是一种有些高级的技术，在大多数情况下，你并不会真正需要它，因为你可以在你的应用程序代码的其余部分抛出异常（包括 `HTTPException`），例如，在路径操作函数中。
>
> 但如果你需要它，它就在那里。🤓

**Python 3.9+**

```python
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException

app = FastAPI()

data = {
    "plumbus": {"description": "Freshly pickled plumbus", "owner": "Morty"},
    "portal-gun": {"description": "Gun to create portals", "owner": "Rick"},
}

class OwnerError(Exception):
    pass

def get_username():
    try:
        yield "Rick"
    except OwnerError as e:
        raise HTTPException(status_code=400, detail=f"Owner error: {e}")

@app.get("/items/{item_id}")
def get_item(item_id: str, username: Annotated[str, Depends(get_username)]):
    if item_id not in data:
        raise HTTPException(status_code=404, detail="Item not found")
    item = data[item_id]
    if item["owner"] != username:
        raise OwnerError(username)
    return item
```

**Python 3.8+**

```python
from fastapi import Depends, FastAPI, HTTPException
from typing_extensions import Annotated

app = FastAPI()

data = {
    "plumbus": {"description": "Freshly pickled plumbus", "owner": "Morty"},
    "portal-gun": {"description": "Gun to create portals", "owner": "Rick"},
}

class OwnerError(Exception):
    pass

def get_username():
    try:
        yield "Rick"
    except OwnerError as e:
        raise HTTPException(status_code=400, detail=f"Owner error: {e}")

@app.get("/items/{item_id}")
def get_item(item_id: str, username: Annotated[str, Depends(get_username)]):
    if item_id not in data:
        raise HTTPException(status_code=404, detail="Item not found")
    item = data[item_id]
    if item["owner"] != username:
        raise OwnerError(username)
    return item
```

**Python 3.8+ - non-Annotated**

```python
from fastapi import Depends, FastAPI, HTTPException

app = FastAPI()

data = {
    "plumbus": {"description": "Freshly pickled plumbus", "owner": "Morty"},
    "portal-gun": {"description": "Gun to create portals", "owner": "Rick"},
}

class OwnerError(Exception):
    pass

def get_username():
    try:
        yield "Rick"
    except OwnerError as e:
        raise HTTPException(status_code=400, detail=f"Owner error: {e}")

@app.get("/items/{item_id}")
def get_item(item_id: str, username: str = Depends(get_username)):
    if item_id not in data:
        raise HTTPException(status_code=404, detail="Item not found")
    item = data[item_id]
    if item["owner"] != username:
        raise OwnerError(username)
    return item
```

> 提示：如果可能，优先使用 `Annotated` 版本。

你可以用来捕获异常（并可能也抛出另一个 `HTTPException`）的替代方法是创建自定义异常处理器。

## 使用 `yield` 和 `except` 的依赖项

如果你在使用 `yield` 的依赖项中使用 `except` 捕获异常，并且你没有再次抛出它（或抛出新的异常），FastAPI 将无法注意到有异常，就像常规 Python 中发生的一样：

**Python 3.9+**

```python
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException

app = FastAPI()

class InternalError(Exception):
    pass

def get_username():
    try:
        yield "Rick"
    except InternalError:
        print("Oops, we didn't raise again, Britney 😱")

@app.get("/items/{item_id}")
def get_item(item_id: str, username: Annotated[str, Depends(get_username)]):
    if item_id == "portal-gun":
        raise InternalError(
            f"The portal gun is too dangerous to be owned by {username}"
        )
    if item_id != "plumbus":
        raise HTTPException(
            status_code=404, detail="Item not found, there's only a plumbus here"
        )
    return item_id
```

**Python 3.8+**

```python
from fastapi import Depends, FastAPI, HTTPException
from typing_extensions import Annotated

app = FastAPI()

class InternalError(Exception):
    pass

def get_username():
    try:
        yield "Rick"
    except InternalError:
        print("Oops, we didn't raise again, Britney 😱")

@app.get("/items/{item_id}")
def get_item(item_id: str, username: Annotated[str, Depends(get_username)]):
    if item_id == "portal-gun":
        raise InternalError(
            f"The portal gun is too dangerous to be owned by {username}"
        )
    if item_id != "plumbus":
        raise HTTPException(
            status_code=404, detail="Item not found, there's only a plumbus here"
        )
    return item_id
```

**Python 3.8+ - non-Annotated**

```python
from fastapi import Depends, FastAPI, HTTPException

app = FastAPI()

class InternalError(Exception):
    pass

def get_username():
    try:
        yield "Rick"
    except InternalError:
        print("Oops, we didn't raise again, Britney 😱")

@app.get("/items/{item_id}")
def get_item(item_id: str, username: str = Depends(get_username)):
    if item_id == "portal-gun":
        raise InternalError(
            f"The portal gun is too dangerous to be owned by {username}"
        )
    if item_id != "plumbus":
        raise HTTPException(
            status_code=404, detail="Item not found, there's only a plumbus here"
        )
    return item_id
```

> 提示：如果可能，优先使用 `Annotated` 版本。

在这种情况下，客户端将看到 HTTP 500 内部服务器错误响应，正如它应该的那样，因为我们没有抛出 `HTTPException` 或类似的异常，但服务器将没有任何日志或任何其他错误指示。😱

### 始终在使用 `yield` 和 `except` 的依赖项中 `raise`

如果你在使用 `yield` 的依赖项中捕获异常，除非你抛出另一个 `HTTPException` 或类似的异常，否则你应该重新抛出原始异常。

你可以使用 `raise` 重新抛出相同的异常：

**Python 3.9+**

```python
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException

app = FastAPI()

class InternalError(Exception):
    pass

def get_username():
    try:
        yield "Rick"
    except InternalError:
        print("We don't swallow the internal error here, we raise again 😎")
        raise

@app.get("/items/{item_id}")
def get_item(item_id: str, username: Annotated[str, Depends(get_username)]):
    if item_id == "portal-gun":
        raise InternalError(
            f"The portal gun is too dangerous to be owned by {username}"
        )
    if item_id != "plumbus":
        raise HTTPException(
            status_code=404, detail="Item not found, there's only a plumbus here"
        )
    return item_id
```

**Python 3.8+**

```python
from fastapi import Depends, FastAPI, HTTPException
from typing_extensions import Annotated

app = FastAPI()

class InternalError(Exception):
    pass

def get_username():
    try:
        yield "Rick"
    except InternalError:
        print("We don't swallow the internal error here, we raise again 😎")
        raise

@app.get("/items/{item_id}")
def get_item(item_id: str, username: Annotated[str, Depends(get_username)]):
    if item_id == "portal-gun":
        raise InternalError(
            f"The portal gun is too dangerous to be owned by {username}"
        )
    if item_id != "plumbus":
        raise HTTPException(
            status_code=404, detail="Item not found, there's only a plumbus here"
        )
    return item_id
```

**Python 3.8+ - non-Annotated**

```python
from fastapi import Depends, FastAPI, HTTPException

app = FastAPI()

class InternalError(Exception):
    pass

def get_username():
    try:
        yield "Rick"
    except InternalError:
        print("We don't swallow the internal error here, we raise again 😎")
        raise

@app.get("/items/{item_id}")
def get_item(item_id: str, username: str = Depends(get_username)):
    if item_id == "portal-gun":
        raise InternalError(
            f"The portal gun is too dangerous to be owned by {username}"
        )
    if item_id != "plumbus":
        raise HTTPException(
            status_code=404, detail="Item not found, there's only a plumbus here"
        )
    return item_id
```

> 提示：如果可能，优先使用 `Annotated` 版本。

现在客户端将获得相同的 HTTP 500 内部服务器错误响应，但服务器将在日志中记录我们的自定义 `InternalError`。😎

## 使用 `yield` 的依赖项的执行

执行顺序或多或少就像这个图。时间从上到下流动。每一列是交互或执行代码的部分之一。

```sequenceDiagram

participant client as Client
participant handler as Exception handler
participant dep as Dep with yield
participant operation as Path Operation
participant tasks as Background tasks

    Note over client,operation: Can raise exceptions, including HTTPException
    client ->> dep: Start request
    Note over dep: Run code up to yield
    opt raise Exception
        dep -->> handler: Raise Exception
        handler -->> client: HTTP error response
    end
    dep ->> operation: Run dependency, e.g. DB session
    opt raise
        operation -->> dep: Raise Exception (e.g. HTTPException)
        opt handle
            dep -->> dep: Can catch exception, raise a new HTTPException, raise other exception
        end
        handler -->> client: HTTP error response
    end

    operation ->> client: Return response to client
    Note over client,operation: Response is already sent, can't change it anymore
    opt Tasks
        operation -->> tasks: Send background tasks
    end
    opt Raise other exception
        tasks -->> tasks: Handle exceptions in the background task code
    end
```

> 信息
>
> 只会向客户端发送一个响应。它可能是错误响应之一，或者是来自路径操作的响应。
>
> 发送其中一个响应后，不能再发送其他响应。

> 提示
>
> 这个图显示了 `HTTPException`，但你也可以抛出任何其他异常，你可以在带有 `yield` 的依赖项或自定义异常处理器中捕获。
>
> 如果你抛出任何异常，它将被传递给带有 yield 的依赖项，包括 `HTTPException`。在大多数情况下，你会想要从带有 `yield` 的依赖项重新抛出相同的异常或新的异常，以确保它被正确处理。

## 使用 `yield`、`HTTPException`、`except` 和后台任务的依赖项

> 警告
>
> 你很可能不需要这些技术细节，你可以跳过这一部分并继续下面的内容。
>
> 这些细节主要在你使用 FastAPI 0.106.0 之前的版本并在后台任务中使用带有 `yield` 的依赖项中的资源时有用。

### 使用 `yield` 和 `except` 的依赖项，技术细节

在 FastAPI 0.110.0 之前，如果你使用带有 `yield` 的依赖项，然后你在该依赖项中使用 `except` 捕获异常，并且你没有再次抛出异常，异常将自动转发到任何异常处理器或内部服务器错误处理器。

这在 0.110.0 版本中更改，以修复未处理的内存消耗从未处理程序（内部服务器错误）转发的异常，并使其与常规 Python 代码的行为一致。

### 后台任务和使用 `yield` 的依赖项，技术细节

在 FastAPI 0.106.0 之前，在 `yield` 之后抛出异常是不可能的，带有 `yield` 的依赖项中的退出代码是在发送响应之后执行的，所以异常处理器已经运行了。

这样设计主要是为了允许在后台任务中使用依赖项"yielded"的相同对象，因为退出代码会在后台任务完成后执行。

然而，因为这意味着在通过网络传输响应时不必要地保持在带有 yield 的依赖项中的资源（例如数据库连接），这在 FastAPI 0.106.0 中更改了。

> 提示
>
> 此外，后台任务通常是一个独立的逻辑集，应该单独处理，有自己的资源（例如自己的数据库连接）。
>
> 所以，这样你可能会拥有更清洁的代码。

如果你以前依赖于这种行为，现在你应该在后台任务内部创建后台任务的资源，并且只在内部使用不依赖于带有 `yield` 的依赖项的资源的数据。

例如，不是使用相同的数据库会话，你会在后台任务内部创建一个新的数据库会话，然后你会使用这个新会话从数据库中获取对象。然后，不是将数据库中的对象作为参数传递给后台任务函数，你会传递该对象的 ID，然后在后台任务函数内部再次获取该对象。

## 上下文管理器

### 什么是"上下文管理器"

"上下文管理器"是任何可以在 `with` 语句中使用的 Python 对象。

例如，你可以使用 `with` 来读取文件：

```python
with open("./somefile.txt") as f:
    contents = f.read()
    print(contents)
```

底层，`open("./somefile.txt")` 创建了一个被称为"上下文管理器"的对象。

当 `with` 块完成时，它确保关闭文件，即使有异常。

当你创建带有 `yield` 的依赖项时，FastAPI 将在内部为其创建一个上下文管理器，并将其与其他一些相关工具结合。

### 在带有 `yield` 的依赖项中使用上下文管理器

> 警告
>
> 这或多或少是一个"高级"想法。
>
> 如果你刚刚开始使用 FastAPI，你可能现在想要跳过它。

在 Python 中，你可以通过创建一个带有两个方法的类来创建上下文管理器：`__enter__()` 和 `__exit__()`。

你也可以通过在依赖项函数内部使用 `with` 或 `async with` 语句，在 FastAPI 带有 `yield` 的依赖项内部使用它们：

**Python 3.8+**

```python
class MySuperContextManager:
    def __init__(self):
        self.db = DBSession()

    def __enter__(self):
        return self.db

    def __exit__(self, exc_type, exc_value, traceback):
        self.db.close()

async def get_db():
    with MySuperContextManager() as db:
        yield db
```

> 提示
>
> 创建上下文管理器的另一种方法是使用：
>
> - `@contextlib.contextmanager` 或
> - `@contextlib.asynccontextmanager`
>
> 用它们来装饰带有单个 `yield` 的函数。

这就是 FastAPI 在内部用于带有 `yield` 的依赖项的东西。

但你不必为 FastAPI 依赖项使用装饰器（也不应该）。

FastAPI 将在内部为你做这件事。