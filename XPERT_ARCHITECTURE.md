# XPERT Architectural Blueprint (v5.0 - Zero-Cost MVP, Smart Prompt System)

**CRITICAL DIRECTIVE FOR CLAUDE CODE**: Every technology is free-tier or open-source. **No OpenAI. No GPT-4o. No paid API keys.** Items marked `[SCALE-TRIGGER]` flag what needs upgrading at scale. Never commit secrets. No hardcoded credentials anywhere.

> **⚠️ EXECUTION STRATEGY**: Build phase by phase. Do NOT build all phases in one session. Start with Phase 1+2, verify everything runs, then proceed. See `XPERT_IMPLEMENTATION_PLAN.md` for the full build order. **Phase 0 (HF model research) must be completed before any code is written** — crawl Hugging Face for the best free models per agent category and update the model registry table.

> **🔍 MODEL REGISTRY NOTE**: The models listed below are starting defaults. Claude Code must research Hugging Face before Phase 1 to verify these are still the best free, instruction-tuned, Inference API-compatible models for each category. Replace with better alternatives if discovered.

## 1. Repository Structure
```
workspace/xpert/
├── xpert-backend/                    # Laravel 11 API
│   ├── Dockerfile                    # Multi-stage Alpine (PHP + SQLite)
│   ├── docker-entrypoint.sh          # API server + queue worker
│   ├── render.yaml                   # Render free-tier Blueprint
│   ├── .gitignore                    # Excludes .env, SQLite, uploads, vendor
│   ├── .env.example                  # All vars with placeholders only
│   ├── README.md                     # Clone-to-running in <5 min
│   ├── config/ai_models.php          # HF model registry
│   └── database/database.sqlite      # Created at setup (gitignored)
├── xpert-app/                        # User Frontend (React + Tailwind)
│   ├── .gitignore
│   └── .env.example
├── xpert-admin-dashboard/            # Admin Frontend (React + Tailwind)
│   ├── .gitignore
│   └── .env.example
├── docker-compose.dev.yml            # Full local stack (Laravel + Ollama)
└── .github/workflows/ci.yml          # Tests + secret scanning
```

## 2. Smart Prompt Generation Flow (Core Feature)

```
User selects Agent → Dynamic form (per agent field_schema)
         │
         ▼
POST /api/prompts/generate
  ├── Fetch agent.system_prompt
  ├── Fetch prompt_templates.template_body
  ├── Replace {{placeholders}} with user inputs
  ├── Append uploaded file content (if any)
  └── Return assembled prompt to frontend
         │
         ▼
User Choice Screen (NO auto-submit):
  A: "Use Generated Prompt" (read-only preview)
  B: "Write My Own Prompt" (blank textarea)
  C: "Edit Generated Prompt" (editable textarea)
         │
User clicks [Send to AI]
         │
         ▼
POST /api/prompts/submit
  ├── Check prompt_cache → return if hit
  ├── Check user quota → 402 if exceeded
  ├── Call HF primary model → fallback chain if needed
  ├── Log to prompt_logs
  └── Return AI response
```

## 3. System Components

### Client Layer
- **User App** (`xpert-app`): React SPA. Responsive Tailwind = mobile strategy. 320px–1440px+.
- **Admin Dashboard** (`xpert-admin-dashboard`): Separate React SPA. Agent CRUD, template editing, prompt log viewer, user management.
- Client-side MIME + size validation on file uploads.

### Application Layer (`xpert-backend`)
- **Laravel 11 API**: Serves both frontends. CORS bound to Vercel domains.
- **Auth**: Sanctum tokens. `role:admin` / `role:user` middleware.
- **Smart Prompt Engine**: Constructs prompts from agent `system_prompt` + `prompt_template` + user inputs + file content. Returns to frontend for user review before AI call.
- **Queue**: Database driver + cron `queue:work`. `[SCALE-TRIGGER]`: Redis + Horizon.
- **Response Cache**: `prompt_cache` table (SHA-256 key, 24h TTL).

### AI Model Registry (`config/ai_models.php`)

