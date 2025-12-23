# Extra Data Types

Up to now, you have been using common data types like `int`, `float`, `str`, `bool`, etc.

But you can also use other more complex data types.

Here are some of the other data types you can use:

* `UUID`: a standard "Universally Unique Identifier", common as ID for records in databases
* `datetime.datetime`: a date and time, like `2015-09-21T12:04:00`
* `datetime.date`: a date, like `2015-09-21`
* `datetime.time`: a time, like `12:04:00`
* `datetime.timedelta`: a duration of time, like `1 day 2 hours`
* `frozenset`: similar to `set`, but immutable
* `bytes`: standard Python `bytes`
* `Decimal`: standard Python `Decimal`
* `Path`: from `pathlib.Path`

## Example

```python
from datetime import datetime, time, timedelta
from typing import Union
from uuid import UUID

from fastapi import Body, FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    start_date: datetime | None = None
    end_date: datetime | None = None
    start_time: time | None = None
    end_time: time | None = None
    repeat_at: time | None = None
    process_after: timedelta | None = None


@app.put("/items/{item_id}")
async def update_item(item_id: UUID, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

## Recap

With these extra data types, FastAPI supports:

* UUIDs
* Dates and times
* Time deltas
* And many other data types

And FastAPI will validate them and convert them to the correct types in the documentation.
