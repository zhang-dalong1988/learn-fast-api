# Cookie 参数

你可以定义 Cookie 参数，就像你定义 `Query` 和 `Path` 参数一样。

## 导入 `Cookie`

首先，从 `fastapi` 导入 `Cookie`：

```python
from typing import Annotated

from fastapi import Cookie, FastAPI

app = FastAPI()

@app.get("/items/")
async def read_items(ads_id: Annotated[str, Cookie()]):
    return {"ads_id": ads_id}
```

## 声明 Cookie 参数

然后，使用与 `Path` 和 `Query` 相同的方式声明 Cookie 参数。

第一个值是默认值，你可以传递所有额外的验证或注释参数：

```python
from typing import Annotated

from fastapi import Cookie, FastAPI

app = FastAPI()

@app.get("/items/")
async def read_items(ads_id: Annotated[str, Cookie()]):
    return {"ads_id": ads_id}
```

### 技术细节

`Cookie`、`Path`、`Query` 是 sibling 类，它们共享相同的 `Param` 类。

但是要记住，当你从 `fastapi` 导入 `Query`、`Path`、`Cookie` 时，这些实际上是返回特殊类的函数。

### 警告

Cookie 是 Cookie Headers 中的键，它们只能是字符串。

## Python 3.8+ non-Annotated

如果你不使用 `Annotated`，可以传递 `Cookie` 作为默认值：

```python
from fastapi import Cookie, FastAPI

app = FastAPI()

@app.get("/items/")
async def read_items(ads_id: str = Cookie()):
    return {"ads_id": ads_id}
```

## 测试 Cookie

为了测试 cookie，你可以使用浏览器开发者工具或像 `httpie` 这样的工具：

```bash
http GET http://127.0.0.1:8000/items/ Cookie:ads_id=12345
```

或者使用 curl：

```bash
curl http://127.0.0.1:8000/items/ -H "Cookie: ads_id=12345"
```

## 总结

你可以使用 `Cookie` 来声明 cookie 参数，就像 `Query` 和 `Path` 一样。
