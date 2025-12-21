# Claude Code 快速上手指南

Claude Code 是 Anthropic 官方的 CLI 工具,让开发者能够通过命令行与 Claude AI 交互来完成软件工程任务.

## 1. 安装

```bash
# 安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 或使用 pip
pip install claude-code
```

## 2. 基础使用

### 2.1 启动和认证

```bash
# 首次使用需要登录
claude-code login

# 查看帮助
claude-code --help
```

### 2.2 常用命令

```bash
# 在当前目录启动 Claude Code
claude-code

# 指定特定目录
claude-code /path/to/project

# 直接执行任务
claude-code "修复 main.py 中的错误"

# 使用文件作为输入
claude-code -f instructions.txt
```

## 3. 核心功能

### 3.1 代码理解与分析

```bash
# 解释代码
claude-code "解释 main.py 的功能"

# 查找问题
claude-code "帮我找出代码中的潜在问题"
```

### 3.2 代码生成与修改

```bash
# 生成新功能
claude-code "在 main.py 中添加一个用户登录接口"

# 修复 Bug
claude-code "修复 items 接口的 500 错误"

# 重构代码
claude-code "重构 get_items 函数,使其更高效"
```

### 3.3 项目管理

```bash
# 查看项目结构
claude-code "分析项目结构并给出改进建议"

# 生成文档
claude-code "为 API 接口生成文档"
```

## 4. 高级功能

### 4.1 Slash 命令

在 Claude Code 中使用斜杠命令快速执行特定任务:

#### 基础命令

```bash
/help          # 查看所有可用命令和帮助
/clear         # 清除当前会话历史
/exit          # 退出 Claude Code
/save          # 保存当前会话
/load          # 加载之前的会话
/version       # 显示 Claude Code 版本信息
```

#### 代码管理

```bash
/commit [message]   # 创建 git commit,可指定提交信息
/branch <name>      # 创建新分支
/checkout <branch>  # 切换分支
/merge <branch>     # 合并分支
/status            # 查看 git 状态
/diff              # 查看代码变更
/log [n]           # 查看 git 日志,默认最近10条
/revert <commit>   # 回滚到指定提交
```

#### 代码审查与优化

```bash
/review [file]      # 代码审查,可指定文件
/refactor <func>    # 重构指定函数或代码块
/optimize [file]    # 优化代码性能
/format [files]     # 格式化代码文件
/lint [file]        # 运行代码检查
/analyze [file]     # 深度分析代码结构和质量
```

#### 测试与构建

```bash
/test [file]        # 运行测试,可指定文件
/test:watch         # 监控模式运行测试
/test:coverage      # 生成测试覆盖率报告
/build              # 构建项目
/build:prod         # 生产环境构建
/run <script>       # 运行指定脚本
```

#### 文档生成

```bash
/docs               # 生成项目文档
/docs:api           # 生成 API 文档
/docs:readme        # 更新 README.md
/docs:changelog     # 生成变更日志
```

#### 项目管理

```bash
/init               # 初始化项目配置
/setup              # 设置开发环境
/config             # 查看或修改配置
/install <package>  # 安装依赖包
/update             # 更新依赖
/clean              # 清理临时文件和缓存
```

#### 搜索与查找

```bash
/search <term>      # 在项目中搜索关键词
/find <pattern>     # 查找文件或代码模式
/grep <pattern>     # 使用 grep 搜索代码
```

#### 数据库操作

```bash
/db:migrate         # 运行数据库迁移
/db:seed            # 填充测试数据
/db:reset           # 重置数据库
/db:backup          # 备份数据库
```

#### 部署与发布

```bash
/deploy <env>       # 部署到指定环境
/release <version>  # 创建新版本发布
/docker:build       # 构建 Docker 镜像
/docker:run         # 运行 Docker 容器
```

#### Git 扩展命令

```bash
/stash              # 暂存当前更改
/stash:pop          # 恢复暂存的更改
/stash:clear        # 清除暂存列表
/tag <name>         # 创建标签
/push [branch]      # 推送到远程仓库
/pull               # 拉取远程更新
/fetch              # 获取远程信息
```

#### AI 辅助命令

```bash
/explain <code>     # 解释代码片段
/improve <code>     # 改进代码质量
/complete <code>    # 代码补全
/debug <error>      # 调试错误
/benchmark          # 性能基准测试
```

#### 自定义命令

