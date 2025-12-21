# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **FastAPI learning repository** containing structured documentation and examples in Chinese. The repository serves as a personal learning resource for mastering FastAPI from basics to advanced topics. It also includes a custom MCP (Model Context Protocol) server for web scraping to facilitate tutorial collection and documentation.

## Development Environment Setup

### Python Environment

```bash
# Activate virtual environment (Windows)
.venv\Scripts\activate

# Activate virtual environment (Unix/macOS)
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### Node.js Environment (for MCP server)

```bash
# Install Node.js dependencies (if needed)
npm install

# The MCP server has no external dependencies - uses only Node.js built-in modules
```

## Running FastAPI Applications

### Main Application

```bash
# Navigate to the project directory
cd F:\learn-fast-api

# Run development server (recommended method)
fastapi dev main.py

# Alternative: use uvicorn directly
uvicorn main:app --reload

# Access API documentation
# Interactive docs: http://127.0.0.1:8000/docs
# Alternative docs: http://127.0.0.1:8000/redoc
```

### Running Example Code

When working with tutorial examples:

1. Create a new Python file for each example
2. Run with: `fastapi dev <filename>.py`
3. Access the interactive docs to test endpoints

## MCP Server (Web Scraper)

The repository includes a custom MCP server for web scraping, allowing Claude to fetch and process web content for tutorial collection.

### Running the MCP Server

```bash
# Start MCP server (for integration with Claude Desktop)
npm start

# Run scraper directly from command line
npm run scrape https://example.com

# Run the simple scraper (no MCP protocol)
node simple-web-scraper.js https://example.com
```

### MCP Server Configuration

To use the web scraper with Claude Desktop:

1. **Locate Claude Desktop config file:**

   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Add the server configuration:**

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

3. **Restart Claude Desktop** to load the new server

### MCP Server Features

- **scrape_webpage**: Extract structured content (title, description, text) from web pages
- **fetch_html**: Get raw HTML content from web pages
- No external dependencies - uses only Node.js built-in modules
- Handles HTTP/HTTPS with automatic redirects
- Includes proper User-Agent headers
- 10-second timeout for requests

## Repository Structure

### Documentation Organization (`docs/`)

```
docs/
├── 00-其他/                      # Additional topics
│   ├── 1-Pydantic.md            # Pydantic fundamentals (FastAPI's core)
│   ├── 2-Union 和 Annotated.md  # Python type hints guide
│   └── x-ClaudeCode.md          # Claude Code CLI usage guide
├── 01-入门/                      # Beginner tutorials
│   ├── 1-快速上手.md            # Quick start and installation
│   ├── 2-路径参数.md            # Path parameters with examples
│   └── 3-查询参数.md            # Query parameters and validation
└── 02-请求/                      # Request handling
    ├── 1-请求体.md               # Request body and Pydantic models
    ├── 2-查询参数字符串验证.md   # Query parameter string validation
    └── 3-路径参数数值验证.md     # Path parameter numeric validation
```

### Code Files

- **`main.py`** - Advanced FastAPI example demonstrating:
  - Pydantic models with Query parameters
  - Filtering and pagination implementation
  - Complex query parameter structures
  - Using BaseModel for query parameter validation

### MCP Server Files

- **`mcp-server.js`** - Main MCP server implementation
- **`simple-web-scraper.js`** - Web scraper class without MCP protocol
- **`web-scraper-mcp.js`** - Alternative implementation using Puppeteer
- **`package.json`** - Node.js project configuration

## Key Learning Path

1. **Start with** `docs/01-入门/1-快速上手.md` for installation and basics
2. **Progress through** path parameters (`2-路径参数.md`) and query parameters (`3-查询参数.md`)
3. **Learn request handling** in `docs/02-请求/` for request bodies and validation
4. **Understand the fundamentals** in `00-其他/`:
   - Pydantic (essential for FastAPI)
   - Python type hints (Union, Annotated)
5. **Practice with** `main.py` for advanced implementation examples

## Documentation Standards

All documentation is written in Chinese. When contributing or modifying documentation:

- Maintain Chinese language consistency
- Follow the existing markdown formatting style
- Include practical code examples with explanations
- Use proper Chinese punctuation (full-width symbols)
- Add sequential section numbers for tutorial continuity

## Dependencies

### Python Dependencies (`requirements.txt`)

```
fastapi==0.124.4      # FastAPI framework
uvicorn[standard]==0.38.0  # ASGI server with standard features
# pytest>=7.0.0      # (Optional) For testing
# httpx>=0.24.0      # (Optional) For testing async endpoints
# python-multipart>=0.0.6  # (Optional) For form data support
```

### Node.js Dependencies

The MCP server has **zero external dependencies** - it uses only Node.js built-in modules:

- `https` - For making HTTPS requests
- `http` - For making HTTP requests
- `url` - For URL parsing
- No npm packages required

## Development Workflow

### For Learning FastAPI

1. Read the tutorial markdown files in order
2. Copy code examples to separate Python files
3. Run each example with `fastapi dev`
4. Experiment with the interactive API documentation
5. Modify and test your own implementations

### For Tutorial Collection (Using MCP)

1. Ensure MCP server is configured in Claude Desktop
2. Use natural language requests: "请抓取 https://example.com 的内容"
3. The scraper will extract structured content for processing
4. Content can be converted to markdown tutorials following repository standards

## Architecture Notes

- **Learning-focused repository** - No production configurations, CI/CD, or test suites
- **Git repository** - Initialized for version control
- **Modular structure** - Each topic in separate files for easy navigation
- **Modern FastAPI features** - Examples use latest FastAPI patterns and best practices
- **Progressive complexity** - From basic concepts to advanced implementations
- **Integrated web scraping** - Custom MCP server enables automated content collection

## 教程采集指南

当用户需要从网页采集教程时：

1. **使用 MCP 服务器**（推荐）：

   - 确保在 Claude Desktop 中配置了 MCP 服务器
   - 直接请求："请抓取 [URL] 的教程内容"
   - 内容将自动提取并结构化

2. **手动处理**：

   - 使用 `npm run scrape [URL]` 获取内容
   - 手动转换为 markdown 格式

3. **内容规范**：
   - 所有符号转换为半角英文符号
   - 保持段落结构和空格
   - 添加章节序号，保持文档连续性
   - 包含实际的代码示例和解释
   - 同类代码仅保留 Pyhton 版本较高的示例
   - 代码示例 (代码片段) 添加注释, 便于学习和理解关键内容
   - 辅助生成的注释, 润色内容不可以使用全角符号, 无论是誊写的原文还是润色后的内容都使用半角英文符号

## Troubleshooting

### FastAPI Issues

- Ensure virtual environment is activated
- Check port 8000 is not already in use
- Verify dependencies are installed: `pip install -r requirements.txt`

### MCP Server Issues

- Node.js must be installed (version 14+ recommended)
- Check firewall settings if scraper fails
- Some websites may block scraping - respect robots.txt
- Timeouts occur after 10 seconds for unresponsive sites

### Git Issues

- Repository is initialized but may have no remote
- Use `git status` to check current state
- Add remote with: `git remote add origin <URL>` if needed
