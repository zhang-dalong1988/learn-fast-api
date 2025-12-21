# 6-元数据和文档URL

您可以在 FastAPI 应用中自定义多个元数据配置。

这些配置用于 OpenAPI 规范和自动 API 文档 UI。

## API 元数据字段

您可以设置以下字段：

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `title` | `str` | API 的标题。 |
| `summary` | `str` | API 的简短摘要。自 OpenAPI 3.1.0、FastAPI 0.99.0 起可用。 |
| `description` | `str` | API 的简短描述。可以使用 Markdown。 |
| `version` | `string` | API 的版本。这是您自己应用程序的版本，而不是 OpenAPI 的版本。例如 `2.5.0`。 |
| `terms_of_service` | `str` | API 服务条款的 URL。如果提供，必须是 URL。 |
| `contact` | `dict` | 暴露的 API 的联系信息。可以包含多个字段。 |
| `license_info` | `dict` | 暴露的 API 的许可证信息。可以包含多个字段。 |

### contact 字段

`contact` 字段包含以下参数：

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `name` | `str` | 联系人/组织的识别名称。 |
| `url` | `str` | 指向联系信息的 URL。必须是 URL 格式。 |
| `email` | `str` | 联系人/组织的电子邮件地址。必须是电子邮件地址格式。 |

### license_info 字段

`license_info` 字段包含以下参数：

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `name` | `str` | **必需**（如果设置了 `license_info`）。用于 API 的许可证名称。 |
| `identifier` | `str` | API 的 SPDX 许可证表达式。`identifier` 字段与 `url` 字段互斥。自 OpenAPI 3.1.0、FastAPI 0.99.0 起可用。 |
| `url` | `str` | 用于 API 的许可证的 URL。必须是 URL 格式。 |

## 基本元数据配置

您可以如下设置它们：

```python
from fastapi import FastAPI

description = """
ChimichangApp API 帮助您完成很棒的工作。🚀

## 项目

您可以**读取项目**。

## 用户

您将能够：

* **创建用户**（未实现）。
* **读取用户**（未实现）。
"""

app = FastAPI(
    title="ChimichangApp",
    description=description,
    summary="死侍最喜欢的应用。无需多言。",
    version="0.0.1",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "神奇的死侍",
        "url": "http://x-force.example.com/contact/",
        "email": "dp@x-force.example.com",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
)

@app.get("/items/")
async def read_items():
    return [{"name": "Katana"}]
```

> **提示**
>
> 您可以在 `description` 字段中编写 Markdown，它将在输出中呈现。

使用此配置，自动 API 文档将如下所示：