```bash
/custom:create      # 创建自定义命令
/custom:list        # 列出自定义命令
/custom:run <cmd>   # 运行自定义命令
```

### 4.2 Hook 配置

创建 `.claude/hooks.json` 配置自动化任务:

```json
{
  "pre-edit": "black .",
  "post-edit": "pytest",
  "pre-commit": "npm run lint"
}
```

### 4.3 MCP 服务器

使用 MCP (Model Context Protocol) 扩展功能:

```bash
# 安装 MCP 服务器
claude-code mcp install github-search

# 使用 MCP 功能
claude-code "搜索 GitHub 上的 FastAPI 示例"
```

## 5. 最佳实践

### 5.1 项目初始化

```bash
# 为新项目配置 Claude Code
echo "这是一个 FastAPI 项目" > .claude/context.md
claude-code init
```

### 5.2 有效提问

- **明确目标**: "添加用户认证" 而不是 "改进代码"
- **提供上下文**: "在现有的 CRUD 操作基础上添加软删除"
- **指定格式**: "返回 JSON 格式的响应"

### 5.3 版本控制集成

```bash
# Claude 自动创建的提交信息
git log --oneline -n 5

# 查看 Claude 的修改
git diff HEAD~1
```

### 5.4 使用模板

创建 `.claude/templates/` 目录存放常用提示:

```text
# .claude/templates/api-endpoint.txt
为 FastAPI 项目创建一个 {model} 的 CRUD 接口,包括:
- GET /{model}/
- GET /{model}/{id}
- POST /{model}/
- PUT /{model}/{id}
- DELETE /{model}/{id}
```

## 6. 快捷键

### 6.1 基础快捷键

- `Ctrl+C`: 中断当前操作
- `Ctrl+D`: 退出 Claude Code
- `Tab`: 自动补全
- `↑/↓`: 浏览历史命令

### 6.2 对话框快捷键

#### 文本选择

- **Ctrl + Shift + A** - 全选文本(在大多数终端环境中)
- 鼠标拖拽 - 标准文本选择
- **Shift + 方向键** - 扩展选择范围

#### 对话框控制

- **数字键**(1, 2, 3...)- 选择带编号的选项
- **方向键** - 在选项间导航
- **Enter** - 确认选择
- **Esc 或 Ctrl + C** - 取消对话框

#### 其他界面快捷键

- **Ctrl + A** - 移动到行首
- **Ctrl + E** - 移动到行末
- **Ctrl + K** - 删除从光标到行末的内容
- **Ctrl + U** - 删除整行
- **Ctrl + L** - 清屏

### 6.3 快捷键参考

更多快捷键信息请参考官方文档:

- [Claude Code Keyboard Shortcuts](https://docs.anthropic.com/en/docs/claude-code/keyboard-shortcuts)

## 7. 常见问题

### 7.1 Q: 如何让 Claude 理解特定项目的约定?

A: 在项目根目录创建 `.claude/context.md` 文件,描述项目结构和约定.

### 7.2 Q: 可以同时处理多个文件吗?

A: 可以,使用 `@file` 语法引用文件:

```
请根据 @models.py 中的数据模型,更新 @routes.py 中的接口
```

### 7.3 Q: 如何保护敏感信息?

A: Claude Code 会自动忽略 `.env`、`.key` 等敏感文件,也可以在 `.claudeignore` 中指定要忽略的文件.

## 8. 示例工作流

### 8.1 FastAPI 开发流程

```bash
# 1. 启动 Claude Code
claude-code

# 2. 创建新模型
"创建一个 User 模型,包含 id、name、email 字段"

# 3. 生成 CRUD 接口
"为 User 模型创建完整的 CRUD API"

# 4. 添加测试
"为用户 API 编写 pytest 测试用例"

# 5. 生成文档
"更新 API 文档,包含用户相关的接口"

# 6. 代码审查
/review
```

## 9. 更多资源

- [Claude Code 官方文档](https://docs.anthropic.com/claude/docs/claude-code)
- [GitHub 仓库](https://github.com/anthropics/claude-code)
- [社区示例](https://github.com/anthropics/claude-code-examples)

## 10. 下一步

1. 尝试在当前 FastAPI 项目中使用 Claude Code
2. 配置自定义 hooks 和模板
3. 探索 MCP 生态系统
4. 分享你的使用技巧和最佳实践

---
