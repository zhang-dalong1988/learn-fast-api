# FastAPI 学习项目

这是一个使用 Claude Skills 自动化学习 FastAPI 官方教程的项目。通过自定义的 Claude Skills，实现文档获取、翻译、代码注释添加和 Git 自动提交等功能。

## 项目特点

- **自动化学习流程**: 使用 Claude Skills 一键完成章节获取、翻译和注释
- **中文翻译**: 将 FastAPI 官方文档翻译为中文，添加详细代码注释
- **智能排版**: 中文与英文/数字/符号之间自动添加空格，使用全角标点符号
- **Git 自动化**: 自动记录学习时间，提交代码并推送到远程仓库
- **进度追踪**: 实时更新学习进度和统计数据

## 目录结构

```
learn-fast-api/
├── .claude/
│   └── skills/
│       ├── fastapi-fetch-doc/          # 获取原始英文文档
│       ├── fastapi-translate-doc/      # 翻译为中文
│       ├── fastapi-annotate-code/      # 添加代码注释
│       ├── fastapi-process-chapter/    # 完整处理流程（一键执行）
│       └── fastapi-commit/             # 自动提交并处理下一章
├── docs/
│   ├── 原始文档/
│   │   ├── 用户指南/                   # Tutorial 英文原文
│   │   └── 高级指南/                   # Advanced 英文原文
│   ├── 中文文档/
│   │   ├── 用户指南/                   # Tutorial 中文翻译
│   │   ├── 高级指南/                   # Advanced 中文翻译
│   │   └── README.md                   # 章节目录
│   └── 学习日志.md                     # 学习进度和统计
└── README.md
```

## Claude Skills 使用说明

### 1. fastapi-process-chapter (一键处理章节)

一键完成 FastAPI 章节的完整处理流程：获取文档 → 翻译润色 → 添加代码注释 → 保存文件

**使用方法**: 在对话中说 "处理章节X" 或 "process chapter X"

示例:
- "处理章节01" - 处理 Tutorial 第 01 章
- "处理章节28.1" - 处理 Tutorial 第 28.1 子章节

**自动完成**:
- 识别章节属于 Tutorial 还是 Advanced
- 获取原始英文文档
- 翻译为中文并润色
- 添加序号和代码注释
- 保存原始文档和翻译文档

### 2. fastapi-commit (自动提交)

自动提交代码到 Git 仓库，记录学习时间和进度，然后自动处理下一章节

**使用方法**: 在对话中说 "代码提交" 或 "commit"

**自动完成**:
- 计算本次学习时间
- 更新学习日志
- 创建 Git 提交
- 推送到远程仓库
- 自动处理下一章节

### 3. 其他辅助 Skills

- **fastapi-fetch-doc**: 获取 FastAPI 官方文档原始内容
- **fastapi-translate-doc**: 翻译 FastAPI 文档为中文并润色
- **fastapi-annotate-code**: 为文档中的代码添加中文注释

## 文档命名规则

- **原始文档**: `{序号}-{英文标题}.md` (如 `01-first-steps.md`)
- **翻译文档**: `{序号}-{中文标题}.md` (如 `01-第一步.md`)
- **章节编号**:
  - Tutorial: 01-38
  - Advanced: 01-27
  - 子章节: 28.1, 28.2 等

## 学习内容

### Tutorial - 用户指南 (38 章)

从基础到高级，系统学习 FastAPI 核心概念:

- 路径参数、查询参数、请求体
- 数据验证和类型转换
- 响应模型和状态码
- 依赖注入系统
- 安全认证
- 错误处理
- CORS 配置
- SQL 数据库

### Advanced - 高级指南 (27 章)

深入学习高级主题:

- 应用流程和代理配置
- WebSockets
- 测试 (TestClient)
- 异步数据库
- 后台任务
- 自定义响应
- GraphQL
- WSGI 集成

## 翻译约定

1. **自然表达**: 使用中文自然表达，避免直译
2. **空格规则**: 中文与英文/数字/符号之间添加空格
3. **保留原文**: 保留专有名词的英文原文 (如 FastAPI, Python, Pydantic 等)
4. **代码注释**: 解释"为什么"而不是仅仅描述"做了什么"
5. **全角标点**: 使用全角标点符号 (，。？！：；)

## 开始学习

1. 克隆仓库:
```bash
git clone https://github.com/zhang-dalong1988/learn-fast-api.git
cd learn-fast-api
```

2. 处理第一个章节:
在 Claude Code 中说: "处理章节01"

3. 查看学习进度:
打开 `docs/学习日志.md` 或 `docs/中文文档/README.md`

4. 提交并继续:
在 Claude Code 中说: "代码提交"

## 学习进度

- **开始日期**: 2025-12-24
- **累计学习时间**: 进行中
- **完成进度**: 查看学习日志

详细进度请查看: [学习日志](docs/学习日志.md) | [章节目录](docs/中文文档/README.md)

## 技术栈

- **FastAPI**: 现代化的 Python Web 框架
- **Claude Code**: AI 辅助编程工具
- **Claude Skills**: 自定义命令系统
- **Git**: 版本控制和学习记录
- **Markdown**: 文档格式

## 远程仓库

https://github.com/zhang-dalong1988/learn-fast-api

## 许可证

本项目仅用于个人学习，FastAPI 官方文档版权归其原作者所有。
