# ClawRouter Setup - Smart LLM Router

**Installed:** 2026-02-16
**Version:** 0.9.12

## What's Running

| Component | Status | Endpoint |
|-----------|--------|----------|
| ClawRouter Proxy | ✅ Running | `http://localhost:8402` |
| OpenClaw Provider | ✅ Configured | `blockrun/auto` |

## Available Models

30+ models through one wallet:

| Provider | Models |
|----------|--------|
| OpenAI | GPT-5.2, GPT-4.1, GPT-4o, o3, o4-mini |
| Anthropic | Claude Opus 4.6, Sonnet 4, Haiku 4.5 |
| Google | Gemini 2.5 Pro, Gemini 3 Pro |
| DeepSeek | DeepSeek Chat, DeepSeek Reasoner |
| Moonshot | Kimi K2.5 |
| xAI | Grok 3, Grok 4 |
| NVIDIA | GPT-OSS 120B |

## Routing Profiles

Use with `/model <profile>`:

| Profile | Strategy | Savings | Best For |
|---------|----------|---------|----------|
| `blockrun/auto` | Balanced | 74-100% | Default |
| `blockrun/eco` | Cost optimized | 95.9-100% | Max savings |
| `blockrun/premium` | Quality focused | 0% | Best quality |
| `blockrun/free` | Free tier only | 100% | Zero cost |

## Usage

```bash
# Use auto-routing (recommended)
/model blockrun/auto

# Maximum savings
/model blockrun/eco

# Best quality
/model blockrun/premium
```

## Wallet

Auto-generated on first run. Check status:
```bash
cat ~/.openclaw/blockrun/wallet.key
```

Fund with USDC on Base (L2).

## Logs

```bash
tail -f /tmp/clawrouter.log
```

## Documentation

- Skill file: `/skills/clawrouter/SKILL.md`
- Homepage: https://github.com/BlockRunAI/ClawRouter
- Docs: https://blockrun.ai/docs
