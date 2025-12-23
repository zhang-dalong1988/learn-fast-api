# Cookie 参数

## 1. 导入 Cookie

```python
# 导入 FastAPI 和 Cookie 类
from fastapi import Cookie, FastAPI
# 导入 Union 类型
from typing import Union

# 创建应用实例
app = FastAPI()


# 定义 GET 路径操作, 使用 Cookie 参数
@app.get("/items/")
async def read_items(ads_id: Union[str, None] = Cookie(None)):
    # ads_id 是 Cookie 参数, 可选
    # 返回包含 ads_id 的结果
    return {"ads_id": ads_id}
```

## 2. 定义 Cookie 参数

Cookie 参数的定义方式与查询参数类似:

* 使用类型注解来定义类型
* 你可以使用 `Cookie` 来添加额外的验证和元数据
* 你可以使用 `None` 来使它们成为可选的

## 3. 总结

使用 `Cookie` 你可以:

* 定义 Cookie 参数
* 添加验证和元数据
* 设置默认值

以及更多!
