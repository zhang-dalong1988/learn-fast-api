# SQL（关系型）数据库

__FastAPI__ 不要求你必须使用 SQL（关系型）数据库。但你可以使用 __任何你想用的数据库__。

这里我们来看一个使用 SQLModel 的例子。

__SQLModel__ 构建在 SQLAlchemy 和 Pydantic 之上。它由 __FastAPI__ 的同一作者创建, 是需要使用 __SQL 数据库__ 的 FastAPI 应用的完美搭配。

### 提示

你可以使用任何其他 SQL 或 NoSQL 数据库库（在某些情况下称为 "ORM"）, FastAPI 不会强制你使用任何东西。😎

由于 SQLModel 基于 SQLAlchemy, 你可以轻松使用 SQLAlchemy __支持的任何数据库__（这也意味着 SQLModel 支持）, 比如:

- PostgreSQL
- MySQL
- SQLite
- Oracle
- Microsoft SQL Server, 等等

在这个例子中, 我们将使用 __SQLite__, 因为它使用单个文件并且 Python 内置支持。所以, 你可以直接复制这个例子并运行它。

稍后, 对于生产环境的应用, 你可能想要使用像 __PostgreSQL__ 这样的数据库服务器。

### 提示

有一个官方项目生成器, 包含 __FastAPI__ 和 __PostgreSQL__, 还包括前端和更多工具: https://github.com/fastapi/full-stack-fastapi-template

这是一个非常简短的教程, 如果你想学习数据库的一般知识、SQL 或更高级的功能, 请查看 SQLModel 文档。

## 1. 安装 `SQLModel`

首先, 确保你创建了虚拟环境, 激活它, 然后安装 `sqlmodel`:

```bash
$ pip install sqlmodel
---> 100%
```

## 2. 使用单个模型创建应用

我们首先使用单个 __SQLModel__ 模型创建最简单的应用版本。

稍后我们将在下面通过 __多个模型__ 来提高安全性和通用性。🤓

### 2.1 创建模型

导入 `SQLModel` 并创建数据库模型:

**Python 3.10+**

```python
# 从 typing 模块导入 Annotated, 用于类型注解
from typing import Annotated

# 从 fastapi 导入所需的组件
from fastapi import Depends, FastAPI, HTTPException, Query
# 从 sqlmodel 导入数据库相关组件
from sqlmodel import Field, Session, SQLModel, create_engine, select

# 定义 Hero 类, 继承自 SQLModel, table=True 表示这是一个表模型
class Hero(SQLModel, table=True):
    # id 字段, 可为 None, 默认值为 None, 设为主键
    # 数据库会自动为这个字段生成唯一值
    id: int | None = Field(default=None, primary_key=True)
    # name 字段, 字符串类型, 创建索引以加快查询速度
    name: str = Field(index=True)
    # age 字段, 可为 None, 默认值为 None, 创建索引
    age: int | None = Field(default=None, index=True)
    # secret_name 字段, 字符串类型, 必须提供
    secret_name: str

# 下面的代码省略 👇
```

`Hero` 类与 Pydantic 模型非常相似（实际上, 在底层, 它 _确实是一个 Pydantic 模型_）。

有几个区别:

- `table=True` 告诉 SQLModel 这是一个 _表模型_, 它应该表示 SQL 数据库中的 __表__, 而不仅仅是 _数据模型_（就像任何其他常规 Pydantic 类那样）。
- `Field(primary_key=True)` 告诉 SQLModel `id` 是 SQL 数据库中的 __主键__（你可以在 SQLModel 文档中了解更多关于 SQL 主键的知识）。

  通过将类型声明为 `int | None`, SQLModel 会知道这个列在 SQL 数据库中应该是 `INTEGER`, 并且应该是 `NULLABLE`（可为空）。
- `Field(index=True)` 告诉 SQLModel 应该为此列创建 __SQL 索引__, 这将在按此列过滤读取数据时允许更快的查找。

  SQLModel 会知道声明为 `str` 的东西将是 `TEXT`（或 `VARCHAR`, 取决于数据库）类型的 SQL 列。

### 2.2 创建引擎

SQLModel `engine`（底层实际上是一个 SQLAlchemy `engine`）是 __持有数据库连接__ 的东西。

