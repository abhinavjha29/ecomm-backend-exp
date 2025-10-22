# Docker Setup Guide

This guide explains how to run the E-Commerce Backend using Docker and Docker Compose.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Development Mode](#development-mode)
- [Production Mode](#production-mode)
- [Docker Commands](#docker-commands)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)

## 🐳 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)

### Verify Installation

```bash
docker --version
docker-compose --version
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd back-express
```

### 2. Set Up Environment Variables

```bash
# Copy the Docker environment template
cp .env.docker .env

# Edit the .env file with your configuration
nano .env  # or use your preferred editor
```

### 3. Start the Application

```bash
# Start in production mode
docker-compose up -d

# Or start in development mode
docker-compose --profile dev up -d
```

### 4. Verify Everything is Running

```bash
# Check running containers
docker-compose ps

# View application logs
docker-compose logs -f app

# Check database logs
docker-compose logs -f postgres
```

### 5. Access the Application

- **API**: http://localhost:5080
- **Health Check**: http://localhost:5080/api/test
- **API Documentation**: http://localhost:5080/api-docs

## ⚙️ Configuration

### Environment Variables

The `.env` file contains all configuration variables:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_DB=ecommerce
POSTGRES_PORT=5432

# Application
PORT=5080
NODE_ENV=production

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# Security
SALT_ROUNDS=10
```

### Important Security Notes

⚠️ **For Production:**

1. **Change all default passwords and secrets!**
2. Use strong, randomly generated values:
   ```bash
   # Generate secure secrets
   openssl rand -base64 32
   ```
3. Never commit `.env` files with production credentials

## 🏃‍♂️ Running the Application

### Production Mode (Recommended)

Production mode uses optimized builds and minimal dependencies:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**What happens:**

1. PostgreSQL database starts and initializes
2. Application waits for database to be healthy
3. Prisma migrations run automatically
4. Application starts on port 5080

### Development Mode

Development mode includes hot-reload and dev tools:

```bash
# Start development services
docker-compose --profile dev up -d

# View logs
docker-compose logs -f app-dev

# Stop services
docker-compose --profile dev down
```

**Features in dev mode:**

- 🔄 Hot reload with nodemon
- 📦 All dev dependencies available
- 🔍 Source maps enabled
- 💾 Volume mounting for live code changes

## 🐳 Docker Commands

### Container Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Rebuild containers (after code changes)
docker-compose up -d --build
```

### Logs and Monitoring

```bash
# View all logs
docker-compose logs

# Follow logs (real-time)
docker-compose logs -f

# View specific service logs
docker-compose logs app
docker-compose logs postgres

# View last 100 lines
docker-compose logs --tail=100
```

### Database Operations

```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d ecommerce

# Run Prisma migrations
docker-compose exec app npx prisma migrate deploy

# Generate Prisma Client
docker-compose exec app npx prisma generate

# Open Prisma Studio
docker-compose exec app npx prisma studio

# Backup database
docker-compose exec postgres pg_dump -U postgres ecommerce > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres ecommerce < backup.sql
```

### Application Commands

```bash
# Access application shell
docker-compose exec app sh

# Run linting
docker-compose exec app npm run lint

# Check linting errors
docker-compose exec app npm run lint:check

# Format code
docker-compose exec app npm run format

# Build TypeScript
docker-compose exec app npm run build
```

### Health Checks

```bash
# Check container health status
docker-compose ps

# Test API endpoint
curl http://localhost:5080/api/test

# Check application health
docker-compose exec app wget --quiet --tries=1 --spider http://localhost:5080/api/test
```

## 🛠️ Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process using port 5080
lsof -ti:5080 | xargs kill -9

# Or change the port in .env file
PORT=5081
```

#### Database Connection Failed

```bash
# Check if database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres

# Wait for database to be ready
docker-compose exec postgres pg_isready -U postgres
```

#### Container Won't Start

```bash
# View detailed logs
docker-compose logs app

# Rebuild container
docker-compose up -d --build --force-recreate app

# Remove and recreate volumes
docker-compose down -v
docker-compose up -d
```

#### Prisma Migration Issues

```bash
# Reset database (WARNING: destroys all data)
docker-compose exec app npx prisma migrate reset

# Deploy pending migrations
docker-compose exec app npx prisma migrate deploy

# Create new migration
docker-compose exec app npx prisma migrate dev --name init
```

#### Permission Errors

```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Rebuild with no cache
docker-compose build --no-cache
```

### Debug Mode

```bash
# Run with debug output
docker-compose --verbose up

# Check container details
docker inspect ecommerce-app

# Check network
docker network inspect back-express_ecommerce-network
```

## 🏗️ Architecture

### Container Structure

```
┌─────────────────────────────────────────┐
│         Docker Compose                  │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐   ┌──────────────┐  │
│  │              │   │              │  │
│  │  PostgreSQL  │◄──┤     App      │  │
│  │  (postgres)  │   │  (Node.js)   │  │
│  │              │   │              │  │
│  │  Port: 5432  │   │  Port: 5080  │  │
│  │              │   │              │  │
│  └──────────────┘   └──────────────┘  │
│         │                   │          │
│         │                   │          │
│    [Volume:              [Volume:      │
│   postgres_data]          logs]        │
│                                         │
└─────────────────────────────────────────┘
            │
            │ Network: ecommerce-network
            │
```

### Services

#### PostgreSQL Database

- **Image**: postgres:15-alpine
- **Port**: 5432
- **Volume**: postgres_data (persistent storage)
- **Health Check**: pg_isready

#### Application (Production)

- **Build**: Multi-stage Dockerfile
- **Port**: 5080
- **Depends On**: postgres (healthy)
- **Auto-restart**: unless-stopped
- **Health Check**: HTTP GET /api/test

#### Application (Development)

- **Build**: Dockerfile.dev
- **Port**: 5080
- **Volume**: Source code mounted for hot-reload
- **Profile**: dev (optional)

### Networking

All services run in an isolated Docker network (`ecommerce-network`):

- Containers can communicate using service names
- Example: `postgres:5432` from app container

### Volumes

- **postgres_data**: Persists database data
- **./logs**: Application logs (mounted from host)
- **./node_modules**: Dependencies (dev mode only)

## 📊 Performance Optimization

### Production Best Practices

1. **Use multi-stage builds** (already implemented)
2. **Run as non-root user** (already implemented)
3. **Minimize image size** (using alpine base)
4. **Use .dockerignore** (already configured)
5. **Health checks enabled** (already configured)

### Resource Limits (Optional)

Add to `docker-compose.yml`:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## 🔒 Security Checklist

- [ ] Change default database passwords
- [ ] Use strong JWT secrets
- [ ] Don't expose unnecessary ports
- [ ] Run containers as non-root user ✅
- [ ] Keep images updated
- [ ] Use environment-specific .env files
- [ ] Enable Docker Content Trust (DCT)
- [ ] Scan images for vulnerabilities

```bash
# Scan image for vulnerabilities
docker scan ecommerce-app
```

## 🚢 Deployment

### Building for Production

```bash
# Build production image
docker build -t ecommerce-backend:latest .

# Tag for registry
docker tag ecommerce-backend:latest your-registry/ecommerce-backend:latest

# Push to registry
docker push your-registry/ecommerce-backend:latest
```

### Docker Compose Production

```bash
# Use production compose file
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📝 Maintenance

### Regular Tasks

```bash
# Update images
docker-compose pull

# Rebuild containers
docker-compose up -d --build

# Clean up unused resources
docker system prune -a

# Clean up volumes (careful!)
docker volume prune
```

### Backups

```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres ecommerce > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup application data
docker run --rm -v back-express_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

## 🎯 Quick Reference

### Start Everything

```bash
docker-compose up -d
```

### Stop Everything

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f
```

### Restart Application

```bash
docker-compose restart app
```

### Access Database

```bash
docker-compose exec postgres psql -U postgres -d ecommerce
```

### Run Migrations

```bash
docker-compose exec app npx prisma migrate deploy
```

---

**For more information, see the main [README.md](README.md)**

**Happy Dockerizing! 🐳**
