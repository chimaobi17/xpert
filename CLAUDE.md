# XPERT - Claude Code Project Instructions

## 🧠 Advanced MCP Plugins Enabled

**Sequential Thinking**: Extended reasoning for complex problems  
**Superpowers**: TDD, debugging, collaboration, best practices  
**Context7**: Smart context management and token optimization  
**Simplifier**: Code simplification and low-code patterns  

See [.claude/rules/tools/](.claude/rules/tools/) for details on each:
- [SEQUENTIAL_THINKING.md](.claude/rules/tools/SEQUENTIAL_THINKING.md) — Step-by-step reasoning
- [SUPERPOWERS.md](.claude/rules/tools/SUPERPOWERS.md) — TDD & debugging workflows
- [CONTEXT7.md](.claude/rules/tools/CONTEXT7.md) — Context & memory optimization
- [SIMPLIFIER.md](.claude/rules/tools/SIMPLIFIER.md) — Code simplification patterns

---

## Quick Start - Project Rules & Monitoring

All project standards, patterns, and monitoring logs are in [`.claude/rules/`](.claude/rules/README.md):

- **Database Design**: [.claude/rules/database/SCHEMA.md](.claude/rules/database/SCHEMA.md)
- **Frontend Design**: [.claude/rules/frontend/DESIGN_SYSTEM.md](.claude/rules/frontend/DESIGN_SYSTEM.md)
- **Backend Standards**: [.claude/rules/backend/API_STANDARDS.md](.claude/rules/backend/API_STANDARDS.md)
- **Coding Standards**: [.claude/rules/coding-standards/](coding-standards/)
- **Architecture**: [.claude/rules/architecture/OVERVIEW.md](.claude/rules/architecture/OVERVIEW.md)
- **Code Patterns**: [.claude/rules/patterns/REUSABLE_PATTERNS.md](.claude/rules/patterns/REUSABLE_PATTERNS.md)
- **Session Logs**: [.claude/rules/logs/SESSION_LOG.md](.claude/rules/logs/SESSION_LOG.md) (auto-populated)
- **Issues & Failures**: [.claude/rules/failures/KNOWN_ISSUES.md](.claude/rules/failures/KNOWN_ISSUES.md) (auto-populated)
- **Performance Metrics**: [.claude/rules/performance/METRICS.md](.claude/rules/performance/METRICS.md) (auto-populated)

## Project Overview
XPERT is a zero-cost AI prompt platform built on Laravel 12 + SQLite + Sanctum with two React SPAs (`xpert-app/` on port 5173, `xpert-admin-dashboard/` on port 5174). All AI runs on free Hugging Face Inference API models — **no OpenAI, no paid APIs**.

## Tech Stack
- **Backend**: Laravel 12, PHP 8.2+, SQLite, Laravel Sanctum (SPA cookie auth)
- **Frontend**: React 19, Vite 6, Tailwind CSS 3.4, react-router-dom 7
- **AI**: Hugging Face free-tier Inference API only
- **Local dev URL**: `xpert.test` (never change this)

## Code Standards

### Laravel / PHP
- Follow PSR-12 coding standard
- Use Form Request validation for all endpoints accepting user input
- Use Eloquent relationships and scopes — no raw SQL unless performance-critical
- Use Gates and Policies for authorization (defined in AppServiceProvider)
- Use config files for magic values (`config/ai_models.php` for model registry)
- Never hardcode credentials or API keys — use `.env`
- Use resource classes for API responses when returning model data
- Service classes go in `app/Services/`
- Three-tier role system: `user` < `admin` < `super_admin`

