# CORS（跨域资源共享）

CORS 或 "Cross-Origin Resource Sharing"（跨域资源共享）指的是在浏览器中运行的前端具有与后端通信的 JavaScript 代码, 并且后端与前端的 "源"（origin）不同的情况.

## 1. 什么是源 (Origin)

源（origin）是协议（`http`、`https`）、域名（`myapp.com`、`localhost`、`localhost.tiangolo.com`）和端口（`80`、`443`、`8080`）的组合.

所以, 以下都是不同的源:

- `http://localhost`
- `https://localhost`
- `http://localhost:8080`

即使它们都在 `localhost` 上, 它们使用不同的协议或端口, 因此它们是不同的 "源".

## 2. CORS 工作步骤

假设你有一个在浏览器中运行的前端, 地址是 `http://localhost:8080`, 它的 JavaScript 试图与运行在 `http://localhost` 的后端通信（因为如果我们没有指定端口, 浏览器将假定使用默认端口 `80`）.

然后, 浏览器将向 `:80`-后端发送 HTTP `OPTIONS` 请求, 如果后端发送适当的响应头授权来自这个不同源（`http://localhost:8080`）的通信, 那么 `:8080`-浏览器将允许前端中的 JavaScript 向 `:80`-后端发送其请求.

为了实现这一点, `:80`-后端必须有一个 "允许的源" 列表.

在这种情况下, 列表必须包含 `http://localhost:8080` 以便 `:8080`-前端能够正常工作.

### 工作流程说明

```
前端 (http://localhost:8080)
    ↓
1. 浏览器发送 OPTIONS 请求到后端
    ↓
2. 后端返回 CORS 响应头
    ↓
3. 浏览器验证响应头
    ↓
4. 允许实际请求发送到后端
```

## 3. 通配符

也可以将列表声明为 `"*"`（"通配符"）来表示允许所有源.

但这只允许某些类型的通信, 不包括涉及凭据（credentials）的所有内容: Cookies、Authorization 标头（如使用 Bearer Tokens 的那些）等.

因此, 为了使一切正常工作, 最好显式指定允许的源.

### 为什么不能总是使用通配符？

使用 `*` 通配符时, 浏览器会:
- 允许简单的 GET/POST 请求
- **不允许** 发送凭据（Cookies、Authorization headers）
- **不允许** 某些复杂的请求

如果你的 API 需要:
- 用户身份验证（Cookies）
- Bearer Token 认证
- 任何需要 Authorization header 的操作

你就需要明确指定允许的源, 而不是使用 `*`.

## 4. 使用 CORSMiddleware

你可以使用 `CORSMiddleware` 在 __FastAPI__ 应用中配置它.

- 导入 `CORSMiddleware`
- 创建允许的源列表（作为字符串）
- 将其作为 "中间件" 添加到你的 __FastAPI__ 应用中

你还可以指定后端是否允许:

- 凭据（Authorization 标头、Cookies 等）
- 特定的 HTTP 方法（`POST`、`PUT`）或使用通配符 `"*"` 允许所有方法
- 特定的 HTTP 标头或使用通配符 `"*"` 允许所有标头

**Python 3.8+**

```python
# 导入 FastAPI 主类
from fastapi import FastAPI
# 从 fastapi.middleware.cors 导入 CORS 中间件
from fastapi.middleware.cors import CORSMiddleware

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义允许的源列表
# 这些是允许访问你 API 的前端地址
origins = [
    "http://localhost.tiangolo.com",      # 允许 http 协议的 localhost.tiangolo.com
    "https://localhost.tiangolo.com",     # 允许 https 协议的 localhost.tiangolo.com
    "http://localhost",                   # 允许 http://localhost (默认端口 80)
    "http://localhost:8080",              # 允许 http://localhost:8080 (开发服务器常用端口)
]

# 添加 CORS 中间件到应用
app.add_middleware(
    CORSMiddleware,                        # 要添加的中间件类
    allow_origins=origins,                 # 允许的源列表
    allow_credentials=True,                # 允许携带凭据（Cookies、Authorization headers）
    allow_methods=["*"],                   # 允许所有 HTTP 方法（GET、POST、PUT、DELETE 等）
    allow_headers=["*"],                   # 允许所有 HTTP 请求头
)

# 定义一个简单的路由
@app.get("/")
async def main():
    return {"message": "Hello World"}
```

### CORSMiddleware 参数说明

`CORSMiddleware` 实现使用的默认参数默认是限制性的, 因此你需要显式启用特定的源、方法或标头, 以便允许浏览器在跨域上下文中使用它们.

支持以下参数:

- **`allow_origins`** - 应允许进行跨域请求的源列表.
  - 例如: `['https://example.org', 'https://www.example.org']`
  - 你可以使用 `['*']` 允许任何源.

- **`allow_origin_regex`** - 用于匹配应允许进行跨域请求的源的正则表达式字符串.
  - 例如: `'https://.*\\.example\\.org'` 匹配所有 example.org 的子域名.

