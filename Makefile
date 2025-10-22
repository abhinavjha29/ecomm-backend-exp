.PHONY: help build up down restart logs shell db-shell migrate clean

# Variables
COMPOSE = docker-compose
APP_SERVICE = app
DB_SERVICE = postgres

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build or rebuild services
	$(COMPOSE) build

up: ## Start services in detached mode
	$(COMPOSE) up -d

up-dev: ## Start services in development mode
	$(COMPOSE) --profile dev up -d

down: ## Stop and remove containers, networks
	$(COMPOSE) down

down-v: ## Stop and remove containers, networks, and volumes
	$(COMPOSE) down -v

restart: ## Restart services
	$(COMPOSE) restart

logs: ## View output from containers
	$(COMPOSE) logs -f

logs-app: ## View application logs
	$(COMPOSE) logs -f $(APP_SERVICE)

logs-db: ## View database logs
	$(COMPOSE) logs -f $(DB_SERVICE)

ps: ## List containers
	$(COMPOSE) ps

shell: ## Access application shell
	$(COMPOSE) exec $(APP_SERVICE) sh

db-shell: ## Access PostgreSQL shell
	$(COMPOSE) exec $(DB_SERVICE) psql -U postgres -d ecommerce

migrate: ## Run database migrations
	$(COMPOSE) exec $(APP_SERVICE) npx prisma migrate deploy

migrate-dev: ## Run database migrations in dev mode
	$(COMPOSE) exec $(APP_SERVICE) npx prisma migrate dev

generate: ## Generate Prisma Client
	$(COMPOSE) exec $(APP_SERVICE) npx prisma generate

studio: ## Open Prisma Studio
	$(COMPOSE) exec $(APP_SERVICE) npx prisma studio

seed: ## Seed the database
	$(COMPOSE) exec $(APP_SERVICE) npx prisma db seed

lint: ## Run linter
	$(COMPOSE) exec $(APP_SERVICE) npm run lint

test: ## Run tests
	$(COMPOSE) exec $(APP_SERVICE) npm test

clean: ## Remove all containers, volumes, and images
	$(COMPOSE) down -v --rmi all

backup: ## Backup database
	@mkdir -p backups
	$(COMPOSE) exec $(DB_SERVICE) pg_dump -U postgres ecommerce > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup created in backups/ directory"

restore: ## Restore database from backup (usage: make restore FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "Error: Please specify FILE=<backup_file>"; \
		exit 1; \
	fi
	$(COMPOSE) exec -T $(DB_SERVICE) psql -U postgres ecommerce < $(FILE)
	@echo "Database restored from $(FILE)"

rebuild: ## Rebuild and restart services
	$(COMPOSE) down
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d

health: ## Check health of services
	@echo "Checking service health..."
	@curl -f http://localhost:5080/api/test || echo "Application not healthy"
	@$(COMPOSE) exec $(DB_SERVICE) pg_isready -U postgres || echo "Database not healthy"

install: ## Initial setup - copy env, build, and start
	@if [ ! -f .env ]; then \
		cp .env.docker .env; \
		echo ".env file created from .env.docker"; \
		echo "Please edit .env with your configuration"; \
	else \
		echo ".env file already exists"; \
	fi
	$(COMPOSE) build
	$(COMPOSE) up -d
	@echo "Installation complete! Application starting..."
	@echo "Visit http://localhost:5080"