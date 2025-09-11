#!/bin/bash

# SmartResumeAI Development Environment Startup Script

echo "🚀 Starting SmartResumeAI Development Environment..."

# Check if .env.dev file exists
if [ ! -f .env.dev ]; then
    echo "❌ .env.dev file not found. Please create .env.dev file manually."
    echo "You can copy .env.local and change DB_HOST to 'localhost'"
    exit 1
fi

# Start PostgreSQL in Docker
echo "🐘 Starting PostgreSQL database..."
make dev-db-up

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if database is ready
until docker-compose -f docker-compose.dev.yml exec -T smart-resume-ai-pg-dev pg_isready -U postgres; do
    echo "⏳ Database is not ready yet, waiting..."
    sleep 2
done

echo "✅ Database is ready!"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🔥 Starting NestJS development server..."
echo "📡 API will be available at: http://localhost:3000"
echo "🗄️  Database will be available at: localhost:5432"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Use .env.dev file for development
export NODE_ENV=development
npm run start:dev
