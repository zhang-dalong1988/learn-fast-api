# First Steps

## Install FastAPI

First of all, you will need Python 3.7+.

You can install FastAPI with:

```bash
pip install fastapi
```

You will also need an ASGI server, for production such as **Uvicorn**.

```bash
pip install "uvicorn[standard]"
```

## Your first API

Create a file `main.py` with:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```

Or use `async def`:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```

**Note**: If you already know `async def` / `await` you can use them as normal.

## Run it

Run the server with:

```bash
uvicorn main:app --reload
```

You should see an output like:

```text
<font color="#2ECC71">INFO:</font>     Uvicorn running on <b>http://127.0.0.1:8000</b> (Press CTRL+C to quit)
<font color="#2ECC71">INFO:</font>     Started reloader process [12345] using statreload
<font color="#2ECC71">INFO:</font>     Started server process [12345]
<font color="#2ECC71">INFO:</font>     Waiting for application startup.
<font color="#2ECC71">INFO:</font>     Application startup complete.
```

### Check it

Open your browser at http://127.0.0.1:8000/items/5?q=somequery.

You will see the JSON response as:

```json
{"item_id": 5, "q": "somequery"}
```

You already created an API that:

* **Receives** HTTP requests in the paths `/` and `/items/{item_id}`.
* Both paths take `GET` **operations** (also known as HTTP **methods**).
* The path `/items/{item_id}` has a **path parameter** `item_id` that should be an `int`.
* The path `/items/{item_id}` has an optional `str` **query parameter** `q`.

## Interactive API docs

Now go to http://127.0.0.1:8000/docs.

You will see the automatic interactive API documentation (provided by **Swagger UI**):

