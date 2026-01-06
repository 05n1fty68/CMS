# API Reference - n1fty CRM

Complete API endpoint documentation for n1fty CRM.

## Base URL

All API endpoints are prefixed with `/api`

Example: `http://localhost:3000/api/auth/login`

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### POST /api/auth/login

User login endpoint.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "role": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### POST /api/auth/register

User registration endpoint. Can be restricted for production.

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"  // Optional, defaults to "user"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 2,
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

## Client Endpoints

All client endpoints require authentication.

### GET /api/clients

Get all clients. Supports optional search parameter.

**Query Parameters:**
- `search` (optional): Search term to filter by name or email

**Example:** `/api/clients?search=john`

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "clients": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+60123456789",
      "notes": "Regular customer",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z",
      "deleted_at": null
    }
  ]
}
```

---

### GET /api/clients/:id

Get a single client by ID.

**Success Response (200):**
```json
{
  "success": true,
  "client": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+60123456789",
    "notes": "Regular customer",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "deleted_at": null
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Client not found"
}
```

---

### POST /api/clients

Create a new client.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+60198765432",  // Optional
  "notes": "VIP client"      // Optional
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Client created successfully",
  "client": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+60198765432",
    "notes": "VIP client",
    "created_at": "2024-01-15T11:00:00.000Z",
    "updated_at": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Name and email are required"
}
```

---

### PUT /api/clients/:id

Update an existing client.

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "phone": "+60198765432",
  "notes": "Updated notes"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Client updated successfully",
  "client": {
    "id": 2,
    "name": "Jane Smith Updated",
    "email": "jane.updated@example.com",
    "phone": "+60198765432",
    "notes": "Updated notes",
    "created_at": "2024-01-15T11:00:00.000Z",
    "updated_at": "2024-01-15T11:30:00.000Z"
  }
}
```

---

### DELETE /api/clients/:id

Delete a client (soft delete). **Requires admin role.**

**Success Response (200):**
```json
{
  "success": true,
  "message": "Client deleted successfully"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Admin access required"
}
```

---

## Interaction Endpoints (Placeholder)

These endpoints exist but return placeholder responses in the interim stage.

### GET /api/interactions

Get all interactions. **Returns placeholder.**

**Response (200):**
```json
{
  "success": true,
  "message": "Interaction tracking feature coming soon",
  "interactions": [],
  "count": 0
}
```

---

### GET /api/interactions/client/:clientId

Get interactions for a specific client. **Returns placeholder.**

**Response (200):**
```json
{
  "success": true,
  "message": "Interaction tracking feature coming soon",
  "clientId": "1",
  "interactions": [],
  "count": 0
}
```

---

### POST /api/interactions

Create a new interaction. **Not implemented.**

**Response (501):**
```json
{
  "success": false,
  "message": "Interaction tracking feature not yet implemented. Coming soon."
}
```

---

## Dashboard Endpoints

### GET /api/dashboard/stats

Get dashboard statistics. Requires authentication.

**Success Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalClients": 10,
    "totalInteractions": 0,
    "recentClients": []
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (only in development mode)"
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Client deletion is soft delete (sets `deleted_at` timestamp)
- Search is case-insensitive and matches name or email
- Email addresses must be unique per client
- JWT tokens expire after 24 hours (configurable via `JWT_EXPIRES_IN`)

