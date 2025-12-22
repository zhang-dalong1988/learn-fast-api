# 11. Header 参数

HTTP Header（请求头）是 HTTP 协议中用于传递额外元数据的重要机制。在 Web 开发中，Header 常用于：

- **身份认证**：Bearer Token、API Key 等
- **内容协商**：Accept、Content-Type、Accept-Language 等
- **缓存控制**：Cache-Control、ETag、If-None-Match 等
- **客户端信息**：User-Agent、Referer、X-Forwarded-For 等
- **自定义信息**：X-Request-ID、X-Client-Version 等

FastAPI 提供了简单而强大的方式来处理 Header 参数。

## 11.1 Header 的基本概念

### 11.1.1 什么是 HTTP Header？

HTTP Header 是在 HTTP 请求和响应中传递的额外信息，以键值对的形式存在。它们不包含在请求体中，而是作为 HTTP 协议的一部分。

### 11.1.2 常见的 HTTP Header

| Header 名称 | 用途 | 示例 |
|------------|------|------|
| `Authorization` | 身份认证 | `Bearer abc123` |
| `Content-Type` | 内容类型 | `application/json` |
| `Accept` | 接受的内容类型 | `application/json, text/html` |
| `User-Agent` | 客户端信息 | `Mozilla/5.0 (Windows NT 10.0)` |
| `X-Request-ID` | 请求追踪 | `550e8400-e29b-41d4` |
| `X-API-Key` | API 密钥 | `sk-1234567890` |

## 11.2 声明 Header 参数

### 11.2.1 基本用法（推荐方式）

```python
from typing import Annotated
from fastapi import Header, FastAPI

# 创建 FastAPI 应用实例
app = FastAPI()

@app.get("/api/info")
async def get_api_info(
    # 声明 Header 参数：从请求头中读取 user_agent
    user_agent: Annotated[str, Header(
        description="客户端用户代理信息",
        examples=["Mozilla/5.0 (Windows NT 10.0; Win64; x64)"]
    )]
):
    """
    获取 API 信息

    - user_agent 是从 Header 中读取的必需参数
    - Header 名称会自动转换为标准的 HTTP 格式
    """
    return {
        "message": "API 信息",
        "client": {
            "user_agent": user_agent,
            "platform": "根据 User-Agent 解析的平台"
        }
    }
```

### 11.2.2 多个 Header 参数

```python
from typing import Annotated
from fastapi import Header, FastAPI

app = FastAPI()

@app.get("/api/request-info")
async def get_request_info(
    # 读取多个 Header 参数
    host: Annotated[str, Header(description="请求主机")],
    authorization: Annotated[str | None, Header(
        description="认证信息，Bearer Token",
        examples=["Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"]
    )] = None,  # 可选
    x_request_id: Annotated[str | None, Header(
        description="请求唯一标识符，用于追踪",
        examples=["req-123456"],
        alias="X-Request-ID"  # 自定义 Header 名称
    )] = None,  # 可选
):
    """
    获取请求的详细信息

    展示如何同时读取多个 Header：
    - host：请求主机（必需）
    - authorization：认证 token（可选）
    - x_request_id：请求 ID（可选）
    """
    return {
        "request": {
            "host": host,
            "authenticated": authorization is not None,
            "request_id": x_request_id
        },
        "message": "请求信息已获取"
    }
```

### 11.2.3 可选的 Header 参数

```python
from typing import Annotated
from fastapi import Header, FastAPI

app = FastAPI()

@app.get("/api/analytics")
async def track_analytics(
    # 可选的分析相关 Header
    referer: Annotated[str | None, Header(
        description="来源页面",
        examples=["https://google.com/search?q=fastapi"]
    )] = None,

    # 可选的客户端 IP（代理传递）
    x_forwarded_for: Annotated[str | None, Header(
        description="客户端真实 IP（通过代理传递）",
        examples=["203.0.113.1, 192.168.1.1"],
        alias="X-Forwarded-For"
    )] = None,

    # 可选的设备类型
    x_device_type: Annotated[str | None, Header(
        description="设备类型",
        examples=["mobile", "desktop", "tablet"],
        alias="X-Device-Type"
    )] = None
):
    """
    记录访问分析数据

    展示多个可选 Header 的处理：
    - referer：用户来源页面
    - x_forwarded_for：客户端 IP（考虑代理）
    - x_device_type：设备类型
    """
    return {
        "analytics": {
            "referer": referer,
            "client_ip": x_forwarded_for,
            "device_type": x_device_type
        },
        "message": "分析数据已记录"
    }
```

