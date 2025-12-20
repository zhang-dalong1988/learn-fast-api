# Web Scraper MCP Server

这是一个自制的 MCP (Model Context Protocol) 服务器，用于网页抓取功能，无需外部依赖。

## 功能特性

- **scrape_webpage**: 提取网页内容，包括标题、描述和文本内容
- **fetch_html**: 获取网页的原始 HTML 内容
- 无需外部依赖，仅使用 Node.js 内置模块
- 支持自动重定向
- 内置 User-Agent

## 使用方法

### 1. 直接使用命令行工具

```bash
# 抓取网页内容
npm run scrape https://example.com
```

### 2. 作为 MCP 服务器运行

```bash
# 启动 MCP 服务器
npm start
```

### 3. 在 Claude Desktop 中配置

1. 找到 Claude Desktop 配置文件：
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. 添加以下配置：

```json
{
  "mcpServers": {
    "web-scraper": {
      "command": "node",
      "args": ["F:\\learn-fast-api\\mcp-server.js"],
      "env": {}
    }
  }
}
```

3. 重启 Claude Desktop

## 使用示例

配置完成后，在 Claude Code 中可以使用：

1. "请抓取 https://example.com 的内容"
2. "获取 https://fastapi.tiangolo.com/zh/tutorial/path-params/ 的教程内容"

## 输出格式

`scrape_webpage` 工具返回 JSON 格式：

```json
{
  "url": "https://example.com",
  "title": "网页标题",
  "description": "网页描述",
  "textContent": "提取的纯文本内容",
  "htmlContent": "完整的HTML内容",
  "timestamp": "2025-12-19T17:00:00.000Z"
}
```

## 限制

- 目前只支持 HTTP 和 HTTPS 协议
- 不支持需要 JavaScript 渲染的动态内容
- 不支持文件下载
- 对于某些网站可能需要额外的请求头

## 故障排除

如果遇到问题，请检查：

1. 网络连接是否正常
2. URL 是否有效
3. 目标网站是否允许抓取（检查 robots.txt）
4. 是否有防火墙或代理设置