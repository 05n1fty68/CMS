# CMS Podman Deployment Guide

This guide explains how to deploy and run the Client Management System using Podman containers.

## Prerequisites

- **Podman** installed and running
  - Installation: https://podman.io/getting-started/installation
- **podman-compose** installed (or use `podman compose` if available)
  - Installation: `pip install podman-compose`

## Services Included

This Podman Compose configuration runs the following services:

1. **PostgreSQL Database** (`cms-db`)
   - PostgreSQL 15 Alpine
   - Database: `cms_db`
   - User: `cms_user`
   - Password: `cms_password`
   - Port: 5432 (internal only, optionally exposed on host)

2. **CMS Backend** (`cms-backend`)
   - Node.js 18 Alpine
   - Express.js API server
   - Exposed on port 3000
   - Connects to PostgreSQL database

## Quick Start

### 1. Start all services

```bash
podman-compose up -d
```

This command will:
- Build the backend container image (if not already built)
- Start the PostgreSQL database container
- Start the backend API container
- Initialize the database schema automatically

### 2. Verify services are running

```bash
podman-compose ps
```

You should see both `cms-db` and `cms-backend` containers running.

### 3. Check logs

```bash
# Backend logs
podman-compose logs -f cms-backend

# Database logs
podman-compose logs -f cms-db
```

### 4. Test the API

```bash
curl http://localhost:3000/api/health
```

You should receive a JSON response indicating the API is running.

## Configuration

### Environment Variables

The backend is configured with the following key environment variables (set in `podman-compose.yml`):

- `DB_HOST=cms-db` - Database hostname (container name)
- `DB_PORT=5432` - Database port
- `DB_NAME=cms_db` - Database name
- `DB_USER=cms_user` - Database user
- `DB_PASSWORD=cms_password` - Database password
- `JWT_SECRET=cms-jwt-secret-key-change-in-production` - JWT signing secret
- `PORT=3000` - Backend server port
- `NODE_ENV=development` - Environment mode

### Data Persistence

All database data is stored in the `cms_data` volume, which persists even when containers are stopped.

## Management Commands

### Start services
```bash
podman-compose up -d
```

### Stop services
```bash
podman-compose down
```

### Stop and remove volumes (WARNING: Deletes all data)
```bash
podman-compose down -v
```

### View logs
```bash
# All services
podman-compose logs -f

# Specific service
podman-compose logs -f cms-backend
podman-compose logs -f cms-db
```

### Rebuild backend image
```bash
podman-compose build cms-backend
podman-compose up -d
```

### Restart a specific service
```bash
podman-compose restart cms-backend
podman-compose restart cms-db
```

## Database Management

### Access PostgreSQL database

```bash
podman-compose exec cms-db psql -U cms_user -d cms_db
```

### Run SQL commands

```bash
# Execute a SQL file
podman-compose exec -T cms-db psql -U cms_user -d cms_db < your-script.sql

# Execute a single SQL command
podman-compose exec cms-db psql -U cms_user -d cms_db -c "SELECT COUNT(*) FROM clients;"
```

### Backup database

```bash
podman-compose exec cms-db pg_dump -U cms_user cms_db > backup.sql
```

### Restore database

```bash
podman-compose exec -T cms-db psql -U cms_user -d cms_db < backup.sql
```

## Container Management

### Access backend container shell

```bash
podman-compose exec cms-backend sh
```

### Access database container shell

```bash
podman-compose exec cms-db sh
```

### View container resource usage

```bash
podman stats
```

## Troubleshooting

### Backend won't start

1. **Check logs**:
   ```bash
   podman-compose logs cms-backend
   ```

2. **Verify database is ready**:
   ```bash
   podman-compose logs cms-db
   ```

3. **Check if database is accessible from backend**:
   ```bash
   podman-compose exec cms-backend ping -c 3 cms-db
   ```

### Database connection issues

1. **Ensure PostgreSQL container is running**:
   ```bash
   podman-compose ps
   ```

2. **Check database logs**:
   ```bash
   podman-compose logs cms-db
   ```

3. **Verify environment variables**:
   ```bash
   podman-compose exec cms-backend env | grep DB_
   ```

4. **Test database connection manually**:
   ```bash
   podman-compose exec cms-backend sh -c "PGPASSWORD=cms_password psql -h cms-db -U cms_user -d cms_db -c 'SELECT NOW();'"
   ```

### Port conflicts

If port 3000 is already in use, modify the port mapping in `podman-compose.yml`:

```yaml
services:
  cms-backend:
    ports:
      - "3001:3000"  # Change 3001 to your preferred port
```

Then restart:
```bash
podman-compose down
podman-compose up -d
```

### Container build issues

If the backend image fails to build:

1. **Check for syntax errors in Containerfile**:
   ```bash
   podman build -t cms-backend-test -f cms-backend/Containerfile cms-backend/
   ```

2. **Clear build cache and rebuild**:
   ```bash
   podman-compose build --no-cache cms-backend
   ```

### Network issues

If containers can't communicate:

1. **Check network exists**:
   ```bash
   podman network ls
   ```

2. **Inspect network**:
   ```bash
   podman network inspect cms_cms_network
   ```

3. **Recreate network**:
   ```bash
   podman-compose down
   podman-compose up -d
   ```

## Development Workflow

### Making code changes

1. **Edit backend code** in `cms-backend/` directory
2. **Rebuild and restart**:
   ```bash
   podman-compose build cms-backend
   podman-compose up -d cms-backend
   ```

### Viewing real-time logs

```bash
podman-compose logs -f cms-backend
```

## Security Considerations

⚠️ **For Development/Interim Use Only**:

- Default credentials are used for simplicity
- JWT secret is a placeholder
- Database is exposed on host port (optional)
- No HTTPS/TLS encryption
- No rate limiting or advanced security features

**For Production**:
- Change all default passwords
- Use strong, unique JWT secrets
- Remove database port exposure
- Enable HTTPS
- Implement proper security hardening
- Use secrets management
- Enable firewall rules

## Differences from Docker Compose

This Podman configuration:
- Uses `docker.io/` prefix for base images (required by Podman)
- Uses `:Z` suffix for volume mounts (SELinux labeling)
- Compatible with rootless Podman
- Uses `podman-compose` or `podman compose` commands

## Additional Resources

- [Podman Documentation](https://docs.podman.io/)
- [Podman Compose Documentation](https://github.com/containers/podman-compose)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Note**: This configuration is designed for development and interim demonstration. Production deployments require additional security hardening and configuration.

