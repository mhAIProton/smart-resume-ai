#!/bin/bash

# PostgreSQL Database Backup Script
# This script creates a backup of the PostgreSQL database

# Load environment variables from .env.local
if [ -f ".env.local" ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

# Set default values if not provided
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-smart_resume_ai}
DB_USERNAME=${DB_USERNAME:-postgres}
BACKUP_DIR=${BACKUP_DIR:-../backups}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/smart_resume_ai_backup_$TIMESTAMP.sql"

# Set PGPASSWORD environment variable for non-interactive backup
export PGPASSWORD="$DB_PASSWORD"

echo "Starting database backup..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "Backup file: $BACKUP_FILE"

# Create the backup
pg_dump \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USERNAME" \
    --dbname="$DB_NAME" \
    --no-password \
    --verbose \
    --clean \
    --if-exists \
    --create \
    --format=plain \
    --file="$BACKUP_FILE"

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

# Unset password variable
unset PGPASSWORD

echo "Backup process completed at $(date)"
EOF