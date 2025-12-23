---
name: fastapi-fetch-doc
description: 获取 FastAPI 官方文档原始内容
allowed-tools: WebFetch, Write, Read, Edit
---

# FastAPI 文档获取 Skill

## 功能
从 FastAPI 官方文档获取原始英文内容。

## 使用方法
在对话中说 "获取章节X" 或 "fetch chapter X"，其中 X 是章节编号（如 01, 02, 28.1 等）

## 处理流程
1. 根据章节编号判断属于 tutorial 还是 advanced
2. 从内置的章节列表中获取对应的 URL
3. 使用 WebFetch 获取原始文档内容
4. 将原始内容保存到 `docs/原始文档/用户指南/` 或 `docs/原始文档/高级指南/`
5. 使用英文文件名保存（如 01-first-steps.md）

## 章节列表

### Tutorial 部分（01-38）
01. First Steps - https://fastapi.tiangolo.com/tutorial/first-steps/
02. Path Parameters - https://fastapi.tiangolo.com/tutorial/path-params/
03. Query Parameters - https://fastapi.tiangolo.com/tutorial/query-params/
04. Request Body - https://fastapi.tiangolo.com/tutorial/body/
05. Query Parameters and String Validations - https://fastapi.tiangolo.com/tutorial/query-params-str-validations/
06. Path Parameters and Numeric Validations - https://fastapi.tiangolo.com/tutorial/path-params-numeric-validations/
07. Body - Multiple Parameters - https://fastapi.tiangolo.com/tutorial/body-multiple-params/
08. Body - Fields - https://fastapi.tiangolo.com/tutorial/body-fields/
09. Body - Nested Models - https://fastapi.tiangolo.com/tutorial/body-nested-models/
10. Extra Data Types - https://fastapi.tiangolo.com/tutorial/extra-data-types/
11. Cookie Parameters - https://fastapi.tiangolo.com/tutorial/cookie-params/
12. Header Parameters - https://fastapi.tiangolo.com/tutorial/header-params/
13. Response Model - https://fastapi.tiangolo.com/tutorial/response-model/
14. Extra Models - https://fastapi.tiangolo.com/tutorial/extra-models/
15. Response Status Code - https://fastapi.tiangolo.com/tutorial/response-status-code/
16. Form Data - https://fastapi.tiangolo.com/tutorial/request-forms/
17. Request Files - https://fastapi.tiangolo.com/tutorial/request-files/
18. Request Forms and Files - https://fastapi.tiangolo.com/tutorial/request-forms-and-files/
19. Handling Errors - https://fastapi.tiangolo.com/tutorial/handling-errors/
20. Path Operation Configuration - https://fastapi.tiangolo.com/tutorial/path-operation-configuration/
21. JSON Compatible Encoder - https://fastapi.tiangolo.com/tutorial/encoder/
22. Body - Updates - https://fastapi.tiangolo.com/tutorial/body-updates/
23. Dependencies - First Steps - https://fastapi.tiangolo.com/tutorial/dependencies/
24. Dependencies - `yield` Dependencies - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
25. Dependencies - Subdependencies - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-in-path-operation-decorators/
26. Dependencies - Dependencies in Path Operation Decorators - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-in-path-operation-decorators/
27. Dependencies - Global Dependencies - https://fastapi.tiangolo.com/tutorial/dependencies/global-dependencies/
28. Dependencies - Dependencies with `yield` - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
29. Dependencies - Parameterizing Dependencies - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
30. FastAPI Dependencies in `yield` Dependencies - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
31. Dependencies - Cache - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
32. Security - First Steps - https://fastapi.tiangolo.com/tutorial/security/
33. Security - Get Current User - https://fastapi.tiangolo.com/tutorial/security/get-current-user/
34. Security - Simple OAuth2 with Password and Bearer - https://fastapi.tiangolo.com/tutorial/security/simple-oauth2/
35. Security - OAuth2 with Password (and hashing), Bearer with JWT tokens - https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
36. Advanced User Authentication in FastAPI - https://fastapi.tiangolo.com/tutorial/advanced-User-Authentication-in-FastAPI/
37. Middleware - https://fastapi.tiangolo.com/tutorial/middleware/
38. CORS (Cross-Origin Resource Sharing) - https://fastapi.tiangolo.com/tutorial/cors/

### Advanced 部分（01-27）
01. Application Flow - https://fastapi.tiangolo.com/advanced/application-flow/
02. Behind a Proxy - https://fastapi.tiangolo.com/advanced/behind-a-proxy/
03. Templates - https://fastapi.tiangolo.com/advanced/templates/
04. WebSockets - https://fastapi.tiangolo.com/advanced/websockets/
05. WebSockets - Handling Disconnections and Multiple Clients - https://fastapi.tiangolo.com/advanced/websockets/
06. Using the `TestClient` - https://fastapi.tiangolo.com/advanced/testing/
07. Using the `TestClient` - Testing Events with the `TestClient` - https://fastapi.tiangolo.com/advanced/testing-events/
08. Testing Dependencies with Overrides - https://fastapi.tiangolo.com/advanced/testing-dependencies/
09. Async Database - https://fastapi.tiangolo.com/advanced/async-database/
10. Async Tests with HTTPX and AsyncIO - https://fastapi.tiangolo.com/advanced/async-tests/
11. Project Generation - https://fastapi.tiangolo.com/advanced/project-generation/
12. Sub Applications - Mounts - https://fastapi.tiangolo.com/advanced/sub-applications/
13. Background Tasks - https://fastapi.tiangolo.com/advanced/background-tasks/
14. Using `TestClient` to test Background Tasks - https://fastapi.tiangolo.com/advanced/testing-background-tasks/
15. Static Files - https://fastapi.tiangolo.com/advanced/static-files/
16. Custom Response - HTML, Stream, File, others - https://fastapi.tiangolo.com/advanced/custom-response/
17. Custom Response - Streaming Response with `async` generator - https://fastapi.tiangolo.com/advanced/custom-response/
18. Custom Response - Streaming Response with `yield` - https://fastapi.tiangolo.com/advanced/custom-response/
19. Advanced User Authentication in FastAPI - https://fastapi.tiangolo.com/advanced/advanced-user-authentication/
20. GraphQL - https://fastapi.tiangolo.com/advanced/graphql/
21. Using `TestClient` to test GraphQL - https://fastapi.tiangolo.com/advanced/testing-graphql/
22. Applications - `__init__` - https://fastapi.tiangolo.com/advanced/applications/
23. Applications - Redirects, HTTPS, WSGI - https://fastapi.tiangolo.com/advanced/applications/
24. Separating `__init__` from the `FastAPI` Instance - https://fastapi.tiangolo.com/advanced/applications/
25. WSGI Framework - Flask, Django, etc. - https://fastapi.tiangolo.com/advanced/wsgi/
26. SQL (Relational) Databases - https://fastapi.tiangolo.com/tutorial/sql-databases/
27. NoSQL (Non-relational) Databases - https://fastapi.tiangolo.com/advanced/nosql-databases/
