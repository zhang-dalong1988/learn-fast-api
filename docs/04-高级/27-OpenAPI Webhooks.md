# OpenAPI Webhooks - FastAPI

Webhooks 允许外部系统在特定事件发生时向您的 FastAPI 应用程序发送 HTTP 请求.这与回调相反,回调是您的应用程序向外部系统发送请求.

## 什么是 Webhooks

Webhook 是一种"入站"请求,由外部服务在特定事件发生时主动推送给您的应用程序.这对于集成第三方服务非常有用,例如:
- GitHub 推送通知
- Stripe 支付事件
- Slack 交互消息
- 自定义事件通知

## 定义 Webhooks

在 FastAPI 中,您可以通过定义常规的端点来接收 webhook,并在 OpenAPI 文档中声明它们.

### 基本示例

```python
from fastapi import FastAPI, Request, Header, HTTPException, BackgroundTasks
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel
from typing import Optional, Literal
import hmac
import hashlib

app = FastAPI()


class GitHubPushEvent(BaseModel):
    ref: str
    sender: dict
    repository: dict
    commits: list[dict]


@app.post("/webhooks/github")
async def github_webhook(
    event: GitHubPushEvent,
    request: Request,
    x_github_event: str = Header(...),
    x_github_delivery: str = Header(...),
    x_hub_signature_256: Optional[str] = Header(None),
):
    """
    接收 GitHub Webhook 事件

    - **x_github_event**: 事件类型(如 "push", "pull_request")
    - **x_github_delivery**: 事件的唯一标识符
    - **x_hub_signature_256**: HMAC 签名,用于验证请求
    """
    # 验证签名
    webhook_secret = "your-github-webhook-secret"
    if x_hub_signature_256:
        body = await request.body()
        signature = "sha256=" + hmac.new(
            webhook_secret.encode(),
            body,
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(signature, x_hub_signature_256):
            raise HTTPException(status_code=403, detail="Invalid signature")

    # 处理事件
    if x_github_event == "push":
        await handle_push_event(event)
    elif x_github_event == "pull_request":
        await handle_pull_request_event(event)

    return {"status": "received", "delivery": x_github_delivery}


async def handle_push_event(event: GitHubPushEvent):
    """处理 GitHub push 事件"""
    print(f"Received push event on {event['ref']}")
    # 在这里添加您的业务逻辑
    # 例如:触发 CI/CD 流水线、更新数据库等


async def handle_pull_request_event(event: dict):
    """处理 GitHub pull request 事件"""
    print(f"Received pull request event")
    # 在这里添加您的业务逻辑


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Webhooks API",
        version="1.0.0",
        description="接收各种 Webhook 事件的 API",
        routes=app.routes,
    )

    # 添加 webhook 定义到 OpenAPI
    openapi_schema["webhooks"] = {
        "github": {
            "post": {
                "summary": "GitHub Webhook",
                "description": "接收来自 GitHub 的 webhook 事件",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/GitHubPushEvent"}
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "成功接收事件",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string"},
                                        "delivery": {"type": "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
```

## 支付 Webhook 示例(Stripe)

```python
from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import stripe

app = FastAPI()

# 配置 Stripe
stripe.api_key = "sk_test_..."  # 您的 Stripe 密钥
endpoint_secret = "whsec_..."  # 您的 webhook 端点密钥


class StripeEvent(BaseModel):
    id: str
    type: str
    data: dict
    object: str = "event"


class StripeCharge(BaseModel):
    id: str
    amount: int
    currency: str
    status: str


@app.post("/webhooks/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(..., alias="stripe-signature"),
):
    """
    接收 Stripe Webhook 事件

    支持的事件类型:
    - payment_intent.succeeded
    - payment_intent.payment_failed
    - charge.succeeded
    - charge.failed
    """
    body = await request.body()

    try:
        event = stripe.Webhook.construct_event(
            body, stripe_signature, endpoint_secret
        )
    except ValueError:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    # 处理事件
    if event.type == "payment_intent.succeeded":
        payment_intent = event.data.object
        print(f"Payment succeeded: {payment_intent.id}")
        # 更新订单状态等

    elif event.type == "payment_intent.payment_failed":
        payment_intent = event.data.object
        print(f"Payment failed: {payment_intent.id}")
        # 通知用户等

    elif event.type == "charge.succeeded":
        charge = event.data.object
        print(f"Charge succeeded: {charge.id}")
        # 记录支付等

    return JSONResponse({"status": "received"})


# 在 OpenAPI 中定义 webhook
@app.callbacks.post(
    "/webhooks/stripe",
    summary="Stripe 支付 Webhook",
    description="接收来自 Stripe 的支付相关事件",
    tags=["Webhooks"],
)
async def stripe_webhook_definition(
    event: dict,
    stripe_signature: str = Header(...),
):
    """Stripe webhook 定义"""
    pass
```

