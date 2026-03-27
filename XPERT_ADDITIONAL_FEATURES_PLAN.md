# Xpert Additional Features & Fixes Implementation Plan

This document outlines post-MVP feature extensions and critical user experience fixes, categorized for prioritized execution.

---

## 🚀 [NEW FEATURES & BRANDING]

### Phase 14: Strict Workspace Agent Limits (3-Agent Cap)
**Goal**: Enforce a hard cap of 3 active agents for Free tier users.
- [ ] **14.1 Controller Guard**: Update `UserAgentController@store` to block additions if count >= 3 for free users (Error: `agent_limit_reached`).
- [ ] **14.2 Onboarding Logic**: Limit default agents to top 3 for free users.
- [ ] **14.3 "Limit Reached" Modal**: Intercept adds on frontend and show upgrade modal.
- [ ] **14.4 UI Badge**: Add "Agents: X/3" counter to sidebar.

### Phase 15: Chatbot UI Branding & Icon Refinement
**Goal**: Align chatbot with primary green branding.
- [ ] **15.1 Color Shift**: Update `ChatbotPanel.jsx` to use `primary-600` classes instead of `indigo-600`.
- [ ] **15.2 Message Bubbles**: Update bot responses to use `bg-primary-50`.
- [ ] **15.3 Bot Icon**: Replace generic bubble with `CpuChipIcon` (Robot icon).

---

## 🛠️ [CRITICAL FIXES & UX REFINEMENTS]

### Phase 16: AI Loading States & Connectivity
**Goal**: Fix the perceived "frozen" state during AI generation.
- [ ] **16.1 Loading UI**: Add a "Thinking..." spinner and disable buttons during `generate` calls.
- [ ] **16.2 Connectivity Check**: Verify `HUGGINGFACE_API_KEY` synchronization and add "Cold Start" detection/alerts.

### Phase 17: One-Time Onboarding Experience
**Goal**: Ensure the onboarding modal only pops up once.
- [ ] **17.1 Onboarding Flag**: Add `is_onboarded` column to `users` table and a `PATCH /user/onboarded` endpoint.
- [ ] **17.2 Persistence on Skip**: Update "Skip" button to call the onboarded endpoint.
- [ ] **17.3 Dashboard Sync**: Update `Dashboard.jsx` to respect the `is_onboarded` flag from the auth state.
+
+### Phase 18: Agent Library Expansion
+**Goal**: Diversify the AI ecosystem with specialized agents once core functionality is efficient.
+- [ ] **18.1 Niche Agents**: Add 10-15 new agents across `creative`, `business`, and `language` domains in `AiAgentSeeder.php`.
+- [ ] **18.2 Multi-Model Support**: Ensure new agents are mapped to relevant Hugging Face models (e.g., Llama 3, Mistral, FLUX).

---

## ✅ Verification Plan

### Manual Verification
- Confirm the 3-agent cap triggers the upgrade modal.
- Verify the Chatbot is fully Green with a Robot icon.
- Confirm a loading spinner appears immediately after clicking "Use AI".
- Verify the Onboarding modal disappears forever after dismissing it once.