你应该有 __单个 `engine` 对象__ 用于所有代码连接到同一个数据库。

**Python 3.10+**

```python
# 上面的代码省略 👆

# 定义 SQLite 数据库文件名
sqlite_file_name = "database.db"
# 创建 SQLite 数据库连接 URL
# 格式: sqlite:///文件名
sqlite_url = f"sqlite:///{sqlite_file_name}"

# 设置连接参数
# check_same_thread=False 允许在不同的线程中使用同一个数据库
# 这对于 FastAPI 是必需的, 因为一个请求可能使用多个线程（例如在依赖项中）
connect_args = {"check_same_thread": False}
# 创建数据库引擎
# engine 是管理数据库连接的核心对象
engine = create_engine(sqlite_url, connect_args=connect_args)

# 创建数据库和表的函数
def create_db_and_tables():
    # 使用 SQLModel 的 metadata 创建所有表
    # 这会查找所有 table=True 的模型并创建对应的表
    SQLModel.metadata.create_all(engine)

# 获取数据库会话的依赖函数
def get_session():
    # 使用上下文管理器创建 Session
    # 每个 request 都会获得一个新的 session
    with Session(engine) as session:
        # yield 将 session 传递给依赖它的路径操作函数
        # 函数执行完毕后, session 会自动关闭
        yield session

# 创建 Annotated 类型别名, 简化依赖注入的代码
# SessionDep 表示这是一个 Session 类型的依赖
SessionDep = Annotated[Session, Depends(get_session)]

# 创建 FastAPI 应用实例
app = FastAPI()

# 应用启动时执行的事件处理器
@app.on_event("startup")
def on_startup():
    # 应用启动时创建数据库和表
    create_db_and_tables()

# 下面的代码省略 👇
```

使用 `check_same_thread=False` 允许 FastAPI 在不同的线程中使用同一个 SQLite 数据库。这是必需的, 因为 __单个请求__ 可能使用 __多个线程__（例如在依赖项中）。

别担心, 通过代码的结构方式, 我们稍后会确保每个请求使用 __单个 SQLModel _会话___, 这实际上就是 `check_same_thread` 试图实现的目标。

### 2.3 创建表

然后我们添加一个函数, 使用 `SQLModel.metadata.create_all(engine)` 来为所有 _表模型_ __创建表__。

**Python 3.10+**

```python
# 上面的代码省略 👆

def create_db_and_tables():
    # metadata 包含所有定义的表模型的信息
    # create_all() 会检查表是否存在, 不存在则创建
    # 这样可以安全地多次调用这个函数
    SQLModel.metadata.create_all(engine)

# 下面的代码省略 👇
```

### 2.4 创建会话依赖

__`Session`__ 是 __在内存中存储对象__ 并跟踪数据中所需的任何更改的东西, 然后它 __使用 `engine`__ 与数据库通信。

我们将创建一个带有 `yield` 的 FastAPI __依赖__, 它将为每个请求提供一个新的 `Session`。这就是确保我们每个请求使用单个会话的方法。🤓

然后我们创建一个 `Annotated` 依赖 `SessionDep` 来简化将使用此依赖的其余代码。

**Python 3.10+**

```python
# 上面的代码省略 👆

# 定义一个生成器函数作为依赖
def get_session():
    # 使用 with 语句创建 Session
    # 这确保了 session 在使用后会正确关闭
    with Session(engine) as session:
        # yield 将 session 传递给路径操作函数
        # 在路径操作函数执行完毕后, 代码会继续执行
        # session 会自动关闭并释放资源
        yield session

# 创建类型别名, 简化依赖注入的使用
# Annotated[Session, Depends(get_session)] 告诉 FastAPI:
# 1. 这个参数的类型是 Session
# 2. 使用 get_session 函数来获取这个 Session
SessionDep = Annotated[Session, Depends(get_session)]

# 下面的代码省略 👇
```

### 2.5 在启动时创建数据库表

我们将在应用启动时创建数据库表。

**Python 3.10+**

```python
# 上面的代码省略 👆

# 创建 FastAPI 应用实例
app = FastAPI()

# 注册应用启动时的事件处理器
@app.on_event("startup")
def on_startup():
    # 应用启动时创建所有数据库表
    create_db_and_tables()

# 下面的代码省略 👇
```

