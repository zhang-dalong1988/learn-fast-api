# SQL (Relational) Databases

__FastAPI__ doesn't require you to use a SQL (relational) database. But you can use __any database__ that you want.

Here we'll see an example using SQLModel.

__SQLModel__ is built on top of SQLAlchemy and Pydantic. It was made by the same author of __FastAPI__ to be the perfect match for FastAPI applications that need to use __SQL databases__.

Tip

You could use any other SQL or NoSQL database library you want (in some cases called "ORMs"), FastAPI doesn't force you to use anything. 😎

As SQLModel is based on SQLAlchemy, you can easily use __any database supported__ by SQLAlchemy (which makes them also supported by SQLModel), like:

- PostgreSQL
- MySQL
- SQLite
- Oracle
- Microsoft SQL Server, etc.

In this example, we'll use __SQLite__, because it uses a single file and Python has integrated support. So, you can copy this example and run it as is.

Later, for your production application, you might want to use a database server like __PostgreSQL__.

Tip

There is an official project generator with __FastAPI__ and __PostgreSQL__ including a frontend and more tools: https://github.com/fastapi/full-stack-fastapi-template

This is a very simple and short tutorial, if you want to learn about databases in general, about SQL, or more advanced features, go to the SQLModel docs.

## Install `SQLModel`

First, make sure you create your virtual environment, activate it, and then install `sqlmodel`:

```bash
$ pip install sqlmodel
---> 100%
```

## Create the App with a Single Model

We'll create the simplest first version of the app with a single __SQLModel__ model first.

Later we'll improve it increasing security and versatility with __multiple models__ below. 🤓

### Create Models

Import `SQLModel` and create a database model:

**Python 3.10+**

```python
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select

class Hero(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)
    secret_name: str

# Code below omitted 👇
```

The `Hero` class is very similar to a Pydantic model (in fact, underneath, it actually _is a Pydantic model_).

There are a few differences:

- `table=True` tells SQLModel that this is a _table model_, it should represent a __table__ in the SQL database, it's not just a _data model_ (as would be any other regular Pydantic class).
- `Field(primary_key=True)` tells SQLModel that the `id` is the __primary key__ in the SQL database (you can learn more about SQL primary keys in the SQLModel docs).

  By having the type as `int | None`, SQLModel will know that this column should be an `INTEGER` in the SQL database and that it should be `NULLABLE`.
- `Field(index=True)` tells SQLModel that it should create a __SQL index__ for this column, that would allow faster lookups in the database when reading data filtered by this column.

  SQLModel will know that something declared as `str` will be a SQL column of type `TEXT` (or `VARCHAR`, depending on the database).

### Create an Engine