## Slack Webhook 示例

```python
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from typing import Optional

app = FastAPI()


class SlackEvent(BaseModel):
    type: str
    challenge: Optional[str] = None
    event: Optional[dict] = None
    user_id: Optional[str] = None


class SlackCommand(BaseModel):
    command: str
    text: str
    response_url: str
    user_id: str


# Slack Events API
@app.post("/webhooks/slack/events")
async def slack_events_webhook(event: SlackEvent):
    """
    接收 Slack Events API 的 webhook

    需要处理 URL 验证和实际事件
    """
    # URL 验证
    if event.type == "url_verification" and event.challenge:
        return {"challenge": event.challenge}

    # 处理其他事件
    if event.type == "event_callback" and event.event:
        slack_event = event.event
        if slack_event.get("type") == "message":
            await handle_slack_message(slack_event)

    return {"status": "ok"}


async def handle_slack_message(event: dict):
    """处理 Slack 消息事件"""
    print(f"Received message from user {event.get('user')}: {event.get('text')}")
    # 在这里添加您的业务逻辑


# Slack Slash Commands
@app.post("/webhooks/slack/commands")
async def slack_command_webhook(command: SlackCommand):
    """
    处理 Slack Slash Commands

    例如:/weather <city>
    """
    if command.command == "/weather":
        return handle_weather_command(command)

    return {"text": "Unknown command"}


def handle_weather_command(command: SlackCommand):
    """处理天气命令"""
    city = command.text.strip()
    if not city:
        return {"text": "Please specify a city: /weather <city>"}

    # 模拟获取天气信息
    weather_info = f"The weather in {city} is sunny, 25°C"

    return {
        "response_type": "in_channel",
        "text": weather_info
    }


# Slack Interactive Components
@app.post("/webhooks/slack/interactive")
async def slack_interactive_webhook(request: Request):
    """
    处理 Slack Interactive Components(按钮、选择器等)
    """
    form_data = await request.form()
    payload = form_data.get("payload")

    if payload:
        import json
        action = json.loads(payload)
        # 处理交互
        print(f"Received action: {action}")

    return {"status": "ok"}
```

## 自定义 Webhook 系统

```python
from fastapi import FastAPI, Request, HTTPException, BackgroundTasks, Header
from pydantic import BaseModel, Field
from typing import Dict, Any, List
import uuid
from datetime import datetime
import asyncio

app = FastAPI()


# Webhook 配置数据库(实际使用中应该是真正的数据库)
webhook_subscriptions: Dict[str, Dict] = {}
webhook_events: List[Dict] = []


class WebhookSubscription(BaseModel):
    url: str = Field(..., description="接收事件的 URL")
    events: List[str] = Field(..., description="订阅的事件类型")
    secret: Optional[str] = Field(None, description="用于验证签名的密钥")
    active: bool = Field(True, description="是否激活")


class WebhookEvent(BaseModel):
    event_type: str = Field(..., description="事件类型")
    data: Dict[str, Any] = Field(..., description="事件数据")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))


# 管理 webhook 订阅
@app.post("/webhooks/subscribe")
async def subscribe_webhook(subscription: WebhookSubscription):
    """订阅 webhook 事件"""
    subscription_id = str(uuid.uuid4())
    webhook_subscriptions[subscription_id] = subscription.dict()
    return {"subscription_id": subscription_id, "status": "subscribed"}


@app.delete("/webhooks/unsubscribe/{subscription_id}")
async def unsubscribe_webhook(subscription_id: str):
    """取消订阅 webhook"""
    if subscription_id not in webhook_subscriptions:
        raise HTTPException(status_code=404, detail="Subscription not found")

    del webhook_subscriptions[subscription_id]
    return {"status": "unsubscribed"}


# 触发 webhook 事件
async def trigger_webhook_event(event: WebhookEvent):
    """触发 webhook 事件给所有订阅者"""
    webhook_events.append(event.dict())

    for sub_id, subscription in webhook_subscriptions.items():
        if not subscription["active"]:
            continue

        if event.event_type not in subscription["events"]:
            continue

        # 在后台发送 webhook
        asyncio.create_task(
            send_webhook(
                subscription["url"],
                event,
                subscription.get("secret")
            )
        )


async def send_webhook(url: str, event: WebhookEvent, secret: Optional[str] = None):
    """发送 webhook 到指定的 URL"""
    import httpx

    headers = {
        "Content-Type": "application/json",
        "X-Event-Type": event.event_type,
        "X-Event-ID": event.event_id,
    }

    payload = event.dict()

    # 如果有密钥,添加签名
    if secret:
        import hmac
        import hashlib

        signature = hmac.new(
            secret.encode(),
            str(payload).encode(),
            hashlib.sha256
        ).hexdigest()
        headers["X-Webhook-Signature"] = f"sha256={signature}"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers, timeout=30.0)
            print(f"Webhook sent to {url}: {response.status_code}")
        except Exception as e:
            print(f"Failed to send webhook to {url}: {e}")


# API 端点,用于触发事件
@app.post("/trigger-event")
async def trigger_event(event: WebhookEvent, background_tasks: BackgroundTasks):
    """触发一个 webhook 事件"""
    background_tasks.add_task(trigger_webhook_event, event)
    return {"event_id": event.event_id, "status": "triggered"}


# 查询 webhook 历史和订阅
@app.get("/webhooks/subscriptions")
async def list_subscriptions():
    """列出所有 webhook 订阅"""
    return webhook_subscriptions


@app.get("/webhooks/events")
async def list_events():
    """列出所有 webhook 事件历史"""
    return webhook_events


# 接收 webhook 的端点示例
@app.post("/webhooks/receiver")
async def receive_webhook(
    event: WebhookEvent,
    x_webhook_signature: str = Header(None),
    x_event_type: str = Header(...),
):
    """
    接收 webhook 的示例端点

    - **x_webhook_signature**: 可选的签名头
    - **x_event_type**: 事件类型
    """
    # 验证事件类型
    if x_event_type != event.event_type:
        raise HTTPException(status_code=400, detail="Event type mismatch")

    print(f"Received event: {event.event_type}")
    print(f"Event data: {event.data}")

    return {"status": "received", "event_id": event.event_id}
```

