# 元数据和文档 URL

你可以在你的 __FastAPI__ 应用程序中自定义多个元数据配置。

你可以设置以下用于 OpenAPI 规范和自动 API 文档 UI 的字段:

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `title` | `str` | API 的标题。 |
| `summary` | `str` | API 的简短摘要。自 OpenAPI 3.1.0、FastAPI 0.99.0 起可用。 |
| `description` | `str` | API 的简短描述。可以使用 Markdown。 |
| `version` | `string` | API 的版本。这是你自己的应用程序的版本, 不是 OpenAPI 的版本。例如 `2.5.0`。 |
| `terms_of_service` | `str` | API 服务条款的 URL。如果提供, 必须是 URL。 |
| `contact` | `dict` | 公开的 API 的联系信息。它可以包含多个字段。<br>**contact 字段**<br>| 参数 | 类型 | 描述 |<br>| --- | --- | --- |<br>| `name` | `str` | 联系人/组织的识别名称。 |<br>| `url` | `str` | 指向联系信息的 URL。必须是 URL 格式。 |<br>| `email` | `str` | 联系人/组织的电子邮件地址。必须是电子邮件地址格式。 | |
| `license_info` | `dict` | 公开的 API 的许可信息。它可以包含多个字段。<br>**license_info 字段**<br>| 参数 | 类型 | 描述 |<br>| --- | --- | --- |<br>| `name` | `str` | __必需__（如果设置了 `license_info`）。用于 API 的许可证名称。 |<br>| `identifier` | `str` | API 的 SPDX 许可证表达式。`identifier` 字段与 `url` 字段互斥。自 OpenAPI 3.1.0、FastAPI 0.99.0 起可用。 |<br>| `url` | `str` | 用于 API 的许可证的 URL。必须是 URL 格式。 | |

你可以按如下方式设置它们:

**Python 3.8+**

```python
# 从 fastapi 导入 FastAPI
from fastapi import FastAPI

# 定义 API 描述信息
# 使用 Markdown 格式, 可以在文档 UI 中渲染
description = """
ChimichangApp API 帮助你做很棒的事情。🚀

## Items（物品）

你可以 **读取物品**。

## Users（用户）

你将能够:

* **创建用户** (_未实现_)。
* **读取用户** (_未实现_)。

"""

# 创建 FastAPI 应用实例, 并配置元数据
app = FastAPI(
    title="ChimichangApp",  # API 标题
    description=description,  # API 描述（支持 Markdown）
    summary="死侍最喜欢的应用。就这么简单。",  # API 简短摘要
    version="0.0.1",  # API 版本（你自己的应用版本）
    terms_of_service="http://example.com/terms/",  # 服务条款 URL
    contact={  # 联系信息
        "name": "神奇死侍",
        "url": "http://x-force.example.com/contact/",
        "email": "dp@x-force.example.com",
    },
    license_info={  # 许可证信息
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
)

# 定义一个简单的 GET 路径操作
@app.get("/items/")
async def read_items():
    return [{"name": "Katana"}]
```

### 提示

你可以在 `description` 字段中编写 Markdown, 它会在输出中渲染。

使用此配置, 自动 API 文档将看起来像:

