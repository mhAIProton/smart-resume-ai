#!/bin/bash

# PostgreSQL Database Backup Script for Docker
# This script creates a backup of the PostgreSQL database running in Docker

# Dev command export
# docker exec smart-resume-ai-pg-dev pg_dump -U postgres -d smart_resume_ai > ./dump.sql
# Dev command import
# cat ./dump.sql | docker exec -i smart-resume-ai-pg-test psql -U postgres -d smart_resume_ai

# Load environment variables from .env.local
if [ -f ".env.local" ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

# Set default values if not provided
DB_HOST=${DB_HOST:-smart-resume-ai-pg}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-smart_resume_ai}
DB_USERNAME=${DB_USERNAME:-postgres}
BACKUP_DIR=${BACKUP_DIR:-./backups}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/smart_resume_ai_backup_$TIMESTAMP.sql"

echo "Starting database backup from Docker container..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "Backup file: $BACKUP_FILE"

# Create the backup using docker exec
docker exec smart-resume-ai-pg pg_dump \
    --host=localhost \
    --port=5432 \
    --username="$DB_USERNAME" \
    --dbname="$DB_NAME" \
    --no-password \
    --verbose \
    --clean \
    --if-exists \
    --create \
    --format=plain > "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP_FILE"
    
    # Compress the backup file
    gzip "$BACKUP_FILE"
    echo "Backup compressed: $BACKUP_FILE.gz"
    
    # Show file size
    ls -lh "$BACKUP_FILE.gz"
else
    echo "Backup failed!"
    exit 1
fi

echo "Backup process completed at $(date)"