A SQLModel `engine` (underneath it's actually a SQLAlchemy `engine`) is what __holds the connections__ to the database.

You would have __one single `engine` object__ for all your code to connect to the same database.

**Python 3.10+**

```python
# Code above omitted 👆

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Code below omitted 👇
```

Using `check_same_thread=False` allows FastAPI to use the same SQLite database in different threads. This is necessary as __one single request__ could use __more than one thread__ (for example in dependencies).

Don't worry, with the way the code is structured, we'll make sure we use __a single SQLModel _session_ per request__ later, this is actually what the `check_same_thread` is trying to achieve.

### Create the Tables

We then add a function that uses `SQLModel.metadata.create_all(engine)` to __create the tables__ for all the _table models_.

**Python 3.10+**

```python
# Code above omitted 👆

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Code below omitted 👇
```

### Create a Session Dependency

A __`Session`__ is what stores the __objects in memory__ and keeps track of any changes needed in the data, then it __uses the `engine`__ to communicate with the database.

We will create a FastAPI __dependency__ with `yield` that will provide a new `Session` for each request. This is what ensures that we use a single session per request. 🤓

Then we create an `Annotated` dependency `SessionDep` to simplify the rest of the code that will use this dependency.

**Python 3.10+**

```python
# Code above omitted 👆

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

# Code below omitted 👇
```

### Create Database Tables on Startup

We will create the database tables when the application starts.

**Python 3.10+**

```python
# Code above omitted 👆

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Code below omitted 👇
```

For production you would probably use a migration script that runs before you start your app. 🤓

Tip

SQLModel will have migration utilities wrapping Alembic, but for now, you can use Alembic directly.

### Create a Hero

Because each SQLModel model is also a Pydantic model, you can use it in the same __type annotations__ that you could use Pydantic models.

For example, if you declare a parameter of type `Hero`, it will be read from the __JSON body__.

The same way, you can declare it as the function's __return type__, and then the shape of the data will show up in the automatic API docs UI.

**Python 3.10+**

```python
# Code above omitted 👆

@app.post("/heroes/")
def create_hero(hero: Hero, session: SessionDep) -> Hero:
    session.add(hero)
    session.commit()
    session.refresh(hero)
    return hero

# Code below omitted 👇
```

Here we use the `SessionDep` dependency (a `Session`) to add the new `Hero` to the `Session` instance, commit the changes to the database, refresh the data in the `hero`, and then return it.

### Read Heroes

We can __read__ `Hero`s from the database using a `select()`. We can include a `limit` and `offset` to paginate the results.

**Python 3.10+**

```python
# Code above omitted 👆

@app.get("/heroes/")
def read_heroes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Hero]:
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    return heroes

# Code below omitted 👇
```

### Read One Hero

We can __read__ a single `Hero`.

**Python 3.10+**

```python
# Code above omitted 👆

@app.get("/heroes/{hero_id}")
def read_hero(hero_id: int, session: SessionDep) -> Hero:
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero

# Code below omitted 👇
```

### Delete a Hero

We can also __delete__ a `Hero`.

**Python 3.10+**

```python
# Code above omitted 👆

@app.delete("/heroes/{hero_id}")
def delete_hero(hero_id: int, session: SessionDep):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(hero)
    session.commit()
    return {"ok": True}
```

### Run the App

You can run the app:

```bash
$ fastapi dev main.py

<span style="color: green;">INFO</span>:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

Then go to the `/docs` UI, you will see that __FastAPI__ is using these __models__ to __document__ the API, and it will use them to __serialize__ and __validate__ the data too.

![Database API UI](https://fastapi.tiangolo.com/img/tutorial/sql-databases/image01.png)

## Update the App with Multiple Models

Now let's __refactor__ this app a bit to increase __security__ and __versatility__.

If you check the previous app, in the UI you can see that, up to now, it lets the client decide the `id` of the `Hero` to create. 😱

We shouldn't let that happen, they could overwrite an `id` we already have assigned in the DB. Deciding the `id` should be done by the __backend__ or the __database__, __not by the client__.

Additionally, we create a `secret_name` for the hero, but so far, we are returning it everywhere, that's not very __secret__... 😅

We'll fix these things by adding a few __extra models__. Here's where SQLModel will shine. ✨

### Create Multiple Models

In __SQLModel__, any model class that has `table=True` is a __table model__.

And any model class that doesn't have `table=True` is a __data model__, these ones are actually just Pydantic models (with a couple of small extra features). 🤓

With SQLModel, we can use __inheritance__ to __avoid duplicating__ all the fields in all the cases.

#### `HeroBase` - the base class

Let's start with a `HeroBase` model that has all the __fields that are shared__ by all the models:

- `name`
- `age`

**Python 3.10+**

```python
# Code above omitted 👆

class HeroBase(SQLModel):
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)

# Code below omitted 👇
```

#### `Hero` - the _table model_

Then let's create `Hero`, the actual _table model_, with the __extra fields__ that are not always in the other models:

- `id`
- `secret_name`

Because `Hero` inherits form `HeroBase`, it __also__ has the __fields__ declared in `HeroBase`, so all the fields for `Hero` are:

- `id`
- `name`
- `age`
- `secret_name`

**Python 3.10+**

```python
# Code above omitted 👆

class HeroBase(SQLModel):
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)

class Hero(HeroBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    secret_name: str

# Code below omitted 👇
```

#### `HeroPublic` - the public _data model_

Next, we create a `HeroPublic` model, this is the one that will be __returned__ to the clients of the API.

It has the same fields as `HeroBase`, so it won't include `secret_name`.

Finally, the identity of our heroes is protected! 🥷

It also re-declares `id: int`. By doing this, we are making a __contract__ with the API clients, so that they can always expect the `id` to be there and to be an `int` (it will never be `None`).

Tip

Having the return model ensure that a value is always available and always `int` (not `None`) is very useful for the API clients, they can write much simpler code having this certainty.

Also, __automatically generated clients__ will have simpler interfaces, so that the developers communicating with your API can have a much better time working with your API. 😎

All the fields in `HeroPublic` are the same as in `HeroBase`, with `id` declared as `int` (not `None`):

- `id`
- `name`
- `age`

**Python 3.10+**

```python
# Code above omitted 👆

class HeroBase(SQLModel):
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)

