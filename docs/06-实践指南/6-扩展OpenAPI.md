# 扩展 OpenAPI¶

在某些情况下，您可能需要修改生成的 OpenAPI 模式。

在本节中，您将看到如何做到这一点。

## 正常流程¶

正常（默认）流程如下。

一个 `FastAPI` 应用程序（实例）有一个 `.openapi()` 方法，该方法期望返回 OpenAPI 模式。

作为应用程序对象创建的一部分，为 `/openapi.json`（或您设置的任何 `openapi_url`）注册了一个路径操作。

它只返回一个 JSON 响应，其中包含应用程序的 `.openapi()` 方法的结果。

默认情况下，`.openapi()` 方法的作用是检查属性 `.openapi_schema` 以查看其是否有内容并返回它们。

如果没有，它使用 `fastapi.openapi.utils.get_openapi` 中的实用函数生成它们。

而函数 `get_openapi()` 接收以下参数：

- `title`：OpenAPI 标题，在文档中显示。
- `version`：您的 API 版本，例如 `2.5.0`。
- `openapi_version`：使用的 OpenAPI 规范版本。默认为最新版本：`3.1.0`。
- `summary`：API 的简短摘要。
- `description`：您的 API 描述，可以包含 markdown 并将在文档中显示。
- `routes`：路由列表，这些是每个已注册的路径操作。它们从 `app.routes` 获取。

信息

参数 `summary` 在 OpenAPI 3.1.0 及以上版本中可用，FastAPI 0.99.0 及以上版本支持。

## 覆盖默认值¶

使用上述信息，您可以使用相同的实用函数生成 OpenAPI 模式并覆盖您需要的每个部分。

例如，让我们添加 ReDoc 的 OpenAPI 扩展以包含自定义徽标。

### 普通的 FastAPI¶

首先，像往常一样编写您的 FastAPI 应用程序：

Python 3.8+

```python
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

app = FastAPI()

@app.get("/items/")
async def read_items():
    return [{"name": "Foo"}]

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Custom title",
        version="2.5.0",
        summary="This is a very custom OpenAPI schema",
        description="Here's a longer description of the custom **OpenAPI** schema",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
```

### 生成 OpenAPI 模式¶

然后，使用相同的实用函数在 `custom_openapi()` 函数内部生成 OpenAPI 模式：

Python 3.8+

```python
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

app = FastAPI()

@app.get("/items/")
async def read_items():
    return [{"name": "Foo"}]

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Custom title",
        version="2.5.0",
        summary="This is a very custom OpenAPI schema",
        description="Here's a longer description of the custom **OpenAPI** schema",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
```

### 修改 OpenAPI 模式¶

现在您可以通过将自定义的 `x-logo` 添加到 OpenAPI 模式中的 `info` "对象"来添加 ReDoc 扩展：

Python 3.8+

```python
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

app = FastAPI()

@app.get("/items/")
async def read_items():
    return [{"name": "Foo"}]

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Custom title",
        version="2.5.0",
        summary="This is a very custom OpenAPI schema",
        description="Here's a longer description of the custom **OpenAPI** schema",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
```

### 缓存 OpenAPI 模式¶

您可以使用属性 `.openapi_schema` 作为"缓存"来存储生成的模式。

这样，您的应用程序不必在每次用户打开 API 文档时都生成模式。

它只会生成一次，然后相同的缓存模式将用于下一个请求。

Python 3.8+

```python
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

app = FastAPI()

@app.get("/items/")
async def read_items():
    return [{"name": "Foo"}]

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Custom title",
        version="2.5.0",
        summary="This is a very custom OpenAPI schema",
        description="Here's a longer description of the custom **OpenAPI** schema",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
```

### 覆盖方法¶

现在您可以用新函数替换 `.openapi()` 方法。

Python 3.8+

```python
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

app = FastAPI()

@app.get("/items/")
async def read_items():
    return [{"name": "Foo"}]

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Custom title",
        version="2.5.0",
        summary="This is a very custom OpenAPI schema",
        description="Here's a longer description of the custom **OpenAPI** schema",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
```

### 检查结果¶

一旦您访问 http://127.0.0.1:8000/redoc，您将看到您正在使用自定义徽标（在本例中是 FastAPI 的徽标）：

![在此处插入图片]

## 更多扩展方式¶

除了添加徽标，您还可以：

### 添加自定义标签¶

```python
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="My Super API",
        version="2.5.0",
        description="This is a very custom OpenAPI schema",
        routes=app.routes,
    )
    openapi_schema["tags"] = [
        {
            "name": "users",
            "description": "Operations with users. The **login** logic is also here.",
        },
        {
            "name": "items",
            "description": "Manage items. So _fancy_ they have their own docs.",
        }
    ]
    app.openapi_schema = openapi_schema
    return app.openapi_schema
```

### 添加服务器信息¶

```python
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="My API",
        version="1.0.0",
        description="API description",
        routes=app.routes,
    )
    openapi_schema["servers"] = [
        {"url": "https://api.example.com/v1", "description": "Production server"},
        {"url": "https://staging-api.example.com", "description": "Staging server"},
    ]
    app.openapi_schema = openapi_schema
    return app.openapi_schema
```

### 添加外部文档¶

```python
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="My API",
        version="1.0.0",
        description="API description",
        routes=app.routes,
    )
    openapi_schema["externalDocs"] = {
        "description": "Find more info here",
        "url": "https://example.com/docs"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema
```

## 总结

通过自定义 OpenAPI 模式，您可以：

1. 修改 API 的标题、版本和描述
2. 添加自定义扩展（如 ReDoc 的 x-logo）
3. 定义自定义标签
4. 指定服务器 URL
5. 添加外部文档链接
6. 完全控制生成的 OpenAPI 规范

这些技术让您可以根据需要完全定制 API 文档的外观和内容。