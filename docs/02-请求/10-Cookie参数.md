# 10. Cookie 参数

Cookie 是 HTTP 协议中用于在客户端存储少量数据的一种机制。在 Web 开发中，Cookie 常用于：
- 用户身份验证（存储 session ID 或 token）
- 用户偏好设置（如语言、主题）
- 购物车信息
- 追踪用户行为（如分析用户访问路径）

FastAPI 提供了简单而强大的方式来处理 Cookie 参数。

## 10.1 Cookie 的基本概念

### 10.1.1 什么是 Cookie？

Cookie 是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。

### 10.1.2 Cookie 的特点
- **大小限制**：通常不超过 4KB
- **存储位置**：保存在客户端浏览器
- **传输方式**：每次 HTTP 请求都会自动携带
- **安全性**：可以被用户查看和修改，不适合存储敏感信息

## 10.2 声明 Cookie 参数

在 FastAPI 中，你可以像声明 `Query` 和 `Path` 参数一样声明 Cookie 参数：

### 10.2.1 基本用法（推荐方式）

```python
from typing import Annotated
from fastapi import Cookie, FastAPI

# 创建 FastAPI 应用实例
app = FastAPI()

@app.get("/user/profile")
async def get_user_profile(
    # 声明 Cookie 参数：从请求中读取 session_id
    session_id: Annotated[str, Cookie(
        description="用户会话标识符",
        examples=["abc123xyz456"]  # 示例值
    )]
):
    """
    获取用户个人资料

    - session_id 是从 Cookie 中读取的必需参数
    - Cookie 的名称就是参数名（session_id）
    """
    return {
        "message": "成功获取用户资料",
        "session_id": session_id,
        # 实际项目中，这里会根据 session_id 查询用户信息
    }
```

### 10.2.2 多个 Cookie 参数

```python
from typing import Annotated
from fastapi import Cookie, FastAPI

app = FastAPI()

@app.get("/dashboard")
async def get_dashboard(
    # 读取多个 Cookie 参数
    user_id: Annotated[str, Cookie(description="用户ID")],
    theme: Annotated[str, Cookie(description="界面主题")] = "light",  # 可选，默认值 light
    lang: Annotated[str, Cookie(description="语言设置")] = "zh-CN",    # 可选，默认值 zh-CN
):
    """
    获取用户仪表盘数据

    展示如何同时读取多个 Cookie：
    - user_id：必需，用户唯一标识
    - theme：可选，界面主题（light/dark）
    - lang：可选，语言设置
    """
    return {
        "user_id": user_id,
        "preferences": {
            "theme": theme,
            "language": lang
        },
        "dashboard_data": "用户仪表盘数据..."
    }
```

### 10.2.3 可选的 Cookie 参数

```python
from typing import Annotated
from fastapi import Cookie, FastAPI

app = FastAPI()

@app.get("/cart/items")
async def get_cart_items(
    # 可选的购物车 Cookie
    cart_token: Annotated[str | None, Cookie(
        description="购物车令牌，用于识别用户的购物车",
        examples=["cart_123456"],
        default=None  # 如果没有提供，则为 None
    )] = None
):
    """
    获取购物车商品

    - cart_token 是可选的 Cookie
    - 如果用户首次访问，cart_token 可能为 None
    """
    if cart_token is None:
        return {
            "message": "购物车为空",
            "items": [],
            "cart_token": None
        }

    # 实际项目中，根据 cart_token 查询购物车内容
    return {
        "cart_token": cart_token,
        "items": ["商品1", "商品2", "商品3"]
    }
```

## 10.3 Cookie 验证和约束

### 10.3.1 添加验证规则

```python
from typing import Annotated
from fastapi import Cookie, FastAPI
from pydantic import constr  # 用于字符串约束

app = FastAPI()

@app.post("/api/analytics")
async def track_analytics(
    # 带验证的 Cookie 参数
    tracking_id: Annotated[
        constr(                     # 使用 Pydantic 的字符串约束
            min_length=10,          # 最小长度 10
            max_length=50,          # 最大长度 50
            pattern=r'^[a-zA-Z0-9_\-]+$'  # 只允许字母、数字、下划线、连字符
        ),
        Cookie(
            description="追踪ID，用于分析用户行为",
            examples=["user_abc123", "tracker_xyz789"]
        )
    ],
    # 可选的版本 Cookie
    version: Annotated[
        str,
        Cookie(
            description="应用版本号",
            regex=r'^\d+\.\d+\.\d+$',  # 版本号格式：x.y.z
            examples=["1.0.0", "2.1.3"]
        )
    ] = "1.0.0"  # 默认版本
):
    """
    记录用户行为分析

    展示如何对 Cookie 参数进行验证：
    - tracking_id 必须符合特定格式
    - version 有默认值和格式验证
    """
    return {
        "tracking_id": tracking_id,
        "version": version,
        "message": "分析数据已记录"
    }
```

