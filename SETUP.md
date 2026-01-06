# Quick Setup Guide

This is a condensed setup guide for getting the CMS up and running quickly.

## Step 1: Start Backend Services

```bash
podman-compose up -d
```

Wait a few seconds for services to start, then verify:

```bash
podman-compose ps
```

Both `cms-db` and `cms-backend` should be running.

## Step 2: Test Backend API

```bash
curl http://localhost:3000/api/health
```

You should see: `{"status":"ok","message":"CMS Backend API is running",...}`

## Step 3: Create Your First User

Register an admin user:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "admin"
  }'
```

Save the `token` from the response - you'll need it for API calls.

## Step 4: Serve Frontend

Open a terminal in the `src/cms-frontend` directory:

```bash
cd src/cms-frontend

# Option 1: Python 3
python -m http.server 8080

# Option 2: Node.js (if you have http-server)
npx http-server -p 8080

# Option 3: PHP
php -S localhost:8080
```

## Step 5: Access the Application

Open your browser and go to: **http://localhost:8080**

Login with the credentials you created in Step 3:
- Email: `admin@example.com`
- Password: `admin123`

## Troubleshooting

### Backend not responding?
```bash
podman-compose logs cms-backend
```

### Database connection issues?
```bash
podman-compose logs cms-db
```

### Need to restart everything?
```bash
podman-compose down
podman-compose up -d
```

### Reset database (WARNING: Deletes all data)?
```bash
podman-compose down -v
podman-compose up -d
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [PODMAN_README.md](PODMAN_README.md) for Podman-specific instructions
- Explore the API endpoints at http://localhost:3000/api

---

**Note**: This is an interim version. Some features are intentionally incomplete.

