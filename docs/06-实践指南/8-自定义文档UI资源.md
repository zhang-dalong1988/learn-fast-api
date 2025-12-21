# 自定义文档 UI 静态资源（自托管）¶

API 文档使用 **Swagger UI** 和 **ReDoc**，每个都需要一些 JavaScript 和 CSS 文件。

默认情况下，这些文件从 CDN 提供服务。

但是可以自定义它，您可以设置特定的 CDN，或者自己托管文件。

## 自定义 JavaScript 和 CSS 的 CDN¶

假设您想使用不同的 CDN，例如您想使用 `https://unpkg.com/`。

如果您生活在一个限制某些 URL 的国家，这可能很有用。

### 禁用自动文档¶

第一步是禁用自动文档，因为默认情况下，它们使用默认的 CDN。

要禁用它们，在创建 `FastAPI` 应用时将其 URL 设置为 `None`：

Python 3.8+

```python
from fastapi import FastAPI
from fastapi.openapi.docs import (
    get_redoc_html,
    get_swagger_ui_html,
    get_swagger_ui_oauth2_redirect_html,
)

app = FastAPI(docs_url=None, redoc_url=None)

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css",
    )

@app.get(app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_js_url="https://unpkg.com/redoc@2/bundles/redoc.standalone.js",
    )

@app.get("/users/{username}")
async def read_user(username: str):
    return {"message": f"Hello {username}"}
```

### 包含自定义文档¶

现在您可以创建自定义文档的路径操作。

您可以重用 FastAPI 的内部函数来创建文档的 HTML 页面，并传递所需的参数：

- `openapi_url`：文档的 HTML 页面可以获取您的 API 的 OpenAPI 模式的 URL。您可以在这里使用属性 `app.openapi_url`。
- `title`：您的 API 的标题。
- `oauth2_redirect_url`：您可以在这里使用 `app.swagger_ui_oauth2_redirect_url` 来使用默认值。
- `swagger_js_url`：您的 Swagger UI 文档的 HTML 可以获取 **JavaScript** 文件的 URL。这是自定义的 CDN URL。
- `swagger_css_url`：您的 Swagger UI 文档的 HTML 可以获取 **CSS** 文件的 URL。这是自定义的 CDN URL。

对于 ReDoc 也是类似的...

Python 3.8+

```python
from fastapi import FastAPI
from fastapi.openapi.docs import (
    get_redoc_html,
    get_swagger_ui_html,
    get_swagger_ui_oauth2_redirect_html,
)

app = FastAPI(docs_url=None, redoc_url=None)

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css",
    )

@app.get(app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_js_url="https://unpkg.com/redoc@2/bundles/redoc.standalone.js",
    )

@app.get("/users/{username}")
async def read_user(username: str):
    return {"message": f"Hello {username}"}
```

提示

`swagger_ui_redirect` 的路径操作是使用 OAuth2 时的助手。

如果将您的 API 与 OAuth2 提供程序集成，您将能够使用获取的凭据进行身份验证并返回 API 文档。并使用真实的 OAuth2 身份验证与之交互。

Swagger UI 将在幕后为您处理它，但它需要这个"重定向"助手。

### 创建路径操作来测试它¶

现在，为了能够测试一切正常，创建一个路径操作：

Python 3.8+

```python
from fastapi import FastAPI
from fastapi.openapi.docs import (
    get_redoc_html,
    get_swagger_ui_html,
    get_swagger_ui_oauth2_redirect_html,
)

app = FastAPI(docs_url=None, redoc_url=None)

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css",
    )

@app.get(app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_js_url="https://unpkg.com/redoc@2/bundles/redoc.standalone.js",
    )

@app.get("/users/{username}")
async def read_user(username: str):
    return {"message": f"Hello {username}"}
```

### 测试它¶

现在，您应该能够访问 http://127.0.0.1:8000/docs 的文档，并重新加载页面，它将从新的 CDN 加载这些资源。

## 自托管文档的 JavaScript 和 CSS¶

如果您需要您的应用程序在没有开放互联网访问或本地网络的情况下也能保持工作，那么自托管 JavaScript 和 CSS 可能很有用。

在这里您将看到如何在同一个 FastAPI 应用程序中提供这些文件，并配置文档以使用它们。

### 项目文件结构¶

假设您的项目文件结构如下所示：

```
.
├── app
│   ├── __init__.py
│   ├── main.py
```

现在创建一个目录来存储那些静态文件。

您的新文件结构可能如下所示：

```
.
├── app
│   ├── __init__.py
│   ├── main.py
└── static/
```

### 下载文件¶

下载文档所需的静态文件并将它们放在 `static/` 目录中。

您可能右键单击每个链接并选择类似于"另存为链接..."的选项。

**Swagger UI** 使用文件：

- `swagger-ui-bundle.js`
- `swagger-ui.css`

而 **ReDoc** 使用文件：

