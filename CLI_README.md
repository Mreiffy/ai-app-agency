# Agency CLI Documentation

## Installation

The CLI is already installed at:
```
/data/.openclaw/workspace/agency/agency-cli
/data/.openclaw/workspace/agency/interactive
```

Add to your PATH for global access:
```bash
export PATH="/data/.openclaw/workspace/agency:$PATH"
```

Or create aliases:
```bash
alias agency='/data/.openclaw/workspace/agency/agency-cli'
alias agencyi='/data/.openclaw/workspace/agency/interactive'
```

## Usage

### Command Mode (One-off commands)
```bash
agency status                    # Show agency status
agency send larz "build app"     # Send command to agent
agency memory scout              # View agent memory
agency costs                     # Show cost dashboard
agency build "Twitter tool"      # Start new build
agency list agents               # List all agents
```

### Interactive Mode (REPL)
```bash
agencyi                          # Start interactive mode
```

## Commands Reference

### Agency Control
| Command | Description |
|---------|-------------|
| `status` | Full agency status dashboard |
| `brief` | Generate daily brief |
| `standup [time]` | Trigger standup (morning/evening/now) |
| `costs` | Show cost dashboard |
| `dashboard` | Open visual Software Factory dashboard |

### Visual Dashboard
| Command | Description |
|---------|-------------|
| `agency-dashboard start` | Start web dashboard server |
| `agency-dashboard stop` | Stop dashboard server |
| `agency-dashboard status` | Check dashboard status |
| `agency-dashboard open` | Open dashboard in browser |

### Agent Commands
| Command | Description |
|---------|-------------|
| `send <agent> <msg>` | Send command to specific agent |
| `memory <agent>` | View agent's memory file |
| `agents` | List all agents (interactive only) |

### Quick Shorthand (Interactive Only)
```
larz: build a Twitter scheduler app
scout: research AI video tools
julie: create landing page copy
engineer: ship overnight build
innovate: build something cool
```

### Build & Deploy
| Command | Description |
|---------|-------------|
| `build <idea>` | Start new app build |
| `deploy <app>` | Deploy to production (requires ✅) |

### Monitoring
| Command | Description |
|---------|-------------|
| `logs [type]` | View logs (audit/cost/commands) |
| `trends` | View Scout's latest findings |

### Shell Access (Interactive Only)
```
! ls -la              # Execute shell command
! cat file.txt        # View file contents
```

## Examples

### Check Status
```bash
$ agency status

============================================================
  AI APP AGENCY STATUS
============================================================

📊 AGENTS:
🦞 LARZ         | Status: Active     | Task: Ready
🔍 SCOUT        | Status: Active     | Task: Ready
🎨 JULIE        | Status: Active     | Task: Ready
🏗️ ENGINEER     | Status: Active     | Task: Ready
💡 INNOVATOR    | Status: Active     | Task: Ready
🛡️ GUARDIAN     | Status: Active     | Task: Ready

💰 COSTS:
  Daily: $0.00 / $10.00
  Monthly: $0.00 / $300.00
  Status: ✅ Under budget
```

### Send Command
```bash
$ agency send larz "Build a SaaS boilerplate with Next.js and Stripe"

============================================================
  SENDING TO LARZ
============================================================

Message: Build a SaaS boilerplate with Next.js and Stripe

📤 Routing to larz...

✅ Command logged. larz will process on next wake.

💡 Tip: Larz will delegate to other agents as needed.
```

### Interactive Mode
```bash
$ agencyi

    ╔═══════════════════════════════════════════════════╗
    ║  🤖 AI APP AGENCY - INTERACTIVE CONTROL CENTER   ║
    ║                                                   ║
    ║  Type 'help' for commands | 'quit' to exit       ║
    ╚═══════════════════════════════════════════════════╝

✅ Agency CLI ready. Type 'help' for commands.

🚀 agency> larz: build a Twitter growth tool
============================================================
  SENDING TO LARZ
============================================================
Message: build a Twitter growth tool
...

🚀 agency> scout: research viral hooks
...

🚀 agency> costs
...

🚀 agency> quit
👋 Goodbye! Agency continues running in background.
```

## Agent Quick Commands

Each agent has special quick commands:

| Command | Action |
|---------|--------|
| `scout` | Research trending apps on Product Hunt |
| `julie` | Create Twitter thread for today |
| `engineer` | Check overnight builds and create PR |
| `innovate` | Build a small improvement surprise |
| `guardian` | Run cost audit |
| `larz` | Generate status report |

## Tips

1. **Use interactive mode** for exploration and multiple commands
2. **Use command mode** for scripts and automation
3. **Shorthand syntax** (`agent: message`) is faster in interactive mode
4. **All commands are logged** to `commands.log`
5. **Use `!`** for shell commands without leaving interactive mode

## Troubleshooting

**Command not found:**
```bash
# Make sure agency is in PATH
export PATH="/data/.openclaw/workspace/agency:$PATH"
```

**Permission denied:**
```bash
chmod +x /data/.openclaw/workspace/agency/agency-cli
chmod +x /data/.openclaw/workspace/agency/interactive
```

**Python not found:**
Ensure Python 3 is installed: `python3 --version`

## Advanced Usage

### Create Shell Function
Add to `.bashrc` or `.zshrc`:
```bash
agency() {
    /data/.openclaw/workspace/agency/agency-cli "$@"
}

agencyi() {
    /data/.openclaw/workspace/agency/interactive
}
```

### Create Alias for Common Commands
```bash
alias a='agency'
alias ai='agencyi'
alias as='agency status'
alias ac='agency costs'
```

### Scripting Example
```bash
#!/bin/bash
# daily-check.sh

agency status
agency costs
agency send larz "Daily check-in"
```