- **`allow_methods`** - 应允许跨域请求的 HTTP 方法列表.
  - 默认为 `['GET']`.
  - 你可以使用 `['*']` 允许所有标准方法.

- **`allow_headers`** - 应支持跨域请求的 HTTP 请求标头列表.
  - 默认为 `[]`.
  - 你可以使用 `['*']` 允许所有标头.
  - 对于简单的 CORS 请求, `Accept`、`Accept-Language`、`Content-Language` 和 `Content-Type` 标头始终是允许的.

- **`allow_credentials`** - 指示应支持跨域请求的 Cookies.
  - 默认为 `False`.
  - **重要**: 如果 `allow_credentials` 设置为 `True`, 则 `allow_origins`、`allow_methods` 和 `allow_headers` 都不能设置为 `['*']`. 所有这些都必须显式指定.

- **`expose_headers`** - 指示应使浏览器可以访问的任何响应标头.
  - 默认为 `[]`.

- **`max_age`** - 设置浏览器缓存 CORS 响应的最大时间（秒）.
  - 默认为 `600`（10 分钟）.
  - 浏览器将缓存预检请求的结果, 以减少后续请求的延迟.

### 中间件处理两种特定类型的 HTTP 请求:

## 5. CORS 预检请求

这些是带有 `Origin` 和 `Access-Control-Request-Method` 标头的任何 `OPTIONS` 请求.

**什么是预检请求？**

当浏览器想要发送一个 "非简单" 请求时, 它会先发送一个 OPTIONS 请求来检查服务器是否允许该请求.

**非简单请求的例子:**
- 使用 PUT、DELETE 等方法
- 使用 `Content-Type: application/json`
- 包含自定义请求头

**预检请求流程:**

```
1. 浏览器发送 OPTIONS 请求
   Headers:
   - Origin: http://localhost:8080
   - Access-Control-Request-Method: POST
   - Access-Control-Request-Headers: Content-Type

2. 服务器响应
   Headers:
   - Access-Control-Allow-Origin: http://localhost:8080
   - Access-Control-Allow-Methods: POST, GET, OPTIONS
   - Access-Control-Allow-Headers: Content-Type
   - Access-Control-Max-Age: 600

3. 浏览器检查响应, 如果允许, 发送实际请求
```

在这种情况下, 中间件将拦截传入的请求并使用适当的 CORS 标头进行响应, 并提供 `200` 或 `400` 响应以供信息参考.

## 6. 简单请求

任何带有 `Origin` 标头的请求.

**什么是简单请求？**

简单请求不需要预检. 以下条件满足即为简单请求:
- 使用 GET、HEAD 或 POST 方法
- 只允许的标头: Accept、Accept-Language、Content-Language、Content-Type
- Content-Type 只能是: text/plain、multipart/form-data、application/x-www-form-urlencoded

在这种情况下, 中间件将正常传递请求, 但会在响应中包含适当的 CORS 标头.

**简单请求流程:**

```
1. 浏览器直接发送实际请求
   Headers:
   - Origin: http://localhost:8080

2. 服务器处理请求并响应
   Headers:
   - Access-Control-Allow-Origin: http://localhost:8080

3. 浏览器验证响应头, 如果匹配, 返回响应给 JavaScript
```

## 7. 更多信息

有关 CORS 的更多信息, 请查看 [Mozilla CORS 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

### 技术细节

你也可以使用 `from starlette.middleware.cors import CORSMiddleware`.

__FastAPI__ 为了方便开发者, 在 `fastapi.middleware` 中提供了几个中间件. 但是大多数可用的中间件直接来自 Starlette.

## 8. 实际应用示例

### 示例 1: 生产环境配置

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 生产环境: 明确指定允许的源
origins = [
    "https://myapp.example.com",      # 你的生产前端
    "https://admin.myapp.example.com", # 你的管理后台
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,           # 允许 Cookies
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # 明确指定允许的方法
    allow_headers=["*"],              # 允许所有标头
)
```

### 示例 2: 开发环境配置

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 开发环境: 使用通配符（不适用于需要凭据的场景）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],              # 允许所有源
    allow_credentials=False,          # 不能使用 True
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 示例 3: 使用正则表达式匹配源

```python
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 使用正则表达式匹配所有子域名
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https://.*\\.example\\.org",  # 匹配 https://*.example.org
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 9. 常见问题

### Q: 为什么我的跨域请求被阻止？

**A:** 检查以下几点:
1. `allow_origins` 是否包含你的前端地址
2. 如果使用 `allow_credentials=True`, 不能使用 `["*"]` 作为 `allow_origins`
3. 请求方法是否在 `allow_methods` 列表中
4. 请求头是否在 `allow_headers` 列表中

### Q: 如何在开发时允许所有源？

**A:** 在开发环境中可以使用通配符, 但不能启用凭据:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # 必须为 False
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Q: 如何允许特定的自定义头？

**A:** 明确列出允许的自定义头:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://example.com"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "X-Custom-Header",  # 你的自定义头
    ],
)
```
