# FastAPI 学习项目

这是一个使用 Claude Skills 自动化学习 FastAPI 官方教程的项目。通过自定义的 Claude Skills，实现文档获取、翻译、代码注释添加和 Git 自动提交等功能。

## 项目特点

- **双重学习目标**: 同时学习 FastAPI 和 Claude Skills 的使用
- **自动化学习流程**: 使用 Claude Skills 一键完成章节获取、翻译和注释
- **中文翻译**: 将 FastAPI 官方文档翻译为中文，添加详细代码注释
- **智能排版**: 中文与英文/数字/符号之间自动添加空格，使用全角标点符号
- **Git 自动化**: 自动记录学习时间，支持本地提交和远程推送
- **进度追踪**: 实时更新学习进度和统计数据
- **项目可复用**: 支持重置项目，让其他学习者从头开始

## 目录结构

```
learn-fast-api/
├── .claude/
│   └── skills/
│       ├── fastapi-fetch-doc/          # 获取原始英文文档
│       ├── fastapi-translate-doc/      # 翻译为中文
│       ├── fastapi-annotate-code/      # 添加代码注释
│       ├── fastapi-process-chapter/    # 完整处理流程（一键执行）
│       ├── fastapi-commit/             # 自动提交并处理下一章
│       ├── fastapi-commit-local/       # 仅本地提交
│       └── fastapi-reset-project/      # 重置项目
├── docs/
│   ├── 原始文档/
│   │   ├── 用户指南/                   # Tutorial 英文原文
│   │   └── 高级指南/                   # Advanced 英文原文
│   ├── 中文文档/
│   │   ├── 用户指南/                   # Tutorial 中文翻译
│   │   ├── 高级指南/                   # Advanced 中文翻译
│   │   └── README.md                   # 章节目录
│   └── 学习日志.md                     # 学习进度和统计
├── .venv/                              # Python 虚拟环境
├── .gitignore
├── CLAUDE.md                           # Claude Code 工作指导
└── README.md
```

## Claude Skills 使用说明

### 1. fastapi-process-chapter (一键处理章节)

一键完成 FastAPI 章节的完整处理流程：获取文档 → 翻译润色 → 添加代码注释 → 保存文件

**使用方法**: "处理章节03" 或 "process chapter 03"

**自动完成**:
- 识别章节属于 Tutorial 还是 Advanced
- 获取原始英文文档
- 翻译为中文并润色
- 添加序号和代码注释
- 保存原始文档和翻译文档

### 2. fastapi-commit (自动提交并继续)

自动提交代码到 Git 仓库，记录学习时间和进度，然后自动处理下一章节

**使用方法**: "代码提交" 或 "commit"

**自动完成**:
- 计算本次学习时间
- 更新学习日志
- 创建 Git 提交
- 推送到远程仓库
- 自动处理下一章节

### 3. fastapi-commit-local (仅本地提交)

仅在本地提交代码，不推送远程仓库，不处理下一章节

**使用方法**: "仅提交" 或 "commit local"

**适用场景**:
- 离线学习时保存进度
- 批量学习后统一提交
- 暂时不推送到远程仓库

### 4. fastapi-reset-project (重置项目)

清空所有学习文档，重置学习日志，让新学习者从头开始

**使用方法**: "重置项目" 或 "reset project"

**注意**: 此操作会删除所有学习进度，请谨慎使用

### 5. 其他辅助 Skills

- **fastapi-fetch-doc**: 获取 FastAPI 官方文档原始内容
- **fastapi-translate-doc**: 翻译 FastAPI 文档为中文并润色
- **fastapi-annotate-code**: 为文档中的代码添加中文注释

## 环境配置

### 激活虚拟环境

```bash
# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate
```

### 安装 FastAPI

```bash
pip install fastapi uvicorn
```

### 测试代码示例

当学习文档中的代码示例时，使用虚拟环境运行：

```bash
uvicorn main:app --reload
```

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

2. 激活虚拟环境:
```bash
.venv\Scripts\activate  # Windows
# 或
source .venv/bin/activate  # Linux/Mac
```

3. 处理第一个章节:
在 Claude Code 中说: "处理章节01"

4. 提交并继续:
在 Claude Code 中说: "代码提交"

5. 查看学习进度:
打开 `docs/学习日志.md` 或 `docs/中文文档/README.md`

## 学习进度

- **开始日期**: 2025-12-24
- **累计学习时间**: 进行中
- **完成进度**: 查看学习日志

详细进度请查看: [学习日志](docs/学习日志.md) | [章节目录](docs/中文文档/README.md)

## 技术栈

- **FastAPI**: 现代化的 Python Web 框架
- **Claude Code**: AI 辅助编程工具
- **Claude Skills**: 自定义命令系统（本项目共 7 个 Skills）
- **Python venv**: 虚拟环境隔离依赖
- **Git**: 版本控制和学习记录
- **Markdown**: 文档格式

## 远程仓库

https://github.com/zhang-dalong1988/learn-fast-api

## 许可证

本项目仅用于个人学习，FastAPI 官方文档版权归其原作者所有。
