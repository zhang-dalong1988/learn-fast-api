---
name: fastapi-commit
description: 自动提交代码并记录学习时间,然后自动处理下一章节
allowed-tools: Write, Read, Edit, Bash, WebFetch
---

# FastAPI 代码提交 Skill

## 功能
自动提交代码到 Git 仓库，记录学习时间和进度，然后自动处理下一个章节。

## 使用方法
在对话中说 "代码提交" 或 "commit"

## 执行流程

### 第一阶段：提交代码
1. 读取 `docs/学习日志.md` 获取当前学习统计
2. 计算本次学习时间（从上一次提交到现在）
3. 更新学习日志：
   - 累计学习时间
   - 更新完成章节数量
   - 计算完成进度百分比
   - 更新当前进度
4. 提交代码到 Git：
   - 添加所有更改
   - 创建提交信息：[章节X] 标题 | 学习时间: X小时X分钟 | 累计: X小时X分钟 | 进度: X.X%
   - 推送到远程仓库

### 第二阶段：自动处理下一章
1. 读取 `docs/学习日志.md` 确定当前进度
2. 根据进度确定下一个章节编号
3. 自动执行 fastapi-process-chapter 流程处理下一章

## 章节列表

### Tutorial 部分（01-38）
01 - https://fastapi.tiangolo.com/tutorial/first-steps/
02 - https://fastapi.tiangolo.com/tutorial/path-params/
03 - https://fastapi.tiangolo.com/tutorial/query-params/
04 - https://fastapi.tiangolo.com/tutorial/body/
05 - https://fastapi.tiangolo.com/tutorial/query-params-str-validations/
06 - https://fastapi.tiangolo.com/tutorial/path-params-numeric-validations/
07 - https://fastapi.tiangolo.com/tutorial/body-multiple-params/
08 - https://fastapi.tiangolo.com/tutorial/body-fields/
09 - https://fastapi.tiangolo.com/tutorial/body-nested-models/
10 - https://fastapi.tiangolo.com/tutorial/extra-data-types/
11 - https://fastapi.tiangolo.com/tutorial/cookie-params/
12 - https://fastapi.tiangolo.com/tutorial/header-params/
13 - https://fastapi.tiangolo.com/tutorial/response-model/
14 - https://fastapi.tiangolo.com/tutorial/extra-models/
15 - https://fastapi.tiangolo.com/tutorial/response-status-code/
16 - https://fastapi.tiangolo.com/tutorial/request-forms/
17 - https://fastapi.tiangolo.com/tutorial/request-files/
18 - https://fastapi.tiangolo.com/tutorial/request-forms-and-files/
19 - https://fastapi.tiangolo.com/tutorial/handling-errors/
20 - https://fastapi.tiangolo.com/tutorial/path-operation-configuration/
21 - https://fastapi.tiangolo.com/tutorial/encoder/
22 - https://fastapi.tiangolo.com/tutorial/body-updates/
23 - https://fastapi.tiangolo.com/tutorial/dependencies/
24 - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
25 - https://fastapi.tiangolo.com/tutorial/dependencies/
26 - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-in-path-operation-decorators/
27 - https://fastapi.tiangolo.com/tutorial/dependencies/global-dependencies/
28 - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
29 - https://fastapi.tiangolo.com/tutorial/dependencies/
30 - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
31 - https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
32 - https://fastapi.tiangolo.com/tutorial/security/
33 - https://fastapi.tiangolo.com/tutorial/security/get-current-user/
34 - https://fastapi.tiangolo.com/tutorial/security/simple-oauth2/
35 - https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
36 - https://fastapi.tiangolo.com/tutorial/advanced-User-Authentication-in-FastAPI/
37 - https://fastapi.tiangolo.com/tutorial/middleware/
38 - https://fastapi.tiangolo.com/tutorial/cors/

### Advanced 部分（01-27）
01 - https://fastapi.tiangolo.com/advanced/application-flow/
02 - https://fastapi.tiangolo.com/advanced/behind-a-proxy/
03 - https://fastapi.tiangolo.com/advanced/templates/
04 - https://fastapi.tiangolo.com/advanced/websockets/
05 - https://fastapi.tiangolo.com/advanced/websockets/
06 - https://fastapi.tiangolo.com/advanced/testing/
07 - https://fastapi.tiangolo.com/advanced/testing-events/
08 - https://fastapi.tiangolo.com/advanced/testing-dependencies/
09 - https://fastapi.tiangolo.com/advanced/async-database/
10 - https://fastapi.tiangolo.com/advanced/async-tests/
11 - https://fastapi.tiangolo.com/advanced/project-generation/
12 - https://fastapi.tiangolo.com/advanced/sub-applications/
13 - https://fastapi.tiangolo.com/advanced/background-tasks/
14 - https://fastapi.tiangolo.com/advanced/testing-background-tasks/
15 - https://fastapi.tiangolo.com/advanced/static-files/
16 - https://fastapi.tiangolo.com/advanced/custom-response/
17 - https://fastapi.tiangolo.com/advanced/custom-response/
18 - https://fastapi.tiangolo.com/advanced/custom-response/
19 - https://fastapi.tiangolo.com/advanced/advanced-user-authentication/
20 - https://fastapi.tiangolo.com/advanced/graphql/
21 - https://fastapi.tiangolo.com/advanced/testing-graphql/
22 - https://fastapi.tiangolo.com/advanced/applications/
23 - https://fastapi.tiangolo.com/advanced/applications/
24 - https://fastapi.tiangolo.com/advanced/applications/
25 - https://fastapi.tiangolo.com/advanced/wsgi/
26 - https://fastapi.tiangolo.com/tutorial/sql-databases/
27 - https://fastapi.tiangolo.com/advanced/nosql-databases/

## 提交信息格式
```
[章节{序号}] {章节名称} | 学习时间: {本次}小时{本次}分钟 | 累计: {累计}小时{累计}分钟 | 进度: {百分比}%
```

示例:
```
[章节01] 第一步 | 学习时间: 0小时30分钟 | 累计: 0小时30分钟 | 进度: 1.5%
```

## 学习日志格式
```markdown
# FastAPI 学习日志

## 学习统计
- **开始日期**: 2025-12-24
- **累计学习时间**: X 小时 Y 分钟
- **已完成章节**: X / 65 章
- **完成进度**: X.X%
- **当前进度**: 第 X 章 - {章节名称}

## 学习记录

### 2025-12-24
- [章节01] 第一步 - 0小时30分钟
- [章节02] 路径参数 - 0小时45分钟
```