## 11.3 Header 的自动转换

### 11.3.1 名称自动转换

FastAPI 会自动将 Python 变量名转换为标准的 HTTP Header 格式：

```python
from typing import Annotated
from fastapi import Header, FastAPI

app = FastAPI()

@app.get("/api/demo")
async def demo_conversion(
    # Python 变量名自动转换为 HTTP Header
    user_agent: Annotated[str, Header()],           # → User-Agent
    x_token: Annotated[str, Header()],              # → X-Token
    content_type: Annotated[str, Header()],         # → Content-Type
    accept_language: Annotated[str, Header()],      # → Accept-Language
    x_custom_header: Annotated[str, Header()]       # → X-Custom-Header
):
    """
    展示 Header 名称的自动转换：
    - 下划线(_)转换为连字符(-)
    - 驼峰命名转换为单词首字母大写
    """
    return {
        "headers": {
            "user_agent": user_agent,
            "x_token": x_token,
            "content_type": content_type,
            "accept_language": accept_language,
            "x_custom_header": x_custom_header
        }
    }
```

### 11.3.2 禁用自动转换

如果需要完全按照 Header 的原始名称，可以禁用自动转换：

```python
from typing import Annotated
from fastapi import Header, FastAPI

app = FastAPI()

@app.get("/api/no-conversion")
async def no_conversion(
    # 设置 convert_underscores=False 禁用转换
    custom_header: Annotated[str, Header(convert_underscores=False)] = None,

    # 注意：禁用转换后，Header 名称必须完全匹配
    # 某些代理服务器可能不支持带下划线的 Header
    x_custom_value: Annotated[str, Header(
        alias="X-Custom-Value",  # 使用 alias 指定 Header 名称
        convert_underscores=False
    )]
):
    """
    展示禁用 Header 自动转换：
    - custom_header：不会自动转换下划线
    - x_custom_value：使用 alias 指定具体名称

    ⚠️ 警告：某些 HTTP 代理和服务器不允许使用带下划线的 Header
    """
    return {
        "custom_header": custom_header,
        "x_custom_value": x_custom_value,
        "note": "使用 convert_underscores=False 需要谨慎"
    }
```

## 11.4 重复的 Header 值

### 11.4.1 接收多个值

某些 Header 可能包含多个值，例如 `X-Token` 或 `Accept`。你可以声明为列表类型来接收所有值：

```python
from typing import Annotated
from fastapi import Header, FastAPI

app = FastAPI()

@app.get("/api/tokens")
async def get_tokens(
    # 接收多个 X-Token 值
    x_token: Annotated[list[str] | None, Header(
        description="认证令牌列表，可包含多个",
        examples=[["token1", "token2", "token3"]],
        alias="X-Token"
    )] = None,

    # 接收多个 Accept 类型
    accept: Annotated[list[str] | None, Header(
        description="接受的内容类型列表",
        examples=[["application/json", "text/html", "application/xml"]]
    )] = None
):
    """
    处理包含多个值的 Header

    HTTP 请求示例：
    X-Token: abc123
    X-Token: def456
    Accept: application/json
    Accept: text/html

    这些值会被收集到列表中
    """
    return {
        "tokens": x_token,
        "accept_types": accept,
        "token_count": len(x_token) if x_token else 0,
        "accept_count": len(accept) if accept else 0
    }
```

### 11.4.2 处理重复值的实际应用

```python
from typing import Annotated
from fastapi import Header, FastAPI

app = FastAPI()

@app.post("/api/batch-process")
async def batch_process(
    # 批量处理的 ID 列表
    x_batch_ids: Annotated[list[str], Header(
        description="批量处理的 ID 列表",
        alias="X-Batch-IDs"
    )],

    # 处理优先级
    x_priority: Annotated[list[str], Header(
        description="处理优先级列表",
        alias="X-Priority"
    )] = ["normal"],  # 默认值

    # 标签列表
    x_tags: Annotated[list[str], Header(
        description="处理标签",
        alias="X-Tags"
    )] = []
):
    """
    批量处理示例

    展示如何处理重复 Header 值：
    - x_batch_ids：要处理的 ID 列表
    - x_priority：优先级顺序
    - x_tags：处理标签

    使用场景：
    - 批量删除多个资源
    - 批量更新多个记录
    - 批量查询多个数据
    """
    # 验证 ID 列表
    if not x_batch_ids:
        return {"error": "没有提供要处理的 ID"}

    # 限制批量大小
    if len(x_batch_ids) > 100:
        return {"error": "批量大小不能超过 100"}

    # 处理逻辑...
    processed = []
    for batch_id in x_batch_ids:
        processed.append({
            "id": batch_id,
            "status": "processed",
            "priority": x_priority[0] if x_priority else "normal"
        })

    return {
        "processed": processed,
        "total": len(processed),
        "tags": x_tags
    }
```

