# 生成 SDK - FastAPI

FastAPI 可以基于您的 OpenAPI 规范自动生成客户端 SDK（软件开发工具包），这使其他开发者可以更容易地在不同编程语言中与您的 API 交互。

## 什么是 SDK

SDK（Software Development Kit，软件开发工具包）是一组工具和库的集合，使开发者能够更容易地使用特定的平台或 API。对于 FastAPI，SDK 通常包括：
- 类型化的客户端类
- 自动认证处理
- 错误处理
- 数据模型
- 请求/响应序列化

## 使用 OpenAPI Generator

OpenAPI Generator 是一个流行的工具，可以从 OpenAPI 规范生成各种语言的客户端 SDK。

### 安装 OpenAPI Generator

```bash
# 使用 npm 安装
npm install @openapitools/openapi-generator-cli -g

# 或者使用 Docker
docker pull openapitools/openapi-generator-cli
```

### 生成客户端 SDK

```bash
# 获取 OpenAPI 规范
curl http://localhost:8000/openapi.json -o openapi.json

# 生成 Python 客户端
openapi-generator-cli generate \
    -i openapi.json \
    -g python \
    -o ./client-python \
    --additional-properties=packageName=fastapi_client

# 生成 JavaScript 客户端
openapi-generator-cli generate \
    -i openapi.json \
    -g javascript \
    -o ./client-javascript \
    --additional-properties=projectName=fastapiClient

# 生成 TypeScript 客户端
openapi-generator-cli generate \
    -i openapi.json \
    -g typescript-axios \
    -o ./client-typescript \
    --additional-properties=withSeparateModelsAndApi=true
```

## FastAPI 配置以优化 SDK 生成

### 基本示例应用

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional

app = FastAPI(
    title="Book Store API",
    description="一个简单的图书商店 API",
    version="1.0.0",
    contact={
        "name": "API Support",
        "email": "support@bookstore.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
    servers=[
        {
            "url": "https://api.bookstore.com/v1",
            "description": "生产环境",
        },
        {
            "url": "https://staging-api.bookstore.com/v1",
            "description": "预发布环境",
        },
    ],
)


class BookBase(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    price: float
    isbn: str


class Book(BookBase):
    id: int
    is_available: bool = True

    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "title": "Python 编程：从入门到实践",
                "author": "Eric Matthes",
                "description": "一本优秀的 Python 入门书",
                "price": 89.00,
                "isbn": "978-7-115-54608-8",
                "is_available": True,
            }
        }


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    is_available: Optional[bool] = None


# 模拟数据库
books_db = {
    1: Book(id=1, title="Python 编程", author="Eric Matthes", price=89.00, isbn="978-7-115-54608-8"),
    2: Book(id=2, title="流畅的 Python", author="Luciano Ramalho", price=108.00, isbn="978-7-115-54255-9"),
}


@app.get(
    "/books/",
    response_model=List[Book],
    summary="获取所有图书",
    description="返回图书列表中所有可用的图书",
    tags=["Books"],
)
async def get_books(skip: int = 0, limit: int = 10):
    """
    获取图书列表。

    - **skip**: 跳过的记录数（用于分页）
    - **limit**: 返回的最大记录数
    """
    books = list(books_db.values())[skip : skip + limit]
    return books


@app.get(
    "/books/{book_id}",
    response_model=Book,
    summary="获取特定图书",
    description="根据 ID 获取单本图书的详细信息",
    tags=["Books"],
)
async def get_book(book_id: int):
    """
    根据图书 ID 获取图书详情。

    - **book_id**: 要检索的图书的唯一标识符
    """
    if book_id not in books_db:
        raise HTTPException(status_code=404, detail="Book not found")
    return books_db[book_id]


@app.post(
    "/books/",
    response_model=Book,
    summary="创建新图书",
    description="在图书列表中添加新图书",
    tags=["Books"],
    status_code=201,
)
async def create_book(book: BookCreate):
    """
    创建一本新图书。

    返回新创建的图书信息，包括自动生成的 ID。
    """
    new_id = max(books_db.keys()) + 1
    new_book = Book(id=new_id, **book.dict())
    books_db[new_id] = new_book
    return new_book


