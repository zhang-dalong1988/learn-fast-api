from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List

app = FastAPI()


class FilterParams(BaseModel):
    limit: int = 100  # 每页数量, 默认 100
    offset: int = 0  # 跳过的数量, 默认 0
    q: str | None = None  # 搜索关键词
    categories: List[str] = []  # 分类列表


@app.get("/items/")
async def read_items(filter: FilterParams = Query(default={})):
    """获取物品列表, 支持过滤和分页"""
    return filter
