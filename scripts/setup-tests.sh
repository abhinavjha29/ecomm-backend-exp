#!/bin/bash

# Test Setup Script
# This script sets up the test environment for the E-Commerce backend

set -e  # Exit on error

echo "🚀 Setting up test environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
echo -e "\n${YELLOW}Checking PostgreSQL...${NC}"
if ! pg_isready > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL is running${NC}"

# Create test database
echo -e "\n${YELLOW}Creating test database...${NC}"
if PGPASSWORD=abhi1234 psql -U postgres -lqt | cut -d \| -f 1 | grep -qw ecommerce_test; then
    echo -e "${YELLOW}Database 'ecommerce_test' already exists. Dropping and recreating...${NC}"
    PGPASSWORD=abhi1234 dropdb -U postgres ecommerce_test || true
fi

PGPASSWORD=abhi1234 createdb -U postgres ecommerce_test
echo -e "${GREEN}✓ Test database created${NC}"

# Run Prisma migrations
echo -e "\n${YELLOW}Running Prisma migrations on test database...${NC}"
DATABASE_URL="postgresql://postgres:abhi1234@localhost:5432/ecommerce_test?schema=public" npx prisma migrate deploy
echo -e "${GREEN}✓ Migrations completed${NC}"

# Generate Prisma Client
echo -e "\n${YELLOW}Generating Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✓ Prisma Client generated${NC}"

# Check if .env.test exists
if [ ! -f .env.test ]; then
    echo -e "\n${YELLOW}Creating .env.test file...${NC}"
    cat > .env.test << EOL
NODE_ENV=test
PORT=5081
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_test?schema=public"

# JWT Configuration
JWT_SECRET=test-jwt-secret-key-for-testing-only
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=test-jwt-refresh-secret-key-for-testing-only
JWT_REFRESH_EXPIRES_IN=30d

# Bcrypt
SALT_ROUNDS=10
EOL
    echo -e "${GREEN}✓ .env.test file created${NC}"
else
    echo -e "\n${GREEN}✓ .env.test file already exists${NC}"
fi

echo -e "\n${GREEN}✅ Test environment setup complete!${NC}"
echo -e "\n${YELLOW}You can now run tests with:${NC}"
echo "  npm test              # Run all tests with coverage"
echo "  npm run test:unit     # Run unit tests only"
echo "  npm run test:e2e      # Run E2E tests only"
echo "  npm run test:watch    # Run tests in watch mode"