# 🏭 Software Factory Dashboard

## Overview

A stunning visual dashboard that transforms your AI App Agency into an inspiring **Software Factory** - a living, breathing production floor you can watch in real-time.

## Features

### 🎨 Visual Design
- **Cyberpunk/Sci-fi aesthetic** with neon accents
- **Dark mode** optimized for monitoring
- **Animated grid background** with subtle effects
- **Live status indicators** with pulsing animations

### 📊 Dashboard Layout

#### Left Panel - Agent Control
- **6 Agent Cards** with live status
  - Avatar, name, role
  - Real-time status (Online/Working)
  - Current task display
  - Click to focus
- **Quick Stats** - Apps shipped, revenue

#### Center Panel - Factory Floor
- **Software Factory Visualization**
  - Work stations for each agent type
  - Animated conveyor belt with app packages
  - Live terminal showing real commands
  - Production line metaphor

#### Right Panel - Activity Stream
- **Live Activity Feed** - Real-time updates
- **Progress Bars** - Current operations
- **Scheduled Events** - Upcoming standups
- **Auto-updating** every 5-15 seconds

### ⚡ Live Features

| Feature | Description |
|---------|-------------|
| **Real-time Activity** | New events appear automatically |
| **Status Pulsing** | Working agents pulse cyan |
| **Conveyor Animation** | Apps move across the factory floor |
| **Terminal Updates** | Live command output |
| **Progress Tracking** | Visual progress bars |

## Launch Dashboard

### Start Server
```bash
cd /data/.openclaw/workspace/agency
./agency-dashboard start
```

### Access Dashboard
- **Local:** http://localhost:8080
- **Network:** http://YOUR_IP:8080

### Stop Server
```bash
./agency-dashboard stop
```

## Access Options

### Option 1: Local Machine (Same VPS)
```bash
curl http://localhost:8080
# Or open in lynx/w3m
```

### Option 2: Expose to Internet (with tunnel)
```bash
# Using ngrok
ngrok http 8080

# Using Cloudflare Tunnel
cloudflared tunnel --url http://localhost:8080
```

### Option 3: Your Local Browser via SSH
```bash
# From your local machine
ssh -L 8080:localhost:8080 user@vps-ip
# Then open http://localhost:8080 on your Mac
```

## Dashboard Sections

### Header
- Agency name & logo
- Live status indicators
- Cost tracking
- Next event countdown

### Agent Cards (Left)
- 🦞 Larz - Orchestrator
- 🔍 Scout - Researcher
- 🎨 Julie - Content/Design
- 🏗️ Engineer - Developer
- 💡 Innovator - Improver
- 🛡️ Guardian - Cost/Safety

### Factory Floor (Center)
- Visual production line
- Work stations
- Conveyor belt with packages
- Live terminal output

### Activity Stream (Right)
- Timestamped events
- Agent actions
- Progress tracking
- Scheduled events

## Customization

### Change Colors
Edit CSS variables in `index.html`:
```css
:root {
    --accent-cyan: #00f0ff;
    --accent-purple: #a855f7;
    --accent-green: #22c55e;
}
```

### Add More Stats
Edit the Quick Stats section in the HTML

### Customize Activity Feed
Modify the `activities` array in the JavaScript

## Screenshots

The dashboard shows:
- All 6 agents with real-time status
- Factory floor visualization
- Live terminal with commands
- Activity stream updating in real-time
- Progress bars for operations
- Next scheduled events

## Integration with CLI

The dashboard complements the CLI:
- **CLI** for commands and control
- **Dashboard** for visualization and monitoring

Use both together:
```bash
# Terminal 1: Start dashboard
./agency-dashboard start

# Terminal 2: Use CLI
./agency-cli status
./agency-cli send larz "build app"
```

## Future Enhancements

Possible additions:
- [ ] WebSocket for true real-time updates
- [ ] Charts for cost/revenue over time
- [ ] Agent avatars with animation
- [ ] Sound effects for events
- [ ] Mobile-responsive design
- [ ] Dark/light mode toggle
- [ ] Export data to CSV
- [ ] Integration with Discord/Telegram

## File Structure

```
dashboard/
├── index.html          # Main dashboard (16KB)
├── README.md           # This file
└── assets/             # (for future images, etc.)
```

## Technical Details

- **Pure HTML/CSS/JS** - No frameworks needed
- **Self-contained** - Single file deployment
- **Lightweight** - Loads instantly
- **No dependencies** - Works offline
- **Responsive** - Adapts to screen size

---

**Watch your AI team work in real-time!** 🚀
