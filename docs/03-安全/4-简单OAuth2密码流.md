# 简单 OAuth2 密码流

现在让我们看看如何使用 OAuth2 密码流来实现安全认证.

我们将使用 FastAPI 提供的安全工具来处理认证和授权.

## OAuth2PasswordRequestForm

FastAPI 提供了一个实用工具类 `OAuth2PasswordRequestForm`,用于处理 OAuth2 密码流中的表单数据.

```python
from fastapi.security import OAuth2PasswordRequestForm

@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    # ...
```

`OAuth2PasswordRequestForm` 包含以下字段:

- `username`:字符串
- `password`:字符串
- `scope`:字符串,默认为空字符串
- `client_id`:可选字符串
- `client_secret`:可选字符串

## 完整示例

这是一个完整的示例,展示了如何实现 OAuth2 密码流:

```python
from datetime import datetime, timedelta
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    }
}

app = FastAPI()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

class UserInDB(User):
    hashed_password: str


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
```

## 它是如何工作的

### 1. 获取令牌

用户发送一个 POST 请求到 `/token` 端点,表单数据包含:

- `username=johndoe`
- `password=secret`

`OAuth2PasswordRequestForm` 会自动从请求体中提取这些数据.

### 2. 验证用户

`authenticate_user` 函数:

- 从数据库中获取用户
- 验证密码是否正确
- 如果验证成功,返回用户对象
- 如果验证失败,返回 False

### 3. 创建访问令牌

如果用户验证成功,我们创建一个访问令牌:

```python
access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
access_token = create_access_token(
    data={"sub": user.username}, expires_delta=access_token_expires
)
```

### 4. 返回令牌

返回包含访问令牌和令牌类型的响应:

```python
return {"access_token": access_token, "token_type": "bearer"}
```

## 使用令牌

现在客户端可以使用这个令牌来访问受保护的端点.客户端需要在请求头中包含:

```
Authorization: Bearer <access_token>
```

## OAuth2PasswordRequestForm 的特性

### 表单数据

`OAuth2PasswordRequestForm` 期望表单数据而不是 JSON.这意味着:

- Content-Type 必须是 `application/x-www-form-urlencoded`
- 数据应该像 HTML 表单一样发送

这在 OAuth2 规范中是必需的.

### 范围(Scope)

`OAuth2PasswordRequestForm` 还支持 `scope` 字段,这是一个用空格分隔的字符串列表.

例如,如果你发送:

```
scope=me items:read items:write
```

那么 `form_data.scopes` 将是一个包含 `["me", "items:read", "items:write"]` 的列表.

## 完整的工作示例

让我们添加一些受保护的端点:

```python
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.get("/users/me", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    return current_user
```

## 如何测试它

1. 运行应用程序:
   ```bash
   uvicorn main:app --reload
   ```

2. 访问 http://127.0.0.1:8000/docs

3. 点击 `/token` 端点

4. 点击 "Try it out"

5. 输入用户名和密码:
   - username: `johndoe`
   - password: `secret`

6. 执行请求,你会收到令牌

7. 点击页面顶部的 "Authorize" 按钮

8. 在 "Value" 字段中输入 `Bearer <你的令牌>`

9. 现在你可以访问受保护的端点,如 `/users/me`

## 完整的认证流程

1. 用户使用用户名和密码调用 `/token` 端点
2. 应用程序验证凭据
3. 如果凭据有效,应用程序返回一个访问令牌
4. 客户端存储令牌
5. 对于后续请求,客户端在 `Authorization` 头中包含令牌
6. 应用程序验证令牌,如果有效,处理请求
7. 如果令牌无效,应用程序返回 401 Unauthorized 错误

## 安全注意事项

### 使用 HTTPS

在生产环境中,始终使用 HTTPS 而不是 HTTP.HTTPS 可以加密通信,防止令牌在传输过程中被窃听.

### 令牌过期

令牌应该有过期时间.在我们的示例中,令牌在 30 分钟后过期:

```python
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

### 密码哈希

永远不要以明文形式存储密码.始终使用哈希算法(如 bcrypt)来存储密码:

```python
hashed_password = get_password_hash(password)
```

### 密钥安全

`SECRET_KEY` 应该是强随机值,并且应该保密.不要在代码中硬编码它,而是使用环境变量或密钥管理服务.

```python
import os
SECRET_KEY = os.getenv("SECRET_KEY")
```

## 总结

我们实现了:

- OAuth2 密码流认证
- 使用 `OAuth2PasswordRequestForm` 处理登录表单
- 生成和验证 JWT 令牌
- 保护端点,只允许认证用户访问
- 在响应中不包含敏感信息

在下一节中,我们将看到如何进一步改进这个实现,包括添加更多的安全特性.