#!/usr/bin/env bash
# Render build script for Django portfolio
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Run database migrations
python manage.py migrate

# Create superuser if it doesn't exist (optional, uses env vars)
if [ -n "$DJANGO_SUPERUSER_USERNAME" ]; then
    python manage.py createsuperuser --no-input 2>/dev/null || true
fi
