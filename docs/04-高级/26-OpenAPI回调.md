# OpenAPI 回调 - FastAPI

OpenAPI 回调允许您定义在特定操作完成后触发的出站 HTTP 请求。这对于实现 Webhook 钩子、通知系统等非常有用。

## 什么是回调

回调是一种"出站"请求，即您的应用程序在特定操作完成后向其他系统发送 HTTP 请求。这与常规的"入站"请求相反，后者是客户端向您的应用程序发送请求。

## 定义回调

您可以使用 `APIRouter` 的 `callbacks` 参数或 `@app.callbacks()` 装饰器来定义回调。

### 基本示例

```python
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel
from typing import Optional

app = FastAPI()


class Item(BaseModel):
    title: str
    description: Optional[str] = None


class CallbackEvent(BaseModel):
    event: str
    item_id: int


@app.callbacks.post(
    "{$callback_url}/events/{$request.body#/id}",
    summary="当创建项目时触发回调",
    response_model=CallbackEvent,
)
async def item_created_callback(
    event: CallbackEvent,
    callback_url: str = "http://example.com/callbacks"
):
    """
    这是一个回调定义，当新项目被创建时，外部服务会接收到通知。

    - **event**: 事件类型（如 "created"）
    - **item_id**: 被创建项目的ID
    """
    pass


@app.post("/items/", response_model=Item)
async def create_item(item: Item):
    """
    创建一个新项目。

    这会触发一个回调到之前定义的回调端点。
    """
    # 在实际应用中，这里会保存项目并发送回调
    return item


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="回调示例",
        version="1.0.0",
        description="一个演示 OpenAPI 回调的 API",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
```

### 使用装饰器定义多个回调

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    price: float


class PaymentCallback(BaseModel):
    payment_id: str
    status: str
    amount: float


class ShippingCallback(BaseModel):
    order_id: str
    tracking_number: str
    status: str


# 定义支付成功回调
@app.callbacks.post(
    "{$callback_url}/payments/success",
    summary="支付成功回调",
    response_model=PaymentCallback,
)
async def payment_success_callback(
    callback_data: PaymentCallback,
    callback_url: str = "https://api.example.com/webhooks"
):
    """当支付成功时触发"""
    pass


# 定义发货通知回调
@app.callbacks.post(
    "{$callback_url}/shipping/update",
    summary="发货状态更新回调",
    response_model=ShippingCallback,
)
async def shipping_update_callback(
    callback_data: ShippingCallback,
    callback_url: str = "https://api.example.com/webhooks"
):
    """当发货状态更新时触发"""
    pass


@app.post("/orders/{order_id}/pay")
async def pay_order(order_id: str, amount: float):
    """处理订单支付"""
    return {"status": "success", "order_id": order_id, "amount": amount}


@app.put("/orders/{order_id}/ship")
async def ship_order(order_id: str, tracking_number: str):
    """处理订单发货"""
    return {"status": "shipped", "order_id": order_id, "tracking_number": tracking_number}