## 11.5 Python 版本兼容性

### 11.5.1 Python 3.10+（最新语法）

```python
# 使用 | 语法表示可选类型和列表类型
from typing import Annotated
from fastapi import Header

async def example(
    token: str | None = Header(default=None),      # 可选
    values: list[str] | None = Header(default=None)  # 可选列表
):
    pass
```

### 11.5.2 Python 3.9

```python
# 使用 Union 代替 |
from typing import Annotated, Union, List

async def example(
    token: Annotated[Union[str, None], Header()] = None,
    values: Annotated[Union[List[str], None], Header()] = None
):
    pass
```

### 11.5.3 Python 3.8

```python
# 需要安装 typing_extensions
from typing import List, Union
from fastapi import Header

async def example(
    token: Union[str, None] = Header(default=None),
    values: Union[List[str], None] = Header(default=None)
):
    pass
```

## 11.6 实际应用场景

### 11.6.1 API 认证和授权

```python
from typing import Annotated
from fastapi import Header, HTTPException, status
import jwt
import base64
import hashlib

app = FastAPI()
SECRET_KEY = "your-secret-key"

def verify_api_key(api_key: str) -> bool:
    """验证 API Key"""
    # 实际项目中应该查询数据库
    valid_keys = ["sk-123456", "sk-789012"]
    return api_key in valid_keys

def parse_bearer_token(authorization: str) -> str:
    """解析 Bearer Token"""
    if not authorization.startswith("Bearer "):
        raise ValueError("Invalid token format")
    return authorization[7:]  # 去掉 "Bearer " 前缀

@app.get("/api/protected/data")
async def get_protected_data(
    # 方式1：API Key 认证
    x_api_key: Annotated[str, Header(
        description="API 密钥",
        alias="X-API-Key"
    )],

    # 方式2：Bearer Token 认证
    authorization: Annotated[str, Header(
        description="Bearer Token",
        examples=["Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"]
    )]
):
    """
    需要认证的 API 接口

    支持两种认证方式：
    1. API Key：通过 X-API-Key Header
    2. Bearer Token：通过 Authorization Header
    """
    # 验证 API Key
    if not verify_api_key(x_api_key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的 API Key"
        )

    # 验证 Bearer Token
    try:
        token = parse_bearer_token(authorization)
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证令牌"
        )

    return {
        "user_id": user_id,
        "protected_data": "这是需要认证才能访问的数据",
        "api_key": x_api_key[:8] + "..."  # 只显示部分 key
    }
```

### 11.6.2 内容协商