### Frontend / React
- Tailwind CSS + CSS custom properties for theming — no inline styles
- Use `clsx` for conditional class composition
- Theme: GREEN (#22c55e) and WHITE with dark mode support
- 3-way theme toggle: light / dark / system
- Glassmorphism on modals, overlays, dropdowns: `backdrop-blur-md` + semi-transparent bg

### Security
- Sanctum SPA authentication with CSRF cookie
- Rate limiting on all public endpoints
- Validate and sanitize all user inputs server-side
- Never expose internal errors to API responses in production
- Premium gating: check user plan_level before allowing premium agent access

## Architecture
- `app/Models/` — 8 Eloquent models (User, AiAgent, PromptTemplate, PromptLog, PromptLibrary, PromptCache, TokenUsageLog, UploadedFile)
- `app/Http/Controllers/Api/` — API controllers (Auth, Agent, Library, Usage, Notification, UserAgent, Admin/)
- `app/Services/` — Business logic services (to be created: PromptEngineService, HuggingFaceService)
- `config/ai_models.php` — Model registry with quotas and rate limits
- `database/` — Migrations, seeders, factories all complete
- `routes/api.php` — 33 API routes

## Code Review Checklist
When reviewing code, check for:
1. **Security**: SQL injection, XSS, mass assignment, auth bypass, exposed secrets
2. **Validation**: All user input validated via Form Requests or inline rules
3. **Authorization**: Gates/policies enforced, role hierarchy respected
4. **Error handling**: Proper try/catch, meaningful error responses, no leaked internals
5. **Performance**: N+1 queries, missing eager loading, uncached repeated queries
6. **Consistency**: Follows existing patterns in the codebase
7. **Quota enforcement**: Token limits and rate limits respected per plan_level
8. **Test coverage**: New features should have corresponding tests

## Key Business Rules
- Free plan: 25,000 tokens/day, 50 requests/day
- Standard plan: 150,000 tokens/day, 300 requests/day
- Premium plan: 1,000,000 tokens/day, unlimited requests
- Only super_admin can promote/demote users and delete accounts
- Admins and super_admins can block/unblock users
- Onboarding auto-assigns default agents based on field_of_specialization
- Premium agents require Standard or Premium plan

## Commands

### Development Servers
```bash
# Backend
php artisan serve                    # Start Laravel dev server (port 8000)
php artisan migrate:fresh --seed     # Reset DB with seed data
php artisan test                     # Run test suite
php artisan route:list               # List all routes

# Frontend (user app)
cd xpert-app && npm run dev          # Dev server on port 5173
cd xpert-app && npm run build        # Production build

# Frontend (admin app)
cd xpert-admin-dashboard && npm run dev    # Dev server on port 5174
cd xpert-admin-dashboard && npm run build  # Production build
```

### Project Rules & Monitoring
```bash
# Log session activity (auto-populate logs)
python3 ~/.claude/scripts/rules-monitor.py . session '{"files_changed":[],"features":[],"bugs_fixed":[],"patterns":[],"next_steps":[]}'

# Log a failure/issue
python3 ~/.claude/scripts/rules-monitor.py . failure '{"title":"...","severity":"High","description":"...","root_cause":"...","impact":"...","status":"Open"}'

# Log a new code pattern
python3 ~/.claude/scripts/rules-monitor.py . pattern '{"name":"...","category":"Backend","description":"...","code":"...","when_to_use":"..."}'

# Log performance metrics
python3 ~/.claude/scripts/rules-monitor.py . performance '{"category":"frontend","metric":"Bundle size","value":"450KB","target":"<500KB","status":"ok"}'

# Scan for patterns and errors
python3 ~/.claude/scripts/rules-monitor.py . scan

# Generate monitoring report
python3 ~/.claude/scripts/rules-monitor.py . report
```

---

## 🧠 Obsidian Second Brain Integration

**Automated Vault Updates**: Every Claude session is automatically captured and added to your Obsidian vault at `/Users/chimzy/Documents/`.

### One-time setup (already done):
- ✅ Vault structure created (Topics, Chats, Insights, Tags)
- ✅ 4 initial sessions processed
- ✅ 3D graph generated (`XPERT-3D-Graph.html`)
- ✅ HOW-TO-USE-3D-GRAPH.md guide created

### Automatic vault updates:
```bash
# Auto-capture all new sessions
python3 ~/.claude/scripts/vault-auto-update.py /Users/chimzy/Documents/workspace/xpert

# Update with graph regeneration
python3 ~/.claude/scripts/vault-auto-update.py /Users/chimzy/Documents/workspace/xpert --graph

# Watch for changes in real-time
python3 ~/.claude/scripts/vault-auto-update.py /Users/chimzy/Documents/workspace/xpert --watch
```

To regenerate the 3D graph after vault updates:
```bash
/graphify /Users/chimzy/Documents/workspace/xpert
```

**Usage**: Open the vault in Obsidian at `/Users/chimzy/Documents/` to browse all chats, topics, and insights with full wikilink navigation and 3D graph visualization.

---

## ⚡ Current Development Tasks (For Claude Code)
Refer to **[XPERT_ADDITIONAL_FEATURES_PLAN.md](file:///Users/chimzy/Documents/workspace/xpert/XPERT_ADDITIONAL_FEATURES_PLAN.md)** for the prioritized roadmap of post-MVP fixes and features.

**Current Admin Credentials**:
- **Email**: `admin@xpert.test`
- **Password**: `password`
*(Note: Both `admin` and `super_admin` roles are authorized in the Admin Dashboard)*
