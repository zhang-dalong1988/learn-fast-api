# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **FastAPI learning repository** containing structured documentation and examples in Chinese. The repository serves as a personal learning resource for mastering FastAPI from basics to advanced topics.

## Common Commands

### Running the Application

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server (recommended)
fastapi dev main.py

# Alternative: use uvicorn directly
uvicorn main:app --reload

# Access API documentation
# Interactive docs: http://127.0.0.1:8000/docs
# Alternative docs: http://127.0.0.1:8000/redoc
```

### Python Environment

- Uses Python virtual environment (`.venv/` directory present)
- Ensure you're in the correct venv before running commands

## Repository Structure

### Documentation Organization (`docs/`)

- **`01-入门/`** - Beginner tutorials covering:

  - Quick start guide
  - Path parameters with detailed examples
  - Query parameters and validation

- **`00-其他/`** - Additional topics:
  - Pydantic fundamentals (FastAPI's core dependency)
  - Python type hints (Union, Annotated)
  - Claude Code CLI guide for AI-assisted development

### Code Examples

- **`main.py`** - Demonstrates advanced FastAPI features:
  - Pydantic models with Query parameters
  - Filtering and pagination implementation
  - Complex query parameter structures

## Key Learning Path

1. **Start with** `docs/01-入门/1-快速上手.md` for installation and basics
2. **Progress through** path parameters (`2-路径参数.md`) and query parameters
3. **Explore** advanced topics in `00-其他/` for Pydantic and type hints
4. **Reference** `main.py` for practical implementation examples

## Documentation Language

All documentation is written in Chinese. When contributing or modifying documentation:

- Maintain Chinese language consistency
- Follow the existing markdown formatting style
- Include practical code examples with explanations

## Dependencies

Core dependencies defined in `requirements.txt`:

- FastAPI 0.124.4
- Uvicorn 0.38.0 (ASGI server)
- Optional testing dependencies are commented out

## Architecture Notes

- Repository is purely for learning - no test suite, CI/CD, or production configurations
- Not a git repository - currently local only
- Examples focus on modern FastAPI features and best practices
- Progressive learning structure from basic to advanced concepts

## 教程采集 (用户发出誊写教程需求的相关事项)

- 根据用户给出的 URL, 将教程誊写至本地
- 所有符号转换为半角英文符号
- 实时添加空格, 保持段落结构
- 添加章节序号, 保持文档连续性