```python
from typing import Annotated
from fastapi import Header, Query, Response
import json

app = FastAPI()

@app.get("/api/data")
async def get_data(
    # 客户端接受的内容类型
    accept: Annotated[str, Header(
        description="客户端接受的内容类型",
        examples=["application/json", "text/html", "application/xml"]
    )] = "application/json",

    # 客户端语言偏好
    accept_language: Annotated[str, Header(
        description="客户端语言偏好",
        examples=["zh-CN, en-US", "en-US", "ja-JP"],
        alias="Accept-Language"
    )] = "zh-CN",

    # 客户端字符集
    accept_charset: Annotated[str, Header(
        description="接受的字符集",
        examples=["utf-8", "iso-8859-1"],
        alias="Accept-Charset"
    )] = "utf-8",

    # 查询参数
    format: str = Query(default="json", description="返回格式")
):
    """
    内容协商示例

    根据 Accept Header 返回不同格式的数据
    """
    # 准备数据
    data = {
        "message": "Hello World",
        "timestamp": "2024-01-15T10:30:00Z",
        "data": [1, 2, 3, 4, 5]
    }

    # 根据语言返回不同的消息
    messages = {
        "zh-CN": "你好，世界！",
        "en-US": "Hello, World!",
        "ja-JP": "こんにちは、世界！"
    }

    # 解析语言偏好
    preferred_lang = accept_language.split(",")[0].split("-")[0]
    data["message"] = messages.get(accept_language, messages.get("zh-CN"))

    # 根据接受类型返回响应
    response = Response()

    if "application/json" in accept:
        response.headers["Content-Type"] = "application/json; charset=utf-8"
        response.body = json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8")
    elif "text/html" in accept:
        response.headers["Content-Type"] = "text/html; charset=utf-8"
        html = f"""
        <html>
            <head><title>数据展示</title></head>
            <body>
                <h1>{data['message']}</h1>
                <p>时间戳：{data['timestamp']}</p>
                <pre>{json.dumps(data, ensure_ascii=False, indent=2)}</pre>
            </body>
        </html>
        """
        response.body = html.encode("utf-8")
    elif "application/xml" in accept:
        response.headers["Content-Type"] = "application/xml; charset=utf-8"
        xml = f"""<?xml version="1.0" encoding="UTF-8"?>
        <data>
            <message>{data['message']}</message>
            <timestamp>{data['timestamp']}</timestamp>
        </data>
        """
        response.body = xml.encode("utf-8")
    else:
        # 默认返回 JSON
        response.headers["Content-Type"] = "application/json; charset=utf-8"
        response.body = json.dumps(data, ensure_ascii=False).encode("utf-8")

    return response
```

### 11.6.3 请求追踪和日志

```python
from typing import Annotated
from fastapi import Header, Request
import uuid
import time
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    # 记录请求开始时间
    start_time = time.time()

    # 获取或生成请求 ID
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())

    # 记录请求信息
    logger.info(
        f"Request started - ID: {request_id}, "
        f"Method: {request.method}, "
        f"Path: {request.url.path}, "
        f"Remote: {request.client.host if request.client else 'unknown'}"
    )

    # 处理请求
    response = await call_next(request)

    # 记录响应信息
    process_time = time.time() - start_time
    logger.info(
        f"Request completed - ID: {request_id}, "
        f"Status: {response.status_code}, "
        f"Time: {process_time:.3f}s"
    )

    # 添加响应头
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = str(process_time)

    return response

@app.get("/api/log-example")
async def log_example(
    # 请求追踪 ID
    x_request_id: Annotated[str | None, Header(
        description="请求唯一标识符，用于追踪请求链路",
        alias="X-Request-ID"
    )] = None,

    # 调用链 ID（微服务架构中）
    x_trace_id: Annotated[str | None, Header(
        description="分布式追踪 ID",
        alias="X-Trace-ID"
    )] = None,

    # 调用者服务
    x_caller_service: Annotated[str | None, Header(
        description="调用方服务名称",
        alias="X-Caller-Service"
    )] = None
):
    """
    日志和追踪示例

    展示如何使用 Header 进行请求追踪：
    - x_request_id：单个请求的唯一 ID
    - x_trace_id：分布式系统中的追踪 ID
    - x_caller_service：标识调用方服务
    """
    # 记录业务日志
    logger.info(
        f"Processing request - RequestID: {x_request_id}, "
        f"TraceID: {x_trace_id}, "
        f"Caller: {x_caller_service}"
    )

    return {
        "request_id": x_request_id,
        "trace_id": x_trace_id,
        "caller_service": x_caller_service,
        "message": "请求已处理",
        "log_level": "INFO"
    }
```

### 11.6.4 版本控制和客户端信息

