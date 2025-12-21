# 分离输入和输出的 OpenAPI 模式或否¶

当使用 **Pydantic v2** 时,生成的 OpenAPI 比以前更精确和**正确**.😎

事实上,在某些情况下,它甚至会为同一个 Pydantic 模型在 OpenAPI 中设置**两个 JSON 模式**,用于输入和输出,这取决于它们是否具有**默认值**.

让我们看看这是如何工作的,以及如果需要,如何更改它.

## 输入和输出的 Pydantic 模型¶

假设您有一个带有默认值的 Pydantic 模型,如下所示:

Python 3.10+

```python
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None

# 下面的代码省略 👇
```

👀 完整文件预览

Python 3.10+

```python
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None

app = FastAPI()

@app.post("/items/")
def create_item(item: Item):
    return item

@app.get("/items/")
def read_items() -> list[Item]:
    return [
        Item(
            name="Portal Gun",
            description="Device to travel through the multi-rick-verse",
        ),
        Item(name="Plumbus"),
    ]
```

🤓 其他版本和变体

Python 3.9+Python 3.8+

```python
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: Optional[str] = None

app = FastAPI()

@app.post("/items/")
def create_item(item: Item):
    return item

@app.get("/items/")
def read_items() -> list[Item]:
    return [
        Item(
            name="Portal Gun",
            description="Device to travel through the multi-rick-verse",
        ),
        Item(name="Plumbus"),
    ]
```

```python
from typing import List, Union

from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: Union[str, None] = None

app = FastAPI()

@app.post("/items/")
def create_item(item: Item):
    return item

@app.get("/items/")
def read_items() -> List[Item]:
    return [
        Item(
            name="Portal Gun",
            description="Device to travel through the multi-rick-verse",
        ),
        Item(name="Plumbus"),
    ]
```

### 输入模型¶

如果您将此模型用作输入,如下所示:

Python 3.10+

```python
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None

app = FastAPI()

@app.post("/items/")
def create_item(item: Item):
    return item

# 下面的代码省略 👇
```

👀 完整文件预览

Python 3.10+

```python
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None

app = FastAPI()

@app.post("/items/")
def create_item(item: Item):
    return item

@app.get("/items/")
def read_items() -> list[Item]:
    return [
        Item(
            name="Portal Gun",
            description="Device to travel through the multi-rick-verse",
        ),
        Item(name="Plumbus"),
    ]
```

🤓 其他版本和变体

Python 3.9+Python 3.8+

```python
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: Optional[str] = None

app = FastAPI()

@app.post("/items/")
def create_item(item: Item):
    return item

@app.get("/items/")
def read_items() -> list[Item]:
    return [
        Item(
            name="Portal Gun",
            description="Device to travel through the multi-rick-verse",
        ),
        Item(name="Plumbus"),
    ]
```

```python
from typing import List, Union

from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: Union[str, None] = None

app = FastAPI()

@app.post("/items/")
def create_item(item: Item):
    return item

@app.get("/items/")
def read_items() -> List[Item]:
    return [
        Item(
            name="Portal Gun",
            description="Device to travel through the multi-rick-verse",
        ),
        Item(name="Plumbus"),
    ]
```

...那么 `description` 字段将**不是必需的**.因为它有一个默认值 `None`.

### 文档中的输入模型¶

您可以在文档中确认,`description` 字段没有**红色星号**,它没有被标记为必需:

![在此处插入图片]

### 输出模型¶

但是,如果您将相同的模型用作输出,如下所示:

Python 3.10+

```python
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None

app = FastAPI()

@app.post("/items/")
def create_item(item: Item):
    return item

@app.get("/items/")
def read_items() -> list[Item]:
    return [
        Item(
            name="Portal Gun",
            description="Device to travel through the multi-rick-verse",
        ),
        Item(name="Plumbus"),
    ]
```

🤓 其他版本和变体

Python 3.9+Python 3.8+

```python
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: Optional[str] = None

app = FastAPI()

@app.post("/items/")
def create_item(item: Item):
    return item

@app.get("/items/")
def read_items() -> list[Item]:
    return [
        Item(
            name="Portal Gun",
            description="Device to travel through the multi-rick-verse",
        ),
        Item(name="Plumbus"),
    ]
```

