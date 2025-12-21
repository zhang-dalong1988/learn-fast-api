# Conditional OpenAPI¶

Sometimes you might want to have different OpenAPI schemas depending on certain conditions. For example, you might want to:

- Show only certain endpoints in the documentation based on the user's permissions
- Have different documentation for different environments (development vs production)
- Include or exclude certain endpoints based on configuration

## Using `include_in_schema` Parameter¶

You can control whether an endpoint appears in the OpenAPI schema using the `include_in_schema` parameter:

```python
from fastapi import FastAPI
from typing import Optional

app = FastAPI()

@app.get("/public-endpoint")
async def public_endpoint():
    return {"message": "This is a public endpoint"}

@app.get("/private-endpoint", include_in_schema=False)
async def private_endpoint():
    return {"message": "This endpoint won't appear in the docs"}

@app.get("/conditional-endpoint", include_in_schema=app.debug)
async def conditional_endpoint():
    return {"message": "This endpoint only appears in debug mode"}
```

## Dynamic OpenAPI Schema Generation¶

For more complex conditions, you can override the `openapi` method:

```python
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from typing import Dict, Any

app = FastAPI()

# Your endpoints here
@app.get("/admin/data")
async def admin_data():
    return {"data": "Admin only data"}

@app.get("/user/data")
async def user_data():
    return {"data": "User accessible data"}

def custom_openapi() -> Dict[str, Any]:
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Custom API",
        version="1.0.0",
        description="This is a custom API with conditional schemas",
        routes=app.routes,
    )

    # Remove admin endpoints from the schema
    if not app.debug:  # Only show admin endpoints in debug mode
        paths = openapi_schema.get("paths", {})
        paths_to_remove = [path for path in paths if "admin" in path]
        for path in paths_to_remove:
            del paths[path]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
```

## Using APIRouter with Conditional Documentation¶

You can also use APIRouter to group routes and control their documentation:

```python
from fastapi import FastAPI, APIRouter
import os

app = FastAPI()

# Public routes
public_router = APIRouter()

@public_router.get("/")
async def root():
    return {"message": "Public API"}

# Admin routes
admin_router = APIRouter(prefix="/admin")

@admin_router.get("/users")
async def admin_users():
    return {"users": ["admin1", "admin2"]}

# Conditionally include routers based on environment
app.include_router(public_router)

# Only include admin routes in development or when explicitly enabled
if os.getenv("INCLUDE_ADMIN_ROUTES", "false").lower() == "true":
    app.include_router(admin_router)
```

## Using Dependencies for Conditional Access¶

You can also use dependencies to conditionally control access and documentation:

```python
from fastapi import FastAPI, Depends, HTTPException, Header
from typing import Optional

app = FastAPI()

async def verify_admin(
    x_admin_token: Optional[str] = Header(None)
):
    if x_admin_token != "secret-admin-token":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return True

@app.get("/public")
async def public():
    return {"message": "Public endpoint"}

@app.get("/admin/endpoint", dependencies=[Depends(verify_admin)])
async def admin_endpoint():
    return {"message": "Admin only endpoint"}
```

## Custom Documentation Based on User Roles¶

For more advanced scenarios, you can create different documentation views based on user roles:

```python
from fastapi import FastAPI, Depends, Request
from fastapi.openapi.utils import get_openapi
from typing import Dict, Any

app = FastAPI()

def get_user_role(request: Request) -> str:
    # This would typically come from authentication
    return request.headers.get("X-User-Role", "user")

def create_role_specific_openapi(role: str) -> Dict[str, Any]:
    openapi_schema = get_openapi(
        title=f"API - {role.title()} View",
        version="1.0.0",
        description=f"API documentation for {role} role",
        routes=app.routes,
    )

    # Filter paths based on role
    if role == "user":
        paths = openapi_schema.get("paths", {})
        paths_to_remove = [path for path in paths if "/admin" in path]
        for path in paths_to_remove:
            del paths[path]

    return openapi_schema

@app.get("/docs")
async def get_docs(request: Request, role: str = Depends(get_user_role)):
    if role == "admin":
        return {"message": "Admin documentation"}
    else:
        return {"message": "User documentation"}
```

## Summary

Conditional OpenAPI allows you to:

1. Control endpoint visibility in documentation
2. Create different schemas for different environments
3. Implement role-based documentation
4. Dynamically adjust API documentation based on configuration

These techniques help you create more flexible and context-aware API documentation that matches your application's specific needs.