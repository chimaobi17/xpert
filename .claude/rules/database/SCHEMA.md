# Database Schema & Design Rules

## Current Schema

### Models
- **User** - user accounts, authentication, profiles
- **AiAgent** - AI agent configurations and settings
- **PromptTemplate** - reusable prompt templates
- **PromptLog** - history of all prompts executed
- **PromptLibrary** - user's saved prompt collections
- **PromptCache** - cached prompt responses
- **TokenUsageLog** - token consumption tracking
- **UploadedFile** - file uploads and metadata

## Design Principles
- Use Eloquent ORM exclusively (no raw SQL)
- Foreign key constraints always enabled
- Soft deletes for critical entities
- Timestamps (created_at, updated_at) on all tables
- Indexes on frequently queried columns

## Rules
- [ ] Every model must have a factory
- [ ] Every model must have a seeder
- [ ] Use scopes for common queries
- [ ] Use relationships, not raw lookups
- [ ] Validate at model level when possible

## Migration Standards
- File format: `YYYY_MM_DD_HHMMSS_create_table_name.php`
- Always include rollback logic
- Test migrations: fresh, refresh, reset

## Recent Changes
- (Auto-logged by sub-agent)

## Performance Notes
- (Auto-logged by sub-agent)

## Known Issues
- (Auto-logged by sub-agent)