![文档界面示例](https://fastapi.tiangolo.com/img/tutorial/metadata/image01.png)

## 许可证标识符

自 OpenAPI 3.1.0 和 FastAPI 0.99.0 起，您还可以使用 `identifier` 而不是 `url` 来设置 `license_info`。

例如：

```python
from fastapi import FastAPI

description = """
ChimichangApp API 帮助您完成很棒的工作。🚀

## 项目

您可以**读取项目**。

## 用户

您将能够：

* **创建用户**（未实现）。
* **读取用户**（未实现）。
"""

app = FastAPI(
    title="ChimichangApp",
    description=description,
    summary="死侍最喜欢的应用。无需多言。",
    version="0.0.1",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "神奇的死侍",
        "url": "http://x-force.example.com/contact/",
        "email": "dp@x-force.example.com",
    },
    license_info={
        "name": "Apache 2.0",
        "identifier": "MIT",
    },
)

@app.get("/items/")
async def read_items():
    return [{"name": "Katana"}]
```

## 标签元数据

您还可以使用 `openapi_tags` 参数为用于分组路径操作的不同标签添加额外的元数据。

它接受一个包含每个标签一个字典的列表。

每个字典可以包含：

- `name`（**必需**）：与您在路径操作和 `APIRouter` 中的 `tags` 参数中使用的标签名称相同的 `str`。
- `description`：带有标签简短描述的 `str`。它可以包含 Markdown 并将在文档 UI 中显示。
- `externalDocs`：描述外部文档的 `dict`，包含：
  - `description`：外部文档的简短描述 `str`。
  - `url`（**必需**）：外部文档的 URL `str`。

### 为标签创建元数据

让我们在带有 `users` 和 `items` 标签的示例中尝试一下。

为您的标签创建元数据并将其传递给 `openapi_tags` 参数：

```python
from fastapi import FastAPI

tags_metadata = [
    {
        "name": "users",
        "description": "用户操作。**登录**逻辑也在这里。",
    },
    {
        "name": "items",
        "description": "管理项目。如此花哨以至于它们有自己的文档。",
        "externalDocs": {
            "description": "项目外部文档",
            "url": "https://fastapi.tiangolo.com/",
        },
    },
]

app = FastAPI(openapi_tags=tags_metadata)

@app.get("/users/", tags=["users"])
async def get_users():
    return [{"name": "Harry"}, {"name": "Ron"}]

@app.get("/items/", tags=["items"])
async def get_items():
    return [{"name": "wand"}, {"name": "flying broom"}]
```

请注意，您可以在描述中使用 Markdown，例如 "login" 将以粗体显示（**login**），"fancy" 将以斜体显示（_fancy_）。

> **提示**
>
> 您不必为使用的所有标签添加元数据。

### 使用您的标签

在路径操作（和 `APIRouter`）中使用 `tags` 参数将它们分配给不同的标签：

```python
from fastapi import FastAPI

tags_metadata = [
    {
        "name": "users",
        "description": "用户操作。**登录**逻辑也在这里。",
    },
    {
        "name": "items",
        "description": "管理项目。如此花哨以至于它们有自己的文档。",
        "externalDocs": {
            "description": "项目外部文档",
            "url": "https://fastapi.tiangolo.com/",
        },
    },
]

app = FastAPI(openapi_tags=tags_metadata)

@app.get("/users/", tags=["users"])
async def get_users():
    return [{"name": "Harry"}, {"name": "Ron"}]

@app.get("/items/", tags=["items"])
async def get_items():
    return [{"name": "wand"}, {"name": "flying broom"}]
```

### 检查文档

现在，如果您检查文档，它们将显示所有额外的元数据：

![带标签元数据的文档界面](https://fastapi.tiangolo.com/img/tutorial/metadata/image02.png)

### 标签的顺序

每个标签元数据字典的顺序也定义了在文档 UI 中显示的顺序。

例如，即使按字母顺序 `users` 会排在 `items` 之后，但它显示在它们之前，因为我们将它们的元数据添加为列表中的第一个字典。

## OpenAPI URL

默认情况下，OpenAPI 模式在 `/openapi.json` 提供服务。

但您可以使用参数 `openapi_url` 配置它。

例如，要将其设置为在 `/api/v1/openapi.json` 提供服务：

```python
from fastapi import FastAPI

app = FastAPI(openapi_url="/api/v1/openapi.json")

@app.get("/items/")
async def read_items():
    return [{"name": "Foo"}]
```

如果您想完全禁用 OpenAPI 模式，可以设置 `openapi_url=None`，这也将禁用使用它的文档用户界面。

## 文档 URL

您可以配置包含的两个文档用户界面：

- **Swagger UI**：在 `/docs` 提供服务。
  - 您可以使用参数 `docs_url` 设置其 URL。
  - 您可以通过设置 `docs_url=None` 禁用它。
- **ReDoc**：在 `/redoc` 提供服务。
  - 您可以使用参数 `redoc_url` 设置其 URL。
  - 您可以通过设置 `redoc_url=None` 禁用它。

例如，要将 Swagger UI 设置为在 `/documentation` 提供服务并禁用 ReDoc：

```python
from fastapi import FastAPI

app = FastAPI(docs_url="/documentation", redoc_url=None)

@app.get("/items/")
async def read_items():
    return [{"name": "Foo"}]
```

## 总结

通过配置元数据和文档 URL，您可以：

1. **自定义 API 信息**：设置标题、描述、版本等基本信息
2. **提供联系信息**：让用户知道如何联系 API 维护者
3. **指定许可证**：明确 API 的使用条款
4. **组织标签**：使用标签对 API 端点进行分组，并提供额外信息
5. **自定义文档路径**：更改默认的文档 URL 以满足项目需求
6. **控制文档可见性**：根据需要禁用某些或所有文档界面

这些配置使您的 API 文档更加专业和信息丰富。