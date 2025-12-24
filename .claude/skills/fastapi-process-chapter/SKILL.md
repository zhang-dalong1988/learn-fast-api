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

基于 https://fastapi.tiangolo.com/tutorial/ 官方目录（2025年）

01. 第一步 (First Steps) - https://fastapi.tiangolo.com/tutorial/first-steps/
02. 路径参数 (Path Parameters) - https://fastapi.tiangolo.com/tutorial/path-params/
03. 查询参数 (Query Parameters) - https://fastapi.tiangolo.com/tutorial/query-params/
04. 请求体 (Request Body) - https://fastapi.tiangolo.com/tutorial/body/
05. 查询参数和字符串验证 (Query Parameters and String Validations) - https://fastapi.tiangolo.com/tutorial/query-params-str-validations/
06. 路径参数和数值验证 (Path Parameters and Numeric Validations) - https://fastapi.tiangolo.com/tutorial/path-params-numeric-validations/
07. 查询参数模型 (Query Parameter Models) - https://fastapi.tiangolo.com/tutorial/query-param-models/
08. 请求体 - 多个参数 (Body - Multiple Parameters) - https://fastapi.tiangolo.com/tutorial/body-multiple-params/
09. 请求体 - 字段 (Body - Fields) - https://fastapi.tiangolo.com/tutorial/body-fields/
10. 请求体 - 嵌套模型 (Body - Nested Models) - https://fastapi.tiangolo.com/tutorial/body-nested-models/
11. 声明请求示例数据 (Declare Request Example Data) - https://fastapi.tiangolo.com/tutorial/schema-extra-example/
12. 额外数据类型 (Extra Data Types) - https://fastapi.tiangolo.com/tutorial/extra-data-types/
13. Cookie 参数 (Cookie Parameters) - https://fastapi.tiangolo.com/tutorial/cookie-params/
14. Header 参数 (Header Parameters) - https://fastapi.tiangolo.com/tutorial/header-params/
15. Cookie 参数模型 (Cookie Parameter Models) - https://fastapi.tiangolo.com/tutorial/cookie-param-models/
16. Header 参数模型 (Header Parameter Models) - https://fastapi.tiangolo.com/tutorial/header-param-models/
17. 响应模型 - 返回类型 (Response Model - Return Type) - https://fastapi.tiangolo.com/tutorial/response-model/
18. 额外模型 (Extra Models) - https://fastapi.tiangolo.com/tutorial/extra-models/
19. 响应状态码 (Response Status Code) - https://fastapi.tiangolo.com/tutorial/response-status-code/
20. 表单数据 (Form Data) - https://fastapi.tiangolo.com/tutorial/request-forms/
21. 表单数据模型 (Form Models) - https://fastapi.tiangolo.com/tutorial/request-form-models/
22. 请求文件 (Request Files) - https://fastapi.tiangolo.com/tutorial/request-files/
23. 请求表单和文件 (Request Forms and Files) - https://fastapi.tiangolo.com/tutorial/request-forms-and-files/
24. 处理错误 (Handling Errors) - https://fastapi.tiangolo.com/tutorial/handling-errors/
25. 路径操作配置 (Path Operation Configuration) - https://fastapi.tiangolo.com/tutorial/path-operation-configuration/
26. JSON 兼容编码器 (JSON Compatible Encoder) - https://fastapi.tiangolo.com/tutorial/encoder/
27. 请求体 - 更新 (Body - Updates) - https://fastapi.tiangolo.com/tutorial/body-updates/
28. 依赖 (Dependencies) - https://fastapi.tiangolo.com/tutorial/dependencies/
28.1. 依赖 - 类作为依赖 (Dependencies - Classes as Dependencies) - https://fastapi.tiangolo.com/tutorial/dependencies/classes-as-dependencies/
28.2. 依赖 - 子依赖 (Dependencies - Sub-dependencies) - https://fastapi.tiangolo.com/tutorial/dependencies/sub-dependencies/
28.3. 依赖 - 路径操作装饰器中的依赖 (Dependencies - Dependencies in path operation decorators) - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-in-path-operation-decorators/
28.4. 依赖 - 全局依赖 (Dependencies - Global Dependencies) - https://fastapi.tiangolo.com/tutorial/dependencies/global-dependencies/
28.5. 依赖 - 带有 yield 的依赖 (Dependencies - Dependencies with yield) - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
29. 安全 (Security) - https://fastapi.tiangolo.com/tutorial/security/
29.1. 安全 - 第一步 (Security - First Steps) - https://fastapi.tiangolo.com/tutorial/security/first-steps/
29.2. 安全 - 获取当前用户 (Security - Get Current User) - https://fastapi.tiangolo.com/tutorial/security/get-current-user/
29.3. 安全 - 简单的 OAuth2 密码和 Bearer (Security - Simple OAuth2 with Password and Bearer) - https://fastapi.tiangolo.com/tutorial/security/simple-oauth2/
29.4. 安全 - OAuth2 密码（和哈希），Bearer JWT 令牌 (Security - OAuth2 with Password (and hashing), Bearer with JWT tokens) - https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
30. 中间件 (Middleware) - https://fastapi.tiangolo.com/tutorial/middleware/
31. CORS（跨域资源共享）(CORS (Cross-Origin Resource Sharing)) - https://fastapi.tiangolo.com/tutorial/cors/
32. SQL（关系型）数据库 (SQL (Relational) Databases) - https://fastapi.tiangolo.com/tutorial/sql-databases/
33. 更大的应用 - 多文件 (Bigger Applications - Multiple Files) - https://fastapi.tiangolo.com/tutorial/bigger-applications/
34. 后台任务 (Background Tasks) - https://fastapi.tiangolo.com/tutorial/background-tasks/
35. 元数据和文档 URL (Metadata and Docs URLs) - https://fastapi.tiangolo.com/tutorial/metadata/
36. 静态文件 (Static Files) - https://fastapi.tiangolo.com/tutorial/static-files/
37. 测试 (Testing) - https://fastapi.tiangolo.com/tutorial/testing/
38. 调试 (Debugging) - https://fastapi.tiangolo.com/tutorial/debugging/

