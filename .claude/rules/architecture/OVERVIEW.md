# Architecture Overview

## System Design

### Layers
```
┌─────────────────────────────────┐
│   React Frontend (Port 5173)    │
│   React Admin (Port 5174)       │
└──────────────┬──────────────────┘
               │ API Requests
┌──────────────▼──────────────────┐
│   Laravel API (Port 8000)       │
│   (Sanctum SPA Auth)            │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   Business Logic Services       │
│   - PromptEngineService         │
│   - HuggingFaceService          │
│   - QuotaService                │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   Database Layer (Eloquent)     │
│   SQLite (MVP)                  │
│   PostgreSQL (Production)       │
└─────────────────────────────────┘
```

## Key Components

### Authentication Flow
1. User registration/login via `/api/auth/register`, `/api/auth/login`
2. Sanctum generates CSRF cookie
3. Subsequent requests include CSRF token
4. Backend validates token and returns user data

### Prompt Execution Flow
1. User submits prompt with agent selection
2. API validates quota and permissions
3. PromptEngineService processes prompt
4. HuggingFaceService calls Hugging Face API
5. Response cached and logged
6. Tokens deducted from user quota

### File Upload Flow
1. User uploads file to FileUploadController
2. File parsed and stored (base64 in DB)
3. Metadata saved to UploadedFile model
4. User can reference in prompts

## Scaling Considerations
- [ ] Move SQLite → PostgreSQL when needed
- [ ] Implement queue jobs for long-running tasks
- [ ] Add caching layer (Redis)
- [ ] Implement real-time features (WebSockets)
- [ ] Scale AI inference (multiple models)

## Recent Changes
- (Auto-logged by sub-agent)

## Performance Notes
- (Auto-logged by sub-agent)

## Known Issues
- (Auto-logged by sub-agent)
