# Header 参数

## 1. 导入 Header

```python
# 导入 FastAPI 和 Header 类
from fastapi import FastAPI, Header
# 导入 Union 类型
from typing import Union

# 创建应用实例
app = FastAPI()


# 定义 GET 路径操作, 使用 Header 参数
@app.get("/items/")
async def read_items(user_agent: Union[str, None] = Header(None)):
    # user_agent 是 Header 参数, 可选
    # 返回包含 User-Agent 的结果
    return {"User-Agent": user_agent}
```

## 2. 自动转换

FastAPI 会自动将 Header 参数名称从 `user_agent` 转换为 `User-Agent`。

如果你不想要这种自动转换, 可以使用 `convert_underscores=False`:

```python
# 导入 FastAPI 和 Header 类
from fastapi import FastAPI, Header

# 创建应用实例
app = FastAPI()


# 定义 GET 路径操作, 禁用自动下划线转换
@app.get("/items/")
async def read_items(
    strange_header: str | None = Header(None, convert_underscores=False)
):
    # strange_header 不会被自动转换为带连字符的形式
    return {"strange_header": strange_header}
```

## 3. 总结

使用 `Header` 你可以:

* 定义 Header 参数
* 自动转换为带连字符的名称
* 如果需要, 禁用自动转换

以及更多!