class Hero(HeroBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    secret_name: str

class HeroPublic(HeroBase):
    id: int

# Code below omitted 👇
```

#### `HeroCreate` - the _data model_ to create a hero

Now we create a `HeroCreate` model, this is the one that will __validate__ the data from the clients.

It has the same fields as `HeroBase`, and it also has `secret_name`.

Now, when the clients __create a new hero__, they will send the `secret_name`, it will be stored in the database, but those secret names won't be returned in the API to the clients.

Tip

This is how you would handle __passwords__. Receive them, but don't return them in the API.

You would also __hash__ the values of the passwords before storing them, __never store them in plain text__.

The fields of `HeroCreate` are:

- `name`
- `age`
- `secret_name`

**Python 3.10+**

```python
# Code above omitted 👆

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

# Code below omitted 👇
```

#### `HeroUpdate` - the _data model_ to update a hero

We didn't have a way to __update a hero__ in the previous version of the app, but now with __multiple models__, we can do it. 🎉

The `HeroUpdate` _data model_ is somewhat special, it has __all the same fields__ that would be needed to create a new hero, but all the fields are __optional__ (they all have a default value). This way, when you update a hero, you can send just the fields that you want to update.

Because all the __fields actually change__ (the type now includes `None` and they now have a default value of `None`), we need to __re-declare__ them.

We don't really need to inherit from `HeroBase` because we are re-declaring all the fields. I'll leave it inheriting just for consistency, but this is not necessary. It's more a matter of personal taste. 🤷

The fields of `HeroUpdate` are:

- `name`
- `age`
- `secret_name`

**Python 3.10+**

```python
# Code above omitted 👆

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

class HeroUpdate(HeroBase):
    name: str | None = None
    age: int | None = None
    secret_name: str | None = None

# Code below omitted 👇
```

### Create with `HeroCreate` and return a `HeroPublic`

Now that we have __multiple models__, we can update the parts of the app that use them.

We receive in the request a `HeroCreate` _data model_, and from it, we create a `Hero` _table model_.

This new _table model_ `Hero` will have the fields sent by the client, and will also have an `id` generated by the database.

Then we return the same _table model_ `Hero` as is from the function. But as we declare the `response_model` with the `HeroPublic` _data model_, __FastAPI__ will use `HeroPublic` to validate and serialize the data.

**Python 3.10+**

```python
# Code above omitted 👆

@app.post("/heroes/", response_model=HeroPublic)
def create_hero(hero: HeroCreate, session: SessionDep):
    db_hero = Hero.model_validate(hero)
    session.add(db_hero)
    session.commit()
    session.refresh(db_hero)
    return db_hero

# Code below omitted 👇
```

### Read Heroes with `HeroPublic`

We can do the same as before to __read__ `Hero`s, again, we use `response_model=list[HeroPublic]` to ensure that the data is validated and serialized correctly.

**Python 3.10+**

```python
# Code above omitted 👆

@app.get("/heroes/", response_model=list[HeroPublic])
def read_heroes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[HeroPublic]:
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    return heroes

# Code below omitted 👇
```

### Read One Hero with `HeroPublic`

We can __read__ a single hero.

**Python 3.10+**

```python
# Code above omitted 👆

@app.get("/heroes/{hero_id}", response_model=HeroPublic)
def read_hero(hero_id: int, session: SessionDep) -> HeroPublic:
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero

# Code below omitted 👇
```

### Update a Hero with `HeroUpdate`

We can __update a hero__. For this we use an HTTP `PATCH` operation.

And in the code, we get a `dict` with all the data sent by the client, __only the data sent by the client__, excluding any values that would be there just for being the default values. To do it we use `exclude_unset=True`. This is the main trick. 🪄

Then we use `hero_db.sqlmodel_update(hero_data)` to update the `hero_db` with the data from `hero_data`.

**Python 3.10+**

```python
# Code above omitted 👆

@app.patch("/heroes/{hero_id}", response_model=HeroPublic)
def update_hero(hero_id: int, hero: HeroUpdate, session: SessionDep):
    hero_db = session.get(Hero, hero_id)
    if not hero_db:
        raise HTTPException(status_code=404, detail="Hero not found")
    hero_data = hero.model_dump(exclude_unset=True)
    hero_db.sqlmodel_update(hero_data)
    session.add(hero_db)
    session.commit()
    session.refresh(hero_db)
    return hero_db

# Code below omitted 👇
```

### Delete a Hero Again

__Deleting__ a hero stays pretty much the same.

**Python 3.10+**

```python
# Code above omitted 👆

@app.delete("/heroes/{hero_id}")
def delete_hero(hero_id: int, session: SessionDep):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(hero)
    session.commit()
    return {"ok": True}
```

### Run the App Again

You can run the app:

```bash
$ fastapi dev main.py

<span style="color: green;">INFO</span>:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

If you go to the `/docs` API UI, you will see that it is now updated, and it won't expect to receive the `id` from the client when creating a hero, etc.

![Updated API UI](https://fastapi.tiangolo.com/img/tutorial/sql-databases/image02.png)

## Recap

You can use __SQLModel__ to interact with a SQL database and simplify the code with _data models_ and _table models_.

You can learn a lot more at the __SQLModel__ docs, there's a longer mini tutorial on using SQLModel with __FastAPI__. 🚀
