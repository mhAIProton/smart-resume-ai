#!/bin/bash

# PostgreSQL Database Restore Script for Docker
# Usage: ./restore-db-docker.sh <backup_file>

# Load environment variables from .env.local
if [ -f ".env.local" ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

# Set default values if not provided
DB_HOST=${DB_HOST:-smart-resume-ai-pg}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-smart_resume_ai}
DB_USERNAME=${DB_USERNAME:-postgres}

# Check if backup file is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup_file>"
    echo "Example: $0 ./backups/smart_resume_ai_backup_20240913_120000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "Starting database restore using Docker..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "Backup file: $BACKUP_FILE"

# Confirm before proceeding
read -p "Are you sure you want to restore the database? This will overwrite existing data! (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore cancelled."
    exit 1
fi

# Check if file is compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "Decompressing and restoring backup file..."
    gunzip -c "$BACKUP_FILE" | docker exec -i smart-resume-ai-pg psql \
        --host=localhost \
        --port=5432 \
        --username="$DB_USERNAME" \
        --dbname=postgres \
        --no-password \
        --verbose
else
    echo "Restoring from uncompressed backup file..."
    docker exec -i smart-resume-ai-pg psql \
        --host=localhost \
        --port=5432 \
        --username="$DB_USERNAME" \
        --dbname=postgres \
        --no-password \
        --verbose < "$BACKUP_FILE"
fi

# Check if restore was successful
if [ $? -eq 0 ]; then
    echo "Database restore completed successfully!"
else
    echo "Database restore failed!"
    exit 1
fi

echo "Restore process completed at $(date)"