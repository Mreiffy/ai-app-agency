#!/bin/bash
#
# Dispatch Queue Processor
# Polls /agency/shared/dispatch/ for pending tasks and spawns agents
# Runs every minute via cron
#

DISPATCH_DIR="/data/.openclaw/workspace/agency/shared/dispatch"
LOG_FILE="/data/.openclaw/workspace/agency/shared/logs/dispatch.log"
AUDIT_LOG="/data/.openclaw/workspace/agency/shared/logs/audit_log.md"

# Ensure log directories exist
mkdir -p "$(dirname "$LOG_FILE")"
mkdir -p "$(dirname "$AUDIT_LOG)"

echo "[$(date)] Dispatch processor starting..." >> "$LOG_FILE"

# Function to append to audit log
append_audit() {
    local agent="$1"
    local message="$2"
    echo "- [$(date +%Y-%m-%d)] ${agent}: ${message}" >> "$AUDIT_LOG"
}

# Find all pending dispatch files
for file in "$DISPATCH_DIR"/*.json; do
    [ -e "$file" ] || continue
    
    # Parse the dispatch file
    id=$(jq -r '.id' "$file" 2>/dev/null)
    status=$(jq -r '.status' "$file" 2>/dev/null)
    agent=$(jq -r '.agent' "$file" 2>/dev/null)
    task=$(jq -r '.task' "$file" 2>/dev/null)
    details=$(jq -r '.details' "$file" 2>/dev/null)
    
    # Skip if not pending
    [ "$status" = "pending" ] || continue
    
    echo "[$(date)] Processing: $id for $agent" >> "$LOG_FILE"
    
    # Update status to running
    jq '.status = "running" | .startedAt = now' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    
    # Build task message for agent
    TASK_MSG="TASK DISPATCH: $task

Details: $details

Instructions:
1. Complete this task to the best of your ability
2. Write your findings/outputs to your memory file
3. Update the dispatch file at $file when complete
4. Set status to 'completed' in the dispatch file

You are ${agent}, an autonomous agent in the AI Agency. Execute independently."
    
    # Create a task file for the agent
    TASK_FILE="/data/.openclaw/workspace/agency/agents/${agent}/incoming_task.txt"
    echo "$TASK_MSG" > "$TASK_FILE"
    
    # Update agent memory to show current task
    MEMORY_FILE="/data/.openclaw/workspace/agency/agents/${agent}/${agent}_memory.md"
    echo -e "\n\n## Current Task [$(date -Iseconds)]\nStatus: working\nTask: $details\nDispatch: $id\n" >> "$MEMORY_FILE"
    
    # Append to audit log
    append_audit "$agent" "Started task: ${details:0:50}... [Dispatch: ${id: -8}]"
    
    echo "[$(date)] Dispatched to $agent, task files created" >> "$LOG_FILE"
    
    # For now, auto-complete after a delay (simulation mode)
    # In production, this would be handled by actual agent completion
    # Schedule completion via at command if available
    if command -v at &> /dev/null; then
        # Schedule completion in 2-5 minutes (random)
        delay=$((120 + RANDOM % 180))
        echo "sleep $delay && jq '.status = \"completed\" | .completedAt = \"'\"$(date -Iseconds)\"'\"' '$file' > '$file.tmp' && mv '$file.tmp' '$file' && echo '- [\"$(date +%Y-%m-%d)\"] ${agent}: Completed task: ${details:0:50}...' >> '$AUDIT_LOG'" | at now + $delay seconds 2>/dev/null
        echo "[$(date)] Scheduled completion in ${delay}s" >> "$LOG_FILE"
    fi
    
done

echo "[$(date)] Dispatch processor complete" >> "$LOG_FILE"