## 测试 Webhooks

```python
from fastapi.testclient import TestClient
import pytest
from unittest.mock import patch, AsyncMock

app = FastAPI()


class WebhookEvent(BaseModel):
    type: str
    data: dict


@app.post("/webhooks/test")
async def test_webhook(event: WebhookEvent):
    """测试 webhook 端点"""
    return {"status": "received", "type": event.type}


def test_webhook_endpoint():
    """测试 webhook 端点"""
    with TestClient(app) as client:
        response = client.post(
            "/webhooks/test",
            json={"type": "test_event", "data": {"key": "value"}}
        )
        assert response.status_code == 200
        assert response.json() == {"status": "received", "type": "test_event"}


@pytest.mark.asyncio
async def test_webhook_signature_verification():
    """测试 webhook 签名验证"""
    from fastapi import FastAPI, Header, HTTPException
    from pydantic import BaseModel
    import hmac
    import hashlib

    app = FastAPI()
    secret = "test-secret"

    class Event(BaseModel):
        data: str

    @app.post("/webhooks/secure")
    async def secure_webhook(
        event: Event,
        x_signature: str = Header(..., alias="x-signature")
    ):
        # 验证签名
        expected = hmac.new(
            secret.encode(),
            event.data.encode(),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(x_signature, expected):
            raise HTTPException(status_code=403, detail="Invalid signature")

        return {"status": "verified"}

    # 测试正确的签名
    data = "test data"
    signature = hmac.new(secret.encode(), data.encode(), hashlib.sha256).hexdigest()

    with TestClient(app) as client:
        response = client.post(
            "/webhooks/secure",
            json={"data": data},
            headers={"x-signature": signature}
        )
        assert response.status_code == 200
        assert response.json() == {"status": "verified"}
```

## 最佳实践

1. **安全性**
   - 使用签名验证 webhook 的来源
   - 验证请求的内容类型
   - 记录所有 webhook 请求用于审计

2. **可靠性**
   - 实现重试机制
   - 使用幂等性设计
   - 记录失败的事件以便重试

3. **性能**
   - 使用后台任务处理 webhook
   - 批量处理相似事件
   - 实现限流机制

4. **监控**
   - 监控 webhook 的成功和失败率
   - 设置警报机制
   - 保留事件历史用于调试

## 更多信息

- [OpenAPI 规范 - Webhooks](https://swagger.io/specification/#webhook-object)
- [GitHub Webhooks 文档](https://developer.github.com/webhooks/)
- [Stripe Webhooks 指南](https://stripe.com/docs/webhooks)
- [Slack API 文档](https://api.slack.com/webhooks)