对于生产环境, 你可能会使用在启动应用之前运行的迁移脚本。🤓

### 提示

SQLModel 将有包装 Alembic 的迁移工具, 但目前, 你可以直接使用 Alembic。

### 2.6 创建 Hero

因为每个 SQLModel 模型也是 Pydantic 模型, 所以你可以在可以使用的相同 __类型注解__ 中使用它。

例如, 如果你声明一个类型为 `Hero` 的参数, 它将从 __JSON body__ 中读取。

同样, 你可以将它声明为函数的 __返回类型__, 然后数据的形状将显示在自动 API 文档 UI 中。

**Python 3.10+**

```python
# 上面的代码省略 👆

# 定义 POST 端点, 创建新的英雄
@app.post("/heroes/")
def create_hero(hero: Hero, session: SessionDep) -> Hero:
    # 将新的 hero 对象添加到 session
    # 此时还没有写入数据库, 只是在内存中标记为待添加
    session.add(hero)
    # 提交事务, 将更改写入数据库
    # 只有提交后, 数据才会真正保存到数据库
    session.commit()
    # 刷新 hero 对象, 获取数据库生成的值（如自增的 id）
    # commit 后需要刷新才能获取数据库生成的字段值
    session.refresh(hero)
    # 返回创建的 hero 对象
    # FastAPI 会将其转换为 JSON 响应
    return hero

# 下面的代码省略 👇
```

这里我们使用 `SessionDep` 依赖（一个 `Session`）将新的 `Hero` 添加到 `Session` 实例, 将更改提交到数据库, 刷新 `hero` 中的数据, 然后返回它。

### 2.7 读取 Heroes

我们可以使用 `select()` 从数据库中 __读取__ `Hero`。我们可以包含 `limit` 和 `offset` 来分页结果。

**Python 3.10+**

```python
# 上面的代码省略 👆

# 定义 GET 端点, 获取英雄列表
@app.get("/heroes/")
def read_heroes(
    session: SessionDep,  # 注入数据库会话
    offset: int = 0,  # 跳过前面的 offset 条记录
    limit: Annotated[int, Query(le=100)] = 100,  # 最多返回 100 条记录
) -> list[Hero]:
    # 执行查询, 获取所有匹配的 hero 对象
    # select(Hero) 创建查询
    # .offset(offset) 跳过前 offset 条
    # .limit(limit) 限制返回数量
    # .all() 获取所有结果
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    # 返回英雄列表
    return heroes

# 下面的代码省略 👇
```

### 2.8 读取单个 Hero

我们可以 __读取__ 单个 `Hero`。

**Python 3.10+**

```python
# 上面的代码省略 👆

# 定义 GET 端点, 根据 ID 获取单个英雄
@app.get("/heroes/{hero_id}")
def read_hero(hero_id: int, session: SessionDep) -> Hero:
    # 使用 session.get() 根据 ID 获取单个对象
    # 第一个参数是模型类, 第二个是主键值
    hero = session.get(Hero, hero_id)
    # 如果找不到英雄, 抛出 404 异常
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    # 返回找到的英雄
    return hero

# 下面的代码省略 👇
```

### 2.9 删除 Hero

我们也可以 __删除__ 一个 `Hero`。

**Python 3.10+**

```python
# 上面的代码省略 👆

# 定义 DELETE 端点, 删除指定 ID 的英雄
@app.delete("/heroes/{hero_id}")
def delete_hero(hero_id: int, session: SessionDep):
    # 先获取要删除的英雄
    hero = session.get(Hero, hero_id)
    # 如果找不到, 抛出 404 异常
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    # 从 session 中标记为待删除
    session.delete(hero)
    # 提交事务, 执行删除
    session.commit()
    # 返回成功确认
    return {"ok": True}
```

### 2.10 运行应用

你可以运行应用:

