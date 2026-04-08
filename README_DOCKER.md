# 🐳 Xpert Docker Guide

This project is fully containerized to ensure it runs consistently across macOS, Windows (WSL2), and Linux.

## Quick Start (Development)

To bring up the entire stack (API + Database + React Frontend), run:

```bash
docker-compose up --build
```

### What this does:
1.  **API (`http://localhost:8000`)**: Starts the Laravel backend.
2.  **DB**: Starts a MySQL 8.0 instance.
3.  **Frontend (`http://localhost:5173`)**: Starts the Vite development server with Hot Module Replacement (HMR).

## Common Commands

### Stop the application
```bash
docker-compose down
```

### Run migrations inside Docker
```bash
docker-compose exec api php artisan migrate
```

### Install new dependencies
```bash
docker-compose exec api composer install
docker-compose exec frontend npm install
```

## Troubleshooting
- **Database Connection**: The API is configured to connect to the `db` service using the credentials defined in `docker-compose.yml`.
- **Ports**: If port 8000 or 5173 is already in use on your system, update the `ports` mapping in `docker-compose.yml`.
