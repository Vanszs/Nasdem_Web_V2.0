# Security Documentation

This document outlines the security measures implemented in the Nasdem Web V2.0 application.

## Table of Contents

1. [Authentication](#authentication)
2. [Authorization](#authorization)
3. [Input Validation](#input-validation)
4. [File Upload Security](#file-upload-security)
5. [Rate Limiting](#rate-limiting)
6. [CORS Configuration](#cors-configuration)
7. [Soft Delete](#soft-delete)
8. [Error Handling](#error-handling)
9. [Security Headers](#security-headers)
10. [Environment Variables](#environment-variables)

## Authentication

### JWT Implementation

- **Secret Key**: Uses a strong, randomly generated JWT secret stored in environment variables
- **Token Expiry**: JWT tokens expire after 24 hours
- **Token Blacklist**: Implemented token blacklist for logout functionality
- **Secure Cookies**: Tokens are stored in httpOnly, secure cookies with strict sameSite policy

### Password Security

- **Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
- **Password Requirements**: 
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

### Login Protection

- **Rate Limiting**: 5 login attempts per 15 minutes per IP address
- **Generic Error Messages**: Prevents user enumeration by using generic error messages

## Authorization

### Role-Based Access Control (RBAC)

The application implements a comprehensive RBAC system with three roles:

1. **Superadmin**: Full access to all resources and system settings
2. **Editor**: Can manage content (members, news, programs, gallery) but not users or system settings
3. **Analyst**: Read-only access to most resources with export capabilities

### Permission Matrix

| Resource | Superadmin | Editor | Analyst |
|----------|------------|--------|---------|
| Users (CRUD) | ✅ | ❌ | ❌ |
| Members (CRUD) | ✅ | ✅ | ❌ |
| News (CRUD) | ✅ | ✅ | ❌ |
| Programs (CRUD) | ✅ | ✅ | ❌ |
| Gallery (CRUD) | ✅ | ✅ | ❌ |
| Analytics | ✅ | ✅ | ✅ |
| System Settings | ✅ | ❌ | ❌ |

## Input Validation

### Zod Schemas

All API endpoints use Zod schemas for input validation:

- **Type Safety**: Ensures data types match expected formats
- **Sanitization**: Removes potentially harmful characters
- **Length Limits**: Enforces maximum lengths for string fields
- **Format Validation**: Validates email, URL, and other formats

### Validation Examples

```typescript
// User creation validation
const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(passwordRegex),
  role: z.enum(["superadmin", "editor", "analyst"]),
});
```

## File Upload Security

### File Type Validation

- **Allowed Types**: Only JPEG, PNG, and WebP images are allowed
- **Extension Validation**: File extensions are validated against allowed types
- **Content Validation**: File content is verified using magic numbers to prevent type spoofing

### File Size Limits

- **Maximum Size**: 5MB per file
- **Minimum Size**: 100 bytes to prevent empty files

### Secure File Handling

- **Random Filenames**: Files are stored with randomly generated filenames
- **Secure Permissions**: Files are stored with appropriate file permissions (0o644)
- **Directory Permissions**: Upload directories have restricted permissions (0o755)

## Rate Limiting

### Implementation

- **Default Limit**: 60 requests per minute per IP
- **Authenticated Users**: 200 requests per minute
- **Sensitive Endpoints**: 20 requests per minute for write operations
- **Login Endpoint**: 5 attempts per 15 minutes

### Rate Limiting Headers

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in the current window
- `Retry-After`: Seconds to wait before making another request (when limited)

## CORS Configuration

### Strict CORS Policy

- **Allowed Origins**: Configured via environment variables
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization, X-API-Key
- **Credentials**: Supported for authenticated requests
- **Max Age**: 24 hours for preflight requests

## Soft Delete

### Implementation

All major entities (Users, News, Programs, Gallery, Members) support soft delete:

- **DeletedAt Field**: Timestamp field to mark records as deleted
- **Query Filtering**: Deleted records are automatically filtered out from queries
- **Recovery**: Deleted records can be restored by administrators
- **Hard Delete**: Permanent deletion available to superadmins

## Error Handling

### Secure Error Responses

- **Generic Messages**: Error messages don't expose sensitive information
- **Error Types**: Structured error types for different scenarios
- **Logging**: Detailed errors are logged for debugging
- **Status Codes**: Appropriate HTTP status codes for different error types

### Error Types

- `ValidationError`: Invalid input data
- `AuthenticationError`: Authentication required or failed
- `AuthorizationError`: Insufficient permissions
- `NotFoundError`: Resource not found
- `ConflictError`: Resource conflict (e.g., duplicate)
- `RateLimitError`: Too many requests
- `ServerError`: Internal server error

## Security Headers

### Implemented Headers

- **Strict-Transport-Security**: Enforces HTTPS in production
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Enables XSS protection
- **Referrer-Policy**: Controls referrer information
- **Content-Security-Policy**: Basic CSP to prevent XSS attacks

## Environment Variables

### Required Variables

- `JWT_SECRET`: Strong secret for JWT token signing
- `DATABASE_URL`: Database connection string
- `API_ALLOWED_ORIGINS`: Comma-separated list of allowed origins

### Optional Variables

- `INTERNAL_API_KEY`: For server-to-server communication
- `NODE_ENV`: Environment (development/production)
- `BCRYPT_SALT_ROUNDS`: bcrypt salt rounds (default: 12)

## Security Best Practices

1. **Regular Updates**: Keep dependencies updated to patch security vulnerabilities
2. **Code Review**: All code changes should be reviewed for security implications
3. **Audit Logs**: Implement comprehensive audit logging for sensitive operations
4. **Monitoring**: Monitor for suspicious activities and potential attacks
5. **Backup Security**: Ensure backups are encrypted and securely stored
6. **Access Control**: Implement principle of least privilege for all resources

## Security Checklist

- [ ] JWT secret is strong and randomly generated
- [ ] Password requirements are enforced
- [ ] Rate limiting is configured for all endpoints
- [ ] File upload validation is implemented
- [ ] CORS policy is properly configured
- [ ] Security headers are set
- [ ] Input validation is implemented for all endpoints
- [ ] Error handling doesn't expose sensitive information
- [ ] Soft delete is implemented for data integrity
- [ ] RBAC system is properly configured
- [ ] Database connections are secure
- [ ] Environment variables are properly configured