| Agent Category | Primary Model | Fallback Model |
|---|---|---|
| Code Assistant | `bigcode/starcoder2-15b` | `codellama/CodeLlama-34b-Instruct-hf` |
| Content Writer | `mistralai/Mixtral-8x7B-Instruct-v0.1` | `HuggingFaceH4/zephyr-7b-beta` |
| Business Analyst | `mistralai/Mixtral-8x7B-Instruct-v0.1` | `mistralai/Mistral-7B-Instruct-v0.2` |
| UX Research | `mistralai/Mistral-7B-Instruct-v0.2` | `HuggingFaceH4/zephyr-7b-beta` |
| Graphic Designer | `stabilityai/stable-diffusion-xl-base-1.0` | `runwayml/stable-diffusion-v1-5` |
| Translation | `facebook/nllb-200-distilled-600M` | N/A |
| Document Q&A | `mistralai/Mistral-7B-Instruct-v0.2` | `HuggingFaceH4/zephyr-7b-beta` |
| Sentiment Analysis | `cardiffnlp/twitter-roberta-base-sentiment-latest` | N/A |
| Embeddings | `BAAI/bge-small-en-v1.5` | N/A |

**Fallback**: Primary → retry (backoff) → Fallback model → Queue. **NEVER OpenAI.**

### Data Layer (SQLite-First)
- **DB**: SQLite. `[SCALE-TRIGGER]`: PostgreSQL.
- **Cache/Sessions/Queues**: Database driver (SQLite). `[SCALE-TRIGGER]`: Redis.
- **Files**: Local disk. `[SCALE-TRIGGER]`: S3/R2.

### External Services (Free Only)
- **AI**: Hugging Face Inference API free tier. Ollama for local dev.
- **Payments**: Stubbed (`plan_level` column). `[SCALE-TRIGGER]`: Paystack.
- **OAuth**: Google, GitHub (free).
- **Monitoring**: Laravel logs + Discord webhook. `[SCALE-TRIGGER]`: Sentry.

## 4. Database Schema (SQLite-Compatible)

> **SQLite Rules**: No `ALTER COLUMN`. No native `enum` → use `string` + validation. JSON → `TEXT`. Use `->nullable()` / `->default()` on new columns.

| Table | Key Columns | Purpose |
|---|---|---|
| `users` | `id`, `name`, `email` (unique), `password`, `role` (string), `plan_level` (string, default: free) | Auth & authorization |
| `ai_agents` | `id`, `name`, `domain`, `category`, `system_prompt` (text), `is_premium_only` (bool) | Agent definitions |
| `prompt_templates` | `id`, `agent_id` (FK), `template_body` (text with `{{placeholders}}`), `field_schema` (text — JSON defining dynamic form), `version` (int) | Admin-editable templates |
| `prompt_logs` | `id`, `user_id` (FK), `agent_id` (FK), `prompt_type` (string: generated/custom/edited), `prompt_text` (text), `tokens_estimated` (int), `created_at` | Prompt analytics |
| `prompt_library` | `id`, `user_id` (FK), `agent_id` (FK), `original_input`, `final_prompt`, `ai_response` (text), `created_at` | User-saved outputs |
| `prompt_cache` | `id`, `cache_key` (unique SHA-256), `agent_id`, `prompt_text`, `response_text`, `created_at` | 24h response cache |
| `token_usage_logs` | `id`, `user_id` (FK), `date` (indexed), `tokens_used`, `request_count` | Quota tracking |
| `uploaded_files` | `id`, `user_id` (FK), `file_path`, `mime_type`, `size_bytes`, `parsed_content` (nullable) | Local disk refs |
| `jobs`, `cache`, `sessions` | Laravel defaults | Infrastructure |

### Key API Endpoints

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create user | Public |
| `POST` | `/api/auth/login` | Get Sanctum token | Public |
| `GET` | `/api/agents` | List available agents | User |
| `GET` | `/api/agents/{id}` | Agent details + field_schema | User |
| `POST` | `/api/prompts/generate` | Build prompt from form inputs (no AI call) | User |
| `POST` | `/api/prompts/submit` | Send final prompt to AI | User |
| `GET` | `/api/library` | User's saved prompts | User |
| `POST` | `/api/files/upload` | Upload project file | User |
| `GET` | `/api/admin/users` | List users | Admin |
| `PUT` | `/api/admin/users/{id}/upgrade` | Change plan | Admin |
| `CRUD` | `/api/admin/agents` | Manage agents | Admin |
| `PUT` | `/api/admin/agents/{id}/template` | Edit prompt template | Admin |
| `GET` | `/api/admin/prompt-logs` | View prompt logs | Admin |
| `GET` | `/api/admin/stats` | Usage analytics | Admin |

## 5. Deployment Architecture (Zero-Cost)

- **Backend**: Render free tier via `render.yaml`. Docker. Single container (API + queue worker).
- **Frontends**: Vercel free tier. Both apps deployed independently.
- **CI/CD**: GitHub Actions free tier. Tests + `gitleaks` secret scanning on every push.
- **Secrets**: `.env` only. Docker uses `--env-file`. Render uses env var UI. Never inline.

