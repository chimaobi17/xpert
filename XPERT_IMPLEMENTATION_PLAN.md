# XPERT Implementation Plan (v5.0 - Zero-Cost MVP, Smart Prompt System)

**CRITICAL DIRECTIVE FOR CLAUDE CODE**: Every technology is free-tier or open-source. **No OpenAI. No GPT-4o. No paid API keys. No paid services at any phase.** All AI runs on free Hugging Face Inference API models or self-hosted open-source models via Ollama. Items marked `[SCALE-TRIGGER]` flag what needs upgrading at scale. Never commit secrets. Never hardcode credentials.

---

## ⚠️ EXECUTION STRATEGY — READ THIS FIRST

**DO NOT build all nine phases in one session.** Go phase by phase. This is mandatory.

### Build Order
1. **Session 1 → Phase 1 + 2** (scaffold, `.gitignore`, `.env.example`, migrations, auth). Verify everything runs: `php artisan serve`, hit login/register endpoints, confirm SQLite works.
2. **Session 2 → Phase 3** (Smart Prompt Engine). Verify: `/api/prompts/generate` returns assembled prompts, `/api/prompts/submit` logs correctly.
3. **Session 3 → Phase 4** (HF integration, caching, queues). Verify: AI calls return responses, cache hits work, quota blocks at limit.
4. **Session 4 → Phase 5** (Subscription stubs). Quick verification round.
5. **Session 5 → Phase 6** (User frontend). Verify: full user flow works end-to-end in browser.
6. **Session 6 → Phase 7** (Admin dashboard). Verify: admin can manage agents and view logs.
7. **Session 7 → Phase 8** (User Onboarding & Agent Discovery). Verify: Onboarding flow saves correctly and default agents are attached.
8. **Session 8 → Phase 9** (Specialized AI Agents). Verify: Text-to-image agents UI handles premium gating and layout prompts work well.
9. **Session 9 → Phase 10** (Docker, CI/CD). Verify: `docker-compose up` runs the full stack.
10. **Session 10 → Phase 11** (Pre-Deployment Testing & Security Audit). Verify: Claude Code executes full sweep via `XPERT_MAINTENANCE_PLAN.md`.
11. **Session 11 → Phase 12** (Deployment). Verify: smoke tests pass on live URLs.

### Required Files — Verify Before Session 1
Before starting any build session, confirm these files exist in the workspace root:
- [ ] `XPERT_ARCHITECTURE.md`
- [ ] `XPERT_IMPLEMENTATION_PLAN.md`
- [ ] `XPERT_FRONTEND_IMPLEMENTATION_PLAN.md`
- [ ] `XPERT_FRONTEND_FEATURE_EXTENSIONS.md`
- [ ] `XPERT_MAINTENANCE_PLAN.md`
- [ ] `XPERT_FUTURE_INTEGRATION_PLAN.md`

If ANY file is missing, create it before proceeding. Claude Code must not start Session 1 until all files are present.

### Rules
- **Run tests at the end of every session** before moving to the next phase.
- **If a test fails, fix it in that session.** Do not carry broken code forward.
- **Reference `XPERT_ARCHITECTURE.md`** for schema and endpoint details at each phase.
- **Commit after each successful phase** with a descriptive message (e.g., `feat: phase 2 - auth, migrations, rate limiting`).

---

## 🔍 Phase 0: Hugging Face Model Research (Pre-Build)

**MANDATORY BEFORE ANY CODE IS WRITTEN.** Claude Code must crawl Hugging Face and research the best-performing free models fine-tuned for each agent category. The model registry table below is a starting point — Claude Code must verify and potentially replace these with better alternatives discovered during research.

### Research Checklist
- [x] **0.1** For each agent category below, search Hugging Face for the top-rated, most-downloaded, free Inference API-compatible models.
- [x] **0.2** Verify each model is available on the free Inference API (not gated, not requiring Pro subscription).
- [x] **0.3** Test each model with a sample prompt to confirm it returns quality output and reasonable latency.
- [x] **0.4** Update the model registry table below with the best models found. Document why each was chosen (downloads, benchmark scores, community rating, response quality).
- [x] **0.5** Write the final `config/ai_models.php` based on research results.

### Research Criteria
- **Must be free**: Available on HF Inference API without Pro subscription.
- **Must be responsive**: Average response time < 30 seconds on free tier.
- **Must be quality**: Prefer models with high community ratings, recent updates, and strong benchmarks.
- **Prefer instruction-tuned**: Models fine-tuned for instruction-following over raw base models.
- **Check alternatives**: Don't just accept the defaults below — actively search for newer, better-performing models that may have been released since this plan was written.

---

## Smart Prompt Generation — Data Flow

This is the core user-facing feature. Every developer must understand this sequence:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SMART PROMPT GENERATION FLOW                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  STEP 1: User Input Collection                                     │
│  ┌──────────┐    ┌──────────────────────────────────┐              │
│  │  Select   │───▶│  Dynamic Form (adapts per agent) │              │
│  │  Agent    │    │  e.g. language, topic, tone...   │              │
│  └──────────┘    └──────────────┬───────────────────┘              │
│                                 │                                   │
│  STEP 2: Backend Prompt Engine  ▼                                   │
│  ┌──────────────────────────────────────────────────┐              │
│  │  1. Fetch agent system_prompt from DB             │              │
│  │  2. Fetch prompt_template with {{placeholders}}   │              │
│  │  3. Inject user field values into template         │              │
│  │  4. Append extracted file text (if uploaded)       │              │
│  │  5. Apply prompt engineering best practices        │              │
│  │  6. Return assembled prompt to frontend            │              │
│  └──────────────────────┬───────────────────────────┘              │
│                          │                                          │
│  STEP 3: User Choice     ▼                                          │
│  ┌──────────────────────────────────────────────────┐              │
│  │  OPTION A: "Use Generated Prompt" (read-only)     │              │
│  │  OPTION B: "Write My Own Prompt" (blank textarea)  │              │
│  │  OPTION C: "Edit Generated Prompt" (editable)      │              │
│  │                                                    │              │
│  │  User clicks [Send to AI] — NO auto-submission     │              │
│  └──────────────────────┬───────────────────────────┘              │
│                          │                                          │
│  STEP 4: AI Call + Log   ▼                                          │
│  ┌──────────────────────────────────────────────────┐              │
│  │  1. Check prompt_cache for identical request       │              │
│  │  2. Check user quota (tokens + rate limit)         │              │
│  │  3. Call HF primary model → fallback if needed     │              │
│  │  4. Log to prompt_logs table                       │              │
│  │  5. Return AI response to frontend                 │              │
│  └──────────────────────────────────────────────────┘              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## AI Model Registry Reference Table

Claude Code must create `config/ai_models.php` with this mapping. **These are starting defaults — update with better models discovered during Phase 0 research.**

