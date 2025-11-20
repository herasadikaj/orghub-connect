# Backend Integration Requirements

**Date**: November 20, 2025  
**Feature**: User Authentication System  
**Frontend Status**: ✅ Complete and ready for integration

---

## Current Issue: CORS Blocking Requests

The browser is blocking API requests before they reach the backend due to missing CORS headers.

### Required Backend Configuration

#### 1. CORS Middleware Setup

**Required Headers**:
```
Access-Control-Allow-Origin: http://localhost:8081, http://10.129.4.11:8081
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

**ASP.NET Core Example**:
```csharp
// In Program.cs or Startup.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:8081", 
                "http://10.129.4.11:8081",
                "http://192.168.1.5:8081"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Before app.UseAuthorization()
app.UseCors("AllowFrontend");
```

**Node.js/Express Example**:
```javascript
const cors = require('cors');

app.use(cors({
    origin: ['http://localhost:8081', 'http://10.129.4.11:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
```

#### 2. Handle Preflight OPTIONS Requests

Browsers send OPTIONS requests before POST/PUT/DELETE. Backend must respond with:
- Status: 200 OK
- All CORS headers included
- Empty body

---

## API Contract

### Base URL
```
http://10.138.80.113:5000/api
```

### Authentication Endpoints

#### POST /auth/login

**Request**:
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response** (200 OK):
```json
{
  "userId": 3,
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- 400: Validation error (missing fields)
- 401: Invalid credentials
- 500: Server error

**Backend DTO Requirements**:
- Must accept `email` field (NOT `username`)
- Password should be validated against email-based user
- Return JWT token in response

#### POST /auth/register

**Request**:
```json
{
  "email": "newuser@example.com",
  "password": "string"
}
```

**Response** (200 OK):
```json
{
  "userId": 5,
  "email": "newuser@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- 400: Validation error (invalid email format, weak password)
- 409: Email already exists
- 500: Server error

#### GET /api/profile

**Request Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "userId": 3,
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Errors**:
- 401: Invalid or missing token
- 404: User not found
- 500: Server error

#### PUT /api/profile

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

**Response** (200 OK):
```json
{
  "userId": 3,
  "email": "newemail@example.com",
  "name": "Updated Name"
}
```

**Errors**:
- 400: Validation error
- 401: Invalid or missing token
- 409: Email already taken by another user
- 500: Server error

---

## Testing the Backend

### 1. Test CORS Configuration

```bash
curl -X OPTIONS http://10.138.80.113:5000/api/auth/login \
  -H "Origin: http://localhost:8081" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -i
```

Expected response should include:
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:8081
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 2. Test Login Endpoint

```bash
curl -X POST http://10.138.80.113:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"testpass123"}' \
  -i
```

Expected response:
```json
{
  "userId": 3,
  "email": "user@example.com",
  "token": "eyJ..."
}
```

### 3. Test Protected Endpoint

```bash
curl -X GET http://10.138.80.113:5000/api/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -i
```

Expected response:
```json
{
  "userId": 3,
  "email": "user@example.com",
  "name": "John Doe"
}
```

---

## Frontend Implementation Status

✅ **Complete**:
- Axios client configured with base URL
- Request interceptor adds Authorization header
- Response interceptor handles 401 errors
- Login/Signup forms with validation
- Profile view and edit functionality
- Token persistence in localStorage
- Protected route guards
- Password visibility toggle
- Form validation with Zod
- Loading states and error handling

🎯 **Waiting on**:
- Backend CORS configuration
- Backend DTO verification (email field)
- Backend authentication logic validation

---

## Verification Checklist

- [ ] CORS middleware configured and enabled
- [ ] Preflight OPTIONS requests return 200 with CORS headers
- [ ] Login endpoint accepts `{"email": "...", "password": "..."}`
- [ ] Register endpoint accepts `{"email": "...", "password": "..."}`
- [ ] Authentication validates against `email` field (not username)
- [ ] JWT token included in login/register responses
- [ ] Protected endpoints validate Bearer token
- [ ] Profile endpoints return userId as number
- [ ] Error responses follow consistent format

---

## Contact

If backend configuration is complete and issues persist, check:
1. Browser console for exact error message
2. Network tab for request/response details
3. Backend logs for incoming requests
4. Verify frontend is running on expected port (8081)