```python
from typing import List, Union

from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: Union[str, None] = None

app = FastAPI()

@app.post("/items/")
def create_item(item: Item):
    return item

@app.get("/items/")
def read_items() -> List[Item]:
    return [
        Item(
            name="Portal Gun",
            description="Device to travel through the multi-rick-verse",
        ),
        Item(name="Plumbus"),
    ]
```

...那么因为 `description` 有默认值,如果您**不返回**该字段的任何内容,它仍然会有那个**默认值**.

### 输出响应数据模型¶

如果您与文档交互并检查响应,即使代码没有在其中一个 `description` 字段中添加任何内容,JSON 响应也包含默认值(`null`):

![在此处插入图片]

这意味着它将**总是有一个值**,只是有时该值可能是 `None`(或者在 JSON 术语中是 `null`).

这意味着,使用您的 API 的客户端不必检查值是否存在,他们可以**假设该字段将始终存在**,只是某些情况下它将具有默认值 `None`.

在 OpenAPI 中描述这一点的方法是将该字段标记为**必需的**,因为它将始终存在.

因此,模型的 JSON 模式可能因用于**输入或输出**而不同:

- 对于**输入**,`description` 将**不是必需的**
- 对于**输出**,它将是**必需的**(并且可能是 `None`,或者在 JSON 术语中是 `null`)

### 文档中的输出模型¶

您也可以在文档中检查输出模型,`name` 和 `description` 都被标记为带有**红色星号**的**必需**:

![在此处插入图片]

### 文档中的输入和输出模型¶

如果您在 OpenAPI 中检查所有可用的模式(JSON 模式),您会看到有两个,一个 `Item-Input` 和一个 `Item-Output`.

对于 `Item-Input`,`description` **不是必需的**,它没有红色星号.

但对于 `Item-Output`,`description` **是必需的**,它有红色星号.

![在此处插入图片]

通过来自 **Pydantic v2** 的这个功能,您的 API 文档更加**精确**,如果您有自动生成的客户端和 SDK,它们也将更加精确,具有更好的**开发者体验**和一致性.🎉

## 不分离模式¶

现在,在某些情况下,您可能希望为输入和输出具有**相同的模式**.

可能主要用例是如果您已经有一些自动生成的客户端代码/SDK,而您还不想更新所有自动生成的客户端代码/SDK,您可能想在某个时候这样做,但现在不想.

在这种情况下,您可以通过参数 `separate_input_output_schemas=False` 在 **FastAPI** 中禁用此功能.

信息

对 `separate_input_output_schemas` 的支持是在 FastAPI `0.102.0` 中添加的.🤓

Python 3.10+

```python
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None

app = FastAPI(separate_input_output_schemas=False)

@app.post("/items/")
def create_item(item: Item):
    return item

@app.get("/items/")
def read_items() -> list[Item]:
    return [
        Item(
            name="Portal Gun",
            description="Device to travel through the multi-rick-verse",
        ),
        Item(name="Plumbus"),
    ]
```

🤓 其他版本和变体

Python 3.9+Python 3.8+

```python
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: Optional[str] = None

app = FastAPI(separate_input_output_schemas=False)

@app.post("/items/")
def create_item(item: Item):
    return item

@app.get("/items/")
def read_items() -> list[Item]:
    return [
        Item(
            name="Portal Gun",
            description="Device to travel through the multi-rick-verse",
        ),
        Item(name="Plumbus"),
    ]
```

```python
from typing import List, Union

from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: Union[str, None] = None

app = FastAPI(separate_input_output_schemas=False)

@app.post("/items/")
def create_item(item: Item):
    return item

@app.get("/items/")
def read_items() -> List[Item]:
    return [
        Item(
            name="Portal Gun",
            description="Device to travel through the multi-rick-verse",
        ),
        Item(name="Plumbus"),
    ]
```

### 文档中的输入和输出模型相同模式¶

现在,模型的输入和输出将有一个单一模式,只有 `Item`,并且它将具有 `description` 为**不是必需的**:

![在此处插入图片]

这与 Pydantic v1 中的行为相同.🤓