- `redoc.standalone.js`

之后，您的文件结构可能如下所示：

```
.
├── app
│   ├── __init__.py
│   ├── main.py
└── static
    ├── redoc.standalone.js
    ├── swagger-ui-bundle.js
    └── swagger-ui.css
```

### 提供静态文件¶

- 导入 `StaticFiles`。
- 在特定路径中"挂载"一个 `StaticFiles()` 实例。

Python 3.8+

```python
from fastapi import FastAPI
from fastapi.openapi.docs import (
    get_redoc_html,
    get_swagger_ui_html,
    get_swagger_ui_oauth2_redirect_html,
)
from fastapi.staticfiles import StaticFiles

app = FastAPI(docs_url=None, redoc_url=None)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )

@app.get(app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_js_url="/static/redoc.standalone.js",
    )

@app.get("/users/{username}")
async def read_user(username: str):
    return {"message": f"Hello {username}"}
```

### 测试静态文件¶

启动您的应用程序并访问 http://127.0.0.1:8000/static/redoc.standalone.js。

您应该看到一个很长的 **ReDoc** JavaScript 文件。

它可能以类似以下内容开头：

```
/*! For license information please see redoc.standalone.js.LICENSE.txt */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("null")):
...
```

这确认了您能够从应用程序提供静态文件，并且您将文档的静态文件放在了正确的位置。

现在我们可以配置应用程序以将这些静态文件用于文档。

### 禁用静态文件的自动文档¶

与使用自定义 CDN 时相同，第一步是禁用自动文档，因为默认情况下那些使用 CDN。

要禁用它们，在创建 `FastAPI` 应用时将其 URL 设置为 `None`：

Python 3.8+

```python
from fastapi import FastAPI
from fastapi.openapi.docs import (
    get_redoc_html,
    get_swagger_ui_html,
    get_swagger_ui_oauth2_redirect_html,
)
from fastapi.staticfiles import StaticFiles

app = FastAPI(docs_url=None, redoc_url=None)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )

@app.get(app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_js_url="/static/redoc.standalone.js",
    )

@app.get("/users/{username}")
async def read_user(username: str):
    return {"message": f"Hello {username}"}
```

### 包含静态文件的自定义文档¶

与使用自定义 CDN 的方式相同，现在您可以创建自定义文档的路径操作。

同样，您可以重用 FastAPI 的内部函数来创建文档的 HTML 页面，并传递所需的参数：

- `openapi_url`：文档的 HTML 页面可以获取您的 API 的 OpenAPI 模式的 URL。您可以在这里使用属性 `app.openapi_url`。
- `title`：您的 API 的标题。
- `oauth2_redirect_url`：您可以在这里使用 `app.swagger_ui_oauth2_redirect_url` 来使用默认值。
- `swagger_js_url`：您的 Swagger UI 文档的 HTML 可以获取 **JavaScript** 文件的 URL。**这是现在由您自己的应用程序提供的那个**。
- `swagger_css_url`：您的 Swagger UI 文档的 HTML 可以获取 **CSS** 文件的 URL。**这是现在由您自己的应用程序提供的那个**。

对于 ReDoc 也是类似的...

Python 3.8+

```python
from fastapi import FastAPI
from fastapi.openapi.docs import (
    get_redoc_html,
    get_swagger_ui_html,
    get_swagger_ui_oauth2_redirect_html,
)
from fastapi.staticfiles import StaticFiles

app = FastAPI(docs_url=None, redoc_url=None)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )

@app.get(app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_js_url="/static/redoc.standalone.js",
    )

@app.get("/users/{username}")
async def read_user(username: str):
    return {"message": f"Hello {username}"}
```

提示

`swagger_ui_redirect` 的路径操作是使用 OAuth2 时的助手。

如果将您的 API 与 OAuth2 提供程序集成，您将能够使用获取的凭据进行身份验证并返回 API 文档。并使用真实的 OAuth2 身份验证与之交互。

Swagger UI 将在幕后为您处理它，但它需要这个"重定向"助手。

### 创建路径操作来测试静态文件¶

现在，为了能够测试一切正常，创建一个路径操作：

Python 3.8+

```python
from fastapi import FastAPI
from fastapi.openapi.docs import (
    get_redoc_html,
    get_swagger_ui_html,
    get_swagger_ui_oauth2_redirect_html,
)
from fastapi.staticfiles import StaticFiles

app = FastAPI(docs_url=None, redoc_url=None)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )

@app.get(app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_js_url="/static/redoc.standalone.js",
    )

@app.get("/users/{username}")
async def read_user(username: str):
    return {"message": f"Hello {username}"}
```

### 测试静态文件 UI¶

现在，您应该能够断开 WiFi，访问 http://127.0.0.1:8000/docs 的文档，并重新加载页面。

即使没有互联网，您也能够看到 API 的文档并与之交互。