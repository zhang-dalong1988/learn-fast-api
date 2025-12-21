# 包含 WSGI(Flask、Django 等)- FastAPI

FastAPI 运行在 ASGI(Asynchronous Server Gateway Interface)上.有时您可能需要在同一个应用程序中同时运行 ASGI 应用(如 FastAPI)和 WSGI 应用(如 Flask、Django).

## 什么是 ASGI 和 WSGI

- **WSGI**:Python Web 服务器网关接口,是同步的,用于传统的 Python Web 框架如 Flask 和 Django.
- **ASGI**:异步服务器网关接口,是异步的,支持现代异步框架如 FastAPI、Starlette 等.

## 使用 `WSGIMiddleware`

FastAPI 提供了 `WSGIMiddleware` 来包装 WSGI 应用,使其能在 ASGI 服务器上运行.

### 基本示例:包含 Flask 应用

```python
from fastapi import FastAPI
from fastapi.middleware.wsgi import WSGIMiddleware
from flask import Flask, request, jsonify

# 创建 FastAPI 应用
app = FastAPI()

# 创建 Flask 应用(WSGI)
flask_app = Flask(__name__)

@flask_app.route("/flask")
def flask_route():
    return jsonify({"message": "Hello from Flask!", "path": request.path})

@app.get("/fastapi")
def read_root():
    return {"message": "Hello from FastAPI!"}

# 将 Flask 应用挂载到 FastAPI
app.mount("/flask-app", WSGIMiddleware(flask_app))
```

现在您可以访问:
- `/fastapi` - FastAPI 路由
- `/flask-app/flask` - Flask 路由

### 包含 Django 应用

```python
import os
from fastapi import FastAPI
from fastapi.middleware.wsgi import WSGIMiddleware
from django.core.wsgi import get_wsgi_application

# 配置 Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

# 创建 FastAPI 应用
app = FastAPI()

@app.get("/fastapi")
def read_root():
    return {"message": "Hello from FastAPI!"}

# 获取 Django WSGI 应用
django_app = get_wsgi_application()

# 将 Django 应用挂载到 FastAPI
app.mount("/django", WSGIMiddleware(django_app))
```

## 子应用挂载

您也可以使用 `app.mount()` 来挂载完整的 FastAPI 子应用:

```python
from fastapi import FastAPI

# 主应用
app = FastAPI()

# 子应用 1
subapp1 = FastAPI()

@subapp1.get("/items/")
async def read_items():
    return {"items": ["item1", "item2"]}

# 子应用 2
subapp2 = FastAPI()

@subapp2.get("/users/")
async def read_users():
    return {"users": ["user1", "user2"]}

# 挂载子应用
app.mount("/api/v1", subapp1)
app.mount("/api/v2", subapp2)

@app.get("/")
def read_root():
    return {"message": "Main app"}
```

## 混合异步和同步代码

```python
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.wsgi import WSGIMiddleware
from flask import Flask, jsonify
import asyncio
import time

app = FastAPI()

# WSGI 应用(同步)
flask_app = Flask(__name__)

@flask_app.route("/sync-task")
def sync_task():
    # 模拟同步任务
    time.sleep(1)
    return jsonify({"result": "Synchronous task completed"})

# ASGI 应用(异步)
@app.get("/async-task")
async def async_task():
    # 模拟异步任务
    await asyncio.sleep(1)
    return {"result": "Asynchronous task completed"}

# 挂载 Flask 应用
app.mount("/flask", WSGIMiddleware(flask_app))
```

## 处理请求和响应

### WSGI 应用的请求限制

当 WSGI 应用通过 WSGIMiddleware 运行时,有一些限制:

1. 流式请求体不能使用
2. 某些 WSGI 特性可能不完全可用

### 示例:处理表单数据

```python
from fastapi import FastAPI, Request, Form
from fastapi.middleware.wsgi import WSGIMiddleware
from flask import Flask, request as flask_request, render_template_string

app = FastAPI()

# WSGI 应用
flask_app = Flask(__name__)

@flask_app.route("/form", methods=["GET", "POST"])
def form():
    if flask_request.method == "POST":
        name = flask_request.form.get("name")
        return render_template_string("""
            <h1>Hello, {{ name }}!</h1>
            <p>This response is from Flask (WSGI)</p>
        """, name=name)

    return render_template_string("""
        <form method="post">
            <label>Name: <input type="text" name="name"></label>
            <button type="submit">Submit</button>
        </form>
    """)

# ASGI 应用
@app.post("/form-fastapi")
async def form_fastapi(name: str = Form(...)):
    return {
        "message": f"Hello, {name}!",
        "note": "This response is from FastAPI (ASGI)"
    }

app.mount("/flask", WSGIMiddleware(flask_app))
```

