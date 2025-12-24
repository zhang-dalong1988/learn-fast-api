# Path Parameters

You can declare path "parameters" or "variables" with the same syntax used by Python format strings:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/{item_id}")
async def read_item(item_id: str):
    return {"item_id": item_id}
```

The value of the path parameter `item_id` will be passed to your function as the argument `item_id`.

So, if you run this example and go to `http://127.0.0.1:8000/items/foo`, you would see a response like:

```json
{"item_id": "foo"}
```

## Path parameters with types

You can declare the type of a path parameter using standard Python type annotations, using the same syntax as you would for Pydantic models:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
```

In this case, `item_id` is declared to be of type `int`.

**Check**:

Open your browser at `http://127.0.0.1:8000/items/3`.

You will get a response like:

```json
{"item_id": 3}
```

**Check**:

This will provide editor support (error checking, completion, etc), and will convert the value to the specified type.

### Data validation

But what if you go to `http://127.0.0.1:8000/items/foo`?

You will get a nice HTTP error, like:

```json
{
    "detail": [
        {
            "loc": [
                "path",
                "item_id"
            ],
            "msg": "value is not a valid integer",
            "type": "type_error.integer"
        }
    ]
}
```

This is because the path parameter `item_id` was declared with the value `int`.

So, `foo` is not a valid integer.

The same error would appear if you provided a float instead of an int: e.g. `http://127.0.0.1:8000/items/4.2`

Because `4.2` is not a valid integer either.

**Note**: FastAPI will convert the string `"3"` to the integer `3` automatically, for you.

## Order matters

When creating path operations, you might find yourself in situations where you have a fixed path.

Like `/users/me`, let's say that it's to get data about the current user.

And then you can also have a path `/users/{user_id}` to get data about a specific user by some ID.

Because path operations are evaluated in order, you need to make sure that the path for `/users/me` is declared before the path for `/users/{user_id}`:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/users/me")
async def read_user_me():
    return {"user_id": "the current user"}


@app.get("/users/{user_id}")
async def read_user(user_id: str):
    return {"user_id": user_id}
```

Otherwise, the path for `/users/{user_id}` would match also `/users/me`, thinking that it's receiving a parameter `user_id` with the value `"me"`.

## Predefined values

If you have a path operation that receives a path parameter, but you want the possible valid path parameter values to be predefined, you can use a standard Python `Enum`:

### Create an Enum class

Create an Enum class inheriting from `str` and from `enum.Enum`.

Then inherit from `str` for the Enum class as well. By inheriting from `str` the API docs will be able to know that the values must be of type `string` and will be able to render them correctly.

Then declare class attributes with fixed values, those will be the available valid values:

```python
from enum import Enum

from fastapi import FastAPI


class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"


app = FastAPI()


@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    if model_name == ModelName.alexnet:
        return {"model_name": model_name, "message": "Deep Learning FTW!"}

    if model_name.value == "lenet":
        return {"model_name": model_name, "message": "LeCNN all the images"}

    return {"model_name": model_name, "message": "Have some residual connections"}
```

## Path convertor

You can declare path parameters containing paths using a type like `path` (like `str`, `int`, etc):

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file_path": file_path}
```

**Note**: The path parameter `file_path` needs to have the type annotation `str` (or any other type that would be converted to `str`), otherwise it won't work.

**Check**:

With URL: `/files//home/johndoe/myfile.txt`

The path parameter would be: `/home/johndoe/myfile.txt`

The leading `/` would generate a different path, so the URL would be `/files/home/johndoe/myfile.txt`.

If you want the path parameter to contain a path, you can use a star in the type annotation: `file_path: str` won't work but `file_path: str = ...` with a star in the URL path (not yet supported)...

Wait, the example above was wrong, let me correct it.

The actual way is to use a path convertor:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file_path": file_path}
```

The `:path` syntax tells FastAPI that the parameter should match any path.

For example, the URL `/files//home/johndoe/myfile.txt` would have the file_path as `/home/johndoe/myfile.txt`.

## Recap

With path parameters you can:

* Declare the type of path parameters
* Get data validation
* Get data conversion
* Get API documentation with path parameters

And you can:

* Order path operations
* Use predefined values using enums
* Use path convertors
