# Client Management System (CMS)

A simple, self-hosted, open-source web application for client management, designed for small businesses, freelancers, and startups.

## Project Status: INTERIM PHASE

This project is currently at the **INTERIM development phase** (approximately 50-60% complete). Several features are intentionally incomplete or simplified to demonstrate planned future work for the final submission.

### Implemented Features

- ✅ User authentication (login/register with JWT)
- ✅ Basic role system (admin, user)
- ✅ Client CRUD operations (Create, Read, Update, Soft Delete)
- ✅ Basic dashboard with statistics
- ✅ RESTful API architecture
- ✅ PostgreSQL database with proper schema
- ✅ Podman containerization support
- ✅ Clean, minimal user interface

### Partially Implemented / TODO

- ⚠️ Interaction tracking (database table exists, endpoints return placeholders)
- ⚠️ Search and filtering (UI elements exist, backend logic marked with TODO)
- ⚠️ Reporting (basic client count only, export functionality TODO)
- ⚠️ Role-based access control (basic enforcement, needs enhancement)

### Not Implemented (Excluded for Interim)

- ❌ Advanced analytics dashboards
- ❌ Marketing automation
- ❌ Email integrations
- ❌ Sales pipelines
- ❌ AI-powered features
- ❌ Multi-language support
- ❌ Mobile applications

## Architecture

- **Backend**: Node.js with Express.js
- **Frontend**: HTML, CSS, vanilla JavaScript
- **Database**: PostgreSQL
- **Containerization**: Podman (daemonless, rootless)
- **Authentication**: JWT-based

## Prerequisites

- Podman installed and running
- A web browser for accessing the frontend

**Note**: Use `podman compose` (with space) command. If you have `podman-compose` (with hyphen) installed, you can use that instead.

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/05n1fty68/CMS.git
cd CMS
```

### 2. Start Backend Services with Podman

```bash
# Build and start containers
podman compose -f podman-compose.yml up -d
```

This will:
- Start PostgreSQL database container
- Build and start the CMS backend container
- Initialize the database schema automatically

### 3. Access the Application

- **Backend API**: http://localhost:3000
- **Frontend**: Open `src/frontend/index.html` in your web browser
  - Or use a simple HTTP server:
    ```bash
    cd src/frontend
    python -m http.server 8080
    ```
    Then access: http://localhost:8080

### 4. Create Admin User

After starting the containers, create an admin user using one of these methods:

**Option 1: Use the registration endpoint**
- Register a new user via the frontend
- Then update the user role to 'admin' in the database

**Option 2: Use the create-admin script (recommended)**
```bash
# Access the backend container
podman compose -f podman-compose.yml exec cms-backend sh

# Run the script (inside container)
node scripts/create-admin.js admin@cms.local admin123

# Or run locally if you have Node.js installed
cd src/backend
npm install
node scripts/create-admin.js admin@cms.local admin123
```

**⚠️ IMPORTANT**: Change the default admin password immediately in production!

## Development Setup

### Backend Development

```bash
cd src/backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development

The frontend is static HTML/CSS/JS. Simply open `src/frontend/index.html` in a browser or use a local HTTP server.

### Database Management

```bash
# Access PostgreSQL container
podman compose -f podman-compose.yml exec cms-db psql -U cms_user -d cms_db

# View backend logs
podman compose -f podman-compose.yml logs -f cms-backend

# View database logs
podman compose -f podman-compose.yml logs -f cms-db
```

## Project Structure

```
CMS/
├── src/
│   ├── backend/          # Node.js/Express backend
│   │   ├── config/       # Configuration files
│   │   ├── database/    # Database schema and migrations
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   └── server.js    # Main server file
│   └── frontend/        # HTML/CSS/JS frontend
│       ├── css/         # Stylesheets
│       ├── js/          # JavaScript modules
│       └── index.html   # Main HTML file
├── Containerfile        # Podman container definition
├── podman-compose.yml  # Podman Compose configuration
└── README.md           # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user info

### Clients
- `GET /api/clients` - Get all clients (supports ?search= query parameter)
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Soft delete client (admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Interactions (Placeholder)
- `GET /api/interactions` - Returns placeholder data
- `GET /api/interactions/:id` - Not implemented (501)

## Environment Variables

Backend environment variables (set in `.env` or `podman-compose.yml`):

- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: cms_db)
- `DB_USER` - Database user (default: cms_user)
- `DB_PASSWORD` - Database password (default: cms_password)
- `JWT_SECRET` - JWT secret key (change in production!)
- `JWT_EXPIRES_IN` - Token expiration (default: 24h)
- `PORT` - Server port (default: 3000)
- `CORS_ORIGIN` - CORS allowed origin (default: http://localhost:8080)

## Podman Commands

```bash
# Start services
podman compose -f podman-compose.yml up -d

# Stop services
podman compose -f podman-compose.yml down

# View logs
podman compose -f podman-compose.yml logs -f cms-backend
podman compose -f podman-compose.yml logs -f cms-db

# Rebuild backend image
podman compose -f podman-compose.yml build cms-backend
podman compose -f podman-compose.yml up -d

# Access backend container
podman compose -f podman-compose.yml exec cms-backend sh

# Access database
podman compose -f podman-compose.yml exec cms-db psql -U cms_user -d cms_db
```

## Troubleshooting

### Backend won't start
- Check logs: `podman-compose logs cms-backend`
- Ensure database is ready: `podman-compose logs cms-db`
- Verify environment variables are correct

### Database connection issues
- Ensure PostgreSQL container is running: `podman-compose ps`
- Check database logs: `podman-compose logs cms-db`
- Verify database credentials in `podman-compose.yml`

### Port conflicts
- If port 3000 is in use, modify the port mapping in `podman-compose.yml`
- If port 5432 is in use, modify the PostgreSQL port mapping

### Frontend can't connect to backend
- Ensure backend is running: `curl http://localhost:3000/health`
- Check CORS configuration in backend
- Verify API_BASE_URL in `src/frontend/js/api.js`

## Security Notes

- Default credentials are for development only
- Change all passwords and secrets in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Regularly update dependencies

## Future Enhancements (For Final Submission)

- Complete interaction tracking system
- Advanced search and filtering
- Comprehensive reporting and export
- Enhanced role-based access control
- Email notifications
- Activity logging and audit trail
- Data backup and restore
- API rate limiting
- Input validation enhancements
- Unit and integration tests

## License

MIT License - See LICENSE file for details

## Contributing

This is a Final Year Project for Diploma in Information Technology. Contributions and feedback are welcome!

## Support

For issues and questions, please open an issue on the GitHub repository.

---

**Note**: This project is designed for educational purposes and interim demonstration. Production deployment requires additional security hardening and testing.