```python
from typing import Annotated
from fastapi import Header

app = FastAPI()

@app.get("/api/version")
async def get_api_version(
    # API 版本
    x_api_version: Annotated[str, Header(
        description="客户端使用的 API 版本",
        examples=["1.0", "2.0", "2.1"],
        alias="X-API-Version"
    )] = "1.0",

    # 客户端版本
    x_client_version: Annotated[str, Header(
        description="客户端应用版本",
        examples=["1.2.3", "2.0.0"],
        alias="X-Client-Version"
    )] = None,

    # 客户端平台
    x_client_platform: Annotated[str, Header(
        description="客户端平台",
        examples=["iOS", "Android", "Web", "Windows"],
        alias="X-Client-Platform"
    )] = None,

    # 构建版本
    x_build_number: Annotated[int, Header(
        description="客户端构建号",
        examples=[123, 456, 789],
        alias="X-Build-Number"
    )] = None
):
    """
    版本控制和客户端信息示例

    用于：
    - API 版本兼容性检查
    - 客户端版本管理
    - 功能开关控制
    - 问题定位和分析
    """
    # 版本兼容性检查
    supported_versions = ["1.0", "2.0", "2.1"]
    if x_api_version not in supported_versions:
        return {
            "error": "不支持的 API 版本",
            "supported_versions": supported_versions,
            "current_version": x_api_version
        }

    # 检查客户端版本
    client_info = {
        "api_version": x_api_version,
        "client_version": x_client_version,
        "platform": x_client_platform,
        "build_number": x_build_number
    }

    # 根据版本返回不同功能
    features = []
    if x_api_version >= "2.0":
        features.extend(["advanced_search", "data_export"])
    if x_api_version >= "2.1":
        features.append("real_time_updates")

    return {
        "api_info": {
            "version": x_api_version,
            "features": features
        },
        "client_info": client_info,
        "message": f"API {x_api_version} 正常运行"
    }
```

## 11.7 测试 Header 参数

### 11.7.1 使用 curl 测试

```bash
# 基本用法
curl http://127.0.0.1:8000/api/info \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)"

# 多个 Header
curl http://127.0.0.1:8000/api/request-info \
  -H "Host: api.example.com" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" \
  -H "X-Request-ID: req-123456789"

# 重复的 Header
curl http://127.0.0.1:8000/api/tokens \
  -H "X-Token: token1" \
  -H "X-Token: token2" \
  -H "X-Token: token3"

# 禁用自动转换的 Header
curl http://127.0.0.1:8000/api/no-conversion \
  -H "custom_header: value123"
```

### 11.7.2 使用 HTTPie 测试

```bash
# HTTPie 提供了更友好的语法
http GET http://127.0.0.1:8000/api/info \
  User-Agent:"Mozilla/5.0 (Windows NT 10.0)"

# 认证 Header
http GET http://127.0.0.1:8000/api/protected/data \
  X-API-Key:sk-123456 \
  Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"

# 重复 Header
http GET http://127.0.0.1:8000/api/tokens \
  X-Token:token1 \
  X-Token:token2
```

### 11.7.3 使用 Python requests 测试

```python
import requests

# 基本 Header
headers = {
    "User-Agent": "MyApp/1.0",
    "X-Request-ID": "req-123456"
}

response = requests.get(
    "http://127.0.0.1:8000/api/info",
    headers=headers
)

print(response.json())

# 认证 Header
headers = {
    "X-API-Key": "sk-123456",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}

response = requests.get(
    "http://127.0.0.1:8000/api/protected/data",
    headers=headers
)

print(response.json())
```

### 11.7.4 使用浏览器开发者工具

在浏览器控制台中：
```javascript
// 发送带自定义 Header 的请求
fetch('http://127.0.0.1:8000/api/info', {
    headers: {
        'User-Agent': 'Custom Browser 1.0',
        'X-Custom-Header': 'test-value'
    }
})
.then(response => response.json())
.then(data => console.log(data));
```

## 11.8 Header 的最佳实践

### 11.8.1 命名规范

```python
from typing import Annotated
from fastapi import Header

app = FastAPI()

# ✅ 好的命名规范
@app.get("/api/good")
async def good_headers(
    # 标准 Header
    accept: Annotated[str, Header()],                    # Accept
    content_type: Annotated[str, Header()],             # Content-Type

    # 自定义 Header 使用 X- 前缀
    x_request_id: Annotated[str, Header()],             # X-Request-ID
    x_api_version: Annotated[str, Header()],            # X-API-Version
    x_trace_id: Annotated[str, Header()],               # X-Trace-ID
):
    pass

# ❌ 避免的命名
@app.get("/api/bad")
async def bad_headers(
    # 避免使用标准 Header 名称
    user_agent: Annotated[str, Header()],  # 会导致冲突

    # 避免使用特殊字符
    x_custom$value: Annotated[str, Header()],  # 包含 $
    x_custom@name: Annotated[str, Header()],    # 包含 @
):
    pass
```

### 11.8.2 安全考虑