@app.put(
    "/books/{book_id}",
    response_model=Book,
    summary="更新图书",
    description="更新现有图书的信息",
    tags=["Books"],
)
async def update_book(book_id: int, book: BookUpdate):
    """
    更新图书信息。

    只更新提供的字段，未提供的字段保持不变。
    """
    if book_id not in books_db:
        raise HTTPException(status_code=404, detail="Book not found")

    stored_book = books_db[book_id]
    update_data = book.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(stored_book, field, value)

    return stored_book


@app.delete(
    "/books/{book_id}",
    summary="删除图书",
    description="从图书列表中删除图书",
    tags=["Books"],
)
async def delete_book(book_id: int):
    """
    根据 ID 删除图书。

    - **book_id**: 要删除的图书的唯一标识符
    """
    if book_id not in books_db:
        raise HTTPException(status_code=404, detail="Book not found")

    del books_db[book_id]
    return {"message": "Book deleted successfully"}


# 用户管理部分
class User(BaseModel):
    id: int
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None


users_db = {}


@app.post(
    "/users/",
    response_model=User,
    summary="创建用户",
    description="创建新用户账户",
    tags=["Users"],
    status_code=201,
)
async def create_user(user: UserCreate):
    """
    创建新用户。

    用户名必须是唯一的，电子邮件必须有效。
    """
    if any(u["email"] == user.email for u in users_db.values()):
        raise HTTPException(status_code=400, detail="Email already registered")

    if any(u["username"] == user.username for u in users_db.values()):
        raise HTTPException(status_code=400, detail="Username already taken")

    new_id = max([0] + list(users_db.keys())) + 1
    # 在实际应用中，您应该加密密码
    new_user = User(
        id=new_id,
        email=user.email,
        username=user.username,
        full_name=user.full_name,
    )
    users_db[new_id] = new_user
    return new_user


