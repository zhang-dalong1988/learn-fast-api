# GraphQL¶

由于 **FastAPI** 基于 **ASGI** 标准,因此可以非常轻松地集成任何与 ASGI 兼容的 **GraphQL** 库.

您可以在同一个应用程序中将常规的 FastAPI 路径操作与 GraphQL 结合使用.

**提示**

**GraphQL** 解决了一些非常特定的用例.

与常见的 **Web API** 相比,它有 **优点** 和 **缺点**.

请确保评估在您的用例中,**好处** 是否能够补偿 **坏处**.🤓

## GraphQL 库¶

以下是一些支持 **ASGI** 的 **GraphQL** 库.您可以将它们与 **FastAPI** 一起使用:

- Strawberry 🍓
  - 包含 FastAPI 文档
- Ariadne
  - 包含 FastAPI 文档
- Tartiflette
  - 通过 Tartiflette ASGI 提供 ASGI 集成
- Graphene
  - 通过 starlette-graphene3

## 使用 Strawberry 的 GraphQL¶

如果您需要或想要使用 **GraphQL**,**Strawberry** 是**推荐**的库,因为它的设计最接近 **FastAPI** 的设计,全部基于 **类型注解**.

根据您的用例,您可能更喜欢使用不同的库,但如果您问我,我可能建议您尝试 **Strawberry**.

以下是如何将 Strawberry 与 FastAPI 集成的小示例:

```python
# Python 3.8+
import strawberry
from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter

@strawberry.type
class User:
    name: str
    age: int

@strawberry.type
class Query:
    @strawberry.field
    def user(self) -> User:
        return User(name="Patrick", age=100)

schema = strawberry.Schema(query=Query)

graphql_app = GraphQLRouter(schema)

app = FastAPI()
app.include_router(graphql_app, prefix="/graphql")
```

您可以在 Strawberry 文档中了解更多关于 Strawberry 的信息.

还可以查看关于 Strawberry 与 FastAPI 的文档.

## Starlette 中旧版的 `GraphQLApp`¶

Starlette 的早期版本包含一个用于与 Graphene 集成的 `GraphQLApp` 类.

它已在 Starlette 中被弃用,但如果您有使用它的代码,可以轻松**迁移**到 starlette-graphene3,它涵盖了相同的用例并且具有**几乎相同的接口**.

**提示**

如果您需要 GraphQL,我仍然建议您查看 Strawberry,因为它基于类型注解而不是自定义类和类型.

## 了解更多¶

您可以在官方 GraphQL 文档中了解更多关于 **GraphQL** 的信息.

您也可以在它们各自的链接中了解更多关于上述每个库的信息.

本页有帮助吗?

感谢您的反馈!

感谢您的反馈!

返回顶部

上一页

通用 - How To - 实践指南

下一页

自定义请求和 APIRoute 类

FastAPI 商标归 @tiangolo 所有,并在美国和其他地区注册

使用 Material for MkDocs 制作