```python
from typing import Annotated
from fastapi import Header, HTTPException, status
import re

app = FastAPI()

# Header 值验证函数
def validate_token_header(value: str) -> str:
    """验证 Token Header 格式"""
    if not re.match(r'^Bearer\s+[a-zA-Z0-9._-]+$', value):
        raise ValueError("Token 格式无效：应为 'Bearer <token>'")
    return value

def validate_api_key(value: str) -> str:
    """验证 API Key 格式"""
    if not re.match(r'^sk-[a-zA-Z0-9]{32,}$', value):
        raise ValueError("API Key 格式无效：应为 'sk-' + 32位字符")
    return value

@app.get("/api/secure")
async def secure_endpoint(
    # 验证 Authorization Header
    authorization: Annotated[str, Header(
        description="Bearer Token 认证",
        examples=["Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"]
    )],

    # 验证 API Key
    x_api_key: Annotated[str, Header(
        description="API 密钥",
        examples=["sk-1234567890abcdef1234567890abcdef"],
        alias="X-API-Key"
    )]
):
    """
    安全的 Header 处理示例

    展示如何：
    1. 验证 Header 格式
    2. 处理认证信息
    3. 防止注入攻击
    """
    try:
        # 验证 Token 格式
        token = validate_token_header(authorization)

        # 验证 API Key 格式
        api_key = validate_api_key(x_api_key)

        # 提取纯 token 值
        actual_token = token[7:]  # 去掉 "Bearer "

        # 进一步验证（实际项目中查询数据库）
        # ...

        return {
            "message": "认证成功",
            "token_preview": actual_token[:10] + "...",
            "api_key_preview": api_key[:10] + "..."
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
```

### 11.8.3 性能优化

```python
from typing import Annotated, Optional
from fastapi import Header, FastAPI
from functools import lru_cache

app = FastAPI()

# 缓存频繁访问的 Header 值
@lru_cache(maxsize=1000)
def get_client_info(user_agent: str) -> dict:
    """解析 User-Agent 并缓存结果"""
    # 简单的 User-Agent 解析
    if "Chrome" in user_agent:
        browser = "Chrome"
    elif "Firefox" in user_agent:
        browser = "Firefox"
    elif "Safari" in user_agent:
        browser = "Safari"
    else:
        browser = "Unknown"

    if "Windows" in user_agent:
        os = "Windows"
    elif "Mac" in user_agent:
        os = "macOS"
    elif "Linux" in user_agent:
        os = "Linux"
    else:
        os = "Unknown"

    return {"browser": browser, "os": os}

@app.get("/api/optimized")
async def optimized_endpoint(
    # 使用 Optional 避免不必要的处理
    user_agent: Annotated[Optional[str], Header()] = None,

    # 使用缓存解析结果
    x_cache_control: Annotated[Optional[str], Header(
        alias="Cache-Control"
    )] = None
):
    """
    性能优化示例

    优化策略：
    1. 使用 Optional 避免不必要的处理
    2. 缓存频繁解析的结果
    3. 延迟处理非关键信息
    """
    result = {"message": "API 响应"}

    # 只在需要时解析 User-Agent
    if user_agent:
        client_info = get_client_info(user_agent)
        result["client"] = client_info

    # 处理缓存控制
    if x_cache_control and "no-cache" in x_cache_control:
        result["cache_status"] = "bypassed"

    return result
```

## 11.9 Header 的限制和注意事项

### 11.9.1 大小和字符限制
- HTTP Header 名称不区分大小写（但通常首字母大写）
- Header 值通常是 ASCII 字符，特殊字符需要编码
- 某些代理服务器对 Header 名称和长度有限制

### 11.9.2 安全限制
- 不要在 Header 中存储敏感信息（如密码）
- 使用 HTTPS 保护 Header 不被中间人篡改
- 验证所有来自客户端的 Header 值

### 11.9.3 兼容性考虑
- 某些旧系统不支持自定义 Header
- 代理服务器可能修改或删除某些 Header
- 移动网络可能会限制 Header 大小

## 11.10 总结

FastAPI 的 Header 参数处理提供了：

1. **简单的声明方式**：与 Query、Path、Cookie 参数一致
2. **自动名称转换**：Python 风格转 HTTP 格式
3. **多值支持**：自动处理重复 Header
4. **灵活的配置**：支持禁用自动转换、别名等
5. **完整的验证**：支持 Pydantic 的所有验证功能

使用 Header 时要注意：
- Header 名称会自动转换（下划线转连字符）
- 可以接收重复值，转换为列表
- 注意 Header 的安全性和性能影响
- 遵循命名规范和最佳实践

合理使用 Header，可以让你的 API 更加专业和强大！