```bash
$ fastapi dev main.py

<span style="color: green;">INFO</span>:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

然后转到 `/docs` UI, 你将看到 __FastAPI__ 正在使用这些 __模型__ 来 __文档化__ API, 它也会使用它们来 __序列化__ 和 __验证__ 数据。

![Database API UI](https://fastapi.tiangolo.com/img/tutorial/sql-databases/image01.png)

## 3. 使用多个模型更新应用

现在让我们 __重构__ 这个应用以提高 __安全性__ 和 __通用性__。

如果你检查之前的应用, 在 UI 中你可以看到, 到目前为止, 它允许客户端决定要创建的 `Hero` 的 `id`。😱

我们不应该让这种情况发生, 他们可能会覆盖我们已经在 DB 中分配的 `id`。决定 `id` 应该由 __后端__ 或 __数据库__ 完成, __而不是由客户端__ 完成。

此外, 我们为英雄创建了一个 `secret_name`, 但到目前为止, 我们在任何地方都返回它, 这不是很 __秘密__...😅

我们将通过添加一些 __额外的模型__ 来修复这些问题。这就是 SQLModel 大放异彩的地方。✨

### 3.1 创建多个模型

在 __SQLModel__ 中, 任何具有 `table=True` 的模型类都是 __表模型__。

任何没有 `table=True` 的模型类都是 __数据模型__, 这些实际上只是 Pydantic 模型（有一些小的额外功能）。🤓

使用 SQLModel, 我们可以使用 __继承__ 来 __避免重复__ 所有情况下的所有字段。

#### `HeroBase` - 基类

让我们从 `HeroBase` 模型开始, 它具有所有模型 __共享的字段__:

- `name`
- `age`

**Python 3.10+**

```python
# 上面的代码省略 👆

# 定义基础模型, 包含所有模型共享的字段
# 不设置 table=True, 所以这只是数据模型, 不对应数据库表
class HeroBase(SQLModel):
    # name 字段, 字符串类型, 创建索引以加快查询
    name: str = Field(index=True)
    # age 字段, 可为 None, 默认值为 None, 创建索引
    age: int | None = Field(default=None, index=True)

# 下面的代码省略 👇
```

#### `Hero` - _表模型_

然后让我们创建 `Hero`, 实际的 _表模型_, 带有其他模型中并不总是存在的 __额外字段__:

- `id`
- `secret_name`

因为 `Hero` 继承自 `HeroBase`, 所以它 __也__ 具有 `HeroBase` 中声明的 __字段__, 因此 `Hero` 的所有字段是:

- `id`
- `name`
- `age`
- `secret_name`

**Python 3.10+**

```python
# 上面的代码省略 👆

# 定义基础数据模型
class HeroBase(SQLModel):
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)

# 定义表模型, 继承 HeroBase 并添加额外字段
# table=True 表示这个模型对应数据库中的表
class Hero(HeroBase, table=True):
    # id 字段, 主键, 可为 None（插入时）, 查询时总是有值
    id: int | None = Field(default=None, primary_key=True)
    # secret_name 字段, 存储秘密信息, 不应该返回给客户端
    secret_name: str

# 下面的代码省略 👇
```

#### `HeroPublic` - 公共 _数据模型_

接下来, 我们创建 `HeroPublic` 模型, 这是将 __返回__ 给 API 客户端的模型。

它与 `HeroBase` 具有相同的字段, 因此不包括 `secret_name`。

终于, 我们英雄的身份受到保护了！🥷

它还重新声明了 `id: int`。通过这样做, 我们与 API 客户端建立了 __契约__, 以便他们始终可以期望 `id` 在那里并且是 `int`（它永远不会是 `None`）。

### 提示

让返回模型确保值始终可用且始终是 `int`（而不是 `None`）对于 API 客户端非常有用, 他们可以编写更简单的代码, 具有这种确定性。

此外, __自动生成的客户端__ 将具有更简单的接口, 因此与你的 API 通信的开发人员可以更好地使用你的 API。😎

`HeroPublic` 中的所有字段都与 `HeroBase` 相同, `id` 声明为 `int`（不是 `None`）:

- `id`
- `name`
- `age`

**Python 3.10+**

```python
# 上面的代码省略 👆

class HeroBase(SQLModel):
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)

