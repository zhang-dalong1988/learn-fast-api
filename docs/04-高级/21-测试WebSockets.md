# 测试 WebSockets - FastAPI

您可以使用 `TestClient` 测试您的 WebSocket。

## 测试 WebSocket

要测试 WebSocket，您可以使用 `TestClient` 中的 `with TestClient(app) as client:`。

在上下文中，您可以使用 `client.websocket_connect()` 方法连接到 WebSocket。

### 基本示例

```python
from fastapi import FastAPI, WebSocket
from fastapi.testclient import TestClient

app = FastAPI()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")


def test_websocket():
    with TestClient(app) as client:
        with client.websocket_connect("/ws") as websocket:
            websocket.send_text("Hello WebSocket")
            data = websocket.receive_text()
            assert data == "Message text was: Hello WebSocket"
```

### 测试带路径参数的 WebSocket

```python
from fastapi import FastAPI, WebSocket
from fastapi.testclient import TestClient

app = FastAPI()


@app.websocket("/ws/{item_id}")
async def websocket_endpoint(websocket: WebSocket, item_id: str):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Item ID: {item_id}, Message: {data}")


def test_websocket_with_path_param():
    with TestClient(app) as client:
        with client.websocket_connect("/ws/123") as websocket:
            websocket.send_text("Test message")
            data = websocket.receive_text()
            assert data == "Item ID: 123, Message: Test message"
```

## 测试 WebSocket 生命周期

您可以测试 WebSocket 的整个生命周期，包括连接、消息交换和断开连接：

```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.testclient import TestClient

app = FastAPI()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        pass


def test_websocket_lifecycle():
    with TestClient(app) as client:
        with client.websocket_connect("/ws") as websocket:
            # 测试多条消息
            for i in range(3):
                message = f"Message {i}"
                websocket.send_text(message)
                data = websocket.receive_text()
                assert data == f"Echo: {message}"
```

## 测试 JSON 消息

您也可以测试发送和接收 JSON 消息：

```python
from fastapi import FastAPI, WebSocket
from fastapi.testclient import TestClient
from pydantic import BaseModel

app = FastAPI()


class Message(BaseModel):
    text: str
    sender: str


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_json()
        response = Message(text=f"Received: {data['text']}", sender="server")
        await websocket.send_json(response.dict())


def test_websocket_json():
    with TestClient(app) as client:
        with client.websocket_connect("/ws") as websocket:
            message = {"text": "Hello JSON", "sender": "client"}
            websocket.send_json(message)
            data = websocket.receive_json()
            assert data == {"text": "Received: Hello JSON", "sender": "server"}
```

## 测试 WebSocket 异常

您可以使用 `pytest.raises` 测试 WebSocket 异常：

```python
import pytest
from fastapi import FastAPI, WebSocket
from fastapi.testclient import TestClient

app = FastAPI()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    data = await websocket.receive_text()
    if data == "error":
        raise ValueError("Test error")
    await websocket.send_text(f"Received: {data}")


def test_websocket_error():
    with TestClient(app) as client:
        with client.websocket_connect("/ws") as websocket:
            websocket.send_text("error")
            # 服务器关闭连接
            with pytest.raises(Exception):
                websocket.receive_text()
```

## 测试 WebSocket 头信息

您可以测试带有特定头信息的 WebSocket 连接：

```python
from fastapi import FastAPI, WebSocket, Header
from fastapi.testclient import TestClient

app = FastAPI()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = Header(...)):
    await websocket.accept()
    if token != "valid-token":
        await websocket.close(code=1008)
        return
    await websocket.send_text("Authenticated")


def test_websocket_with_headers():
    with TestClient(app) as client:
        # 测试有效令牌
        with client.websocket_connect("/ws", headers={"token": "valid-token"}) as websocket:
            data = websocket.receive_text()
            assert data == "Authenticated"

        # 测试无效令牌
        with pytest.raises(Exception):
            with client.websocket_connect("/ws", headers={"token": "invalid-token"}) as websocket:
                websocket.receive_text()
```

## 测试 WebSocket 子协议

您可以测试使用特定子协议的 WebSocket 连接：

```python
from fastapi import FastAPI, WebSocket
from fastapi.testclient import TestClient

app = FastAPI()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept(subprotocols=["soap", "wamp"])
    await websocket.send_text("Connected with subprotocol")


def test_websocket_subprotocol():
    with TestClient(app) as client:
        with client.websocket_connect("/ws", subprotocols=["soap"]) as websocket:
            data = websocket.receive_text()
            assert data == "Connected with subprotocol"
```

## 异步测试 WebSocket

由于 WebSocket 是异步的，您也可以使用异步测试：

```python
import pytest
from fastapi import FastAPI, WebSocket
from fastapi.testclient import TestClient
import asyncio

app = FastAPI()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Async echo: {data}")


@pytest.mark.asyncio
async def test_async_websocket():
    async with TestClient(app) as client:
        async with client.websocket_connect("/ws") as websocket:
            await websocket.send_text("Async message")
            data = await websocket.receive_text()
            assert data == "Async echo: Async message"
```

## 性能测试

您可以进行简单的性能测试：

```python
import time
from fastapi import FastAPI, WebSocket
from fastapi.testclient import TestClient

app = FastAPI()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Echo: {data}")


def test_websocket_performance():
    with TestClient(app) as client:
        with client.websocket_connect("/ws") as websocket:
            start_time = time.time()

            # 发送100条消息并测量响应时间
            for i in range(100):
                websocket.send_text(f"Message {i}")
                websocket.receive_text()

            end_time = time.time()
            duration = end_time - start_time

            # 验证性能（示例：100条消息应在1秒内完成）
            assert duration < 1.0, f"WebSocket performance test failed: {duration}s"
```

## 注意事项

1. **WebSocket 测试是同步的**：即使在异步 FastAPI 应用程序中，`TestClient` 的 WebSocket 测试也是同步的。

2. **上下文管理**：始终使用 `with` 语句来管理 WebSocket 连接，以确保正确清理。

3. **超时处理**：对于可能需要很长时间的操作，考虑设置超时。

4. **隔离测试**：每个测试都应该使用新的 WebSocket 连接，以避免测试之间的状态泄漏。

## 更多信息

有关更多详细信息，请查看 FastAPI 的测试文档。