# 🚀 Agency CLI - Installation Complete

## ✅ CLI Tools Created

### 1. Command Mode (`agency` or `agency-cli`)
**File:** `/data/.openclaw/workspace/agency/agency-cli`

**Usage:** One-off commands from shell
```bash
agency status              # Show full status
agency send larz "msg"     # Send command
agency costs               # Cost dashboard
agency build "idea"        # Start build
```

### 2. Interactive Mode (`agencyi` or `interactive`)
**File:** `/data/.openclaw/workspace/agency/interactive`

**Usage:** REPL for exploration
```bash
agencyi                    # Start interactive session
🚀 agency> larz: build app
🚀 agency> costs
🚀 agency> quit
```

### 3. Python Backend
**File:** `/data/.openclaw/workspace/agency/scripts/agency`

Core CLI logic with all command implementations.

---

## 🎯 Available Commands

### Basic Commands
| Command | Description |
|---------|-------------|
| `status` | Full agency status |
| `send <agent> <msg>` | Send command to agent |
| `memory <agent>` | View agent memory |
| `costs` | Cost dashboard |
| `brief` | Generate daily brief |
| `standup [time]` | Trigger standup |
| `build <idea>` | Start new build |
| `logs [type]` | View logs |
| `list <resource>` | List agents/jobs/files |

### Interactive-Only Features
| Feature | Description |
|---------|-------------|
| `larz: message` | Shorthand for send |
| `! command` | Shell command execution |
| `dashboard` | Visual dashboard |
| `trends` | Scout's findings |
| `agents` | Agent list with status |

### Quick Agent Commands (Interactive)
| Command | Action |
|---------|--------|
| `scout` | Research trending apps |
| `julie` | Create today's content |
| `engineer` | Check overnight builds |
| `innovate` | Build surprise feature |
| `guardian` | Run cost audit |
| `larz` | Generate report |

---

## 🛠️ Installation

### Already Configured:
✅ Added to PATH in `~/.bashrc`  
✅ Aliases created: `agency` and `agencyi`  
✅ All scripts executable  

### Reload Shell:
```bash
source ~/.bashrc
```

### Test Installation:
```bash
agency status
```

---

## 📖 Usage Examples

### Quick Status Check
```bash
$ agency status

📊 AGENTS:
🦞 LARZ         | Status: Active     | Task: Ready
🔍 SCOUT        | Status: Active     | Task: Ready
🎨 JULIE        | Status: Active     | Task: Ready
🏗️ ENGINEER     | Status: Active     | Task: Ready
💡 INNOVATOR    | Status: Active     | Task: Ready
🛡️ GUARDIAN     | Status: Active     | Task: Ready

💰 COSTS: $0.00 / $300 ✅
```

### Send Command to Agent
```bash
$ agency send larz "Build a Twitter scheduler with auto-posting"

✅ Command logged. Larz will process on next wake.
💡 Tip: Larz will delegate to other agents as needed.
```

### Interactive Session
```bash
$ agencyi

🚀 agency> help
[Shows all commands]

🚀 agency> larz: build SaaS boilerplate
[Command sent to Larz]

🚀 agency> scout: research AI video tools  
[Command sent to Scout]

🚀 agency> costs
[Shows cost dashboard]

🚀 agency> ! ls -la /agency/shared/
[Executes shell command]

🚀 agency> quit
👋 Goodbye!
```

---

## 📁 Files Created

```
agency/
├── agency-cli              # Main CLI (bash wrapper)
├── interactive             # Interactive mode (bash wrapper)
├── scripts/
│   ├── agency              # Python CLI backend
│   ├── agency-interactive  # Python interactive mode
│   ├── daily-brief.sh
│   ├── morning-standup.sh
│   ├── evening-standup.sh
│   └── cost-check.sh
└── CLI_README.md           # Full documentation
```

---

## 🎮 Pro Tips

1. **Use interactive mode** for exploration
2. **Use command mode** for scripts/automation
3. **Shorthand** (`larz: msg`) is fastest
4. **All commands logged** to `commands.log`
5. **Tab completion** works in interactive mode

---

## 🚀 Ready to Use!

Try these commands:

```bash
# Check status
agency status

# Start interactive mode
agencyi

# Send command to Larz
agency send larz "Build a landing page generator"

# View Scout's memory
agency memory scout

# Check costs
agency costs
```

---

**Your Agency CLI is ready! Control your AI team with ease.** 🤖
