# 配置 Swagger UI¶

您可以配置一些额外的 Swagger UI 参数。

要配置它们，在创建 `FastAPI()` 应用对象时或将 `swagger_ui_parameters` 参数传递给 `get_swagger_ui_html()` 函数。

`swagger_ui_parameters` 接收一个包含直接传递给 Swagger UI 的配置的字典。

FastAPI 将配置转换为 __JSON__ 以使其与 JavaScript 兼容，因为这是 Swagger UI 所需要的。

## 禁用语法高亮¶

例如，您可以禁用 Swagger UI 中的语法高亮。

在不更改设置的情况下，默认情况下启用语法高亮：

![在此处插入图片]

但是您可以通过将 `syntaxHighlight` 设置为 `False` 来禁用它：

Python 3.8+

```python
from fastapi import FastAPI

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": False})

@app.get("/users/{username}")
async def read_user(username: str):
    return {"message": f"Hello {username}"}
```

...然后 Swagger UI 将不再显示语法高亮：

![在此处插入图片]

## 更改主题¶

同样，您可以使用键 `"syntaxHighlight.theme"`（请注意它中间有一个点）来设置语法高亮主题：

Python 3.8+

```python
from fastapi import FastAPI

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": {"theme": "obsidian"}})

@app.get("/users/{username}")
async def read_user(username: str):
    return {"message": f"Hello {username}"}
```

该配置将更改语法高亮颜色主题：

![在此处插入图片]

## 更改默认 Swagger UI 参数¶

FastAPI 包含一些适用于大多数用例的默认配置参数。

它包括这些默认配置：

Python 3.8+

```python
# 上面的代码省略 👆

swagger_ui_default_parameters: Annotated[
    Dict[str, Any],
    Doc(
        """
        Swagger UI 的默认配置。

        您可以使用它作为模板来添加所需的任何其他配置。
        """
    ),
] = {
    "dom_id": "#swagger-ui",
    "layout": "BaseLayout",
    "deepLinking": True,
    "showExtensions": True,
    "showCommonExtensions": True,
}

# 下面的代码省略 👇
```

👀 完整文件预览

Python 3.8+

```python
import json
from typing import Any, Dict, Optional

from fastapi.encoders import jsonable_encoder
from starlette.responses import HTMLResponse
from typing_extensions import Annotated, Doc

swagger_ui_default_parameters: Annotated[
    Dict[str, Any],
    Doc(
        """
        Swagger UI 的默认配置。

        您可以使用它作为模板来添加所需的任何其他配置。
        """
    ),
] = {
    "dom_id": "#swagger-ui",
    "layout": "BaseLayout",
    "deepLinking": True,
    "showExtensions": True,
    "showCommonExtensions": True,
}

def get_swagger_ui_html(
    *,
    openapi_url: Annotated[
        str,
        Doc(
            """
            Swagger UI 应加载和使用的 OpenAPI URL。

            这通常由 FastAPI 自动使用默认 URL `/openapi.json` 完成。
            """
        ),
    ],
    title: Annotated[
        str,
        Doc(
            """
            HTML `<title>` 内容，通常显示在浏览器选项卡中。
            """
        ),
    ],
    swagger_js_url: Annotated[
        str,
        Doc(
            """
            用于加载 Swagger UI JavaScript 的 URL。

            它通常设置为 CDN URL。
            """
        ),
    ] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
    swagger_css_url: Annotated[
        str,
        Doc(
            """
            用于加载 Swagger UI CSS 的 URL。

            它通常设置为 CDN URL。
            """
        ),
    ] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
    swagger_favicon_url: Annotated[
        str,
        Doc(
            """
            要使用的网站图标的 URL。它通常显示在浏览器选项卡中。
            """
        ),
    ] = "https://fastapi.tiangolo.com/img/favicon.png",
    oauth2_redirect_url: Annotated[
        Optional[str],
        Doc(
            """
            OAuth2 重定向 URL，它通常由 FastAPI 自动处理。
            """
        ),
    ] = None,
    init_oauth: Annotated[
        Optional[Dict[str, Any]],
        Doc(
            """
            包含 Swagger UI OAuth2 初始化配置的字典。
            """
        ),
    ] = None,
    swagger_ui_parameters: Annotated[
        Optional[Dict[str, Any]],
        Doc(
            """
            Swagger UI 的配置参数。

            它默认为 [swagger_ui_default_parameters][fastapi.openapi.docs.swagger_ui_default_parameters]。
            """
        ),
    ] = None,
) -> HTMLResponse:
    """
    生成并返回加载 Swagger UI 的 HTML 响应，用于交互式
    API 文档（通常在 `/docs` 提供服务）。

    仅当您需要覆盖某些部分时，您才会自己调用此函数，
    例如用于加载 Swagger UI 的 JavaScript 和 CSS 的 URL。

    在配置 Swagger UI 的 FastAPI 文档
    和自定义文档 UI 静态资源（自托管）的 FastAPI 文档中了解更多信息。
    """
    current_swagger_ui_parameters = swagger_ui_default_parameters.copy()
    if swagger_ui_parameters:
        current_swagger_ui_parameters.update(swagger_ui_parameters)

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
    <link type="text/css" rel="stylesheet" href="{swagger_css_url}">
    <link rel="shortcut icon" href="{swagger_favicon_url}">
    <title>{title}</title>
    </head>
    <body>
    <div id="swagger-ui">
    </div>
    <script src="{swagger_js_url}"></script>
    <!-- `SwaggerUIBundle` 现在在页面上可用 -->
    <script>
    const ui = SwaggerUIBundle({{
        url: '{openapi_url}',
    """

    for key, value in current_swagger_ui_parameters.items():
        html += f"{json.dumps(key)}: {json.dumps(jsonable_encoder(value))},\n"

    if oauth2_redirect_url:
        html += f"oauth2RedirectUrl: window.location.origin + '{oauth2_redirect_url}',"

    html += """
    presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
    })"""

    if init_oauth:
        html += f"""
        ui.initOAuth({json.dumps(jsonable_encoder(init_oauth))})
        """

    html += """
    </script>
    </body>
    </html>
    """
    return HTMLResponse(html)
```

您可以通过在参数 `swagger_ui_parameters` 中设置不同的值来覆盖其中任何一个。

例如，要禁用 `deepLinking`，您可以将这些设置传递给 `swagger_ui_parameters`：

Python 3.8+

```python
from fastapi import FastAPI

app = FastAPI(swagger_ui_parameters={"deepLinking": False})

@app.get("/users/{username}")
async def read_user(username: str):
    return {"message": f"Hello {username}"}
```

## 其他 Swagger UI 参数¶

要查看您可以使用的所有其他可能配置，请阅读 Swagger UI 参数的官方文档。

## 仅限 JavaScript 的设置¶

Swagger UI 还允许其他配置是**仅限 JavaScript**的对象（例如，JavaScript 函数）。

FastAPI 还包含这些仅限 JavaScript 的 `presets` 设置：

```python
presets: [
    SwaggerUIBundle.presets.apis,
    SwaggerUIBundle.SwaggerUIStandalonePreset
]
```

这些是 **JavaScript** 对象，不是字符串，所以您不能直接从 Python 代码传递它们。

如果您需要使用像这些仅限 JavaScript 的配置，您可以使用上述方法之一。覆盖所有 Swagger UI 路径操作并手动编写您需要的任何 JavaScript。