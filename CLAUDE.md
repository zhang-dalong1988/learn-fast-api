# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

This is a **dual-purpose learning project**:
1. **Learn FastAPI** - Systematically study the official FastAPI tutorial documentation
2. **Practice Claude Skills** - Learn and use Claude Code Skills functionality

When working with this repository, remember that users are learning both FastAPI and Claude Skills simultaneously. Guide them to use Skills rather than doing everything manually.

## Claude Skills Architecture

The project contains 7 custom Skills in `.claude/skills/`:

### Main Skills (User-Facing)

**fastapi-process-chapter** - One-click chapter processing pipeline
- Usage: "处理章节03" or "process chapter 03"
- Fetches original English docs from fastapi.tiangolo.com
- Translates to Chinese with specific formatting rules
- Adds numbered sections and detailed code comments
- Saves both original and translated versions
- Chapter mapping is hardcoded in the skill file (Tutorial: 01-38, Advanced: 01-27)

**fastapi-commit** - Automated commit and continue workflow
- Usage: "代码提交" or "commit"
- Two-phase execution:
  1. Updates learning log, commits code with progress tracking, pushes to remote
  2. Automatically processes next chapter
- Calculates time spent since last commit
- Updates `docs/学习日志.md` with statistics

**fastapi-commit-local** - Local commit only
- Usage: "仅提交" or "commit local"
- Updates learning log and commits locally
- Does NOT push to remote repository
- Does NOT process next chapter
- Use for offline learning or batch processing

**fastapi-reset-project** - Reset for new learners
- Usage: "重置项目" or "reset project"
- Clears all learning documents (original and translated)
- Resets learning log to initial state
- Preserves Skills and project structure
- Allows new learners to start fresh

### Helper Skills (Internal)

- **fastapi-fetch-doc** - Fetches original documentation
- **fastapi-translate-doc** - Translates to Chinese
- **fastapi-annotate-code** - Adds Chinese code comments

## Document Processing Rules

When processing FastAPI documentation:

1. **Translation Style**: Natural Chinese expression, avoid literal translation
2. **Punctuation**: Use half-width punctuation (. , ? ! : ;)
3. **Spacing**: Add spaces between Chinese and English/numbers/symbols, and before half-width punctuation marks for better readability
4. **Technical Terms**: Keep English originals for proper nouns (FastAPI, Python, Pydantic, etc.)
5. **Code Comments**: Explain "why" and context, not just "what"
6. **Section Numbering**: Add sequential numbers (1, 2, 2.1, 2.2, etc.)

## File Naming Conventions

- Original docs: `{序号}-{英文标题}.md` (e.g., `01-first-steps.md`)
- Translated docs: `{序号}-{中文标题}.md` (e.g., `01-第一步.md`)
- Locations:
  - `docs/原始文档/用户指南/` - Tutorial originals
  - `docs/原始文档/高级指南/` - Advanced originals
  - `docs/中文文档/用户指南/` - Tutorial translations
  - `docs/中文文档/高级指南/` - Advanced translations

## Chapter Progression

Tutorial: 38 chapters (01-38, with sub-chapters like 28.1, 28.2, etc.)
Advanced: 27 chapters (01-27)
Total: 65 main chapters (plus sub-chapters)

**Important**: The authoritative chapter mapping is in `.claude/skills/fastapi-process-chapter/SKILL.md`. When adding new chapters, update the chapter list in both:
- `.claude/skills/fastapi-process-chapter/SKILL.md`
- `.claude/skills/fastapi-commit/SKILL.md`

**Current Progress** (as of docs/学习日志.md):
- Last completed: Chapter 29.3 - 安全简单的 OAuth2 密码和 Bearer
- Next chapter: 29.4 - 安全 OAuth2 密码和 Bearer JWT 令牌

## Learning State Management

**`docs/学习日志.md`** tracks progress:
- Start date, cumulative time, completed chapters
- Progress percentage (completed / 65 total)
- Current chapter being studied
- Daily learning records

Always update this file when processing chapters or committing.

## Git Workflow

Repository: https://github.com/zhang-dalong1988/learn-fast-api

Standard commit format:
```
[章节XX] {标题} | 学习时间: X小时Y分钟 | 累计: X小时Y分钟 | 进度: X.X%
```

**Note**: The working directory may not be initialized as a git repository. If `git status` fails, initialize with:
```bash
git init
git remote add origin https://github.com/zhang-dalong1988/learn-fast-api.git
git branch -M main
```

## Python Environment

**Virtual Environment**: `.venv/`

When testing FastAPI code examples from the documentation, always use the virtual environment:

```bash
# Activate virtual environment (Windows)
.venv\Scripts\activate

# Activate virtual environment (Linux/Mac)
source .venv/bin/activate

# Install FastAPI if needed
pip install fastapi uvicorn

# Run example code
uvicorn main:app --reload
```

This keeps the project dependencies isolated and prevents polluting the system Python environment.

## Key Architectural Insight

This project demonstrates **Claude Skills as automation tools**. The Skills encode domain knowledge (FastAPI tutorial structure, translation rules, file organization) into reusable commands. When users invoke "处理章节03", they're executing a complex multi-step pipeline defined in the Skill file.

When helping users, prioritize guiding them to use Skills over manual file manipulation. This reinforces the learning aspect of Claude Skills.
