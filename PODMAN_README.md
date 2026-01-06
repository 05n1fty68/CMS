# CMS Podman Deployment

This directory contains Podman Compose configuration for running the CMS backend with PostgreSQL.

## Prerequisites

- Podman installed and running

**Note**: Use `podman compose` (with space) command. If you have `podman-compose` (with hyphen) installed, you can use that instead.

## Services Included

This configuration runs the following services:

1. **PostgreSQL Database** (`cms-db`)
   - PostgreSQL 15 Alpine
   - Database: `cms_db`
   - User: `cms_user`
   - Password: `cms_password`
   - Port: 5432 (exposed for development)

2. **CMS Backend** (`cms-backend`)
   - Node.js 18 Alpine
   - Exposed on port 3000
   - Connects to PostgreSQL
   - Runs in production mode

## Quick Start

1. **Start the services:**
   ```bash
   podman compose -f podman-compose.yml up -d
   ```

2. **Access the application:**
   - Backend API: http://localhost:3000
   - Frontend: Open `src/frontend/index.html` in a browser or use a local HTTP server

3. **Default login credentials:**
   - Email: `admin@cms.local`
   - Password: `admin123`

## Configuration

### Environment Variables

The backend is configured with the following key environment variables in `podman-compose.yml`:

- `DB_HOST=cms-db` - Database hostname (container name)
- `DB_NAME=cms_db` - Database name
- `DB_USER=cms_user` - Database user
- `DB_PASSWORD=cms_password` - Database password
- `JWT_SECRET` - JWT secret key (change in production!)
- `CORS_ORIGIN` - Allowed CORS origin

### Data Persistence

All database data is stored in the `cms_data` volume, which persists across container restarts.

## Management Commands

### Start services
```bash
podman compose -f podman-compose.yml up -d
```

### Stop services
```bash
podman compose -f podman-compose.yml down
```

### View logs
```bash
podman compose -f podman-compose.yml logs -f cms-backend
podman compose -f podman-compose.yml logs -f cms-db
```

### Rebuild backend image
```bash
podman compose -f podman-compose.yml build cms-backend
podman compose -f podman-compose.yml up -d
```

### Access database
```bash
podman compose -f podman-compose.yml exec cms-db psql -U cms_user -d cms_db
```

### Access backend container
```bash
podman compose -f podman-compose.yml exec cms-backend sh
```

### Check service status
```bash
podman compose -f podman-compose.yml ps
```

## Development Setup

For development with live code changes:

1. **Run backend locally:**
   ```bash
   cd src/backend
   npm install
   cp .env.example .env
   # Edit .env with database connection to cms-db container
   npm run dev
   ```

2. **Run frontend:**
   ```bash
   cd src/frontend
   # Use any HTTP server, e.g.:
   python -m http.server 8080
   ```

3. **Keep database running:**
   ```bash
   podman compose -f podman-compose.yml up -d cms-db
   ```

## Troubleshooting

### Backend won't start
- Check logs: `podman compose -f podman-compose.yml logs cms-backend`
- Ensure database is ready: `podman compose -f podman-compose.yml logs cms-db`
- Verify network connectivity between containers

### Database connection issues
- Ensure PostgreSQL container is running: `podman compose -f podman-compose.yml ps`
- Check database logs: `podman compose -f podman-compose.yml logs cms-db`
- Verify environment variables are correct
- Wait a few seconds after starting for database to initialize

### Port conflicts
- If port 3000 is in use, modify the port mapping in `podman-compose.yml`:
  ```yaml
  ports:
    - "3001:3000"  # Change 3001 to your preferred port
  ```
- If port 5432 is in use, modify the PostgreSQL port mapping

### Frontend can't connect to backend
- Ensure backend is accessible: `curl http://localhost:3000/health`
- Check CORS configuration in backend
- Verify API_BASE_URL in `src/frontend/js/api.js` matches backend URL

### Database schema not initialized
- The schema is automatically initialized on first database start
- Check database logs: `podman compose -f podman-compose.yml logs cms-db`
- Manually run schema if needed:
  ```bash
  podman compose -f podman-compose.yml exec cms-db psql -U cms_user -d cms_db -f /docker-entrypoint-initdb.d/schema.sql
  ```

## Security Notes

- Default database credentials are for development only
- For production, change all passwords and secrets
- Consider using environment files for sensitive data
- Enable HTTPS in production environments
- Regularly update base images

## Differences from Docker Compose

This Podman configuration:
- Uses `docker.io/` prefix for base images (required by Podman)
- Uses `:Z` suffix for volume mounts (SELinux labeling)
- Works with both `podman-compose` and `podman compose` commands

## Cleanup

To remove all containers and volumes:

```bash
podman compose -f podman-compose.yml down -v
```

**Warning**: This will delete all database data!

