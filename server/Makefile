# SmartResumeAI Docker Commands

.PHONY: help build up down restart logs ps shell db-shell clean env

# Build images
build:
	docker-compose build

# Start services
up:
	docker-compose up -d

# Stop services
down:
	docker-compose down

# Restart services
restart: down up

# Show logs
logs:
	docker-compose logs -f

# Show API logs
logs-api:
	docker-compose logs -f smart-resume-ai-api

# Show database logs
logs-db:
	docker-compose logs -f smart-resume-ai-pg

# Show running containers
ps:
	docker-compose ps

# Open shell in API container
shell:
	docker-compose exec smart-resume-ai-api sh

# Open PostgreSQL shell
db-shell:
	docker-compose exec smart-resume-ai-pg sh

# Open psql in PostgreSQL container
db-psql:
	docker-compose exec smart-resume-ai-pg psql -U postgres -d smart_resume_ai

# Clean up everything
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

# Rebuild and restart
rebuild: clean build up

# Development helpers
dev-logs:
	docker-compose logs -f --tail=100

# Database operations
db-backup:
	docker-compose exec smart-resume-ai-pg pg_dump -U postgres smart_resume_ai > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Quick database access with custom database name
db-psql-%:
	docker-compose exec smart-resume-ai-pg psql -U postgres -d $*

env:
	docker exec smart-resume-ai-api env
