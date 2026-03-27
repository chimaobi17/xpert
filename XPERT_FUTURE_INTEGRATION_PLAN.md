# XPERT Future Integration Plan (Post-MVP)

**STATUS**: This document is a roadmap only. NONE of these features are part of the MVP build.
They will be implemented after the app is live, validated, and generating user feedback.
Claude Code must NOT build any of these during Phases 1–12.

---

## 1. User-Selectable AI Models

**Trigger**: When Hugging Face releases significantly better free models, or users request model choice.

**Description**: Allow users to choose which AI model powers each agent, instead of the admin-configured defaults.

**Implementation Outline**:
- Add a `user_model_preferences` table: `id`, `user_id` (FK), `agent_category` (string), `preferred_model` (string — HF model ID), `created_at`.
- On the agent workspace, add a "Model" dropdown above the dynamic form. Default: "Recommended (auto)" which uses `config/ai_models.php`. Other options: list of verified free models for that category.
- Admin dashboard: "Model Whitelist" manager — admins curate which models appear in the dropdown per category. Prevents users from selecting broken/gated models.
- The `HuggingFaceService` checks `user_model_preferences` first, falls back to config if no preference set.
- **Free tier**: locked to default model (no choice). **Standard**: choose from whitelist. **Premium**: choose from whitelist + enter custom HF model ID.
- Model performance tracking: log response quality scores (user thumbs-up/down on AI responses) per model to surface the best-performing models.

**Dependencies**: Requires model quality validation pipeline (test prompts against new models before adding to whitelist).

---

## 2. Advanced File Processing

**Trigger**: User feedback requesting better file understanding, or OCR demand.

**Features**:
- **OCR for images**: Integrate Tesseract OCR (free, open-source) to extract text from PNG/JPG uploads. Update `FileProcessorService` to detect image MIME types and route through OCR.
- **Scanned PDF support**: PDFs with images-as-pages (common with scans) → rasterize pages → OCR each page → concatenate text.
- **Audio/Video transcription**: Accept `.mp3`, `.wav`, `.mp4` uploads. Use OpenAI Whisper (local, free via `openai/whisper` Python package) for transcription. Store transcript in `parsed_content`. Requires Python sidecar or microservice.
- **Spreadsheet intelligence**: For XLSX/CSV uploads, instead of raw text extraction, generate a structured summary: column names, row count, sample data, detected data types. This gives the AI better context than raw cell dumps.
- **Multi-file RAG**: For Document Q&A agent, implement basic Retrieval-Augmented Generation: chunk file contents → embed with `BAAI/bge-small-en-v1.5` → store embeddings → retrieve relevant chunks per user question → inject into prompt. Dramatically improves accuracy on long documents.

**Dependencies**: OCR requires system-level Tesseract installation. Audio requires Python runtime. RAG requires embedding storage (could use SQLite with vector extension, or upgrade to pgvector on PostgreSQL).

---

## 3. Real-Time Collaboration

**Trigger**: Team/enterprise demand.

**Features**:
- Shared workspaces: multiple users in one workspace with shared agents and prompt library.
- Collaborative prompt editing: two users can edit the same prompt in real-time (WebSocket-based).
- Team analytics: admin sees usage per team member.
- Role-based access within teams: owner, editor, viewer.

**Dependencies**: Requires WebSocket server (Laravel Reverb or Pusher free tier). Requires team/organization data model.

---

## 4. Prompt Version History

**Trigger**: Power users requesting undo/versioning for their prompts.

**Features**:
- Every edit to a saved prompt in the library creates a version entry.
- Users can browse version history, compare diffs, and restore previous versions.
- "Fork" a prompt: create a new library entry based on an existing prompt.

**Dependencies**: Versioning table linked to `prompt_library`. Diff rendering on frontend.

---

## 5. API Access for Developers

**Trigger**: Developer demand for programmatic access.

**Features**:
- Public API with API key authentication (separate from Sanctum session auth).
- Endpoints mirror the user-facing flow: `/api/v1/prompts/generate`, `/api/v1/prompts/submit`.
- Rate limiting per API key.
- Usage dashboard showing API call volume.
- Webhook support: send AI responses to a user-configured URL.

**Dependencies**: API key management system. Separate rate limiting tier. Documentation (auto-generated via OpenAPI/Swagger).

---

## 6. Custom Agent Builder

**Trigger**: Users wanting to create their own specialized agents.

**Features**:
- "Create Agent" wizard in the user app (not just admin dashboard).
- User defines: name, system prompt, prompt template with placeholders, field schema (drag-and-drop form builder).
- Custom agents are private to the user (not visible in marketplace).
- Premium feature: share custom agents publicly in the marketplace.

**Dependencies**: Extended `ai_agents` table with `created_by` user FK. Marketplace moderation system.

---

## 7. Analytics Dashboard for Users

**Trigger**: User feedback wanting to see their own usage patterns.

**Features**:
- Personal analytics page: prompts per day (chart), tokens consumed (chart), most-used agents (bar chart), favorite prompt types (pie chart).
- "Insights": AI-generated summary of usage patterns ("You use the Code Assistant most on Mondays. Your prompts are getting more complex over time.").
- Export usage data as CSV.

**Dependencies**: Frontend charting (Recharts already available). Backend aggregation endpoints.

---

## 8. Paystack Live Integration

**Trigger**: First paying customer intent confirmed.

**Features**:
- Activate the stubbed `PaystackService`.
- Checkout flow: user clicks "Upgrade" → Paystack inline payment modal → webhook confirms payment → backend updates `plan_level` instantly.
- Subscription management: cancel, downgrade, billing history.
- Nigerian Naira pricing. International card support via Paystack.
- Grace period: if payment fails, downgrade after 7 days, not immediately.

**Dependencies**: Paystack account verified. Webhook endpoint secured. `GET /api/config/features` flips `payments_enabled` to `true`.

---

## 9. Mobile Native App (Capacitor)

**Trigger**: Significant mobile traffic or user demand for app store presence.

**Features**:
- Wrap `xpert-app` in Capacitor for iOS and Android.
- Push notifications for queued prompt completions.
- Offline mode: cache recent prompts and responses locally.
- Camera integration: take photo → upload as file attachment → OCR → AI context.

**Dependencies**: Apple Developer account ($99/year). Google Play Developer account ($25 one-time). Capacitor configuration and native build pipeline.

---

## 10. Multi-Language Interface

**Trigger**: Non-English user growth.

**Features**:
- i18n support: all UI strings externalized to translation files.
- Languages: English, French, Spanish, Arabic, Chinese (start with these five).
- Language auto-detection from browser locale.
- Chatbot knowledge base entries per language.

**Dependencies**: Translation files. RTL layout support for Arabic. Chatbot knowledge duplication per language.

---

## 11. Prompt-Based Model Fine-Tuning

**Trigger**: Users requesting more precise control over AI outputs or "persona" consistency.

**Features**:
- **Prompt-Only Fine-Tuning**: Allow users to provide 10-20 "Example Input -> Target Output" pairs.
- **Persona Instruction**: A dedicated instruction block that is automatically prepended to all system prompts for that user's agents.
- **Feedback Loop**: Users can mark responses as "Corrected" and the system uses the correction to update the prompt-weights/instructions.

**Dependencies**: Efficient prompt injection logic. Scaling system prompts without hitting token limits.

**Dependencies**: Efficient prompt injection logic. Scaling system prompts without hitting token limits.