![Swagger UI](https://fastapi.tiangolo.com/img/index/index-01-swagger-ui02.png)

## Alternative API docs

And now, go to http://127.0.0.1:8000/redoc.

You will see the alternative automatic documentation (provided by **ReDoc**):

![ReDoc](https://fastapi.tiangolo.com/img/index/index-02-redoc.png)

## Example upgrade

Now modify the file `main.py` to receive a body from a `PUT` request.

Declare the body using Pydantic models (standardized with `JSON Schema`).

```python
from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    price: float
    is_offer: bool = None


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}
```

The server should auto-reload (because you added `--reload` to the `uvicorn` command).

## Interactive API docs upgrade

Now go to http://127.0.0.1:8000/docs.

* The interactive API documentation will be updated automatically, including the new body:

![Swagger UI](https://fastapi.tiangolo.com/img/index/index-03-swagger-ui03.png)

* Click on the "Try it out" button, it allows you to fill the parameters and interact with the API directly:

![Swagger UI](https://fastapi.tiangolo.com/img/index/index-04-swagger-ui04.png)

* Click on the "Execute" button, the user interface will communicate with your API, send the parameters, get the results and display them on screen:

![Swagger UI](https://fastapi.tiangolo.com/img/index/index-05-swagger-ui05.png)

## Summary

In summary, you declare once the types of parameters, body, etc. as function parameters.

You do that with standard modern Python type hints.

You do not have to learn a new syntax, the methods or classes of a specific library, etc.

Just standard Python 3.7+.

For example, for an `int`:

```python
item_id: int
```

or a more complex `Item` model:

```python
item: Item
```

And with that single declaration you get:

* Editor support, including:
    * Completion.
    * Type checking.
* Validation of data:
    * Automatic and clear errors when the data is invalid.
* **Standard** JSON Schema for the API documentation (and used for the validation automatically).
* Generated documentation:
    * Interactive API documentation.
    * Alternative documentation for web APIs.
* And based on the single declaration:
    * Code generation for many languages.

**Recap, step by step**:

## Step 1: Import FastAPI

```python
from fastapi import FastAPI
```

`FastAPI` is a Python class that provides all the functionality for your API.

## Step 2: Create a `FastAPI` "instance"

```python
app = FastAPI()
```

This is the object that will be the main point of interaction for your application.

It is called `app` by convention, but you can name it whatever you want.

## Step 3: Create a path operation

#### Code (path operation decorator)

```python
@app.get("/")
def read_root():
    ...
```

* `@app.get("/")` tells FastAPI that the function right below is in charge of handling requests that go to:
    * the path `/`
    * using the **get** <http://method> (HTTP methods are PUT, POST, DELETE, etc.).

**`@something`**:

* This syntax is called a "decorator".
* It puts a "wrapper" on top of the function.
* It takes the function below and does something with it.

In this case, the decorator tells FastAPI that the function below corresponds to the **path** `/` with an **operation** `get`.

This is a **"path operation"**.

**Path**:

* This is the first part after the domain.
* For example, in this URL:
    * `https://example.com/items/foo`
    * the path would be: `/items/foo`

**Operation**:

* This refers to the HTTP **method**.
* One of:
    * `POST`
    * `GET`
    * `PUT`
    * `DELETE`
    * ...and the more exotic ones:
        * `OPTIONS`
        * `HEAD`
        * `PATCH`
        * `TRACE`

In OpenAPI, each of these is called a **"operation"**.

We will call them **"path operations"**.

**Define the path operation function**:

* This is our "path operation function".
    * `def read_root():`
        * `def` is the keyword used in Python to declare a function.
        * `read_root` is the function name.
        * You can use any name you want.
        * The function arguments go inside the parenthesis.
        * Then a colon `:` ends the declaration.
        * This function will be called by FastAPI whenever it receives a request to the URL `"/"` using a `GET` operation.

## Step 4: Return the content

```python
    return {"Hello": "World"}
```

* You can return a `dict`, `list`, singular values as `str`, `int`, etc.
* You can also return Pydantic models (there will be more on this later).
* There are many other objects and models that will be automatically converted to JSON (including ORMs, etc).
* FastAPI will automatically convert this return value to JSON using `json.dumps()` compatible with the standard Python `json` library.

## Step 5: Run the development server

```bash
uvicorn main:app --reload
```

* `main`: the file `main.py` (the Python "module").
* `app`: the object created inside of `main.py` with the line `app = FastAPI()`.
* `--reload`: enable hot-reloading so the server restarts when you make code changes.

This command starts the server:

```text
<font color="#2ECC71">INFO:</font>     Uvicorn running on <b>http://127.0.0.1:8000</b> (Press CTRL+C to quit)
```

## Step 6: Check it

Open your browser at http://127.0.0.1:8000.

You will see the JSON response as:

```json
{"Hello": "World"}
```

## Step 7: The interactive API docs

Now go to http://127.0.0.1:8000/docs.

You will see the automatic interactive API documentation (provided by **Swagger UI**):

![Swagger UI](https://fastapi.tiangolo.com/img/index/index-01-swagger-ui02.png)

## Step 8: The alternative API docs

Now go to http://127.0.0.1:8000/redoc.

You will see the alternative automatic documentation (provided by **ReDoc**):

![ReDoc](https://fastapi.tiangolo.com/img/index/index-02-redoc.png)

## You are done

You already have a working API, that you can use to:

* Interact with it via the interactive documentation: http://127.0.0.1:8000/docs
* Or use the alternative documentation: http://127.0.0.1:8000/redoc
* Or access it from code: http://127.0.0.1:8000/items/5?q=somequery

**Recap**:

* **Step 1**: Import FastAPI.
* **Step 2**: Create a `app` instance.
* **Step 3**: Create a path operation.
* **Step 4**: Define the path operation function (with `def`).
* **Step 5**: Return the content.
* **Step 6**: Run the development server (like Uvicorn).
* **Step 7**: Check the interactive API docs.
* **Step 8**: (Optional) The alternative docs.
* **Step 9**: You are done.

## That's it all folks (for now)

You already saw the basic workflow.

In the next tutorials, you will see how to:

* Use **parameters** (path, query, body, etc).
* Use **data validation**.
* Declare **security** and authentication.
* And more...

But first, let's see the optional sections.