### 10.3.2 Cookie 类型限制

**重要提醒**：Cookie 的值只能是字符串类型！这是 HTTP 协议的规定。

```python
# ❌ 错误：Cookie 不能是整数
@app.get("/bad-example")
async def bad_example(
    count: Annotated[int, Cookie()]  # 这会导致错误
):
    pass

# ✅ 正确：Cookie 必须声明为字符串
@app.get("/good-example")
async def good_example(
    count: Annotated[str, Cookie()]
):
    # 在函数内部可以转换为整数
    count_int = int(count) if count.isdigit() else 0
    return {"count": count_int}
```

## 10.4 Python 版本兼容性

### 10.4.1 Python 3.10+（最新语法）

```python
# 使用 | 语法表示可选类型
from typing import Annotated
from fastapi import Cookie

async def example(
    token: str | None = Cookie(default=None)  # Python 3.10+ 语法
):
    pass
```

### 10.4.2 Python 3.9

```python
# 使用 Union 代替 |
from typing import Annotated, Union
from fastapi import Cookie

async def example(
    token: Annotated[Union[str, None], Cookie()] = None
):
    pass
```

### 10.4.3 Python 3.8

```python
# 需要安装 typing_extensions
from typing import Union
from fastapi import Cookie

async def example(
    token: Union[str, None] = Cookie(default=None)
):
    pass
```

## 10.5 实际应用场景

### 10.5.1 用户认证和授权

```python
from typing import Annotated
from fastapi import Cookie, HTTPException, status
import jwt  # 需要安装 PyJWT

app = FastAPI()
SECRET_KEY = "your-secret-key"

@app.get("/protected/profile")
async def get_protected_profile(
    access_token: Annotated[str, Cookie(description="访问令牌")]
):
    """
    需要认证才能访问的接口

    从 Cookie 中读取 JWT token 并验证
    """
    try:
        # 解码 JWT token
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=["HS256"])

        # 提取用户信息
        user_id = payload.get("user_id")

        return {
            "user_id": user_id,
            "email": payload.get("email"),
            "profile_data": "用户的个人资料..."
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token 已过期"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的 Token"
        )
```

### 10.5.2 多语言支持

```python
from typing import Annotated
from fastapi import Cookie

# 支持的语言列表
SUPPORTED_LANGUAGES = ["zh-CN", "en-US", "ja-JP", "ko-KR"]

@app.get("/localized/greeting")
async def get_localized_greeting(
    lang: Annotated[str, Cookie(
        description="用户语言偏好",
        examples=["zh-CN", "en-US"]
    )] = "zh-CN"  # 默认中文
):
    """
    根据用户语言偏好返回本地化问候语
    """
    # 验证语言是否支持
    if lang not in SUPPORTED_LANGUAGES:
        lang = "zh-CN"  # 回退到默认语言

    greetings = {
        "zh-CN": "你好！欢迎使用我们的服务！",
        "en-US": "Hello! Welcome to our service!",
        "ja-JP": "こんにちは！私たちのサービスへようこそ！",
        "ko-KR": "안녕하세요! 우리 서비스에 오신 것을 환영합니다!"
    }

    return {
        "language": lang,
        "greeting": greetings[lang]
    }
```

### 10.5.3 A/B 测试

```python
from typing import Annotated
from fastapi import Cookie
import random

@app.get("/homepage")
async def get_homepage(
    ab_test_group: Annotated[str, Cookie(
        description="A/B 测试分组",
        examples=["A", "B"]
    )] = None
):
    """
    A/B 测试示例

    根据 Cookie 中的分组返回不同的首页内容
    """
    # 如果没有分组，随机分配一个
    if ab_test_group not in ["A", "B"]:
        ab_test_group = random.choice(["A", "B"])

    # 设置响应中包含分组信息（实际项目中需要设置 Cookie）
    from fastapi import Response
    response = Response()
    response.set_cookie(
        key="ab_test_group",
        value=ab_test_group,
        max_age=30 * 24 * 60 * 60,  # 30 天
        httponly=True  # 只能通过 HTTP 访问
    )

    # 根据分组返回不同内容
    if ab_test_group == "A":
        content = {
            "version": "A",
            "title": "新功能上线！限时优惠！",
            "button_color": "blue",
            "layout": "grid"
        }
    else:
        content = {
            "version": "B",
            "title": "简单界面，快速体验",
            "button_color": "green",
            "layout": "list"
        }

    response.body = str(content).encode()
    return response
```