class Hero(HeroBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    secret_name: str

# 定义公共数据模型, 继承 HeroBase
# 这个模型用于返回给客户端, 不包含 secret_name
class HeroPublic(HeroBase):
    # 重新声明 id 为 int 类型（不可为 None）
    # 这样 API 客户端可以确保返回的对象总是有 id
    id: int

# 下面的代码省略 👇
```

#### `HeroCreate` - 用于创建英雄的 _数据模型_

现在我们创建 `HeroCreate` 模型, 这是将 __验证__ 来自客户端的数据的模型。

它与 `HeroBase` 具有相同的字段, 并且还有 `secret_name`。

现在, 当客户端 __创建新英雄__ 时, 他们将发送 `secret_name`, 它将存储在数据库中, 但这些秘密名称不会在 API 中返回给客户端。

### 提示

这就是你处理 __密码__ 的方法。接收它们, 但不要在 API 中返回它们。

你还应该在存储之前 __哈希__ 密码的值, __永远不要以明文存储它们__。

`HeroCreate` 的字段是:

- `name`
- `age`
- `secret_name`

**Python 3.10+**

```python
# 上面的代码省略 👆

class HeroBase(SQLModel):
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)

class Hero(HeroBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    secret_name: str

class HeroPublic(HeroBase):
    id: int

# 定义创建数据模型, 继承 HeroBase
# 用于验证客户端发送的创建英雄请求数据
class HeroCreate(HeroBase):
    # 添加 secret_name 字段, 创建时需要提供
    secret_name: str

# 下面的代码省略 👇
```

#### `HeroUpdate` - 用于更新英雄的 _数据模型__

在应用的上一个版本中, 我们没有 __更新英雄__ 的方法, 但现在有了 __多个模型__, 我们可以做到这一点。🎉

`HeroUpdate` _数据模型_ 有点特殊, 它具有创建新英雄所需的 __所有相同字段__, 但所有字段都是 __可选的__（它们都有默认值）。这样, 当你更新英雄时, 你可以只发送你想要更新的字段。

因为所有 __字段实际上都改变了__（类型现在包括 `None`, 它们现在有 `None` 的默认值）, 我们需要 __重新声明__ 它们。

我们并不真的需要从 `HeroBase` 继承, 因为我们正在重新声明所有字段。我将让它继承只是为了保持一致性, 但这并不是必需的。这更多是个人品味的问题。🤷

`HeroUpdate` 的字段是:

- `name`
- `age`
- `secret_name`

**Python 3.10+**

```python
# 上面的代码省略 👆

class HeroBase(SQLModel):
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)

