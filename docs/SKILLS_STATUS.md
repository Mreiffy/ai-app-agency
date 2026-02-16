# Skill Installation Notes

## Installed Skills

| Skill | Status | Notes |
|-------|--------|-------|
| **qmd** | ✅ Ready | Quick markdown search, 27 files indexed |
| **clawrouter** | ✅ Running | Smart LLM routing on port 8402 |
| **summarize** | ⚠️ macOS only | Linux alternatives documented |

## QMD (Quick Markdown Search)
- **Location:** `/data/.openclaw/workspace/skills/qmd/`
- **Usage:** `qmd search "query"`
- **Status:** Fully working, 27 agency files indexed

## ClawRouter (Smart LLM Routing)
- **Location:** `/data/.openclaw/workspace/skills/clawrouter/`
- **Proxy:** `http://localhost:8402`
- **Models:** 30+ via BlockRun
- **Usage:** `/model blockrun/auto`

## Summarize
- **Location:** `/data/.openclaw/workspace/skills/summarize/`
- **Status:** macOS ARM64 only
- **Linux Alternative:** Use Firecrawl for web, yt-dlp for YouTube

## YouTube Watcher
- **Location:** `/data/.openclaw/workspace/skills/youtube-watcher/`
- **Status:** ✅ Ready
- **Dependencies:** yt-dlp (installed)
- **Usage:** `python3 /data/.openclaw/workspace/skills/youtube-watcher/scripts/get_transcript.py "URL"`
