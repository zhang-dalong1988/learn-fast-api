# OAuth2 密码流与 JWT

现在让我们将 OAuth2 密码流与 JWT(JSON Web Tokens)结合,创建一个更完整、更安全的认证系统.

## 什么是 JWT

JWT(JSON Web Token)是一个开放标准(RFC 7519),它定义了一种紧凑的、自包含的方式,用于在各方之间安全地传输信息作为 JSON 对象.

JWT 由三部分组成,用点(.)分隔:

1. **头部(Header)**:包含令牌类型和使用的哈希算法
2. **载荷(Payload)**:包含声明(用户信息和元数据)
3. **签名(Signature)**:用于验证消息未被更改

例如:`xxxxx.yyyyy.zzzzz`

## 安装依赖

首先,确保你安装了必要的依赖:

```bash
pip install "passlib[bcrypt]" python-jose[cryptography] python-multipart
```

## 完整实现

让我们创建一个完整的实现,包括:

- 密码哈希和验证
- JWT 令牌创建和验证
- 用户认证
- 受保护的路由

```python
from datetime import datetime, timedelta
from typing import Annotated, List, Union

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    SecurityScopes,
)
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, ValidationError

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="token",
    scopes={"me": "Read information about the current user.", "items": "Read items."},
)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
    scopes: List[str] = []

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

class UserInDB(User):
    hashed_password: str

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Chains",
        "email": "alicechains@example.com",
        "hashed_password": "$2b$12$gSvqqUPZXP1kqUoMxr368.9x.8xsWbAmdHzfwtTKbdCVBDJgEVqfe",
        "disabled": True,
    },
}

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

async def get_current_user(
    security_scopes: SecurityScopes, token: Annotated[str, Depends(oauth2_scheme)]
):
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_scopes = payload.get("scopes", [])
        token_data = TokenData(scopes=token_scopes, username=username)
    except (JWTError, ValidationError):
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )
    return user

async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

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
        data={"sub": user.username, "scopes": form_data.scopes},
        expires_delta=access_token_expires,
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    return current_user

@app.get("/users/me/items/")
async def read_own_items(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    return [{"item_id": "Foo", "owner": current_user.username}]

@app.get("/status/")
async def read_system_status(current_user: Annotated[User, Depends(get_current_user)]):
    return {"status": "ok"}
```

## 关键改进

### 1. 使用 SecurityScopes 处理权限范围

我们添加了 `SecurityScopes` 来处理不同的权限范围:

```python
async def get_current_user(
    security_scopes: SecurityScopes, token: Annotated[str, Depends(oauth2_scheme)]
):
    # ...
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )
```

### 2. 在令牌中包含权限范围

我们在创建令牌时包含了权限范围:

```python
access_token = create_access_token(
    data={"sub": user.username, "scopes": form_data.scopes},
    expires_delta=access_token_expires,
)
```

### 3. 在路由中声明所需的权限范围

我们可以在路由中声明所需的权限范围:

```python
@app.get("/users/me", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    # 需要默认的权限范围(空)
    return current_user

@app.get("/users/me/items/")
async def read_own_items(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    # 需要默认的权限范围(空)
    return [{"item_id": "Foo", "owner": current_user.username}]

@app.get("/status/")
async def read_system_status(
    current_user: Annotated[User, Security(Scopes(["admin"]), Depends(get_current_user))]
):
    # 需要 admin 权限范围
    return {"status": "ok"}
```

## 如何使用不同的权限范围

### 1. 定义权限范围

在 `OAuth2PasswordBearer` 中定义可用的权限范围:

```python
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="token",
    scopes={
        "me": "Read information about the current user.",
        "items": "Read items.",
        "admin": "Admin access.",
    },
)
```

### 2. 请求特定权限范围的令牌

客户端可以在请求令牌时指定权限范围:

```bash
curl -X POST "http://127.0.0.1:8000/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=johndoe&password=secret&scope=me items"
```

### 3. 在路由中验证权限范围

使用 `Security` 而不是 `Depends` 来指定所需的权限范围:

```python
from fastapi import Security

@app.get("/admin/")
async def read_admin_data(
    current_user: Annotated[User, Security(Scopes(["admin"]), Depends(get_current_user))]
):
    return {"data": "admin data"}
```

## JWT 令牌的内容

让我们看看 JWT 令牌中包含的内容:

### 载荷(Payload)

```json
{
  "sub": "johndoe",
  "scopes": ["me", "items"],
  "exp": 1616390200
}
```

- `sub`:主题(用户标识符)
- `scopes`:权限范围列表
- `exp`:过期时间(Unix 时间戳)

### 头部(Header)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`:使用的算法(HS256)
- `typ`:令牌类型(JWT)

## 测试权限范围

1. 获取带有特定权限范围的令牌:
   ```bash
   curl -X POST "http://127.0.0.1:8000/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=johndoe&password=secret&scope=me items"
   ```

2. 使用返回的令牌访问需要特定权限范围的端点:
   ```bash
   curl -X GET "http://127.0.0.1:8000/users/me/items/" \
        -H "Authorization: Bearer <你的令牌>"
   ```

3. 尝试访问需要更高权限范围的端点(会失败):
   ```bash
   curl -X GET "http://127.0.0.1:8000/admin/" \
        -H "Authorization: Bearer <你的令牌>"
   ```

## 高级特性

### 1. 刷新令牌

在生产环境中,你可能想实现刷新令牌机制,这样用户就不需要频繁登录:

```python
class TokenData(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

@app.post("/refresh", response_model=TokenData)
async def refresh_token(refresh_token: str = Form(...)):
    # 验证刷新令牌
    # 生成新的访问令牌
    # 返回新的令牌对
    pass
```

### 2. 令牌撤销

你可能需要实现令牌撤销机制,以便在用户注销时使令牌无效:

```python
# 使用 Redis 或数据库存储已撤销的令牌
revoked_tokens = set()

@app.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    revoked_tokens.add(token)
    return {"message": "Successfully logged out"}
```

### 3. 令牌黑名单

实现令牌黑名单以防止被盗令牌的使用:

```python
# 在验证令牌时检查黑名单
async def get_current_user(token: str = Depends(oauth2_scheme)):
    if token in revoked_tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked"
        )
    # 其余验证逻辑...
```

## 最佳实践

1. **使用强密钥**:生成强随机密钥并妥善存储
2. **设置合理的过期时间**:不要让令牌长期有效
3. **使用 HTTPS**:始终在生产环境中使用 HTTPS
4. **最小权限原则**:只授予必要的权限范围
5. **定期轮换密钥**:定期更换签名密钥
6. **记录安全事件**:记录失败的认证尝试
7. **实施速率限制**:防止暴力破解攻击

## 总结

我们实现了一个完整的 OAuth2 密码流与 JWT 结合的认证系统,包括:

- JWT 令牌的创建和验证
- 权限范围(Scopes)的支持
- 用户认证和授权
- 受保护的路由
- 权限检查

这个实现提供了企业级应用所需的基本安全特性,你可以根据具体需求进一步扩展和完善它.