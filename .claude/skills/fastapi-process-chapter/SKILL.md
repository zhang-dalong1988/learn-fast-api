---
name: fastapi-process-chapter
description: 一键完成 FastAPI 章节的完整处理流程:获取文档、翻译润色、添加代码注释.自动识别 tutorial 或 advanced 部分.
allowed-tools: WebFetch, Write, Read, Edit, Bash
---

# FastAPI 章节完整处理 Skill

## 功能
一键完成 FastAPI 章节的完整处理流程：获取文档 → 翻译润色 → 添加代码注释 → 保存文件。自动识别属于 Tutorial 还是 Advanced 部分。

## 使用方法
在对话中说 "处理章节X" 或 "process chapter X"，其中 X 是章节编号（如 01, 02, 28.1 等）

## 处理流程
1. 根据章节编号判断属于 Tutorial（01-38）还是 Advanced（01-27）
2. 从内置的章节列表中获取对应的 URL
3. 使用 WebFetch 获取原始英文文档
4. 翻译为中文并润色：
   - 使用半角标点符号（,.?!:;）
   - 在中文与英文/数字/符号之间、以及在半角符号前添加空格
   - 保持代码块不变，但添加中文注释
5. 为文档添加序号（1, 2, 2.1, 2.2 等）
6. 为所有代码块添加详细的中文注释
7. 保存原始文档到 `docs/原始文档/用户指南/` 或 `docs/原始文档/高级指南/`
8. 保存翻译文档到 `docs/中文文档/用户指南/` 或 `docs/中文文档/高级指南/`
9. 使用中文文件名：`{序号}-{中文标题}.md`

## 章节列表

### Tutorial 部分（用户指南 - 01-38）
01. 第一步 (First Steps) - https://fastapi.tiangolo.com/tutorial/first-steps/
02. 路径参数 (Path Parameters) - https://fastapi.tiangolo.com/tutorial/path-params/
03. 查询参数 (Query Parameters) - https://fastapi.tiangolo.com/tutorial/query-params/
04. 请求体 (Request Body) - https://fastapi.tiangolo.com/tutorial/body/
05. 查询参数和字符串验证 (Query Parameters and String Validations) - https://fastapi.tiangolo.com/tutorial/query-params-str-validations/
06. 路径参数和数值验证 (Path Parameters and Numeric Validations) - https://fastapi.tiangolo.com/tutorial/path-params-numeric-validations/
07. 请求体 - 多个参数 (Body - Multiple Parameters) - https://fastapi.tiangolo.com/tutorial/body-multiple-params/
08. 请求体 - 字段 (Body - Fields) - https://fastapi.tiangolo.com/tutorial/body-fields/
09. 请求体 - 嵌套模型 (Body - Nested Models) - https://fastapi.tiangolo.com/tutorial/body-nested-models/
10. 额外数据类型 (Extra Data Types) - https://fastapi.tiangolo.com/tutorial/extra-data-types/
11. Cookie 参数 (Cookie Parameters) - https://fastapi.tiangolo.com/tutorial/cookie-params/
12. Header 参数 (Header Parameters) - https://fastapi.tiangolo.com/tutorial/header-params/
13. 响应模型 (Response Model) - https://fastapi.tiangolo.com/tutorial/response-model/
14. 额外模型 (Extra Models) - https://fastapi.tiangolo.com/tutorial/extra-models/
15. 响应状态码 (Response Status Code) - https://fastapi.tiangolo.com/tutorial/response-status-code/
16. 表单数据 (Form Data) - https://fastapi.tiangolo.com/tutorial/request-forms/
17. 表单数据模型 (Form Models) - https://fastapi.tiangolo.com/tutorial/request-form-models/
18. 请求文件 (Request Files) - https://fastapi.tiangolo.com/tutorial/request-files/
19. 请求表单和文件 (Request Forms and Files) - https://fastapi.tiangolo.com/tutorial/request-forms-and-files/
20. 处理错误 (Handling Errors) - https://fastapi.tiangolo.com/tutorial/handling-errors/
21. 路径操作配置 (Path Operation Configuration) - https://fastapi.tiangolo.com/tutorial/path-operation-configuration/
22. JSON 兼容编码器 (JSON Compatible Encoder) - https://fastapi.tiangolo.com/tutorial/encoder/
23. 请求体 - 更新 (Body - Updates) - https://fastapi.tiangolo.com/tutorial/body-updates/
24. 依赖 - 第一步 (Dependencies - First Steps) - https://fastapi.tiangolo.com/tutorial/dependencies/
25. 依赖 - 带有 yield 的依赖 (Dependencies - yield Dependencies) - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
26. 依赖 - 子依赖 (Dependencies - Subdependencies) - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-in-path-operation-decorators/
27. 依赖 - 路径操作装饰器中的依赖 (Dependencies - Dependencies in Path Operation Decorators) - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-in-path-operation-decorators/
28. 依赖 - 全局依赖 (Dependencies - Global Dependencies) - https://fastapi.tiangolo.com/tutorial/dependencies/global-dependencies/
29. 依赖 - 带有 yield 的依赖 (Dependencies - Dependencies with yield) - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
30. 依赖 - 参数化依赖 (Dependencies - Parameterizing Dependencies) - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
31. FastAPI 依赖在 yield 依赖中 (FastAPI Dependencies in yield Dependencies) - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
32. 依赖 - 缓存 (Dependencies - Cache) - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
33. 安全 - 第一步 (Security - First Steps) - https://fastapi.tiangolo.com/tutorial/security/
34. 安全 - 获取当前用户 (Security - Get Current User) - https://fastapi.tiangolo.com/tutorial/security/get-current-user/
35. 安全 - 简单的 OAuth2 密码和 Bearer (Security - Simple OAuth2 with Password and Bearer) - https://fastapi.tiangolo.com/tutorial/security/simple-oauth2/
36. 安全 - OAuth2 密码（和哈希），Bearer JWT 令牌 (Security - OAuth2 with Password (and hashing), Bearer with JWT tokens) - https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
37. FastAPI 中的高级用户认证 (Advanced User Authentication in FastAPI) - https://fastapi.tiangolo.com/tutorial/advanced-User-Authentication-in-FastAPI/
38. 中间件 (Middleware) - https://fastapi.tiangolo.com/tutorial/middleware/
39. CORS（跨域资源共享）(CORS (Cross-Origin Resource Sharing)) - https://fastapi.tiangolo.com/tutorial/cors/

