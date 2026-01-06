# Setup Guide - n1fty CRM

This guide will help you set up the n1fty CRM system for the first time.

## Prerequisites

Before starting, ensure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

## Step-by-Step Setup

### 1. Install Node.js Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 2. Set Up PostgreSQL Database

#### Option A: Using psql Command Line

1. Open PostgreSQL command line or pgAdmin
2. Create a new database:

```sql
CREATE DATABASE n1fty_crm;
```

3. Run the schema file to create tables:

```bash
psql -U postgres -d n1fty_crm -f database/schema.sql
```

#### Option B: Using pgAdmin

1. Open pgAdmin
2. Right-click on "Databases" → Create → Database
3. Name it `n1fty_crm`
4. Open Query Tool
5. Copy and paste the contents of `database/schema.sql`
6. Execute the query

### 3. Configure Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example` if it exists, or create new)

2. Add the following configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=n1fty_crm
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRES_IN=24h
```

**Important**: Replace `your_postgres_password_here` with your actual PostgreSQL password, and change `JWT_SECRET` to a secure random string (at least 32 characters).

### 4. Create Initial Admin User

Run the setup script to create your first admin user:

```bash
node database/setup.js
```

Follow the prompts to enter:
- Admin name
- Admin email
- Admin password

**Note**: Make sure to remember these credentials as you'll need them to login!

### 5. Start the Server

#### Development Mode (with auto-reload):

```bash
npm run dev
```

#### Production Mode:

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

### 6. Access the Application

1. Open your web browser
2. Navigate to `http://localhost:3000`
3. Login with the admin credentials you created in Step 4

## Troubleshooting

### Database Connection Error

If you see "Connection to PostgreSQL database failed":
- Verify PostgreSQL is running
- Check database credentials in `.env` file
- Ensure database `n1fty_crm` exists
- Verify user has proper permissions

### Port Already in Use

If port 3000 is already in use:
- Change `PORT` in `.env` file to a different port (e.g., 3001)
- Or stop the application using port 3000

### Module Not Found Errors

If you see "Cannot find module" errors:
- Run `npm install` again
- Delete `node_modules` folder and `package-lock.json`, then run `npm install`

### JWT Secret Error

If authentication fails:
- Ensure `JWT_SECRET` in `.env` is set and is at least 32 characters long
- Restart the server after changing `.env` file

## Verification Checklist

After setup, verify:

- [ ] Server starts without errors
- [ ] Database connection is successful
- [ ] Can access login page at `http://localhost:3000`
- [ ] Can login with admin credentials
- [ ] Dashboard loads and shows statistics
- [ ] Can navigate to clients page
- [ ] Can create a new client

## Next Steps

Once setup is complete:

1. Explore the dashboard
2. Add your first client
3. Test the search functionality
4. Review the code structure
5. Check TODO comments for future enhancements

## Getting Help

If you encounter issues:

1. Check the error messages in the terminal
2. Review the `README.md` for API documentation
3. Verify all environment variables are set correctly
4. Ensure database schema was created successfully

## Development Notes

- The application uses JWT tokens stored in browser localStorage
- Passwords are hashed using bcryptjs (10 salt rounds)
- Client deletion is soft delete (sets `deleted_at` timestamp)
- Admin role is required for delete operations (interim stage)

