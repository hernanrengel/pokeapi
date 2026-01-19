#!/bin/sh
set -e

echo "Waiting for database to be ready..."
sleep 5

echo "Running Prisma migrations..."
npx prisma migrate deploy || echo "Migrations failed, trying db push..."
npx prisma db push --accept-data-loss || echo "DB push failed"

echo "Database setup complete!"

echo "Starting application..."
exec "$@"
