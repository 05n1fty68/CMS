# n1fty CRM - Client Management System

A simple, self-hosted, open-source web-based CRM alternative for small businesses and freelancers.

## Project Status: INTERIM STAGE (50-60% Complete)

This project is currently at the interim presentation stage. Some features are intentionally incomplete and marked with TODO comments, as the remaining work will be completed after the interim presentation.

## Project Overview

n1fty CRM is a Final Year Project for Diploma in Information Technology. It provides a basic client management system with user authentication, client CRUD operations, and a simple dashboard interface.

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **Vanilla JavaScript** - Client-side logic

## Features Implemented (Interim)

### ✅ Completed Features

1. **User Authentication**
   - Login system with email and password
   - Password hashing using bcryptjs
   - JWT-based authentication
   - Basic role system (admin, user)
   - Registration endpoint (can be restricted)

2. **Client Management (Core CRUD)**
   - Create new clients
   - View client list
   - View single client details
   - Update client information
   - Delete client (soft delete, admin-only)
   - Essential fields: Name, Email, Phone, Notes

3. **Basic UI Pages**
   - Login page
   - Dashboard page
   - Client list page
   - Add/Edit client form
   - Clean, minimal design

4. **Database Schema**
   - Users table
   - Clients table
   - Interactions table (structure exists)

5. **RESTful API**
   - Clear route separation
   - Environment variables usage
   - Basic error handling
   - Code comments

### 🚧 Partially Implemented Features

1. **Interaction Tracking**
   - Database table exists
   - API endpoints return placeholder responses
   - UI shows "Coming Soon" messages
   - **TODO**: Implement full interaction tracking functionality

2. **Search & Filter**
   - Basic search by name or email implemented
   - **TODO**: Add advanced filtering, pagination, sorting

3. **Reporting**
   - Simple client count on dashboard
   - **TODO**: Add export feature, advanced statistics

4. **Role-Based Access Control**
   - Basic middleware exists
   - Admin-only delete functionality
   - **TODO**: Expand role-based permissions

### ❌ Excluded Features (Not Implemented)

- Advanced analytics dashboards
- Marketing automation
- Email integrations
- Sales pipelines
- AI features
- Multi-language support
- Native mobile apps

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Step 1: Clone and Install Dependencies

```bash
# Navigate to project directory
cd alpha

# Install Node.js dependencies
npm install
```

### Step 2: Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE n1fty_crm;
```

2. Run the schema file to create tables:

```bash
psql -U postgres -d n1fty_crm -f database/schema.sql
```

3. (Optional) Load seed data:

```bash
psql -U postgres -d n1fty_crm -f database/seed.sql
```

### Step 3: Environment Configuration

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Update `.env` with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=n1fty_crm
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### Step 4: Run the Application

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## Project Structure

```
alpha/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── clientController.js  # Client CRUD logic
│   │   ├── interactionController.js  # Interaction placeholders
│   │   └── dashboardController.js    # Dashboard stats
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT authentication middleware
│   └── routes/
│       ├── authRoutes.js        # Authentication routes
│       ├── clientRoutes.js     # Client routes
│       ├── interactionRoutes.js # Interaction routes (placeholder)
│       └── dashboardRoutes.js  # Dashboard routes
├── database/
│   ├── schema.sql               # Database schema
│   └── seed.sql                 # Sample data (optional)
├── frontend/
│   ├── css/
│   │   └── style.css            # Main stylesheet
│   ├── js/
│   │   ├── auth.js              # Authentication utilities
│   │   ├── login.js             # Login functionality
│   │   ├── dashboard.js         # Dashboard functionality
│   │   ├── clients.js           # Client list functionality
│   │   └── client-form.js       # Client form functionality
│   ├── index.html               # Login page
│   ├── dashboard.html           # Dashboard page
│   ├── clients.html             # Client list page
│   └── client-form.html         # Add/Edit client form
├── server.js                    # Express server entry point
├── package.json                 # Node.js dependencies
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (can be restricted)

### Clients

- `GET /api/clients` - Get all clients (with optional `?search=term`)
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create new client (requires auth)
- `PUT /api/clients/:id` - Update client (requires auth)
- `DELETE /api/clients/:id` - Delete client (requires auth + admin role)

### Interactions (Placeholder)

- `GET /api/interactions` - Get all interactions (returns placeholder)
- `GET /api/interactions/client/:clientId` - Get client interactions (placeholder)
- `POST /api/interactions` - Create interaction (not implemented)

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics (requires auth)

## Usage

1. **Access the Application**: Navigate to `http://localhost:3000`
2. **Login**: Use your credentials (or register a new account)
3. **Dashboard**: View basic statistics and quick actions
4. **Clients**: View, add, edit, or delete clients
5. **Search**: Use the search bar to find clients by name or email

## Development Notes

### Code Comments

The codebase includes comments explaining:
- Design decisions
- TODO items for future work
- Function purposes
- Implementation notes

### Security Considerations

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- SQL injection prevention through parameterized queries
- CORS enabled for API access

### Future Enhancements (Post-Interim)

1. Complete interaction tracking functionality
2. Advanced search and filtering
3. Export features (CSV, PDF)
4. Enhanced reporting and analytics
5. Email notifications
6. File attachments for clients
7. Activity logs
8. Advanced role-based permissions

## License

MIT License - Open source project for educational purposes.

## Author

Final Year Project - Diploma in Information Technology

## Acknowledgments

Built as a Final Year Project demonstrating full-stack web development skills using Node.js, Express.js, PostgreSQL, and vanilla JavaScript.