### Advanced 部分（高级指南 - 01-27）
01. 应用流程 (Application Flow) - https://fastapi.tiangolo.com/advanced/application-flow/
02. 在代理后面 (Behind a Proxy) - https://fastapi.tiangolo.com/advanced/behind-a-proxy/
03. 模板 (Templates) - https://fastapi.tiangolo.com/advanced/templates/
04. WebSockets - https://fastapi.tiangolo.com/advanced/websockets/
05. WebSockets - 处理断开连接和多个客户端 (WebSockets - Handling Disconnections and Multiple Clients) - https://fastapi.tiangolo.com/advanced/websockets/
06. 使用 TestClient (Using the TestClient) - https://fastapi.tiangolo.com/advanced/testing/
07. 使用 TestClient - 使用 TestClient 测试事件 (Using the TestClient - Testing Events with the TestClient) - https://fastapi.tiangolo.com/advanced/testing-events/
08. 使用覆盖测试依赖 (Testing Dependencies with Overrides) - https://fastapi.tiangolo.com/advanced/testing-dependencies/
09. 异步数据库 (Async Database) - https://fastapi.tiangolo.com/advanced/async-database/
10. 使用 HTTPX 和 AsyncIO 的异步测试 (Async Tests with HTTPX and AsyncIO) - https://fastapi.tiangolo.com/advanced/async-tests/
11. 项目生成 (Project Generation) - https://fastapi.tiangolo.com/advanced/project-generation/
12. 子应用 - 挂载 (Sub Applications - Mounts) - https://fastapi.tiangolo.com/advanced/sub-applications/
13. 后台任务 (Background Tasks) - https://fastapi.tiangolo.com/advanced/background-tasks/
14. 使用 TestClient 测试后台任务 (Using TestClient to test Background Tasks) - https://fastapi.tiangolo.com/advanced/testing-background-tasks/
15. 静态文件 (Static Files) - https://fastapi.tiangolo.com/advanced/static-files/
16. 自定义响应 - HTML、流、文件等 (Custom Response - HTML, Stream, File, others) - https://fastapi.tiangolo.com/advanced/custom-response/
17. 自定义响应 - 使用 async 生成器的流式响应 (Custom Response - Streaming Response with async generator) - https://fastapi.tiangolo.com/advanced/custom-response/
18. 自定义响应 - 使用 yield 的流式响应 (Custom Response - Streaming Response with yield) - https://fastapi.tiangolo.com/advanced/custom-response/
19. FastAPI 中的高级用户认证 (Advanced User Authentication in FastAPI) - https://fastapi.tiangolo.com/advanced/advanced-user-authentication/
20. GraphQL - https://fastapi.tiangolo.com/advanced/graphql/
21. 使用 TestClient 测试 GraphQL (Using TestClient to test GraphQL) - https://fastapi.tiangolo.com/advanced/testing-graphql/
22. 应用 - __init__ (Applications - __init__) - https://fastapi.tiangolo.com/advanced/applications/
23. 应用 - 重定向、HTTPS、WSGI (Applications - Redirects, HTTPS, WSGI) - https://fastapi.tiangolo.com/advanced/applications/
24. 分离 __init__ 和 FastAPI 实例 (Separating __init__ from the FastAPI Instance) - https://fastapi.tiangolo.com/advanced/applications/
25. WSGI 框架 - Flask、Django 等 (WSGI Framework - Flask, Django, etc.) - https://fastapi.tiangolo.com/advanced/wsgi/
26. SQL（关系型）数据库 (SQL (Relational) Databases) - https://fastapi.tiangolo.com/tutorial/sql-databases/
27. NoSQL（非关系型）数据库 (NoSQL (Non-relational) Databases) - https://fastapi.tiangolo.com/advanced/nosql-databases/

## 示例
用户说: "处理章节01"
系统会:
1. 识别为 Tutorial 第 01 章
2. 获取 https://fastapi.tiangolo.com/tutorial/first-steps/
3. 翻译为中文
4. 添加序号和代码注释
5. 保存到 docs/原始文档/用户指南/01-first-steps.md
6. 保存到 docs/中文文档/用户指南/01-第一步.md