## 6. Security Hardening & Quotas (OWASP-Aligned)

**DIRECTIVE FOR CLAUDE CODE**: Review this app and **harden its security**. Follow **OWASP best practices**, include clear comments, and do not break existing functionality.

### 6.1 Rate Limiting (IP + User-Based)
- Apply rate limiting on **all public endpoints** — not just AI routes.
- **Dual-layer**: IP-based throttle (prevent brute-force from single IPs) + user-based throttle (enforce plan quotas).
- Sensible defaults: unauthenticated routes (login, register) → 10 req/min per IP. Authenticated routes → plan-based limits below.
- Return graceful `HTTP 429` with `Retry-After` header and JSON error body `{ "error": "rate_limited", "retry_after": <seconds> }`.

| Control | Free | Standard | Premium |
|---|---|---|---|
| Requests/Day | 50 | 300 | Unlimited |
| Tokens/Request | 500 | 2,000 | 8,000 |
| Daily Token Budget | 25,000 | 150,000 | 1,000,000 |
| File Upload Size | 5 MB | 25 MB | 100 MB |

- Quota exceeded → `HTTP 402` with `{ "error": "quota_exceeded" }`.

### 6.2 Strict Input Validation & Sanitization
- **Schema-based validation**: Every API endpoint must use Laravel Form Requests with explicit rules. No raw `$request->input()` without validation.
- **Type checks**: Enforce types on every field (`string`, `integer`, `boolean`, `file`, `array`). Reject mismatched types.
- **Length limits**: Set `max:` rules on all string/text inputs (e.g., prompt text max 10,000 chars, name max 255).
- **Reject unexpected fields**: Use `$request->validated()` exclusively — never `$request->all()`. Extra fields must be silently dropped.
- **File validation**: Validate MIME type (`mimes:pdf,docx,xlsx,png,jpg`), file size (per plan), and reject executables.
- **XSS prevention**: Escape all output. Use `{{ }}` (not `{!! !!}`) in any Blade views. Sanitize HTML in text fields.
- **SQL injection prevention**: Use Eloquent ORM / parameterized queries exclusively. Never use raw `DB::raw()` with user input.

### 6.3 Secure API Key Handling
- **No hard-coded keys**: Every secret (`HUGGINGFACE_API_KEY`, `APP_KEY`, `DISCORD_WEBHOOK_URL`) must come from `.env`.
- **No client-side key exposure**: API keys must never appear in frontend code, API responses, or JavaScript bundles. The `HF_API_TOKEN` is backend-only.
- **Key rotation**: Document procedure for rotating the HF API key without downtime (update `.env` → restart service).
- **`.env` excluded from Git**: Enforced by `.gitignore`. `.env.example` has placeholder values only.
- **Docker secrets**: Docker Compose uses `env_file:` — never inline secrets in `docker-compose.yml` or `Dockerfile`.
- **CI/CD secrets**: GitHub Actions uses `${{ secrets.* }}` — never echo or log secrets.
- **`gitleaks` CI step**: Scans every push for accidentally committed secrets and blocks the pipeline.

### 6.4 Additional OWASP Controls
- **CSRF protection**: Enabled on all state-changing routes. Sanctum handles this for SPA authentication.
- **CORS**: Strict allowlist — only the two Vercel frontend domains. No wildcard `*` origins.
- **Security headers**: Add middleware for `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security` (in production).
- **Authentication**: Sanctum tokens with expiration. Invalidate tokens on password change.
- **Authorization**: `role:admin` middleware on all `/api/admin/*` routes. Verify ownership on user-specific resources (prevent IDOR).
- **Error handling**: Never expose stack traces or internal errors in API responses in production (`APP_DEBUG=false`).

## 7. Error Handling Strategy

Every error flows from backend exception → structured JSON → frontend handler → user-visible feedback. No silent failures. No raw exceptions leaking. Every error code has a defined frontend action.

### 7.1 Standardized API Error Response Format

Every API error response must follow this exact JSON structure — no exceptions:

```json
{
  "error": "descriptive_snake_case_code",
  "message": "Human-readable message the frontend can display directly to the user",
  "retry": true | false,
  "upgrade": true | false
}
```

- `error`: Machine-readable snake_case code. Never raw exception messages.
- `message`: Clean, user-friendly sentence. Never class names, file paths, or stack traces.
- `retry`: Whether retrying the same request makes sense.
- `upgrade`: Whether to show the "Upgrade Plan" modal.
- In development only (`APP_DEBUG=true`), add a `debug` object with exception class, message, file, line. Strip entirely in production.