```

## 回调 URL 模板

回调 URL 使用 URI 模板语法，允许您引用请求参数和请求体：

### 常用模板变量

- `{$callback_url}`：回调的基础 URL
- `{$request.body#/path}`：请求体中的 JSON 路径
- `{$request.query.param}`：查询参数
- `{$request.header.name}`：请求头

```python
from fastapi import FastAPI, Header, Query
from fastapi.callbacks import APIRoute
from pydantic import BaseModel

app = FastAPI()


class Subscription(BaseModel):
    email: str
    topic: str


@app.callbacks.post(
    "{$callback_url}/subscriptions/{$request.body#/email}",
    summary="订阅确认回调",
)
async def subscription_callback(
    subscription: Subscription,
    callback_url: str = "https://notifications.example.com"
):
    """当用户订阅主题时发送确认"""
    pass


@app.post("/subscribe/")
async def subscribe(
    subscription: Subscription,
    callback_url: str = Query(..., description="回调 URL"),
    user_id: str = Header(..., description="用户 ID"),
):
    """订阅主题"""
    return {
        "status": "subscribed",
        "email": subscription.email,
        "topic": subscription.topic,
        "callback_url": callback_url,
    }
```

## 在 APIRouter 中使用回调

```python
from fastapi import APIRouter, FastAPI
from pydantic import BaseModel

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


class WebhookEvent(BaseModel):
    event_type: str
    data: dict


@router.callbacks.post(
    "{$callback_url}/events",
    summary="通用事件回调",
    response_model=WebhookEvent,
)
async def event_callback(
    event: WebhookEvent,
    callback_url: str = "https://api.example.com/webhooks",
):
    """通用事件回调处理器"""
    pass


@router.post("/register")
async def register_webhook(callback_url: str):
    """注册一个新的 Webhook"""
    return {"status": "registered", "callback_url": callback_url}


app = FastAPI()
app.include_router(router)
```

## 实现回调发送逻辑

以下是一个完整的实现示例，展示如何实际发送回调：

```python
import httpx
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    id: int
    name: str
    price: float


class CallbackEvent(BaseModel):
    event: str
    item_id: int
    timestamp: str


# 存储回调 URL
callback_urls = []


async def send_callback(callback_url: str, event: CallbackEvent):
    """发送回调到指定的 URL"""
    async with httpx.AsyncClient() as client:
        response = await client.post(callback_url, json=event.dict())
        response.raise_for_status()


@app.post("/items/", response_model=Item)
async def create_item(item: Item, background_tasks: BackgroundTasks):
    """创建项目并发送回调"""
    # 在实际应用中，这里会保存到数据库
    # 准备回调事件
    from datetime import datetime
    event = CallbackEvent(
        event="item_created",
        item_id=item.id,
        timestamp=datetime.utcnow().isoformat()
    )

    # 为每个注册的回调 URL 发送回调
    for callback_url in callback_urls:
        background_tasks.add_task(send_callback, callback_url, event)

    return item


@app.post("/callbacks/register")
async def register_callback(callback_url: str):
    """注册新的回调 URL"""
    callback_urls.append(callback_url)
    return {"message": "Callback registered", "url": callback_url}


# 在 OpenAPI 中定义回调
@app.callbacks.post(
    "{$callback_url}",
    summary="项目创建回调",
    response_model=CallbackEvent,
)
async def item_creation_callback(
    event: CallbackEvent,
    callback_url: str,
):
    """
    当新项目创建时触发的事件回调。
    """
    pass
```

## 测试回调

```python
from fastapi.testclient import TestClient
from fastapi import FastAPI
from pydantic import BaseModel
import pytest

app = FastAPI()


class Item(BaseModel):
    id: int
    name: str


class CallbackEvent(BaseModel):
    event: str
    item_id: int


@app.callbacks.post(
    "{$callback_url}/items/{$request.body#/id}",
    summary="项目回调",
    response_model=CallbackEvent,
)
async def item_callback(callback_data: CallbackEvent, callback_url: str):
    """回调定义"""
    pass


@app.post("/items/", response_model=Item)
async def create_item(item: Item):
    """创建项目"""
    return item


def test_callback_in_openapi():
    """测试回调是否正确包含在 OpenAPI 模式中"""
    with TestClient(app) as client:
        response = client.get("/openapi.json")
        assert response.status_code == 200
        openapi_schema = response.json()

        # 检查回调是否定义
        assert "callbacks" in openapi_schema
        assert "item_callback" in openapi_schema["callbacks"]


# 测试回调端点
@pytest.mark.asyncio
async def test_callback_endpoint():
    from fastapi import Request
    from fastapi.testclient import TestClient

    # 模拟回调接收服务器
    callback_app = FastAPI()
    received_callbacks = []

    @callback_app.post("/test/callback/items/123")
    async def receive_callback(callback_data: CallbackEvent):
        received_callbacks.append(callback_data)
        return {"status": "received"}

    # 使用 TestClient 测试
    with TestClient(app) as client:
        response = client.post("/items/", json={"id": 123, "name": "Test Item"})
        assert response.status_code == 200
```

## 安全考虑

### 1. 回调认证

```python
from fastapi import FastAPI, Depends, HTTPException, Header
from pydantic import BaseModel
import hmac
import hashlib

app = FastAPI()


class WebhookEvent(BaseModel):
    event: str
    data: dict


async def verify_webhook_signature(
    x_webhook_signature: str = Header(...),
    x_webhook_timestamp: str = Header(...),
    request_body: bytes = b"",
):
    """验证 webhook 签名"""
    secret = "your-webhook-secret".encode()

    # 创建预期签名
    expected_signature = hmac.new(
        secret,
        x_webhook_timestamp.encode() + request_body,
        hashlib.sha256
    ).hexdigest()

    # 验证签名
    if not hmac.compare_digest(expected_signature, x_webhook_signature):
        raise HTTPException(status_code=403, detail="Invalid webhook signature")

    return True


@app.post("/webhooks/events")
async def receive_webhook(
    event: WebhookEvent,
    verified: bool = Depends(verify_webhook_signature)
):
    """接收 webhook 事件"""
    return {"status": "received", "event": event.event}
```

### 2. 重试机制

```python
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

class CallbackService:
    def __init__(self):
        self.client = httpx.AsyncClient()

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def send_callback_with_retry(self, url: str, data: dict):
        """发送回调，如果失败则重试"""
        response = await self.client.post(url, json=data, timeout=30.0)
        response.raise_for_status()
        return response.json()

    async def close(self):
        await self.client.aclose()


@app.post("/items/{item_id}")
async def update_item(item_id: int, item: dict):
    """更新项目并发送回调"""
    callback_service = CallbackService()
    try:
        # 更新项目逻辑
        updated_item = {"id": item_id, **item}

        # 发送回调
        callback_url = "https://api.example.com/webhooks/item-updated"
        await callback_service.send_callback_with_retry(
            callback_url,
            {
                "event": "item_updated",
                "item_id": item_id,
                "data": updated_item
            }
        )

        return updated_item
    finally:
        await callback_service.close()
```

## 最佳实践

1. **文档化回调**：清晰地记录每个回调的目的、数据格式和触发条件。

2. **版本控制**：在回调 URL 中包含版本号，以便未来升级。

3. **幂等性**：确保回调处理是幂等的，重复执行不会产生副作用。

4. **错误处理**：实现适当的重试机制和错误日志。

5. **安全性**：使用签名验证来确认回调的来源。

6. **监控**：监控回调的成功和失败率。

## 回调与 Webhooks 的区别

- **回调**：通常是一次性的，与特定 API 操作直接相关。
- **Webhooks**：通常是长期订阅，可以接收多种类型的事件通知。

## 更多信息

- [OpenAPI 规范 - 回调](https://swagger.io/specification/#callback-object)
- [Webhooks 最佳实践](https://webhooks.bestpractice/)
- [HTTP 状态码参考](https://httpstatuses.com/)