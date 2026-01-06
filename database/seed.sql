-- Seed data for development and testing
-- This file contains sample client data for interim demo purposes

-- NOTE: To create users, use the setup script instead:
-- Run: node database/setup.js
-- This ensures passwords are properly hashed with bcrypt

-- Alternatively, you can register users through the API endpoint:
-- POST /api/auth/register

-- Insert sample clients (optional - for demo purposes)
-- These will be associated with the first user (admin)
-- Uncomment and modify as needed for testing

/*
INSERT INTO clients (name, email, phone, notes, user_id) VALUES
('John Doe', 'john.doe@example.com', '+60123456789', 'Regular customer, prefers email communication', 1),
('Jane Smith', 'jane.smith@example.com', '+60198765432', 'VIP client, requires priority support', 1),
('ABC Company', 'contact@abccompany.com', '+60312345678', 'Corporate client, monthly retainer', 1)
ON CONFLICT (email) DO NOTHING;
*/

