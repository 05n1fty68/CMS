-- Database initialization script
-- Run this script to set up the database schema

-- Connect to the database (this will be run by the database container)
\c cms_db;

-- Run the schema
\i schema.sql;

-- Display confirmation
SELECT 'Database schema initialized successfully' AS status;

