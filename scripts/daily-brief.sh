#!/bin/bash
# 8am Daily Brief to Founder

echo "Generating 8am Daily Brief..."

OUTPUT="/agency/shared/outputs/daily-brief-$(date +%Y%m%d).md"

cat > "$OUTPUT" << EOF
# 🌅 Good Morning! Daily Brief - $(date '+%A, %B %d, %Y')

## 🚀 Overnight Shipments
$(cat /agency/shared/logs/overnight-builds.log 2>/dev/null || echo "- No overnight builds (yet!)")

## 💡 3 App Ideas from Scout's Research
1. [Idea 1] - [Based on trend] - [Market]
2. [Idea 2] - [Based on trend] - [Market]
3. [Idea 3] - [Based on trend] - [Market]

## 🔥 Trend Summary
- [Key trend 1]
- [Key trend 2]
- [Competitor move]

## 📊 Yesterday's Progress
- Tasks completed: [X]
- PRs ready for review: [X]
- Issues/blockers: [None/see below]

## 🎯 Today's Priorities
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

## 🤝 Standup Highlights
- [Notable collaboration]
- [Relationship update]
- [Agent self-improvement]

## 💰 Cost Status
- Yesterday: $[X]
- Month to date: $[X] / $300
- Status: [On track/Warning]

## ⚠️ Needs Your Attention
- [PRs awaiting approval]
- [Decisions needed]
- [Emergent behaviors proposed]

---
*Built with 💙 by your AI App Agency*
*Reply with ✅, ❌, or specific instructions*
EOF

echo "Brief saved to: $OUTPUT"
echo "Sending to founder..."
# Logic to send via Discord/Telegram
