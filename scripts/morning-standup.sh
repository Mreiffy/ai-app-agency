# Agency Automation Scripts

## Daily Standups (2x per day)

### Morning Standup (9:00 AM EST)
```bash
#!/bin/bash
# morning-standup.sh

echo "🌅 Morning Standup - $(date)"
echo "=============================="

# Read all agent memories
echo "📊 Agent Status:"
for agent in larz scout julie engineer innovator guardian; do
  echo "  - $agent: $(cat /agency/shared/memory/${agent}_status.txt 2>/dev/null || echo 'No status')"
done

# Generate standup agenda
echo ""
echo "📋 Today's Agenda:"
echo "  1. Overnight builds review"
echo "  2. Today's priorities"
echo "  3. Blockers/support needed"
echo "  4. Relationship updates"

# Update relationships based on yesterday
echo ""
echo "🤝 Relationship Updates:"
# Logic to adjust scores based on collaboration

echo ""
echo "✅ Standup complete. Action items logged."
