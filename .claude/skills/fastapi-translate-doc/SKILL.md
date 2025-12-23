---
name: fastapi-translate-doc
description: 翻译 FastAPI 文档为中文并润色
allowed-tools: Read, Write, Edit
---

# FastAPI 文档翻译 Skill

## 功能
将获取的原始英文文档翻译为中文，并进行格式化和润色。

## 使用方法
在对话中说 "翻译章节X" 或 "translate chapter X"

## 处理规则
1. 将所有英文内容翻译为中文
2. 使用半角标点符号（,.?!:;）
3. 在中文与英文/数字/符号之间、以及在半角符号前添加空格
4. 保持代码块不变，但添加中文注释
5. 保持 Markdown 格式

## 输出格式
- 将翻译后的文档保存到 `docs/中文文档/用户指南/` 或 `docs/中文文档/高级指南/`
- 使用中文文件名：`{序号}-{中文标题}.md`
