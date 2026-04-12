# Backend API Standards & Rules

## Tech Stack
- **Framework**: Laravel 12
- **PHP Version**: 8.2+
- **Authentication**: Laravel Sanctum (SPA cookie auth)
- **Database**: SQLite (MVP) → PostgreSQL (production)
- **Validation**: Form Request classes

## API Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "errors": null
}
```

## Controller Standards
- Location: `app/Http/Controllers/Api/`
- Naming: `{Resource}Controller`
- One resource per controller
- Use Form Requests for validation
- Return resource classes, not raw models

## Route Conventions
- RESTful: GET /api/resource, POST /api/resource, etc.
- Versioning: /api/v1/
- Auth routes: /api/auth/{login, logout, register}
- Prefix: All routes use /api/

## Validation Rules
- All user input validated via Form Request
- Server-side validation only (no client-side trust)
- Custom messages in translation files
- Sanitize before storage

## Authorization
- Use Gates for high-level permissions
- Use Policies for model-level permissions
- Role-based: user < admin < super_admin
- Premium gating on premium endpoints

## Error Handling
- Never expose internal errors in production
- Log all errors with context
- Return meaningful error messages to client
- HTTP status codes: 200, 201, 400, 401, 403, 404, 500

## Recent Changes
- (Auto-logged by sub-agent)

## Performance Notes
- (Auto-logged by sub-agent)

## Known Issues
- (Auto-logged by sub-agent)
