#!/bin/bash
set -e

echo "Waiting for DB..."
./wait-for-it.sh "$DB_HOST:$DB_PORT" --timeout=120 --strict

echo "Waiting for Mosquitto..."
./wait-for-it.sh "$MQTT_HOST:$MQTT_PORT" --timeout=60 --strict

echo "Pushing schema to DB..."
npx prisma db push

echo "Initializing provinces..."
mariadb --ssl=0 \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --user="$DB_USER" \
  --password="$DB_PASSWORD" \
  "$DB_NAME" < prisma/indonesia.sql || echo "Skipping init if already exists"

echo "Seeding DB..."
node prisma/seed.js

echo "Starting server..."
npm run start
