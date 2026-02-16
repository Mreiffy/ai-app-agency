# AI Software Factory Pro

A production-ready dashboard for managing your AI App Agency.

## Features

- **Real-time Agent Monitoring** - Live WebSocket updates
- **Mission Control** - Launch missions to any agent
- **Approval Queue** - Approve/deny agent requests
- **Factory Floor View** - Visual workstation monitoring
- **Cost Tracking** - Live budget monitoring

## Quick Start

```bash
# Install dependencies
npm install

# Start development (runs both server and client)
npm run dev

# Or start separately
npm run server  # Backend on port 3001
npm run client  # Frontend on port 3000
```

## Production Deployment

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## API Endpoints

- `GET /api/agents` - List all agents with status
- `GET /api/missions` - List active missions
- `POST /api/missions` - Create new mission
- `GET /api/approvals` - List pending approvals
- `POST /api/approvals/:id` - Approve/deny request
- `GET /api/metrics` - Get cost metrics

## WebSocket Events

- `agents` - Agent status updates
- `mission_created` - New mission notification
- `approval_handled` - Approval processed

## Architecture

```
┌─────────────┐     WebSocket      ┌─────────────┐
│   React     │◄──────────────────►│   Express   │
│   Client    │                    │   Server    │
└──────┬──────┘                    └──────┬──────┘
       │                                   │
       │ HTTP                              │ File Watch
       │                                   │
       ▼                                   ▼
┌─────────────┐                    ┌─────────────┐
│   API       │                    │   Agency    │
│   Routes    │                    │   Files     │
└─────────────┘                    └─────────────┘
```