For `validation_failed`, include a `details` object:
```json
{
  "error": "validation_failed",
  "message": "Some fields are invalid.",
  "retry": false,
  "upgrade": false,
  "details": {
    "topic": ["The topic field is required."],
    "word_count": ["Word count must be a number."]
  }
}
```

### 7.2 Error Code Reference Table

The backend Global Exception Handler and frontend API client both implement against this table:

| Error Code | HTTP | Retry? | Upgrade? | Frontend Action |
|---|---|---|---|---|
| `quota_exceeded` | 402 | No | Yes | Show upgrade modal |
| `rate_limited` | 429 | Yes (after `retry_after`) | No | Toast with countdown timer |
| `ai_unavailable` | 503 | Auto (queued) | No | Show "Processing shortly" + poll |
| `ai_timeout` | 504 | Yes (once) | No | Show "Try again" button |
| `validation_failed` | 422 | No | No | Highlight invalid fields via `details` |
| `auth_required` | 401 | No | No | Redirect to login |
| `forbidden` | 403 | No | No | Show "Access denied" |
| `file_too_large` | 413 | No | Yes | Show plan file limit + upgrade |
| `unsupported_file_type` | 415 | No | No | Show supported types list |
| `prompt_too_long` | 422 | No | Yes | Show plan char limit + upgrade |
| `agent_not_found` | 404 | No | No | Redirect to agent list |
| `template_not_found` | 500 | No | No | Log CRITICAL + Discord alert. Show "Agent temporarily unavailable" |
| `file_parse_failed` | 422 | No | No | Show "Could not read file. Try a different format." |
| `server_error` | 500 | Yes (once) | No | Generic error + "Report issue" link |

### 7.3 Backend Error Handling Layers

**Global Exception Handler**: Map every exception to the error code table. Custom exceptions:
- `QuotaExceededException` → `quota_exceeded` (402)
- `RateLimitException` → `rate_limited` (429)
- `AiUnavailableException` → `ai_unavailable` (503)
- `AiTimeoutException` → `ai_timeout` (504)
- `InvalidApiKeyException` → log CRITICAL + Discord, return `server_error` (500)
- `TemplateNotFoundException` → log CRITICAL + Discord, return `template_not_found` (500)
- `FileParseException` → `file_parse_failed` (422)
- `PromptTooLongException` → `prompt_too_long` (422)
- Laravel `ValidationException` → `validation_failed` (422) with `details`
- Laravel `AuthenticationException` → `auth_required` (401)
- Laravel `AuthorizationException` → `forbidden` (403)
- Laravel `ModelNotFoundException` → `_not_found` (404)
- Laravel `ThrottleRequestsException` → `rate_limited` (429) with `retry_after`
- Any unhandled exception → `server_error` (500). NEVER leak raw exceptions.

**Service-Level Exceptions**: `HuggingFaceService` throws `RateLimitException`/`AiUnavailableException`/`AiTimeoutException`/`InvalidApiKeyException`. `PromptEngineService` throws `TemplateNotFoundException`/`PromptTooLongException`. `FileProcessorService` throws `FileParseException`.

**Structured Logging**: Every AI call logged:
```
[INFO] ai_call | user_id=42 | agent=code_assistant | model=bigcode/starcoder2-15b | tokens=380 | latency_ms=2340 | status=success | cached=false
[WARNING] ai_fallback | user_id=42 | primary=bigcode/starcoder2-15b | fallback=codellama/CodeLlama-34b-Instruct-hf | reason=429
[CRITICAL] ai_invalid_key | model=bigcode/starcoder2-15b | action=discord_alert_sent
```

### 7.4 Frontend Error Handling Layers

**Centralized API Client** (`src/lib/apiClient.js`): Single wrapper — **no raw `fetch()` calls anywhere**. Intercepts all responses and handles error codes from the table above.

**Component Loading States**: Every API-calling component manages `idle`/`loading`/`error`. Skeleton loaders, disabled buttons during submit, upload progress bars. AI calls > 45s update text; > 90s show "queued" with polling.

**Global Error Boundary**: Catches unhandled React errors. Shows "Something went wrong" + "Reload". POSTs to Discord webhook (non-blocking).

**Offline Detection**: Listens `online`/`offline` events. Shows persistent banner when offline, disables submit buttons, auto-dismisses on reconnect.

**Toast System**: Four levels: `info` (blue), `success` (green), `warning` (yellow), `error` (red). Auto-dismiss after 5s except `error`. Called by `apiClient` — components never handle toast logic.