### Advanced 部分（高级指南）

基于 https://fastapi.tiangolo.com/advanced/ 官方目录（2025年）

01. 路径操作高级配置 (Path Operation Advanced Configuration) - https://fastapi.tiangolo.com/advanced/path-operation-advanced-configuration/
02. 附加状态码 (Additional Status Codes) - https://fastapi.tiangolo.com/advanced/additional-status-codes/
03. 直接返回响应 (Return a Response Directly) - https://fastapi.tiangolo.com/advanced/response-directly/
04. 自定义响应 - HTML、流、文件等 (Custom Response - HTML, Stream, File, others) - https://fastapi.tiangolo.com/advanced/custom-response/
05. OpenAPI 中的附加响应 (Additional Responses in OpenAPI) - https://fastapi.tiangolo.com/advanced/additional-responses/
06. 响应 Cookie (Response Cookies) - https://fastapi.tiangolo.com/advanced/response-cookies/
07. 响应头部 (Response Headers) - https://fastapi.tiangolo.com/advanced/response-headers/
08. 响应 - 更改状态码 (Response - Change Status Code) - https://fastapi.tiangolo.com/advanced/response-change-status-code/
09. 高级依赖 (Advanced Dependencies) - https://fastapi.tiangolo.com/advanced/advanced-dependencies/
10. 高级安全 (Advanced Security) - https://fastapi.tiangolo.com/advanced/advanced-security/
10.1. 高级安全 - OAuth2 作用域 (Advanced Security - OAuth2 scopes) - https://fastapi.tiangolo.com/advanced/advanced-security/oauth2-scopes/
10.2. 高级安全 - HTTP 基本认证 (Advanced Security - HTTP Basic Auth) - https://fastapi.tiangolo.com/advanced/advanced-security/http-basic-auth/
11. 直接使用请求 (Using the Request Directly) - https://fastapi.tiangolo.com/advanced/using-request-directly/
12. 使用数据类 (Using Dataclasses) - https://fastapi.tiangolo.com/advanced/dataclasses/
13. 高级中间件 (Advanced Middleware) - https://fastapi.tiangolo.com/advanced/advanced-middleware/
14. 子应用 - 挂载 (Sub Applications - Mounts) - https://fastapi.tiangolo.com/advanced/sub-applications/
15. 在代理后面 (Behind a Proxy) - https://fastapi.tiangolo.com/advanced/behind-a-proxy/
16. 模板 (Templates) - https://fastapi.tiangolo.com/advanced/templates/
17. WebSockets - https://fastapi.tiangolo.com/advanced/websockets/
18. 生命周期事件 (Lifespan Events) - https://fastapi.tiangolo.com/advanced/events/
19. 测试 WebSockets (Testing WebSockets) - https://fastapi.tiangolo.com/advanced/testing-websockets/
20. 测试事件：lifespan 和 startup - shutdown (Testing Events: lifespan and startup - shutdown) - https://fastapi.tiangolo.com/advanced/testing-events/
21. 使用覆盖测试依赖 (Testing Dependencies with Overrides) - https://fastapi.tiangolo.com/advanced/testing-dependencies/
22. 异步测试 (Async Tests) - https://fastapi.tiangolo.com/advanced/async-tests/
23. 设置和环境变量 (Settings and Environment Variables) - https://fastapi.tiangolo.com/advanced/settings/
24. OpenAPI 回调 (OpenAPI Callbacks) - https://fastapi.tiangolo.com/advanced/openapi-callbacks/
25. OpenAPI Webhooks (OpenAPI Webhooks) - https://fastapi.tiangolo.com/advanced/openapi-webhooks/
26. 包含 WSGI - Flask、Django 等 (Including WSGI - Flask, Django, others) - https://fastapi.tiangolo.com/advanced/wsgi/
27. 生成 SDK (Generating SDKs) - https://fastapi.tiangolo.com/advanced/generating-clients/

## 示例
用户说: "处理章节01"
系统会:
1. 识别为 Tutorial 第 01 章
2. 获取 https://fastapi.tiangolo.com/tutorial/first-steps/
3. 翻译为中文
4. 添加序号和代码注释
5. 保存到 docs/原始文档/用户指南/01-first-steps.md
6. 保存到 docs/中文文档/用户指南/01-第一步.md