class Hero(HeroBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    secret_name: str

class HeroPublic(HeroBase):
    id: int

class HeroCreate(HeroBase):
    secret_name: str

# 定义更新数据模型, 继承 HeroBase
# 用于验证客户端发送的更新英雄请求数据
class HeroUpdate(HeroBase):
    # 所有字段都重新声明为可选的
    # 这样客户端可以只发送需要更新的字段
    name: str | None = None  # name 可选
    age: int | None = None   # age 可选
    secret_name: str | None = None  # secret_name 可选

# 下面的代码省略 👇
```

### 3.2 使用 `HeroCreate` 创建并返回 `HeroPublic`

现在我们有了 __多个模型__, 我们可以更新应用中使用它们的部分。

我们在请求中接收 `HeroCreate` _数据模型_, 并从中创建 `Hero` _表模型_。

这个新的 _表模型_ `Hero` 将具有客户端发送的字段, 并且还将具有数据库生成的 `id`。

然后我们从函数中按原样返回相同的 _表模型_ `Hero`。但由于我们使用 `HeroPublic` _数据模型_ 声明了 `response_model`, __FastAPI__ 将使用 `HeroPublic` 来验证和序列化数据。

**Python 3.10+**

```python
# 上面的代码省略 👆

# 定义 POST 端点, response_model 指定返回数据的模型
@app.post("/heroes/", response_model=HeroPublic)
def create_hero(hero: HeroCreate, session: SessionDep):
    # 使用 HeroCreate 数据创建 Hero 表模型实例
    # model_validate() 会验证数据并转换为新模型
    db_hero = Hero.model_validate(hero)
    # 添加到 session
    session.add(db_hero)
    # 提交到数据库
    session.commit()
    # 刷新以获取生成的 id
    session.refresh(db_hero)
    # 返回 db_hero
    # FastAPI 会使用 response_model=HeroPublic 来过滤输出
    # 只返回 HeroPublic 中定义的字段（不包含 secret_name）
    return db_hero

# 下面的代码省略 👇
```

### 3.3 使用 `HeroPublic` 读取 Heroes

我们可以像以前一样 __读取__ `Hero`, 同样, 我们使用 `response_model=list[HeroPublic]` 来确保数据被正确验证和序列化。

**Python 3.10+**

```python
# 上面的代码省略 👆

# 定义 GET 端点, 返回英雄列表
@app.get("/heroes/", response_model=list[HeroPublic])
def read_heroes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[HeroPublic]:
    # 查询数据库
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    # 返回结果
    # response_model 会确保只返回 HeroPublic 中定义的字段
    return heroes

# 下面的代码省略 👇
```

### 3.4 使用 `HeroPublic` 读取单个 Hero

我们可以 __读取__ 单个英雄。

**Python 3.10+**

```python
# 上面的代码省略 👆

# 定义 GET 端点, 根据 ID 获取单个英雄
@app.get("/heroes/{hero_id}", response_model=HeroPublic)
def read_hero(hero_id: int, session: SessionDep) -> HeroPublic:
    # 根据 ID 查询
    hero = session.get(Hero, hero_id)
    # 如果不存在, 抛出 404
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    # 返回结果
    # response_model 会过滤掉 secret_name
    return hero

# 下面的代码省略 👇
```

### 3.5 使用 `HeroUpdate` 更新英雄

我们可以 __更新英雄__。为此, 我们使用 HTTP `PATCH` 操作。

在代码中, 我们获得一个包含客户端发送的所有数据的 `dict`, __只有客户端发送的数据__, 排除仅因作为默认值而存在的任何值。为此, 我们使用 `exclude_unset=True`。这是主要的技巧。🪄

然后我们使用 `hero_db.sqlmodel_update(hero_data)` 用 `hero_data` 中的数据更新 `hero_db`。

**Python 3.10+**

```python
# 上面的代码省略 👆

# 定义 PATCH 端点, 更新英雄
@app.patch("/heroes/{hero_id}", response_model=HeroPublic)
def update_hero(hero_id: int, hero: HeroUpdate, session: SessionDep):
    # 先获取现有数据
    hero_db = session.get(Hero, hero_id)
    # 如果不存在, 抛出 404
    if not hero_db:
        raise HTTPException(status_code=404, detail="Hero not found")
    # 将 hero 转换为字典, 只包含客户端实际设置的字段
    # exclude_unset=True 排除未设置的字段（使用默认值的字段）
    hero_data = hero.model_dump(exclude_unset=True)
    # 使用 hero_data 更新 hero_db
    # sqlmodel_update 是 SQLModel 提供的方法, 用于更新模型实例
    hero_db.sqlmodel_update(hero_data)
    # 将更新后的对象添加到 session
    session.add(hero_db)
    # 提交更改
    session.commit()
    # 刷新以获取最新数据
    session.refresh(hero_db)
    # 返回更新后的对象
    # response_model 会过滤输出
    return hero_db

# 下面的代码省略 👇
```

### 3.6 再次删除 Hero

__删除__ 英雄基本保持不变。

**Python 3.10+**

```python
# 上面的代码省略 👆

# 定义 DELETE 端点
@app.delete("/heroes/{hero_id}")
def delete_hero(hero_id: int, session: SessionDep):
    # 获取要删除的对象
    hero = session.get(Hero, hero_id)
    # 检查是否存在
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    # 标记为删除
    session.delete(hero)
    # 提交更改
    session.commit()
    # 返回成功确认
    return {"ok": True}
```

### 3.7 再次运行应用

你可以运行应用:

```bash
$ fastapi dev main.py

<span style="color: green;">INFO</span>:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

如果你转到 `/docs` API UI, 你将看到它现在已更新, 并且在创建英雄时期望从客户端接收 `id`, 等等。

![Updated API UI](https://fastapi.tiangolo.com/img/tutorial/sql-databases/image02.png)

## 4. 总结

你可以使用 __SQLModel__ 与 SQL 数据库交互, 并通过 _数据模型_ 和 _表模型_ 简化代码。

你可以在 __SQLModel__ 文档中了解更多知识, 那里有一个更长的关于将 SQLModel 与 __FastAPI__ 一起使用的迷你教程。🚀
