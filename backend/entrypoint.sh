#!/bin/sh
# Check if the database is ready and accessible
# You might want to add logic here to wait for your database to be ready

# Update the database schema
echo "Pushing the Prisma schema to the database..."
npx prisma db push
npx prisma studio & # Remove before production
exec "$@"