| Agent Category | Primary Model (HF Free) | Fallback Model (HF Free) | Use Case |
|---|---|---|---|
| **Code Assistant** | `bigcode/starcoder2-15b` | `codellama/CodeLlama-34b-Instruct-hf` | Code generation, debugging, refactoring |
| **Content Writer** | `mistralai/Mixtral-8x7B-Instruct-v0.1` | `HuggingFaceH4/zephyr-7b-beta` | Copywriting, marketing, emails |
| **Business Analyst** | `mistralai/Mixtral-8x7B-Instruct-v0.1` | `mistralai/Mistral-7B-Instruct-v0.2` | SWOT, strategy, business prompts |
| **UX Research** | `mistralai/Mistral-7B-Instruct-v0.2` | `HuggingFaceH4/zephyr-7b-beta` | Usability scripts, UX writing |
| **Graphics Design Advisor** | `mistralai/Mixtral-8x7B-Instruct-v0.1` | `HuggingFaceH4/zephyr-7b-beta` | Design ideas, typography, layout suggestions (Text-based) |
| **Interior Designer (Premium)** | `stabilityai/stable-diffusion-xl-base-1.0` | `runwayml/stable-diffusion-v1-5` | Room design and interior generation (Text-to-Image) |
| **Architectural Visualizer (Premium)** | `stabilityai/stable-diffusion-xl-base-1.0` | `runwayml/stable-diffusion-v1-5` | Building layouts and architectural rendering (Text-to-Image) |
| **Product Photographer (Premium)** | `stabilityai/stable-diffusion-xl-base-1.0` | `runwayml/stable-diffusion-v1-5` | Product shots and studio lighting images (Text-to-Image) |
| **Logo Creator (Premium)** | `stabilityai/stable-diffusion-xl-base-1.0` | `runwayml/stable-diffusion-v1-5` | Vector-style logos and branding marks (Text-to-Image) |
| **Translation** | `facebook/nllb-200-distilled-600M` | N/A | Multilingual prompts |
| **Document Q&A** | `mistralai/Mistral-7B-Instruct-v0.2` | `HuggingFaceH4/zephyr-7b-beta` | RAG-style document analysis |
| **Sentiment Analysis** | `cardiffnlp/twitter-roberta-base-sentiment-latest` | N/A | Classification, tone |
| **Embeddings** | `BAAI/bge-small-en-v1.5` | N/A | Semantic search |

### HF Free Tier Constraints
- ~30 req/min rate limit. Cold starts: 30-60s for unpopular models. Max ~10KB input.

### Fallback Chain (100% Free — NEVER OpenAI)
```
1. PRIMARY model → success → return
2. If 429/5xx → exponential backoff (1s, 2s, 4s) → retry PRIMARY (max 2)
3. If still failing → FALLBACK model (same category)
4. If FALLBACK fails → queue job + notify user "Processing shortly"
⚠️ NEVER default to OpenAI or any paid API.
```

---

## Phase 1: Repository Foundation & Security

- [x] **1.1 Monorepo Scaffold**: Create `xpert-backend` directory. Run:
  ```bash
  composer create-project laravel/laravel xpert-backend
  ```

- [x] **1.2 `.gitignore`**: Create `xpert-backend/.gitignore`:
  ```gitignore
  # Environment & secrets
  .env
  .env.backup
  .env.production

  # Database
  database/database.sqlite

  # Dependencies
  /vendor/
  /node_modules/

  # Storage (user uploads, generated files)
  storage/app/uploads/*
  !storage/app/uploads/.gitkeep
  storage/framework/cache/data/*
  storage/framework/sessions/*
  storage/framework/views/*

  # Docker volumes & local model weights
  docker-volumes/
  ollama_data/
  *.gguf
  *.bin

  # IDE configs
  .vscode/
  .idea/
  *.swp
  *.swo

  # OS files
  .DS_Store
  Thumbs.db

  # Logs
  storage/logs/*.log

  # Compiled assets
  public/hot
  public/storage
  public/build/
  ```

- [x] **1.3 `.env.example`**: Create `xpert-backend/.env.example`:
  ```env
  APP_NAME=Xpert
  APP_ENV=local
  APP_KEY=
  APP_DEBUG=true
  APP_URL=http://localhost:8000

  # Database — SQLite (zero-cost MVP)
  DB_CONNECTION=sqlite
  DB_DATABASE=database/database.sqlite

  # Cache, Sessions, Queue — all database-backed
  CACHE_STORE=database
  SESSION_DRIVER=database
  QUEUE_CONNECTION=database

  # Hugging Face — PRIMARY AI engine (free tier)
  HUGGINGFACE_API_KEY=your_huggingface_key_here

  # Ollama — LOCAL fallback for development
  OLLAMA_BASE_URL=http://localhost:11434

  # CORS — Vercel frontend origins
  FRONTEND_URL=http://localhost:5173
  ADMIN_FRONTEND_URL=http://localhost:5174

  # Error alerting — Discord webhook (free)
  DISCORD_WEBHOOK_URL=your_discord_webhook_here

  # Super Admin seed credentials
  SUPER_ADMIN_EMAIL=admin@xpert.com
  SUPER_ADMIN_PASSWORD=change_this_immediately

  # Paystack — STUBBED for MVP (activate later)
  # PAYSTACK_PUBLIC_KEY=your_key_here
  # PAYSTACK_SECRET_KEY=your_key_here
  ```

