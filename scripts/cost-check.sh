#!/bin/bash
# Agency-wide cost check

LOG="/agency/shared/logs/cost_log.md"
DAILY=$(grep "$(date +%Y-%m-%d)" "$LOG" | grep -oP '\$[0-9.]+' | awk '{sum+=$1} END {printf "%.2f", sum}')

echo "💰 Daily Cost Check: $${DAILY:-0.00}"

if (( $(echo "$DAILY > 10" | bc -l) )); then
  echo "🚨 ALERT: Daily budget exceeded!"
  # Notify Larz to throttle
  echo "STOP_NON_ESSENTIAL=true" > /agency/shared/configs/emergency.conf
elif (( $(echo "$DAILY > 8" | bc -l) )); then
  echo "⚠️ WARNING: Approaching daily limit"
  echo "OPTIMIZE=true" > /agency/shared/configs/optimize.conf
fi
