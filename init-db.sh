#!/bin/bash
set -e

echo "Initializing database..."

# Create database if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT 'Database initialized successfully';
EOSQL

echo "Database initialization completed!"