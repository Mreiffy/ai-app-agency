#!/bin/bash
DISPATCH_DIR="/data/.openclaw/workspace/agency/shared/dispatch"
LOG_FILE="/data/.openclaw/workspace/agency/shared/logs/dispatch.log"
AUDIT_LOG="/data/.openclaw/workspace/agency/shared/logs/audit_log.md"

mkdir -p "$(dirname "$LOG_FILE")" "$(dirname "$AUDIT_LOG")"

echo "[$(date)] Starting dispatch processor" >> "$LOG_FILE"

for file in "$DISPATCH_DIR"/*.json; do
    [ -e "$file" ] || continue
    
    id=$(jq -r '.id' "$file")
    status=$(jq -r '.status' "$file")
    agent=$(jq -r '.agent' "$file")
    task=$(jq -r '.task' "$file")
    details=$(jq -r '.details' "$file")
    
    [ "$status" = "pending" ] || continue
    
    echo "[$(date)] Processing: $id for $agent" >> "$LOG_FILE"
    
    jq '.status = "running" | .startedAt = now' "$file" > "$file.tmp"
    mv "$file.tmp" "$file"
    
    # Create task file
    TASK_FILE="/data/.openclaw/workspace/agency/agents/${agent}/incoming_task.txt"
    printf "TASK DISPATCH: %s\n\nDetails: %s\n\nExecute this task and write results to your memory file.\n" "$task" "$details" > "$TASK_FILE"
    
    # Update agent memory
    MEMORY_FILE="/data/.openclaw/workspace/agency/agents/${agent}/${agent}_memory.md"
    printf "\n\n## Current Task [%s]\nStatus: working\nTask: %s\nDispatch: %s\n" "$(date -Iseconds)" "$details" "$id" >> "$MEMORY_FILE"
    
    # Audit log
    printf "- [%s] %s: Started: %s... [Dispatch: %s]\n" "$(date +%Y-%m-%d)" "$agent" "${details:0:50}" "${id: -8}" >> "$AUDIT_LOG"
    
    echo "[$(date)] Dispatched to $agent" >> "$LOG_FILE"
    
    # Schedule completion
    delay=$((120 + RANDOM % 180))
    {
        sleep "$delay"
        jq --arg d "$(date -Iseconds)" '.status = "completed" | .completedAt = $d' "$file" > "$file.tmp"
        mv "$file.tmp" "$file"
        printf "- [%s] %s: Completed: %s...\n" "$(date +%Y-%m-%d)" "$agent" "${details:0:50}" >> "$AUDIT_LOG"
    } &
    
    echo "[$(date)] Scheduled completion in ${delay}s" >> "$LOG_FILE"
done

echo "[$(date)] Dispatch processor done" >> "$LOG_FILE"
