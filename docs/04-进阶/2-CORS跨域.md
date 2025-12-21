# CORS 跨域

CORS（Cross-Origin Resource Sharing，跨域资源共享）是一种机制，它使用额外的 HTTP 头部来告诉浏览器，让运行在一个 origin（域）上的 Web 应用被准许访问来自不同源服务器上的指定资源。

## 什么是跨域？

当一个资源从与该资源本身所在的服务器不同的域、协议或端口请求一个资源时，资源会发起一个跨域 HTTP 请求。

例如，从前端 JavaScript 代码对 `http://domain-a.com` 发起的 XMLHTTPRequest 请求，针对 `http://api.domain-b.com` 的访问就是一个跨域请求。

## 为什么需要 CORS？

出于安全原因，浏览器限制从脚本内发起的跨源 HTTP 请求。例如，`XMLHttpRequest` 和 Fetch API 遵循同源策略。这意味着使用这些 API 的 Web 应用程序只能从加载应用程序的同一个域请求 HTTP 资源。

## 使用 CORSMiddleware

FastAPI 提供了 `CORSMiddleware` 来处理跨域请求。

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    # 允许跨域的源列表，例如 ["http://www.example.com"]
    # ["*"] 表示允许任何源
    allow_origins=["*"],
    # 跨域请求是否支持 cookie，默认为 False
    allow_credentials=True,
    # 允许跨域请求的 HTTP 方法列表，默认为 ["GET"]
    allow_methods=["*"],
    # 允许跨域请求的 HTTP 头部列表，默认为 []
    # ["*"] 表示允许所有头部
    allow_headers=["*"],
)
```

## 具体参数说明

### `allow_origins`

- 允许跨域请求的源列表。
- 可以是字符串列表或字符串。
- 例如 `["https://example.org", "https://www.example.org"]`。
- 特殊值 `"*"` 允许所有源。

### `allow_methods`

- 允许跨域请求的 HTTP 方法列表。
- 默认为 `["GET"]`。
- 可以使用 `["*"]` 来允许所有标准方法。

### `allow_headers`

- 允许跨域请求的 HTTP 头部列表。
- 默认为 `[]`。
- 可以使用 `["*"]` 来允许所有头部。
- `Accept`、`Accept-Language`、`Content-Language` 和 `Content-Type` 头部总是允许的。

### `allow_credentials`

- 指示跨域请求是否可以包含凭据（cookies、HTTP 认证或客户端 SSL 证书）。
- 默认为 `False`。

### `allow_origin_regex`

- 允许跨域请求的源的正则表达式字符串。
- 例如 `["https://.*\\.example\\.org"]`。

### `expose_headers`

- 指示哪些头部可以作为响应的一部分暴露。
- 默认为 `[]`。

### `max_age`

- 设置浏览器缓存 CORS 预检请求结果的最大时间（秒）。
- 默认为 600。

## 具体示例

### 允许特定域

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 使用正则表达式

```python
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.example\.org",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 针对特定路径设置不同的 CORS 策略

如果需要对不同的路径设置不同的 CORS 策略，你可以创建多个 FastAPI 应用并使用 `Mount`：

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRouter

# 主应用
app = FastAPI()

# 创建子应用
api_app = FastAPI()
web_app = FastAPI()

# 为 API 设置 CORS
api_app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://api.example.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# 为 Web 应用设置 CORS
web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.example.com"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# 挂载子应用
app.mount("/api", api_app)
app.mount("/web", web_app)
```

## CORS 的工作原理

CORS 机制通过以下几种类型的请求来工作：

### 简单请求

对于某些 CORS 请求，浏览器会发送一个"简单请求"，这是一个没有额外 CORS 预检的请求。简单请求需要满足所有以下条件：

- 方法是 GET、HEAD 或 POST
- 除了自动设置的头部，开发者可以手动设置的头部是：
  - `Accept`
  - `Accept-Language`
  - `Content-Language`
  - `Content-Type`
  - `Last-Event-ID`
  - `DPR`
  - `Save-Data`
  - `Viewport-Width`
  - `Width`
- `Content-Type` 的值是：
  - `application/x-www-form-urlencoded`
  - `multipart/form-data`
  - `text/plain`

### 预检请求

对于其他类型的 CORS 请求，浏览器会发送一个"预检请求"（使用 OPTIONS 方法），以确定服务器是否允许该请求。预检请求包含：

- `Origin` 头部：指示请求的源
- `Access-Control-Request-Method` 头部：指示实际请求的方法
- `Access-Control-Request-Headers` 头部：指示实际请求的头部

服务器对预检请求的响应包含：

- `Access-Control-Allow-Origin` 头部：指示允许的源
- `Access-Control-Allow-Methods` 头部：指示允许的方法
- `Access-Control-Allow-Headers` 头部：指示允许的头部
- `Access-Control-Max-Age` 头部：指示预检请求可以缓存的时间

### 实际请求

如果预检请求成功，浏览器会发送实际的请求。实际请求包含：

- `Origin` 头部：指示请求的源

### 响应

服务器对实际请求的响应包含：

- `Access-Control-Allow-Origin` 头部：指示允许的源
- `Access-Control-Expose-Headers` 头部：指示可以暴露给客户端的头部

## CORS 安全注意事项

1. **不要在生产环境中使用 `allow_origins=["*"]`**
   - 这允许任何网站访问你的 API
   - 只在开发环境中使用

2. **谨慎使用 `allow_credentials=True`**
   - 这会暴露你的 API 给任何允许的域
   - 确保你信任所有列在 `allow_origins` 中的域

3. **限制允许的方法和头部**
   - 只允许你的应用程序实际需要的方法和头部
   - 避免使用 `allow_methods=["*"]` 和 `allow_headers=["*"]`

4. **使用 HTTPS**
   - 确保你的 API 和前端都使用 HTTPS
   - 防止中间人攻击

## 常见 CORS 错误

### "No 'Access-Control-Allow-Origin' header is present on the requested resource"

这意味着服务器没有正确配置 CORS。确保你已经添加了 `CORSMiddleware` 并正确配置了 `allow_origins`。

### "The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*'"

这意味着你正在发送需要凭据的请求（如包含 cookies），但服务器设置了 `allow_origins=["*"]`。当你设置 `allow_credentials=True` 时，必须指定具体的源，而不是通配符。

## 总结

CORS 是 Web 开发中常见的安全机制，FastAPI 的 `CORSMiddleware` 使处理 CORS 请求变得简单。记住：

1. 根据你的需求配置适当的 CORS 策略
2. 在生产环境中使用安全的配置
3. 理解预检请求和简单请求的区别
4. 始终考虑安全性，不要过度开放你的 API