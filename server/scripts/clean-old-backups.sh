#!/bin/bash

# Cleanup Old Database Backups Script
# This script removes backup files older than 2 months

# Load environment variables from .env.local
if [ -f ".env.local" ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

# Set default values if not provided
BACKUP_DIR=${BACKUP_DIR:-./backups}
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-60}  # 2 months = 60 days

echo "Starting cleanup of old database backups..."
echo "Backup directory: $BACKUP_DIR"
echo "Retention period: $RETENTION_DAYS days"

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo "Backup directory does not exist: $BACKUP_DIR"
    exit 1
fi

# Count files before cleanup
FILES_BEFORE=$(find "$BACKUP_DIR" -name "smart_resume_ai_backup_*.sql.gz" | wc -l)
echo "Found $FILES_BEFORE backup files before cleanup"

# Remove files older than retention period
DELETED_COUNT=0
while IFS= read -r -d '' file; do
    if [ -f "$file" ]; then
        echo "Deleting old backup: $(basename "$file")"
        rm "$file"
        ((DELETED_COUNT++))
    fi
done < <(find "$BACKUP_DIR" -name "smart_resume_ai_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -print0)

# Count files after cleanup
FILES_AFTER=$(find "$BACKUP_DIR" -name "smart_resume_ai_backup_*.sql.gz" | wc -l)

echo "Cleanup completed!"
echo "Files deleted: $DELETED_COUNT"
echo "Files remaining: $FILES_AFTER"
echo "Cleanup process completed at $(date)"