## 10.6 测试 Cookie

### 10.6.1 使用浏览器开发者工具

1. 打开浏览器开发者工具（F12）
2. 在 Console 中设置 Cookie：
```javascript
document.cookie = "session_id=abc123; path=/"
document.cookie = "theme=dark; path=/"
```
3. 刷新页面查看效果

### 10.6.2 使用 curl 测试

```bash
# 基本用法
curl http://127.0.0.1:8000/user/profile \
  -H "Cookie: session_id=abc123xyz456"

# 多个 Cookie
curl http://127.0.0.1:8000/dashboard \
  -H "Cookie: user_id=12345; theme=dark; lang=zh-CN"

# 测试可选 Cookie
curl http://127.0.0.1:8000/cart/items \
  -H "Cookie: cart_token=cart_123456"
```

### 10.6.3 使用 HTTPie 测试

```bash
# HTTPie 提供了更友好的语法
http GET http://127.0.0.1:8000/user/profile \
  Cookie:session_id=abc123xyz456

# 多个 Cookie
http GET http://127.0.0.1:8000/dashboard \
  Cookie:user_id=12345 \
  Cookie:theme=dark \
  Cookie:lang=zh-CN
```

### 10.6.4 使用 Python requests 测试

```python
import requests

# 测试 Cookie 参数
response = requests.get(
    "http://127.0.0.1:8000/dashboard",
    cookies={
        "user_id": "12345",
        "theme": "dark",
        "lang": "zh-CN"
    }
)

print(response.json())
```

## 10.7 Cookie 安全最佳实践

### 10.7.1 安全设置

```python
from fastapi import Response

@app.post("/login")
async def login(username: str, password: str):
    # 验证用户凭证...

    # 创建安全的 Cookie
    response = Response(content="登录成功")
    response.set_cookie(
        key="session_token",
        value="encrypted_token_here",

        # 安全相关设置
        httponly=True,        # 防止 XSS 攻击
        secure=True,          # 只通过 HTTPS 传输
        samesite="strict",    # CSRF 防护

        # 生命周期设置
        max_age=3600,         # 1小时过期
        expires="2024-12-31", # 具体过期时间

        # 访问控制
        path="/",             # Cookie 有效的路径
        domain=".example.com" # Cookie 有效的域名
    )

    return response
```

### 10.7.2 敏感数据处理

```python
from datetime import datetime, timedelta
import secrets  # 用于生成安全的随机字符串

def generate_session_token():
    """生成安全的 session token"""
    return secrets.token_urlsafe(32)  # 生成 32 字节的随机 token

@app.post("/api/create-session")
async def create_session(user_id: str):
    # 创建新的 session
    session_token = generate_session_token()

    # 在数据库中存储 session 信息
    # 这里应该包含创建时间、过期时间等

    # 设置 Cookie
    response = Response()
    response.set_cookie(
        "session_id",
        session_token,
        httponly=True,      # 重要：防止 JavaScript 访问
        secure=True,        # 重要：只通过 HTTPS
        max_age=3600,      # 1小时后过期
        samesite="strict"   # CSRF 防护
    )

    return response
```

## 10.8 Cookie 的限制和注意事项

### 10.8.1 大小和数量限制
- 每个 Cookie 通常不超过 4KB
- 每个域名下 Cookie 数量有限制（通常 50 个左右）
- 浏览器总的 Cookie 数量也有限制

### 10.8.2 性能考虑
- Cookie 会随每个请求发送，影响请求大小
- 不要在 Cookie 中存储大量数据
- 考虑使用服务器端存储（如 Redis）+ Cookie token 的方式

### 10.8.3 隐私合规
- 需要告知用户 Cookie 的使用
- 遵守 GDPR、CCPA 等隐私法规
- 提供拒绝 Cookie 的选项

## 10.9 总结

FastAPI 的 Cookie 参数处理提供了：

1. **简单的声明方式**：与 Query、Path 参数一致
2. **自动类型转换**：字符串到 Python 类型
3. **内置验证**：支持 Pydantic 的所有验证功能
4. **灵活的可选性**：支持必需和可选的 Cookie
5. **良好的文档支持**：自动生成 API 文档

使用 Cookie 时要注意：
- Cookie 只能是字符串类型
- 考虑安全性，使用 httponly、secure 等标志
- 避免在 Cookie 中存储敏感信息
- 注意性能影响，不要过度使用

合理使用 Cookie，可以很好地提升用户体验和应用功能！