- [x] **1.4 `README.md`** (setup section): Create `xpert-backend/README.md`:
  ```markdown
  # Xpert Backend

  ## Quick Start (< 5 minutes)

  ### Prerequisites
  - PHP 8.3+
  - Composer 2+
  - A free Hugging Face account + API token

  ### Setup
  1. Clone the repository:
     ```bash
     git clone <repo-url> && cd xpert-backend
     ```
  2. Install dependencies:
     ```bash
     composer install
     ```
  3. Configure environment:
     ```bash
     cp .env.example .env
     php artisan key:generate
     ```
  4. Edit `.env` and add your Hugging Face API key.
  5. Create the database and run migrations + seed:
     ```bash
     touch database/database.sqlite
     php artisan migrate --force
     php artisan db:seed
     ```
  6. Start the server:
     ```bash
     php artisan serve
     ```
  7. (Optional) Start the queue worker for async AI jobs:
     ```bash
     php artisan queue:work database --tries=3
     ```

  The API is now running at `http://localhost:8000`.
  ```

- [x] **1.5 Secret Scanning (CI)**: Add secret scanning to GitHub Actions (see Phase 8).

---

## Phase 2: Database & Auth

- [x] **2.1 Environment & SQLite**: Configure `.env` per `.env.example`. Create SQLite file:
  ```bash
  touch database/database.sqlite
  ```
  Run Laravel table scaffolds:
  ```bash
  php artisan cache:table
  php artisan session:table
  php artisan queue:table
  ```
  - *Justification*: Zero-cost. No external DB server.
  - `[SCALE-TRIGGER]`: PostgreSQL + Redis when writes > 50/sec.

- [x] **2.2 Database Migrations (SQLite-Compatible)**:

  **Seeder Note**: Seed one `super_admin` user with credentials configurable via `.env` variables `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` (with defaults in `.env.example` as placeholders). Use `updateOrCreate` so it's idempotent.
  **Seeder Idempotency Rules (MANDATORY — enforced across ALL seeders):**
- Every seeder MUST use `updateOrCreate()` — NEVER `create()`, `insert()`, or `firstOrCreate()`.
- Unique lookup key for agents: `['name' => '...']`
- Unique lookup key for prompt templates: `['agent_id' => ..., 'version' => ...]`
- Unique lookup key for chatbot knowledge: `['question' => '...']`
- Unique lookup key for super_admin: `['email' => config('app.super_admin_email')]`
- These seeders run on EVERY deploy and container restart. They must be safe to execute 1,000 times with zero side effects.

  **Chatbot Seeder**: Seed the `chatbot_knowledge` table with 20-30 Q&A pairs (5 Getting Started, 5 Agents&Prompts, 5 Billing, 5 Navigation, 5 Features) using `updateOrCreate`.

  **SQLite strict rules** — enforce in every migration:
  - No `ALTER COLUMN` — drop and recreate if modification needed.
  - No native `enum` — use `string` + application validation.
  - No native JSON enforcement — use `TEXT`, validate in Form Requests.
  - Always use `->nullable()` or `->default()` for new columns.

  **Tables:**

  | Table | Columns | Notes |
  |---|---|---|
  | `users` | `id`, `name`, `email` (unique), `password`, `role` (string: user/admin/super_admin) | Three-tier role system: `user` (default), `admin` (dashboard access, user management, agent CRUD), `super_admin` (all admin powers + can promote/demote admins + can delete users permanently)., `plan_level` (string: free/standard/premium, default: free), `banned_until` (timestamp, null), `ban_reason` (text, null), timestamps |
  | `ai_agents` | `id`, `name`, `domain` (Must be one of: Technology, Creative, Business, Research, Language), `category` (maps to model registry), `system_prompt` (text), `is_premium_only` (bool, default: false), timestamps | Seeded with 5+ agents |
  | `prompt_templates` | `id`, `agent_id` (FK, cascade), `template_body` (text with `{{placeholders}}`), `field_schema` (text — JSON as TEXT), `version` (integer, default: 1), timestamps | Admin-editable. `field_schema` defines the dynamic form fields per agent |
  | `prompt_logs` | `id`, `user_id` (FK, cascade), `agent_id` (FK, cascade), `prompt_type` (string: generated/custom/edited), `prompt_text` (text), `tokens_estimated` (integer), `created_at` | Invaluable for improving templates |
  | `prompt_library` | `id`, `user_id` (FK, cascade), `agent_id` (FK, cascade), `original_input` (text), `final_prompt` (text), `ai_response` (text), `created_at` | User-saved prompts |
  | `prompt_cache` | `id`, `cache_key` (unique, SHA-256), `agent_id`, `prompt_text` (text), `response_text` (text), `created_at` | 24h TTL in app |
  | `token_usage_logs` | `id`, `user_id` (FK, cascade), `date` (indexed), `tokens_used`, `request_count` | Index: user_id + date |
  | `uploaded_files` | `id`, `user_id` (FK, cascade), `file_path`, `mime_type`, `size_bytes`, `parsed_content` (text, nullable), timestamps | Local disk paths |
  | `chatbot_knowledge` | `id`, `keywords` (text, comma-separated), `question` (text), `answer` (text, markdown-supported), `action_type` (string, nullable: `navigate`, `modal`, `null`), `action_target` (string, nullable: route path or modal name), `category` (string: `general`, `agents`, `prompts`, `billing`, `navigation`, `getting_started`), `sort_order` (int), timestamps | Admin-editable Q&A for non-AI help widget |
| `jobs`, `cache`, `sessions` | Laravel defaults | Via artisan commands above |

- [x] **2.3 AI Model Registry Config**: Create `config/ai_models.php` with the exact model mapping from the reference table above. Structure:
  ```php
  return [
      'code_assistant' => [
          'primary' => 'bigcode/starcoder2-15b',
          'fallback' => 'codellama/CodeLlama-34b-Instruct-hf',
          'max_tokens' => 2048,
          'timeout' => 30,
      ],
      'content_writer' => [
          'primary' => 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          'fallback' => 'HuggingFaceH4/zephyr-7b-beta',
          'max_tokens' => 4096,
          'timeout' => 30,
      ],
      // ... all categories from registry table
  ];
  ```

- [x] **2.4 Auth & Roles (Sanctum)**: Install Sanctum. Create:
  - `GET /api/chatbot/knowledge` — returns full chatbot knowledge base for client caching.
  - `GET /api/health` — Public, no auth required, no database query. Returns `{ "status": "ok", "timestamp": "..." }`. Used for Render health checks and Frontend keep-alive.
  - `POST /api/auth/register` — user with `role: user`, `plan_level: free`.
  - `POST /api/auth/login` — returns Sanctum token (works for user + admin). **Ban Check**: AFTER validating credentials but BEFORE returning a token, check ban status. If banned, do NOT return a token. Return `account_blocked` error (403) with `banned_until` and `ban_reason`.
  - `GET /api/user` — returns authenticated user profile with exact shape:
    ```json
    {
      "id": 1, "name": "Chimaobi", "email": "chimaobi@example.com", "role": "user", "plan_level": "free",
      "job_title": "Full-Stack Developer", "purpose": "Build tools", "field_of_specialization": "technology",
      "onboarding_complete": true, "banned_until": null, "ban_reason": null, "created_at": "2025-07-01T00:00:00Z"
    }
    ```
    *Note: `onboarding_complete` is a computed accessor (true if `field_of_specialization` is not null).*
  - `role` middleware hierarchy:
    - `user` → `/api/*` user routes
    - `admin` → `/api/admin/*` routes (user management, agent CRUD, logs)
    - `super_admin` → `/api/admin/*` + `/api/admin/users/{id}/promote` + `/api/admin/users/{id}/delete`
    The `role:admin` middleware must allow BOTH `admin` and `super_admin`. The `role:super_admin` middleware must allow ONLY `super_admin`.

- [x] **2.5 Security Hardening (OWASP-Aligned)**:
  
  **DIRECTIVE**: Review this app and **harden its security**. Follow **OWASP best practices**, include clear comments, and do not break existing functionality.
  
  **2.5.1 Rate Limiting (IP + User-Based)**:
  - Apply rate limiting on **all public endpoints** — not just AI routes.
  - **Dual-layer**: IP-based throttle (prevent brute-force) + user-based throttle (enforce plan quotas).
  - Unauthenticated routes (login, register) → 10 req/min per IP.
  - Authenticated routes → plan-based: Free: 50/day, Standard: 300/day, Premium: Unlimited.
  - Return graceful `HTTP 429` with `Retry-After` header and JSON body `{ "error": "rate_limited", "retry_after": <seconds> }`.
  - Use `RateLimiter` facade backed by database cache. `[SCALE-TRIGGER]`: Redis atomic counters.

  **2.5.2 Strict Input Validation & Sanitization**:
  - Every endpoint must use Laravel **Form Requests** with explicit validation rules. No raw `$request->input()`.
  - **Type checks**: Enforce `string`, `integer`, `boolean`, `file`, `array` on every field. Reject mismatched types.
  - **Domain Validation**: Explicitly use `in:technology,creative,business,research,language` (and capitalized variants for AI Agents table).
  - **Length limits**: `max:` rules on all inputs (prompt text max 10,000 chars, name max 255, etc.).
  - **Reject unexpected fields**: Use `$request->validated()` exclusively — never `$request->all()`. Extra fields silently dropped.
  - **File validation**: Validate MIME (`mimes:pdf,docx,xlsx,png,jpg`), size (per plan), reject executables.
  - **XSS prevention**: Escape all output. Sanitize HTML in text fields.
  - **SQL injection prevention**: Eloquent / parameterized queries only. Never `DB::raw()` with user input.

  **2.5.3 Secure API Key Handling**:
  - **No hard-coded keys**: Every secret must come from `.env`. Never hardcode.
  - **No client-side exposure**: API keys never appear in frontend code, responses, or JS bundles. `HUGGINGFACE_API_KEY` is backend-only.
  - **Docker**: Use `env_file:` — never inline secrets in Compose or Dockerfile.
  - **CI/CD**: Use `${{ secrets.* }}` in GitHub Actions — never echo or log.
  - **`gitleaks`**: Scans every push and blocks on detected secrets.

  **2.5.4 Additional OWASP Controls**:
  - **CORS**: Strict allowlist — only the two Vercel frontend domains. No wildcard `*`.
  - **Security headers middleware**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security` (production).
  - **Auth tokens**: Sanctum tokens with expiration. Invalidate on password change.
  - **Authorization**: `role:admin` middleware on `/api/admin/*`. Verify ownership on user resources (prevent IDOR).
  - **Error handling**: `APP_DEBUG=false` in production. Never expose stack traces in API responses.

- [x] **2.6 Phase 2 Tests**:
  - ✅ `GET /api/chatbot/knowledge` returns seeded entries.
  - ✅ `GET /api/health` returns 200 with `{ status: ok }` without authentication.
  - ✅ Non-authenticated users cannot access chatbot endpoint (401).
  - ✅ Registration returns Sanctum token with correct `role` and `plan_level`.
  - ✅ Login succeeds/fails correctly.
  - ✅ Admin middleware blocks non-admin users.
  - ✅ Rate limiter returns 429 after threshold (both IP and user-based).
  - ✅ All migrations run cleanly on SQLite.
  - ✅ Form Request rejects invalid/unexpected input fields with 422.
  - ✅ Non-admin user cannot access `/api/admin/*` routes (403).
  - ✅ CORS rejects requests from non-allowed origins.
  - ✅ Global exception handler returns correct JSON structure for each error code.
  - ✅ Unhandled exception returns `server_error` with no stack trace when `APP_DEBUG=false`.

---

## Phase 3: Smart Prompt Generation Engine (CORE FEATURE)

- [x] **3.1 Dynamic Form Schema**: Each agent's `prompt_templates.field_schema` column stores a JSON (as TEXT) definition of the form fields the frontend must render. Example schemas:

  **Code Assistant:**
  ```json
  {
    "fields": [
      { "name": "language", "type": "select", "label": "Programming Language", "options": ["Python", "JavaScript", "PHP", "Go", "Rust", "Java", "C#", "Other"], "required": true },
      { "name": "task_description", "type": "textarea", "label": "Describe your task", "required": true },
      { "name": "complexity", "type": "select", "label": "Complexity", "options": ["Beginner", "Intermediate", "Advanced"], "required": true },
      { "name": "framework", "type": "text", "label": "Framework/Library (optional)", "required": false }
    ]
  }
  ```

  **Content Writer / Essay Writer:**
  ```json
  {
    "fields": [
      { "name": "topic", "type": "text", "label": "Topic", "required": true },
      { "name": "tone", "type": "select", "label": "Tone", "options": ["Formal", "Casual", "Academic", "Persuasive", "Technical"], "required": true },
      { "name": "word_count", "type": "number", "label": "Target Word Count", "required": true },
      { "name": "audience", "type": "text", "label": "Target Audience", "required": false },
      { "name": "key_points", "type": "textarea", "label": "Key Points to Cover", "required": false }
    ]
  }
  ```

  **Document Analyzer:**
  ```json
  {
    "fields": [
      { "name": "file", "type": "file", "label": "Upload Document", "required": true },
      { "name": "extraction_type", "type": "select", "label": "What to Extract", "options": ["Summary", "Key Points", "Action Items", "Specific Questions"], "required": true },
      { "name": "specific_questions", "type": "textarea", "label": "Your Questions (if applicable)", "required": false }
    ]
  }
  ```

  **Translation Agent:**
  ```json
  {
    "fields": [
      { "name": "source_language", "type": "select", "label": "Source Language", "options": ["English", "French", "Spanish", "German", "Chinese", "Arabic", "Auto-detect"], "required": true },
      { "name": "target_language", "type": "select", "label": "Target Language", "options": ["English", "French", "Spanish", "German", "Chinese", "Arabic"], "required": true },
      { "name": "context", "type": "select", "label": "Context", "options": ["Technical", "Casual", "Legal", "Medical", "Literary"], "required": true },
      { "name": "text_input", "type": "textarea", "label": "Text to Translate", "required": false },
      { "name": "file", "type": "file", "label": "Or Upload File", "required": false }
    ]
  }
  ```

- [x] **3.2 Prompt Template System**: Each agent has admin-editable prompt templates in `prompt_templates` with `{{placeholder}}` variables. Example for Code Assistant:
  ```
  You are an expert {{language}} developer.

  Task: {{task_description}}
  Complexity Level: {{complexity}}
  {{#if framework}}Preferred Framework/Library: {{framework}}{{/if}}

  Instructions:
  - Write clean, well-commented code.
  - Follow {{language}} best practices and conventions.
  - Include error handling where appropriate.
  - Explain your approach briefly before the code.

  Output Format:
  1. Brief explanation of approach
  2. Complete, runnable code
  3. Usage example
  ```
  The engine replaces `{{placeholders}}` with user field values at runtime.

- [x] **3.3 Prompt Engine Service** (`App\Services\PromptEngineService`):
  ```php
  // Pseudocode
  class PromptEngineService {
      public function generate(Agent $agent, array $userInputs, ?string $fileContent): string {
          // 1. Fetch agent's system prompt
          $systemPrompt = $agent->system_prompt;

          // 2. Fetch the latest prompt template for this agent
          $template = $agent->promptTemplates()->latest('version')->first();

          // 3. Replace {{placeholders}} with user field values
          $body = $this->replacePlaceholders($template->template_body, $userInputs);

          // 4. Append file content if provided
          if ($fileContent) {
              $body .= "\n\n--- ATTACHED DOCUMENT ---\n" . $fileContent;
          }

          // 5. Assemble final prompt
          return $systemPrompt . "\n\n" . $body;
      }
  }
  ```
  This is NOT simple string concatenation — it applies prompt engineering best practices: role assignment, structured instructions, output format specification, and contextual constraints.

- [x] **3.4 Prompt Generation API Endpoint**:
  - `POST /api/prompts/generate` — accepts `agent_id` + structured field values + optional file. Returns the generated prompt text (does NOT call AI yet).
  - `POST /api/prompts/submit` — accepts the final prompt text (generated, custom, or edited) + `prompt_type` (generated/custom/edited). Calls the AI model and returns the response.
  - This two-step API enforces the user choice flow: generate first, then explicitly submit.

- [x] **3.5 Prompt Logging**: On every `POST /api/prompts/submit`, log to `prompt_logs`:
  - `user_id`, `agent_id`, `prompt_type` (generated/custom/edited), `prompt_text`, `tokens_estimated` (approx: `strlen / 4`), `created_at`.
  - *Justification*: Data for improving prompt templates over time.

- [x] **3.6 File Processor Service**: Accept uploads via `Storage::disk('local')`. Validate MIME types in Form Request. Extract text:
  - PDF → `smalot/pdfparser`.
  - DOCX → `phpoffice/phpword`.
  - Images → store path only (no OCR for MVP).
  - `[SCALE-TRIGGER]`: S3/R2 when disk exceeds capacity.

- [x] **3.7 Phase 3 Tests**:
  - ✅ Prompt engine correctly replaces `{{placeholders}}` in templates.
  - ✅ File content is appended to prompt when present.
  - ✅ `/api/prompts/generate` returns assembled prompt without calling AI.
  - ✅ `/api/prompts/submit` calls AI and returns response.
  - ✅ `prompt_logs` entry is created with correct `prompt_type`.
  - ✅ Invalid field inputs return `422` validation errors.
  - ✅ Missing template throws `TemplateNotFoundException`, not empty response.
  - ✅ Corrupt file upload returns `file_parse_failed` with user-friendly message.
  - ✅ Prompt exceeding plan char limit returns `prompt_too_long` with `upgrade: true`.

---

## Phase 4: AI Integration & Caching

- [x] **4.1 Hugging Face Service** (`App\Services\HuggingFaceService`):
  ```php
  class HuggingFaceService {
      public function generate(string $category, string $prompt): ?string {
          $models = config("ai_models.{$category}");

          // 1. Try primary model with retries
          try {
              return $this->callInferenceAPI($models['primary'], $prompt, retries: 2);
          } catch (RateLimitException | ServerException $e) {
              Log::warning("HF primary failed", ['category' => $category, 'error' => $e->getMessage()]);
          }

          // 2. Try fallback model
          if (!empty($models['fallback'])) {
              try {
                  return $this->callInferenceAPI($models['fallback'], $prompt, retries: 1);
              } catch (\Exception $e) {
                  Log::error("HF fallback also failed", ['category' => $category]);
              }
          }

          // 3. Queue for later — NEVER call OpenAI
          dispatch(new ProcessDeferredPrompt($category, $prompt, auth()->id()));
          return null; // Frontend shows "queued" message
      }

      private function callInferenceAPI(string $model, string $prompt, int $retries): string {
          // Uses Http::withToken() + exponential backoff (1s, 2s, 4s)
          // timeout: config("ai_models.{category}.timeout") seconds
      }
  }
  ```

- [x] **4.2 Response Caching (SQLite)**: Before any AI call, hash `agent_id . $final_prompt` (SHA-256) → check `prompt_cache`. If hit exists and < 24h old → return cached. On miss → call HF, store result.
  - *Justification*: Dramatically reduces API consumption on HF free tier.

- [x] **4.3 Quota Enforcement**: Check `token_usage_logs` for user's daily total before every AI call.
  - Free: 25k/day, Standard: 150k/day, Premium: 1M/day.
  - Exceeded → `HTTP 402` with `{ "error": "quota_exceeded" }`.

- [x] **4.4 Queue Processing**: Database queue driver. Dispatch long-running AI jobs. Process via cron:
  ```bash
  * * * * * cd /var/www/html && php artisan queue:work database --stop-when-empty --tries=3 --backoff=10
  ```
  - `[SCALE-TRIGGER]`: Redis + Horizon.

- [x] **4.5 Phase 4 Tests**:
  - ✅ HF service returns response (mock HTTP).
  - ✅ Fallback triggers on primary 429.
  - ✅ Cache hit returns stored response without API call.
  - ✅ Quota blocks after daily limit.
  - ✅ Queued job dispatches when all models fail.
  - ✅ HF invalid API key triggers `CRITICAL` log + Discord alert, does NOT retry.
  - ✅ All models failed → job dispatched + `ai_unavailable` (503) returned to client.
  - ✅ Successful AI call logs structured `ai_call` line with latency_ms.

---

## Phase 5: Subscription Logic (Stubbed)

- [x] **5.1 Plan Enforcement**: `plan_level` column drives gating. No payment processor for MVP.
- [x] **5.2 Admin Manual Upgrade**: `PUT /api/admin/users/{id}/upgrade` changes `plan_level`.
- [x] **5.3 Paystack Stub**: `PaymentService` interface with empty `PaystackService`. Commented-out webhooks. **Feature Flag Endpoints**: Add `GET /api/config/features` returning `{ "payments_enabled": false }` based on `.env`. `PaymentService` interface with empty `PaystackService`. Commented-out webhooks.
  - `[SCALE-TRIGGER]`: Paystack test → production.
- [x] **5.4 Phase 5 Tests**:
  - ✅ `GET /api/config/features` returns `{ "payments_enabled": false }` when `PAYSTACK_SECRET_KEY` is not set.
  - ✅ `GET /api/config/features` returns `{ "payments_enabled": true }` when `PAYSTACK_SECRET_KEY` is set.
  - ✅ Plan upgrade propagates to quota/rate checks.
  - ✅ Free user blocked from premium-only agents.

---

## Phase 6: User App Frontend (`xpert-app`)

> **DELEGATED TO FRONTEND PLAN:** All User App UI/UX, State Management, and frontend logic have been extracted (Note: Theme management is entirely client-side via localStorage and HTML class, no backend schema needed) to ensure this plan remains strictly for backend functionalities. 
> 
> 👉 **Please execute [XPERT_FRONTEND_IMPLEMENTATION_PLAN.md](./XPERT_FRONTEND_IMPLEMENTATION_PLAN.md) for Phase 6.**

---

## Phase 7: Admin Dashboard Frontend (`xpert-admin-dashboard`)

> **DELEGATED TO FRONTEND PLAN:** All Admin Dashboard frontend features (user management UI, role toggles, moderation modals) are now handled in the dedicated frontend plan.
> 
> 👉 **Please execute [XPERT_FRONTEND_IMPLEMENTATION_PLAN.md](./XPERT_FRONTEND_IMPLEMENTATION_PLAN.md) for Phase 7.**

---


### Phase 7 Backend Support (Built During Session 6 Alongside Admin Frontend)

These backend API endpoints support the admin dashboard features. Build them when executing Phase 7 from the frontend plan.

- [ ] **7.6 Admin Chatbot Knowledge Manager API**: `CRUD /api/admin/chatbot/knowledge` endpoints behind `role:admin` middleware. Form Request validation: `question` required string max:500, `answer` required string max:5000 (markdown), `keywords` required string max:500 (comma-separated), `action_type` nullable string in:navigate,modal, `action_target` nullable string max:255, `category` required string in:general,agents,prompts,billing,navigation,getting_started, `sort_order` integer.

- [ ] **7.6 Admin Chatbot Knowledge Manager UI** (`/chatbot` route in admin):
  - Data table of all `chatbot_knowledge` entries (Question, Category, Has Action, Sort Order).
  - Edit Modal for row: question, markdown answer, tag-style keywords, action type dropdown, action target input.
  - "Add Entry" / "Delete" confirm.
  - "Preview" simulation panel to test matching.
  - Add to admin Sidebar between "Prompt Logs" and "Settings".
  - Corresponds to backend API endpoint: `CRUD /api/admin/chatbot/knowledge`.
  
  **Phase 7.7 Test Checklist Additions**:
  - ✅ Admin can CRUD chatbot knowledge entries.
  - ✅ New entries appear in `GET /api/chatbot/knowledge` immediately.
  - ✅ Admin preview panel matches questions correctly.

## Phase 8: User Onboarding & Agent Discovery (Backend)

- [ ] **8.1 User Profile Fields**: Create migration to add `job_title` (string, nullable), `purpose` (text, nullable), and `field_of_specialization` (string, nullable). Note: Must be one of: `technology`, `creative`, `business`, `research`, `language`. Stored as lowercase. to `users` table. Update `User` model `$fillable`.
- [ ] **8.2 User-Agent Relationship**: Create migration for `user_agents` pivot table (`id`, `user_id`, `agent_id`, timestamps) to track which agents a user has added to their active workspace.
- [ ] **8.3 Onboarding Endpoint**: `PATCH /api/user/profile` to validate and save onboarding fields.
- [ ] **8.4 Auto-Assign Default Agents**: In the Onboarding logic, when a user sets their `field_of_specialization`, automatically attach 3-5 free default agents from that domain to their `user_agents` pivot table.
    **Case-Insensitive Match**: Use `where('domain', 'LIKE', $user->field_of_specialization)` or normalize both to lowercase.
    **Explicit Mapping**:
    - `technology` → Code Assistant, Document Q&A, UX Research
    - `creative` → Content Writer, Graphics Design Advisor, Logo Creator (if free)
    - `business` → Business Analyst, Content Writer, Sentiment Analysis
    - `research` → Document Q&A, Sentiment Analysis, Translation
    - `language` → Translation, Content Writer, Document Q&A
- [ ] **8.5 Agent Search API**:
  - `GET /api/agents` behavior: Include an `is_added` boolean field eagerly loaded based on if the user has the agent in `user_agents` pivot.
  - `GET /api/user/agents` behavior: Returns ONLY the agents attached to the authenticated user. 
  - `GET /api/agents/search?q={query}` (Add text search to AgentController).
  - `POST /api/user/agents/{agent_id}` to add an agent to the user's workspace.
  - `DELETE /api/user/agents/{agent_id}` to remove an agent.

---


- [ ] **8.6 Admin Moderation Endpoints**:
  - `PUT /api/admin/users/{id}/block` (admin): Accepts `{ "duration": "24h|7d|30d|permanent", "reason": "string (min 10)" }`. Sets `banned_until` and `ban_reason`.
  - `PUT /api/admin/users/{id}/unblock` (admin): Clears `banned_until` and `ban_reason`.
  - `PUT /api/admin/users/{id}/promote` (super_admin): Accepts `{ "role": "admin|user" }`. Returns 403 for regular admins.
  - `DELETE /api/admin/users/{id}` (super_admin): Cascading delete of user and all data. Returns 403 for regular admins.
  
  **CheckBanStatus Middleware**: Run on all authenticated routes. If `banned_until` is set and in the future (or null for permanent), return `account_blocked` (403) with JSON showing duration and reason.

## Phase 9: Specialized AI Agents (Graphics & Image Generation)

- [ ] **9.1 Update AI Model Registry**: Modify `config/ai_models.php` to include:
  - `graphics_design_advisor`: Text-based model for design advice (e.g., `mistralai/Mixtral-8x7B-Instruct-v0.1`), **Free Tier**.
  - `interior_designer`: Text-to-Image generation (e.g., `stabilityai/stable-diffusion-xl-base-1.0`), **Premium Only**.
  - `architectural_renderer`: Text-to-Image generation, **Premium Only**.
  - `product_photographer`: Text-to-Image generation, **Premium Only**.
  - `logo_creator`: Text-to-Image generation, **Premium Only**.
- [ ] **9.2 Update Agent Seeder**: Modify `database/seeders/AiAgentSeeder.php`:
  - Add the `Graphics Design Advisor` agent (non-image, free).
  - Add the four Premium text-to-image agents (`Interior Designer`, `Architectural Visualizer`, `Product Photographer`, `Logo Creator`) with `is_premium_only` set to `true`.
- [ ] **9.3 Image Generation Prompts**: Ensure text-to-image agents use `prompt_templates` that combine all user inputs (style, subject, lighting) into a single descriptive string, since HF Inference API expects a single string for image generation.
- [ ] **9.4 Premium Gating Backend Enforcement**: Ensure the `AgentController` securely blocks access to Premium agents if the user is on a free plan (return 402 Payment Required). *Note: The specific UI/UX for the Upgrade Modal is covered in the Frontend Implementation Plan.*

---

## Phase 10: Docker, Monitoring & CI/CD

### 10.1 Dockerfile (`xpert-backend/Dockerfile`)

```dockerfile
# ------- Stage 1: Composer Dependencies -------
FROM composer:2 AS composer-deps
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# ------- Stage 2: Production Image -------
FROM php:8.3-cli-alpine AS production

RUN apk add --no-cache \
    sqlite sqlite-dev libzip-dev oniguruma-dev \
    postgresql-dev \
    && docker-php-ext-install pdo_sqlite pdo_pgsql mbstring zip bcmath
# Supports both SQLite (local dev) and PostgreSQL (production on Supabase/Neon)

WORKDIR /var/www/html

COPY --from=composer-deps /app/vendor ./vendor
COPY . .

# CRITICAL: No secrets in image. Use --env-file at runtime.
RUN composer dump-autoload --optimize

RUN mkdir -p database storage/app/public storage/logs \
    && touch database/database.sqlite \
    && chmod -R 775 storage database

EXPOSE 8000

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
```

### 10.2 Entrypoint (`xpert-backend/docker-entrypoint.sh`)

```bash
#!/bin/sh
set -e

# Cache config (uses env vars from --env-file)
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Seed default agents if empty
# CRITICAL: ALL seeders MUST use updateOrCreate() — never create() or insert().
# This command runs on every container restart. Non-idempotent seeders WILL create duplicates.
php artisan db:seed --force

# Start queue worker in background
# DO NOT use --stop-when-empty in the entrypoint — it kills the worker permanently after first drain.
# --sleep=30: poll every 30s when idle (saves CPU on free tier)
# --max-time=3600: restart worker hourly to prevent memory leaks
php artisan queue:work database --sleep=30 --tries=3 --backoff=10 --max-time=3600 &

# Start API server
php artisan serve --host=0.0.0.0 --port=8000
```

### 10.3 Docker Compose (`docker-compose.dev.yml` — project root)

```yaml
version: "3.8"

services:
  xpert-backend:
    build:
      context: ./xpert-backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./xpert-backend:/var/www/html
      - ./xpert-backend/database:/var/www/html/database
    env_file:
      - ./xpert-backend/.env    # NEVER inline secrets
    depends_on:
      - ollama

  # Local AI model server (development only)
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 2G

volumes:
  ollama_data:
```

**Startup:**
```bash
docker-compose -f docker-compose.dev.yml up -d
docker exec -it $(docker ps -qf "name=ollama") ollama pull mistral:7b
# If machine has < 8GB RAM, remove ollama service — use HF API only.
```

### 10.4 Laravel Logging & Alerts

Configure `config/logging.php`: `daily` channel, 14-day rotation. Custom `discord` channel for `critical`/`emergency` events.
- `[SCALE-TRIGGER]`: Sentry.

### 10.5 GitHub Actions CI + Secret Scanning

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]

jobs:
  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  backend-tests:
    runs-on: ubuntu-latest
    needs: secret-scan
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: pdo_sqlite, mbstring, zip
      - run: |
          cd xpert-backend
          composer install --no-interaction
          cp .env.example .env
          php artisan key:generate
          touch database/database.sqlite
          php artisan migrate --force
          php artisan test

  frontend-build:
    runs-on: ubuntu-latest
    needs: secret-scan
    strategy:
      matrix:
        app: [xpert-app, xpert-admin-dashboard]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: |
          cd ${{ matrix.app }}
          npm ci
          npm run build
```

---

## Phase 11: Pre-Deployment Maintenance & Testing Audit

**Goal**: Execute a comprehensive codebase review and security sweep BEFORE launching, strictly adhering to the protocols in `XPERT_MAINTENANCE_PLAN.md`.

- [ ] **11.1 Full Application Code Review** 
  - [ ] Prompt Claude Code: *"Review all files in `app/Http/Controllers`, `app/Models`, `src/components`, and `src/pages` for performance bottlenecks, dead code, and standard React/Laravel best practices."*
  - [ ] Apply all refactoring suggestions (e.g., fix React re-render issues, consolidate Tailwind classes).
- [ ] **11.2 Comprehensive Security Sweep**
  - [ ] Prompt Claude Code: *"Use Security Guidance across the backend API and frontend routing layer. Check for OWASP vulnerabilities, API key exposures, and broken access controls."*
  - [ ] Verify `CheckBanStatus` and agent restrictions are airtight. Apply all patches.
- [ ] **11.3 End-to-End Testing Execution**
  - [ ] Run backend tests (if PHPUnit tests exist) or manually test the critical `user`, `admin`, and `super_admin` pathways.
  - [ ] Test the In-App Help Chatbot widget offline to ensure the fallback knowledge base loads.
  - [ ] Run frontend checks: `npm run lint` and `npm run build` (ensure no Vite compile errors).
- [ ] **11.4 Phase 11 Approvals**:
  - [ ] ✅ Zero CRITICAL/HIGH vulnerabilities reported by Claude's Security Guidance.
  - [ ] ✅ Zero unhandled JavaScript console errors.
  - [ ] ✅ The app is 100% stable locally.

---

## Phase 12: Cloud Deployment (Render Free + Vercel Free)

- [ ] **12.1 Render Blueprint** (`xpert-backend/render.yaml`):
  ```yaml
  services:
    - type: web
      name: xpert-backend
      runtime: docker
      dockerfilePath: ./Dockerfile
      plan: free
      envVars:
        - key: APP_ENV
          value: production
        - key: APP_KEY
          generateValue: true
        - key: HUGGINGFACE_API_KEY
          sync: false
        - key: DB_CONNECTION
          value: pgsql # Important: Supabase is Postgres
        - key: DATABASE_URL
          sync: false # You will paste your Supabase Connection String directly into the Render Dashboard Secrets!
        - key: QUEUE_CONNECTION
          value: database
        - key: CACHE_STORE
          value: database
        - key: FRONTEND_URL
          sync: false
        - key: ADMIN_FRONTEND_URL
          sync: false
  ```
  **CRITICAL**: Docker must use `env_file` or Render env vars. No inline secrets.

- [ ] **9.2 Deploy Backend**: Push to GitHub → connect Render Blueprint → obtain live URL.
- [ ] **9.3 Deploy Frontends**: `vercel --prod` for both `xpert-app` and `xpert-admin-dashboard`.
- [ ] **9.4 Environment Wiring (Vercel CLI Automations)**: Claude Code must use the Vercel CLI (`vercel env add`) to automatically inject the new live production URLs into both Vercel projects:
  - `vercel env add VITE_API_BASE_URL production` (Set to the live Render URL).
  - `vercel env add VITE_DISCORD_WEBHOOK production`.
  - Update CORS on Laravel `config/cors.php` to allow both live Vercel domains.
- [ ] **12.5 Smoke Test**:
  - ✅ Login from both frontends.
  - ✅ Select agent → dynamic form → generate prompt → choose option → send → receive AI response.
  - ✅ Admin can edit agent templates and view prompt logs.
  - ✅ 429 and 402 errors render correctly.

---

## Error Handling Strategy

Every error flows: backend exception → structured JSON → frontend handler → user-visible feedback. No silent failures. No raw exceptions leaking. Every error code has a defined frontend action.

### Standardized API Error Response Format

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
- In dev only (`APP_DEBUG=true`), add `debug` object (exception class, message, file, line). Strip in production.

For `validation_failed`, include `details`:
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

### Error Code Reference Table

| Error Code | HTTP | Retry? | Upgrade? | Frontend Action |
|---|---|---|---|---|
| `account_blocked` | 403 | No | No | Show blocked screen with reason, duration, support link |
| `premium_required` | 402 | No | Yes | Show upgrade modal with agent name |
| `agent_already_added` | 409 | No | No | Toast "This agent is already in your workspace" |
| `agent_limit_reached` | 403 | No | Yes | Toast "Free plan limited to X agents. Upgrade for more." |
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
| `template_not_found` | 500 | No | No | Log CRITICAL + Discord. Show "Agent temporarily unavailable" |
| `file_parse_failed` | 422 | No | No | Show "Could not read file. Try a different format." |
| `server_error` | 500 | Yes (once) | No | Generic error + "Report issue" link |

### Backend Error Handling Layers

**Global Exception Handler** (`bootstrap/app.php`): Map every exception to the error code table above.

**Custom Exception Classes:**
- `QuotaExceededException` → `quota_exceeded` (402)
- `RateLimitException` → `rate_limited` (429)
- `AiUnavailableException` → `ai_unavailable` (503)
- `AiTimeoutException` → `ai_timeout` (504)
- `InvalidApiKeyException` → log CRITICAL + Discord alert, return `server_error` (500)
- `TemplateNotFoundException` → log CRITICAL + Discord alert, return `template_not_found` (500)
- `FileParseException` → `file_parse_failed` (422)
- `PromptTooLongException` → `prompt_too_long` (422)

**Laravel Built-in Exception Mappings:**
- `ValidationException` → `validation_failed` (422) with `details` field-to-error mapping
- `AuthenticationException` → `auth_required` (401)
- `AuthorizationException` → `forbidden` (403)
- `ModelNotFoundException` → appropriate `_not_found` (404)
- `ThrottleRequestsException` → `rate_limited` (429) with `retry_after`
- Any unhandled exception → `server_error` (500). NEVER leak raw exceptions.

**Service-Level Exception Throwing:**

`HuggingFaceService`:
- HF `HTTP 429` → throw `RateLimitException` (triggers fallback chain)
- HF `HTTP 5xx` → throw `AiUnavailableException` (triggers fallback chain)
- HF `HTTP 401/403` → throw `InvalidApiKeyException` — log CRITICAL, Discord alert, do NOT retry, do NOT fall back (key is invalid)
- Request timeout → throw `AiTimeoutException` (triggers fallback chain)
- All models exhausted → dispatch queued job, return `null`. Controller returns `ai_unavailable` to frontend.

`PromptEngineService`:
- Template not found for agent → throw `TemplateNotFoundException`. Do NOT return empty string.
- Prompt exceeds plan max length → throw `PromptTooLongException`.

`FileProcessorService`:
- Corrupt/unreadable file → throw `FileParseException` with MIME type and size in context.
- File exceeds plan limit → standard Laravel validation exception.

**Structured Logging** — every AI call logged:
```
[INFO] ai_call | user_id=42 | agent=code_assistant | model=bigcode/starcoder2-15b | tokens=380 | latency_ms=2340 | status=success | cached=false
[WARNING] ai_fallback | user_id=42 | primary=bigcode/starcoder2-15b | fallback=codellama/CodeLlama-34b-Instruct-hf | reason=429
[WARNING] ai_timeout | user_id=42 | agent=code_assistant | model=bigcode/starcoder2-15b | timeout=30s
[ERROR] ai_queue_deferred | user_id=42 | agent=code_assistant | reason=all_models_failed
[CRITICAL] ai_invalid_key | model=bigcode/starcoder2-15b | action=discord_alert_sent
```

Log channels: `daily` (all, 14-day rotation) + `discord` (critical/emergency only → webhook POST).

### Frontend Error Handling Layers

**Centralized API Client** (`src/lib/apiClient.js`):

Single wrapper — **no raw `fetch()` calls anywhere in the app**. Pseudocode:

```javascript
async function apiCall(method, url, data, options = {}) {
  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      switch (error.error) {
        case 'auth_required': redirectToLogin(); break;
        case 'quota_exceeded':
        case 'file_too_large':
        case 'prompt_too_long':
          if (error.upgrade) showUpgradeModal(error.message); break;
        case 'rate_limited':
          showToast(`Rate limited. Try again in ${error.retry_after}s.`, 'warning'); break;
        case 'ai_unavailable':
          showToast('Request queued. Processing shortly.', 'info'); break;
        case 'ai_timeout':
          showToast('AI took too long. Try again.', 'warning'); break;
        case 'validation_failed':
          return { ok: false, validationErrors: error.details };
        case 'forbidden':
          showToast('Access denied.', 'error'); break;
        case 'account_blocked':
          showBlockedScreen(error.message, error.banned_until); break;
        case 'premium_required':
          showUpgradeModal(error.message); break;
        case 'agent_already_added':
          showToast('This agent is already in your workspace.', 'info'); break;
        case 'agent_limit_reached':
          showUpgradeModal('You\'ve reached your agent limit.'); break;
        default:
          showToast(error.message || 'Something went wrong.', 'error');
      }
      return { ok: false, error };
    }
    return { ok: true, data: await response.json() };
  } catch (networkError) {
    showToast('Cannot reach server. Check your connection.', 'error');
    return { ok: false, error: { error: 'network_error', retry: true, upgrade: false } };
  }
}
```

**RULE: No component may call `fetch()` or `axios` directly. Everything goes through `apiCall()`.** This guarantees consistent error handling everywhere.

**Component Loading States**: Every API-calling component manages `idle`/`loading`/`error`. Skeleton loaders matching expected content shape. AI calls > 45s update text; > 90s show "queued" with polling. Disable submit buttons on click, show spinner, prevent double-submit.

**Global Error Boundary**: Wraps entire React app. Catches unhandled JS errors. Shows "Something went wrong" + "Reload". POSTs to Discord webhook (non-blocking).

**Offline Detection**: `online`/`offline` events. Persistent top banner when offline, disable submit buttons, auto-dismiss on reconnect.

**Toast System**: Four levels: `info` (blue), `success` (green), `warning` (yellow), `error` (red). Auto-dismiss 5s except `error`. Called by `apiClient` — components never handle toast logic.

---

## Post-MVP Roadmap (Deferred)

| Feature | Trigger |
|---|---|
| Capacitor/Ionic mobile wrapper | User demand for app store presence |
| Paystack live payments | First paying customer intent |
| Redis + Horizon | Queue depth > 100 / writes > 50/sec |
| S3 / R2 file storage | Disk > 80% |
| Sentry / Datadog | Team > 3 devs |
| PostgreSQL | SQLite write contention |
| Multi-language prompts | User feedback |
| Team workspaces | Premium demand |
