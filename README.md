# Client Management System (CMS)

A simple, self-hosted, open-source web application for client management, designed for small businesses, freelancers, and startups.

**Interim Version - Approximately 50-60% Complete**

This project is currently at the **INTERIM phase** of development. Several features are intentionally incomplete or stubbed to demonstrate planned future work for the final submission.

---

## Project Overview

The Client Management System (CMS) is a Final Year Project for a Diploma in Information Technology. It provides basic client management functionality without the cost, complexity, or vendor lock-in of enterprise CRM platforms.

### Key Features (Interim Version)

#### ✅ Implemented
- **User Authentication**: Login with email and password, JWT-based authentication
- **Client Management**: Create, view, update, and soft delete client records
- **Basic User Interface**: Login page, dashboard, client list, and client form
- **RESTful API**: Express.js backend with PostgreSQL database
- **Podman Containerization**: Backend runs in Podman containers

#### 🚧 Partially Implemented
- **Interaction Tracking**: Database table exists, but functionality is minimal
- **Search & Filter**: UI elements exist, backend logic marked with `TODO`
- **Reporting**: Basic client count summary only
- **Role-Based Access Control**: Authorization middleware exists, limited enforcement

#### ❌ Not Implemented (Final Version)
- Advanced analytics dashboards
- Marketing automation features
- Email or third-party integrations
- Sales pipelines and forecasting
- AI-powered features
- Multi-language support
- Native mobile applications

---

## Technology Stack

### Backend
- **Node.js** with **Express.js**
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **HTML5**, **CSS3**, **Vanilla JavaScript**
- No frameworks or build tools (interim version)

### Infrastructure
- **Podman** for containerization
- **PostgreSQL** containerized service

---

## Project Structure

```
.
├── src/
│   ├── cms-backend/          # Backend API (Node.js/Express)
│   │   ├── config/          # Configuration files
│   │   │   └── database.js  # PostgreSQL connection
│   │   ├── database/        # Database schema and seeds
│   │   │   ├── schema.sql   # Database schema
│   │   │   └── seed.sql     # Sample data
│   │   ├── middleware/      # Express middleware
│   │   │   └── auth.js      # JWT authentication
│   │   ├── routes/          # API routes
│   │   │   ├── auth.js      # Authentication routes
│   │   │   ├── clients.js   # Client CRUD routes
│   │   │   └── interactions.js # Interaction routes (stubbed)
│   │   ├── Containerfile    # Podman container definition
│   │   ├── package.json     # Node.js dependencies
│   │   ├── server.js        # Main server file
│   │   └── .env.example     # Environment variables template
│   │
│   └── cms-frontend/        # Frontend (HTML/CSS/JS)
│       ├── css/
│       │   └── style.css    # Stylesheet
│       ├── js/
│       │   ├── api.js       # API client
│       │   ├── auth.js      # Authentication logic
│       │   ├── clients.js   # Client management logic
│       │   └── app.js       # Main application controller
│       └── index.html       # Main HTML file
│
├── podman-compose.yml   # Podman Compose configuration
└── README.md            # This file
```

---

## Prerequisites

Before setting up the CMS, ensure you have the following installed:

1. **Podman** - Container runtime
   - Installation: https://podman.io/getting-started/installation
   
2. **podman-compose** - Container orchestration
   - Installation: `pip install podman-compose` or use `podman compose` (if available)

3. **Node.js** (optional, for local development)
   - Version 18 or higher
   - Installation: https://nodejs.org/

---

## Quick Start

### 1. Clone or Download the Project

```bash
# Navigate to the project directory
cd cms
```

### 2. Start the Backend Services

Start PostgreSQL and the backend API using Podman Compose:

```bash
podman-compose up -d
```

This will:
- Build the backend container image
- Start PostgreSQL database container
- Start the backend API container
- Initialize the database schema

### 3. Access the Application

- **Backend API**: http://localhost:3000
- **Frontend**: Open `src/cms-frontend/index.html` in a web browser

**Note**: For the frontend to work properly, you may need to serve it through a local web server due to CORS restrictions. You can use:

```bash
# Using Python 3
cd src/cms-frontend
python -m http.server 8080

# Or using Node.js (if you have http-server installed)
npx http-server -p 8080
```

Then access: http://localhost:8080

### 4. Default Credentials

**Important**: The seed data includes placeholder users. You should:

1. Register a new user via the registration endpoint, OR
2. Create a user directly in the database

