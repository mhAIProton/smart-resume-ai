# SmartResumeAI Development Environment Startup Script for Windows

Write-Host "🚀 Starting SmartResumeAI Development Environment..." -ForegroundColor Green

# Check if .env.dev file exists
if (-not (Test-Path ".env.dev")) {
    Write-Host "❌ .env.dev file not found. Please create .env.dev file manually." -ForegroundColor Red
    Write-Host "You can copy .env.local and change DB_HOST to 'localhost'" -ForegroundColor Yellow
    exit 1
}

# Start PostgreSQL in Docker
Write-Host "🐘 Starting PostgreSQL database..." -ForegroundColor Blue
make dev-db-up

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if database is ready
do {
    try {
        $result = docker-compose -f docker-compose.dev.yml exec -T smart-resume-ai-pg-dev pg_isready -U postgres 2>$null
        if ($LASTEXITCODE -eq 0) {
            break
        }
    } catch {
        # Continue waiting
    }
    Write-Host "⏳ Database is not ready yet, waiting..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
} while ($true)

Write-Host "✅ Database is ready!" -ForegroundColor Green

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
    npm install
}

# Start the development server
Write-Host "🔥 Starting NestJS development server..." -ForegroundColor Green
Write-Host "📡 API will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🗄️  Database will be available at: localhost:5432" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run start:dev
