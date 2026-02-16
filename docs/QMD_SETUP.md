# QMD Setup - Quick Markdown Search

**Installed:** 2026-02-16
**Location:** `/data/.openclaw/workspace/tools/qmd`

## Usage

```bash
# Search your agency notes
qmd search "dashboard"
qmd search "agent memory"
qmd search "deployment"

# Available commands
qmd collection list          # Show collections
qmd collection add <path>    # Add new collection
qmd search <query>           # BM25 keyword search
qmd vsearch <query>          # Vector semantic search
qmd query <query>            # Hybrid search + LLM rerank
```

## Current Collections

| Name | Path | Files |
|------|------|-------|
| agency | `/data/.openclaw/workspace/agency` | 27 |

## Skill Reference

See: `/data/.openclaw/workspace/skills/qmd/SKILL.md`

Source: https://github.com/tobi/qmd
