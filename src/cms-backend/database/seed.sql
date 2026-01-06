-- CMS Database Seed Data
-- Sample data for development and testing
-- Interim Version

-- NOTE: User accounts should be created via the registration API endpoint
-- or using a script that properly hashes passwords with bcrypt.
-- 
-- To create a user via API:
--   POST /api/auth/register
--   {
--     "email": "admin@example.com",
--     "password": "your-password",
--     "name": "Admin User",
--     "role": "admin"
--   }
--
-- The registration endpoint will automatically hash the password using bcrypt.

-- Sample clients (optional - for testing)
-- These can be removed or modified as needed
INSERT INTO clients (name, email, phone, notes)
VALUES
    ('Acme Corporation', 'contact@acme.com', '+1-555-0101', 'Major client - software development'),
    ('TechStart Inc', 'info@techstart.com', '+1-555-0102', 'Startup client - consulting services'),
    ('Global Solutions Ltd', 'sales@globalsolutions.com', '+1-555-0103', 'Enterprise client')
ON CONFLICT DO NOTHING;