## 共享状态和中间件

### 在 ASGI 和 WSGI 应用之间共享数据

```python
from fastapi import FastAPI, Request
from fastapi.middleware.wsgi import WSGIMiddleware
from flask import Flask, g, jsonify
from functools import wraps

app = FastAPI()

# 共享状态
shared_state = {"counter": 0}

# WSGI 应用
flask_app = Flask(__name__)

@flask_app.before_request
def before_flask_request():
    # 在请求处理之前获取共享状态
    g.shared_counter = shared_state["counter"]

@flask_app.route("/counter")
def get_counter():
    return jsonify({
        "counter": g.shared_counter,
        "source": "Flask (WSGI)"
    })

# ASGI 应用
@app.middleware("http")
async def add_shared_state(request: Request, call_next):
    # 增加计数器
    shared_state["counter"] += 1
    response = await call_next(request)
    return response

@app.get("/counter")
def get_fastapi_counter():
    return {
        "counter": shared_state["counter"],
        "source": "FastAPI (ASGI)"
    }

app.mount("/flask", WSGIMiddleware(flask_app))
```

## 性能考虑

### WSGI 中间件的开销

```python
from fastapi import FastAPI
from fastapi.middleware.wsgi import WSGIMiddleware
from flask import Flask, jsonify
import time
import asyncio

app = FastAPI()

# 轻量级 WSGI 应用
flask_app = Flask(__name__)

@flask_app.route("/light")
def light_task():
    return jsonify({"message": "Light task"})

# 重量级 WSGI 应用
@flask_app.route("/heavy")
def heavy_task():
    # 模拟 CPU 密集型任务
    sum(x * x for x in range(1000))
    return jsonify({"message": "Heavy task"})

# ASGI 版本的重任务
@app.get("/heavy-async")
async def heavy_async_task():
    # 异步版本
    await asyncio.sleep(0.1)  # 模拟 I/O 操作
    sum(x * x for x in range(1000))
    return {"message": "Heavy async task"}

app.mount("/flask", WSGIMiddleware(flask_app))

# 用于性能测试的路由
@app.get("/native")
def native_fastapi():
    return {"message": "Native FastAPI"}
```

## 调试和测试

### 测试混合应用

```python
import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from fastapi.middleware.wsgi import WSGIMiddleware
from flask import Flask

app = FastAPI()

# WSGI 应用
flask_app = Flask(__name__)

@flask_app.route("/test")
def flask_test():
    return {"message": "Flask test"}

# ASGI 应用
@app.get("/test")
def fastapi_test():
    return {"message": "FastAPI test"}

app.mount("/flask", WSGIMiddleware(flask_app))

def test_mixed_app():
    with TestClient(app) as client:
        # 测试 FastAPI 路由
        response = client.get("/test")
        assert response.status_code == 200
        assert response.json() == {"message": "FastAPI test"}

        # 测试 Flask 路由
        response = client.get("/flask/test")
        assert response.status_code == 200
        assert response.json() == {"message": "Flask test"}
```

## 部署考虑

### 使用 Uvicorn 部署混合应用

```bash
# 安装依赖
pip install fastapi uvicorn flask

# 运行应用
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Docker 部署示例

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 暴露端口
EXPOSE 8000

# 运行命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 最佳实践

1. **路由设计**
   - 为不同的框架使用不同的路径前缀
   - 保持路由清晰和可预测

2. **性能优化**
   - 将 CPU 密集型任务保留在原生框架中
   - 使用异步处理 I/O 密集型任务

3. **共享资源**
   - 使用数据库或外部缓存共享状态
   - 避免在进程间共享内存状态

4. **错误处理**
   - 在每个框架中实现适当的错误处理
   - 统一日志记录

5. **测试策略**
   - 分别测试每个组件
   - 测试集成点

## 常见用例

1. **逐步迁移**:将旧的 WSGI 应用逐步迁移到 FastAPI
2. **集成遗留系统**:与现有的 WSGI 应用集成
3. **混合架构**:利用不同框架的优势

## 限制和注意事项

1. **功能限制**:某些 WSGI 特性可能不完全可用
2. **性能影响**:WSGI 中间件会带来一些开销
3. **调试复杂性**:调试可能更复杂

## 更多信息

- [ASGI 规范](https://asgi.readthedocs.io/)
- [WSGI 规范](https://peps.python.org/pep-3333/)
- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [Flask 文档](https://flask.palletsprojects.com/)
- [Django 文档](https://docs.djangoproject.com/)