![Image 1](https://fastapi.tiangolo.com/img/tutorial/metadata/image01.png)

## 1. 许可证标识符

自 OpenAPI 3.1.0 和 FastAPI 0.99.0 起, 你还可以使用 `identifier` 而不是 `url` 来设置 `license_info`。

例如:

**Python 3.8+**

```python
from fastapi import FastAPI

description = """
ChimichangApp API 帮助你做很棒的事情。🚀

## Items

你可以 **读取物品**。

## Users

你将能够:

* **创建用户** (_未实现_)。
* **读取用户** (_未实现_)。

"""

app = FastAPI(
    title="ChimichangApp",
    description=description,
    summary="死侍最喜欢的应用。就这么简单。",
    version="0.0.1",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "神奇死侍",
        "url": "http://x-force.example.com/contact/",
        "email": "dp@x-force.example.com",
    },
    license_info={
        "name": "Apache 2.0",
        # 使用 SPDX 许可证标识符代替 URL
        # identifier 和 url 字段互斥, 只能设置其中一个
        "identifier": "MIT",
    },
)

@app.get("/items/")
async def read_items():
    return [{"name": "Katana"}]
```

## 2. 标签元数据

你还可以使用 `openapi_tags` 参数为用于分组路径操作的不同标签添加额外的元数据。

它接受一个列表, 其中包含每个标签的一个字典。

每个字典可以包含:

- `name`（__必需__）: 一个 `str`, 与你在路径操作和 `APIRouter` 的 `tags` 参数中使用的相同标签名称。
- `description`: 一个 `str`, 包含标签的简短描述。它可以有 Markdown, 将在文档 UI 中显示。
- `externalDocs`: 一个 `dict`, 描述外部文档, 包含:
  - `description`: 一个 `str`, 包含外部文档的简短描述。
  - `url`（__必需__）: 一个 `str`, 包含外部文档的 URL。

### 2.1 创建标签元数据

让我们在一个示例中尝试使用 `users` 和 `items` 的标签。

为你的标签创建元数据并将其传递给 `openapi_tags` 参数:

**Python 3.8+**

```python
# 从 fastapi 导入 FastAPI
from fastapi import FastAPI

# 定义标签元数据列表
# 每个字典代表一个标签的元数据
tags_metadata = [
    {
        "name": "users",  # 标签名称（必需）
        # 标签描述, 支持 Markdown
        # **login** 会显示为粗体
        "description": "用户相关操作。**登录** 逻辑也在这里。",
    },
    {
        "name": "items",  # 标签名称
        # 标签描述, 支持 Markdown
        # _fancy_ 会显示为斜体
        "description": "管理物品。太 _高级_ 了, 它们有自己的文档。",
        # 外部文档配置
        "externalDocs": {
            "description": "物品外部文档",
            "url": "https://fastapi.tiangolo.com/",
        },
    },
]

# 创建 FastAPI 应用, 传入标签元数据
app = FastAPI(openapi_tags=tags_metadata)

# 定义路径操作, 使用 tags 参数分配标签
@app.get("/users/", tags=["users"])
async def get_users():
    return [{"name": "Harry"}, {"name": "Ron"}]

@app.get("/items/", tags=["items"])
async def get_items():
    return [{"name": "wand"}, {"name": "flying broom"}]
```

请注意, 你可以在描述中使用 Markdown, 例如 "login" 将以粗体显示（**login**）, "fancy" 将以斜体显示（_fancy_）。

### 提示

你不必为你使用的所有标签都添加元数据。

### 2.2 使用你的标签

在你的路径操作（和 `APIRouter`）中使用 `tags` 参数将它们分配给不同的标签:

**Python 3.8+**

```python
from fastapi import FastAPI

tags_metadata = [
    {
        "name": "users",
        "description": "用户相关操作。**登录** 逻辑也在这里。",
    },
    {
        "name": "items",
        "description": "管理物品。太 _高级_ 了, 它们有自己的文档。",
        "externalDocs": {
            "description": "物品外部文档",
            "url": "https://fastapi.tiangolo.com/",
        },
    },
]

app = FastAPI(openapi_tags=tags_metadata)

# tags 参数将此路径操作分配到 "users" 标签
@app.get("/users/", tags=["users"])
async def get_users():
    return [{"name": "Harry"}, {"name": "Ron"}]

# tags 参数将此路径操作分配到 "items" 标签
@app.get("/items/", tags=["items"])
async def get_items():
    return [{"name": "wand"}, {"name": "flying broom"}]
```

### 2.3 检查文档

现在, 如果你检查文档, 它们将显示所有额外的元数据:

![Image 2](https://fastapi.tiangolo.com/img/tutorial/metadata/image02.png)

### 2.4 标签顺序

每个标签元数据字典的顺序也定义了在文档 UI 中显示的顺序。

例如, 即使 `users` 按字母顺序会在 `items` 之后, 它也会显示在它们之前, 因为我们将它们的元数据添加为列表中的第一个字典。

## 3. OpenAPI URL

默认情况下, OpenAPI 模式在 `/openapi.json` 提供。

但你可以使用 `openapi_url` 参数配置它。

例如, 将其设置为在 `/api/v1/openapi.json` 提供:

**Python 3.8+**

```python
from fastapi import FastAPI

# 自定义 OpenAPI schema 的 URL
# 默认是 /openapi.json
app = FastAPI(openapi_url="/api/v1/openapi.json")

@app.get("/items/")
async def read_items():
    return [{"name": "Foo"}]
```

如果你想完全禁用 OpenAPI 模式, 你可以设置 `openapi_url=None`, 这也将禁用使用它的文档用户界面。

## 4. 文档 URL

你可以配置包含的两个文档用户界面:

- __Swagger UI__: 在 `/docs` 提供。
  - 你可以使用 `docs_url` 参数设置其 URL。
  - 你可以通过设置 `docs_url=None` 禁用它。
- __ReDoc__: 在 `/redoc` 提供。
  - 你可以使用 `redoc_url` 参数设置其 URL。
  - 你可以通过设置 `redoc_url=None` 禁用它。

例如, 将 Swagger UI 设置为在 `/documentation` 提供并禁用 ReDoc:

**Python 3.8+**

```python
from fastapi import FastAPI

# 自定义文档 URL
# docs_url: Swagger UI 的 URL（默认是 /docs）
# redoc_url: ReDoc 的 URL（设置为 None 禁用）
app = FastAPI(docs_url="/documentation", redoc_url=None)

@app.get("/items/")
async def read_items():
    return [{"name": "Foo"}]
```