@app.get(
    "/users/{user_id}",
    response_model=User,
    summary="获取用户",
    description="获取用户的详细信息",
    tags=["Users"],
)
async def get_user(user_id: int):
    """根据用户 ID 获取用户信息。"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]
```

### 自定义 OpenAPI 配置

```python
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

app = FastAPI()


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Custom API",
        version="2.0.0",
        description="自定义 API 描述",
        routes=app.routes,
        servers=[
            {"url": "https://api.example.com/v2", "description": "生产服务器"},
            {"url": "https://staging-api.example.com/v2", "description": "测试服务器"},
        ],
        tags=[
            {
                "name": "authentication",
                "description": "认证相关操作"
            },
            {
                "name": "items",
                "description": "项目管理"
            }
        ]
    )

    # 添加全局安全定义
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    # 添加全局安全要求
    openapi_schema["security"] = [{"BearerAuth": []}]

    # 添加外部文档链接
    openapi_schema["externalDocs"] = {
        "description": "项目文档",
        "url": "https://docs.example.com"
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


@app.get("/")
async def root():
    return {"message": "Hello World"}
```

## 生成的 SDK 示例

### Python SDK 使用示例

```python
# 安装生成的 Python SDK
# pip install ./client-python

from fastapi_client import BookStoreApi, BookCreate, BookUpdate
import os

# 创建 API 客户端实例
configuration = fastapi_client.Configuration()
configuration.host = "https://api.bookstore.com/v1"
configuration.api_key['BearerAuth'] = os.getenv("API_KEY")

# 创建 API 实例
api_instance = fastapi_client.BookStoreApi(fastapi_client.ApiClient(configuration))

# 创建新书
new_book = BookCreate(
    title="新的书",
    author="作者姓名",
    description="书的内容描述",
    price=59.99,
    isbn="978-0-123456-78-9"
)

try:
    # 创建图书
    created_book = api_instance.create_book(new_book)
    print(f"创建的图书: {created_book}")

    # 获取所有图书
    books = api_instance.get_books(limit=10)
    print(f"图书列表: {books}")

    # 更新图书
    book_update = BookUpdate(price=49.99)
    updated_book = api_instance.update_book(created_book.id, book_update)
    print(f"更新后的图书: {updated_book}")

except fastapi_client.ApiException as e:
    print(f"API 异常: {e.status_code}\n{e.body}")
```

### JavaScript/TypeScript SDK 使用示例

```javascript
// 使用生成的 JavaScript 客户端
import { BookStoreApi, Configuration, BookCreate, BookUpdate } from './client-javascript';

// 配置
const config = new Configuration({
    basePath: "https://api.bookstore.com/v1",
    apiKey: "Bearer YOUR_API_KEY"
});

// 创建 API 实例
const api = new BookStoreApi(config);

// 创建新书
const newBook = new BookCreate();
newBook.title = "JavaScript 高级编程";
newBook.author = "Nicholas C. Zakas";
newBook.price = 99.99;
newBook.isbn = "978-7-115-27579-0";

api.createBook(newBook)
    .then(book => {
        console.log("创建的图书:", book);

        // 获取所有图书
        return api.getBooks({ limit: 10 });
    })
    .then(books => {
        console.log("图书列表:", books);

        // 更新图书
        const bookUpdate = new BookUpdate();
        bookUpdate.price = 79.99;
        return api.updateBook(book.id, bookUpdate);
    })
    .then(updatedBook => {
        console.log("更新后的图书:", updatedBook);
    })
    .catch(error => {
        console.error("API 错误:", error);
    });
```

## 自动化 SDK 生成流程

### CI/CD 集成示例

```yaml
# .github/workflows/generate-sdk.yml
name: Generate SDK

on:
  push:
    tags:
      - 'v*'

jobs:
  generate:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.9'

    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install openapi-generator-cli

    - name: Generate OpenAPI spec
      run: |
        python -c "import uvicorn; uvicorn.run('main:app', host='127.0.0.1', port=8000)" &
        sleep 5
        curl http://127.0.0.1:8000/openapi.json > openapi.json

    - name: Generate Python SDK
      run: |
        openapi-generator-cli generate \
          -i openapi.json \
          -g python \
          -o ./sdk/python \
          --additional-properties=packageName=fastapi_client,projectName=fastapi_client

    - name: Generate TypeScript SDK
      run: |
        openapi-generator-cli generate \
          -i openapi.json \
          -g typescript-axios \
          -o ./sdk/typescript \
          --additional-properties=withSeparateModelsAndApi=true,npmName=@myorg/fastapi-client,npmVersion=1.0.0

    - name: Build and publish Python SDK
      run: |
        cd sdk/python
        python setup.py sdist bdist_wheel
        twine upload dist/* -u __token__ -p ${{ secrets.PYPI_TOKEN }}

    - name: Publish TypeScript SDK
      run: |
        cd sdk/typescript
        npm publish -u ${{ secrets.NPM_USERNAME }} -p ${{ secrets.NPM_PASSWORD }}
```

### 本地生成脚本

```python
# scripts/generate_sdk.py
import subprocess
import requests
import json
from pathlib import Path

def generate_openapi_spec(url: str, output_path: Path):
    """从运行的应用获取 OpenAPI 规范"""
    response = requests.get(url)
    response.raise_for_status()

    with open(output_path, 'w') as f:
        json.dump(response.json(), f, indent=2)

    print(f"OpenAPI 规范已保存到 {output_path}")

def generate_client(openapi_path: Path, language: str, output_dir: Path, **kwargs):
    """生成指定语言的客户端 SDK"""
    cmd = [
        "openapi-generator-cli",
        "generate",
        "-i", str(openapi_path),
        "-g", language,
        "-o", str(output_dir)
    ]

    # 添加额外属性
    for key, value in kwargs.items():
        cmd.extend(["--additional-properties", f"{key}={value}"])

    subprocess.run(cmd, check=True)
    print(f"{language} 客户端已生成到 {output_dir}")

def main():
    """主函数"""
    # 配置
    api_url = "http://localhost:8000/openapi.json"
    openapi_path = Path("openapi.json")

    # 生成规范
    generate_openapi_spec(api_url, openapi_path)

    # 生成各种语言的客户端
    languages = {
        "python": {
            "output": Path("sdk/python"),
            "props": {
                "packageName": "fastapi_client",
                "projectName": "fastapi_client",
                "packageVersion": "1.0.0"
            }
        },
        "typescript": {
            "output": Path("sdk/typescript"),
            "props": {
                "withSeparateModelsAndApi": "true",
                "npmName": "@myorg/fastapi-client",
                "npmVersion": "1.0.0"
            }
        },
        "java": {
            "output": Path("sdk/java"),
            "props": {
                "groupId": "com.myorg",
                "artifactId": "fastapi-client",
                "artifactVersion": "1.0.0",
                "library": "webclient",
                "dateLibrary": "java8"
            }
        },
        "csharp": {
            "output": Path("sdk/csharp"),
            "props": {
                "packageName": "MyOrg.FastApiClient",
                "packageVersion": "1.0.0",
                "netStandard": "netstandard2.0"
            }
        }
    }

    for lang, config in languages.items():
        output_dir = config["output"]
        output_dir.mkdir(parents=True, exist_ok=True)

        generate_client(
            openapi_path,
            lang,
            output_dir,
            **config["props"]
        )

if __name__ == "__main__":
    main()
```

## 最佳实践

### 1. API 设计原则

- **一致性和可预测性**：使用一致的命名约定和模式
- **版本控制**：在 URL 中包含 API 版本（如 `/api/v1`）
- **错误处理**：提供清晰的错误消息和适当的 HTTP 状态码
- **文档化**：为每个端点提供清晰的描述

### 2. OpenAPI 优化

```python
from typing import Optional
from pydantic import BaseModel, Field

class Item(BaseModel):
    name: str = Field(..., description="项目名称", min_length=1, max_length=100)
    description: Optional[str] = Field(None, description="项目描述")
    price: float = Field(..., gt=0, description="价格（必须大于0）")
    tags: list[str] = Field(default=[], description="标签列表")

    class Config:
        schema_extra = {
            "example": {
                "name": "示例项目",
                "description": "这是一个示例",
                "price": 29.99,
                "tags": ["example", "demo"]
            }
        }
```

### 3. 认证和授权

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # 验证令牌并返回用户
    if token != "fake-super-secret-token":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"username": "john.doe"}

@app.get("/users/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user
```

### 4. 自定义 SDK 生成模板

创建自定义生成器模板以更好地控制生成的代码：

```bash
# 创建自定义模板
openapi-generator-cli author template -g python -o ./templates/python

# 编辑模板文件
# ...

# 使用自定义模板生成
openapi-generator-cli generate \
    -i openapi.json \
    -g python \
    -t ./templates/python \
    -o ./client-python
```

## 高级主题

### 1. 多服务器配置

```python
app = FastAPI(
    servers=[
        {
            "url": "https://api.example.com/v1",
            "description": "生产服务器",
        },
        {
            "url": "https://staging-api.example.com/v1",
            "description": "预发布服务器",
        },
        {
            "url": "http://localhost:8000/v1",
            "description": "开发服务器",
        }
    ]
)
```

### 2. 回调和 Webhooks

```python
from fastapi import FastAPI, Request
from pydantic import BaseModel

app = FastAPI()

@app.post(
    "/webhooks/payment-completed",
    summary="支付完成回调",
    description="当支付完成时，外部服务会调用此端点"
)
async def payment_webhook(request: Request):
    # 处理 webhook
    pass
```

### 3. 文档和示例

```python
from typing import Dict, Any
from pydantic import BaseModel

app = FastAPI(
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

class ExampleResponse(BaseModel):
    message: str
    data: Dict[str, Any]

    class Config:
        schema_extra = {
            "example": {
                "message": "Success",
                "data": {"key": "value"}
            }
        }
```

## 工具和资源

- [OpenAPI Generator](https://openapi-generator.tech/)
- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [OpenAPI 规范](https://swagger.io/specification/)
- [Swagger Codegen](https://swagger.io/tools/swagger-codegen/)
- [AutoRest](https://github.com/Azure/autorest)

## 总结

生成 SDK 可以：
- 提高开发者的采用率
- 减少 API 集成错误
- 提供类型安全的客户端
- 自动处理认证和错误

通过精心设计您的 API 和 OpenAPI 规范，您可以为各种编程语言生成高质量的 SDK，使其他开发者更容易与您的服务集成。