To create a user via API:

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

---

## Development Setup

### Backend Development

1. **Install dependencies**:
   ```bash
   cd src/cms-backend
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

### Database Management

**Access PostgreSQL container**:
```bash
podman-compose exec cms-db psql -U cms_user -d cms_db
```

**View database logs**:
```bash
podman-compose logs -f cms-db
```

**Reset database** (WARNING: This will delete all data):
```bash
podman-compose down -v
podman-compose up -d
```

---

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)

### Clients

- `GET /api/clients` - Get all clients (requires authentication)
- `GET /api/clients/:id` - Get single client (requires authentication)
- `POST /api/clients` - Create new client (requires authentication)
- `PUT /api/clients/:id` - Update client (requires authentication)
- `DELETE /api/clients/:id` - Soft delete client (requires admin role)

### Interactions (Partially Implemented)

- `GET /api/interactions` - Get all interactions (requires authentication)
- `GET /api/interactions/client/:clientId` - Get interactions for a client (requires authentication)
- `POST /api/interactions` - Create interaction (stubbed, returns 501)

### Health Check

- `GET /api/health` - API health status

---

## Configuration

### Environment Variables

Backend environment variables (set in `.env` or `podman-compose.yml`):

- `DB_HOST` - Database host (default: `cms-db`)
- `DB_PORT` - Database port (default: `5432`)
- `DB_NAME` - Database name (default: `cms_db`)
- `DB_USER` - Database user (default: `cms_user`)
- `DB_PASSWORD` - Database password (default: `cms_password`)
- `JWT_SECRET` - JWT signing secret (CHANGE IN PRODUCTION)
- `PORT` - Backend server port (default: `3000`)
- `NODE_ENV` - Environment (development/production)

---

## Management Commands

### Start services
```bash
podman-compose up -d
```

### Stop services
```bash
podman-compose down
```

### View logs
```bash
# Backend logs
podman-compose logs -f cms-backend

# Database logs
podman-compose logs -f cms-db

# All logs
podman-compose logs -f
```

### Rebuild backend image
```bash
podman-compose build cms-backend
podman-compose up -d
```

### Access backend container
```bash
podman-compose exec cms-backend sh
```

---

## Troubleshooting

### Backend won't start
- Check logs: `podman-compose logs cms-backend`
- Ensure database is ready: `podman-compose logs cms-db`
- Verify network connectivity between containers

### Database connection issues
- Ensure PostgreSQL container is running: `podman-compose ps`
- Check database logs: `podman-compose logs cms-db`
- Verify environment variables are correct

### Port conflicts
- If port 3000 is in use, modify the port mapping in `podman-compose.yml`:
  ```yaml
  ports:
    - "3001:3000"  # Change 3001 to your preferred port
  ```

### Frontend can't connect to backend
- Ensure backend is accessible: `curl http://localhost:3000/api/health`
- Check CORS settings in backend
- Verify API_BASE_URL in `cms-frontend/js/api.js`

---

## Security Notes

⚠️ **IMPORTANT FOR PRODUCTION**:

- Default database credentials are for development only
- Change all passwords and secrets before production use
- Use strong JWT secrets
- Enable HTTPS in production
- Implement rate limiting
- Add input validation and sanitization
- Review and harden security settings

---

## Planned Enhancements (Final Version)

The following features are planned for the final submission:

1. **Complete Interaction Tracking**
   - Full CRUD operations
   - Interaction types (call, email, meeting, etc.)
   - Timeline view

2. **Advanced Search & Filtering**
   - Client search by name, email, phone
   - Filter by date, tags, or custom fields
   - Pagination for large datasets

3. **Enhanced Reporting**
   - Client statistics and analytics
   - Export functionality (CSV, PDF)
   - Dashboard charts and graphs

4. **Improved User Experience**
   - Better error handling and user feedback
   - Loading states and animations
   - Responsive design improvements

5. **Additional Features**
   - Client tags and categories
   - File attachments
   - Email notifications
   - Activity logging

---

## License

This project is developed as a Final Year Project for educational purposes.

---

## Contact & Support

For questions or issues related to this interim version, please refer to the project documentation or contact the development team.

---

## Acknowledgments

This project uses the following open-source technologies:
- Node.js and Express.js
- PostgreSQL
- Podman
- Various npm packages (see `package.json`)

---

**Version**: 0.1.0-interim  
**Last Updated**: Interim Phase  
**Status**: Development - Approximately 50-60% Complete

