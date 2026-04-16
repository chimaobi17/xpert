# XPERT — Bugs & Fixes

> **Priority:** HIGH
> **Target:** Mobile responsiveness + AI response page UX
> **Instructions for Claude Code:** Implement each fix in order. Test on mobile (375px) and desktop (1024px+). Push to GitHub when done and deploy via `npx vercel deploy --prod` from the `xpert-app/` directory.

---

## ✅ Previously Fixed (Already Deployed)

These issues have already been resolved and deployed to production. **Do NOT re-implement these.**

### Fix A: Skip button error toast suppressed
- **Files changed:** `xpert-app/src/components/onboarding/OnboardingFlow.jsx`
- **What was done:** Switched from `patch()` to `api.patch()`. The skip button now closes without error toasts.

### Fix B: Onboarding shows for every new user
- **Files changed:** `xpert-app/src/contexts/AuthContext.jsx`
- **What was done:** Added `sessionStorage.removeItem('xpert_onboarding_shown')` on auth state changes.

### Fix C: Backend support for multi-file processing
- **Files changed:** `AgentController.php`, `PromptEngineService.php`
- **What was done:** Implemented logic to extract and process multiple file uploads from any request field, allowing the AI to reference multiple documents simultaneously. (Note: Currently being refined for performance).

### Fix D: AI Resilience & Prompt Standardization (Bug 17)
- **Files changed:** `PromptEngineService.php`, `HuggingFaceService.php`, `AiAgentSeeder.php`, `ai_models.php`
- **What was done:** 
  1. **Structured Prompt Engine:** Refactored the engine for Premium users to curate user inputs and brand intelligence into a highly structured format (Role -> Task -> Context -> Instructions). This specifically fixates Premium Image Generation helpers (like AI Photographer and Logo Creator) by transforming structured metadata into high-fidelity, clean visual descriptors for superior model adherence.
  2. **Tiered Resilience:** Integrated a 3-tier model fallback chain (Primary -> Fallback -> Recovery) and 5-attempt retry logic with exponential backoff to eliminate 503 "Busy" errors.
  3. **User Feedback:** Optimized the AI response flow to provide clear, helpful status updates during peak loads: 
     - *"The AI system is temporarily busy. Please try again in a few moments. Retrying may help."*
     - *"Your request has been queued. Processing shortly."*

### Fix E: Session state clearing on "Done" (Bug 19)
- **Files changed:** `xpert-app/src/pages/agents/AgentWorkspace.jsx`
- **What was done:** Added `sessionStorage.removeItem(storageKey)` to the "Done" button handler to ensure agents start at Step 1 when reopened.

### Fix F: Authenticated user redirection (Bug 20)
- **Files changed:** `xpert-app/src/App.jsx`, `xpert-app/src/pages/Landing.jsx`, `xpert-app/src/pages/auth/Login.jsx`, `xpert-app/src/pages/auth/Register.jsx`
- **What was done:** Implemented logic to redirect already-signed-in users specifically to the `/workspace` dashboard, improving the returning user experience.

---

## 🔧 Outstanding Bugs (Implement These)

### Bug 1: File Upload Limits & Stability (Large Files)
- **Status:** PENDING
- **Issue:** Users cannot upload files larger than the default 2MB PHP limit. AI agents (like Content Writer) fail to recognize large document context.
- **Requirement:** Increase file size limits to 25MB-200MB (plan-based) and implement smart truncation to stay within AI context windows (e.g., Qwen 32k limits).

### Bug 2: CV Builder Agent Performance & Reliability
- **Status:** PENDING
- **Issue:** The CV Builder fails to accurately parse complex PDF resumes or provide high-quality rewrites using the default 7B model.
- **Requirement:** Migrate to a higher-capacity model (e.g., Qwen2.5-Coder-32B), increase token limits to 8192, and optimize the prompt template for resume analysis.

### Bug 3: "Stop Generating" shows full response instead of stopping at exact point
- **File:** `xpert-app/src/components/agents/AiResponse.jsx`
- **Requirement:** Freeze the text at the exact character position when "Stop" is clicked. (See detailed steps in previous version).

### Bug 4: AI Response output overflows outside its container on mobile
- **Files:** `AiResponse.jsx`, `globals.css`
- **Requirement:** Ensure code blocks and long words wrap or scroll horizontally within their cards.

### Bug 5: AI Response content should be scrollable with action buttons pinned
- **File:** `AiResponse.jsx`
- **Requirement:** Make the markdown area scrollable within a fixed height, keeping Copy/Regenerate buttons always visible at the bottom.

### Bug 6: Chatbot FAB overlaps "Generate Prompt" button on mobile
- **File:** `AppLayout.jsx`
- **Requirement:** Add bottom padding to account for the floating bubble.

**File:** `xpert-app/src/components/Chatbot/ChatbotBubble.jsx` and `xpert-app/src/components/layout/AppLayout.jsx`

**Current Behavior:** The floating chatbot bubble (bottom-right) overlaps the "Generate Prompt" button on the agent workspace page when viewed on mobile, blocking user interaction.

**Expected Behavior:** The chatbot bubble should not overlap critical action buttons. Content should have bottom padding to account for the FAB.

### Steps to Fix:
1. In `AppLayout.jsx`, add bottom padding to the main content area to account for the floating button:
   ```jsx
   <div className="mx-auto max-w-6xl px-4 py-6 pb-24 lg:px-8 lg:pb-6">
   ```
2. Alternatively, move the chatbot bubble higher or make it smaller on mobile:
   ```jsx
   // In ChatbotBubble.jsx, reduce size on mobile
   className="fixed bottom-4 right-4 z-40 h-12 w-12 sm:h-14 sm:w-14 ..."
   ```

---

## Bug 6: Step indicator overflows on narrow mobile screens

**File:** `xpert-app/src/pages/agents/AgentWorkspace.jsx`

**Current Behavior:** The step indicator (1 Fill Form — 2 Review Prompt — 3 AI Response) is a horizontal `flex` row. On very narrow screens (<375px), the text wraps awkwardly or overflows.

**Expected Behavior:** Step labels should be hidden on mobile, showing only the numbered circles. Full labels show on `sm:` and above.

### Steps to Fix:
1. Change the step label `<span>` (around line 299-303) to hide text on mobile:
   ```jsx
   <span className={`text-xs font-medium hidden sm:inline ${
     step === i + 1 ? 'text-primary-600' : 'text-[var(--color-text-tertiary)]'
   }`}>
     {label}
   </span>
   ```
2. Make the connecting line shorter on mobile:
   ```jsx
   <div className={`h-px w-4 sm:w-8 transition-colors ${...}`} />
   ```

---

## Bug 7: PromptPreview footer buttons overlap on mobile

**File:** `xpert-app/src/components/agents/PromptPreview.jsx`

**Current Behavior:** The three prompt options (Use Generated, Write My Own, Edit Generated) use `sm:grid-cols-3` which stacks them on mobile. This is mostly fine, but the footer buttons ("Back to Form" / "Send to AI") can overlap or be too close on small screens.

**Expected Behavior:** Footer buttons should stack vertically on mobile with full-width buttons.

### Steps to Fix:
1. Change the footer `div` (line 93) from:
   ```jsx
   <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
   ```
   to:
   ```jsx
   <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-[var(--color-border)]">
   ```
2. Make the "Send to AI" button full-width on mobile:
   ```jsx
   <div className="flex items-center gap-2 w-full sm:w-auto">
   ```

---

## Bug 8: ChatbotWidget panel doesn't resize properly on orientation change

**File:** `xpert-app/src/components/Chatbot/ChatbotWidget.jsx`

**Current Behavior:** The chatbot panel uses `window.innerWidth` directly in `style={{}}` (lines 90-97), which is only evaluated once on render and doesn't update on resize or orientation change.

**Expected Behavior:** The panel should respond to viewport changes reactively.

### Steps to Fix:
1. Replace the inline `style={{}}` with Tailwind responsive classes:
   ```jsx
   <div
     className={`fixed z-50 transition-all duration-300 transform origin-bottom-right shadow-2xl
       bottom-[90px] right-0 sm:right-6
       w-full sm:w-[380px] h-[75vh] sm:h-[500px]
       rounded-t-2xl sm:rounded-2xl
       ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}
     `}
   >
   ```
2. Remove the inline `style={{}}` entirely.

---

## Bug 9: ChatbotMessage markdown overflows on mobile

**File:** `xpert-app/src/components/Chatbot/ChatbotMessage.jsx`

**Current Behavior:** The chatbot message uses `max-w-[85%]` which is fine, but markdown content inside (code blocks, long links) can overflow the bubble.

**Expected Behavior:** All content within the chat bubble should be contained.

### Steps to Fix:
1. Add overflow handling to the markdown container:
   ```jsx
   <div className="prose prose-sm dark:prose-invert max-w-none chatbot-markdown overflow-x-auto break-words">
   ```
2. Add to `globals.css`:
   ```css
   .chatbot-markdown pre {
     overflow-x: auto;
     max-width: 100%;
     font-size: 0.75rem;
   }
   .chatbot-markdown code {
     word-break: break-all;
   }
   ```

---

## Bug 10: Backend — Production database missing `is_onboarded` column

**File:** `database/migrations/2026_03_28_013112_add_is_onboarded_to_users_table.php`

**Current Behavior:** The `PATCH /user/onboarded` endpoint returns a 500 error because the `is_onboarded` column does not exist in the production Supabase database. The migration has not been executed on production.

**Frontend workaround:** ✅ Already deployed — the skip button uses raw axios and silently ignores the 500 error. Users can skip onboarding without seeing any error. However, the onboarding status is NOT persisted in the database.

**Expected Behavior:** The column should exist and the endpoint should return 200, so the user's onboarding status is saved permanently.

### Steps to Fix:
1. On Render, go to the `xpert-api` service → Manual Deploy → "Clear build cache & deploy"
2. This will rebuild the Docker image and run `php artisan migrate --force` which will create the missing column
3. Verify by calling `PATCH /api/user/onboarded` — should return 200 after fix
4. Once this is fixed, users who skip onboarding will have their status saved and won't see the modal again across sessions

---

## General: Global Mobile Responsive Improvements

**File:** `xpert-app/src/styles/globals.css`

### Steps to Fix:
Add a mobile utilities section at the end of `globals.css`:

```css
/* ===== MOBILE RESPONSIVE FIXES ===== */

/* Prevent horizontal overflow globally */
html, body {
  overflow-x: hidden;
}

/* Touch-friendly interactive elements */
@media (max-width: 640px) {
  button, a, select, input, textarea {
    min-height: 44px;
    font-size: max(1rem, 16px); /* Prevents iOS zoom on focus */
  }

  /* Full-width cards on mobile */
  .grid.sm\\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
}

/* Safe area insets for notched phones */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .fixed.bottom-4,
  .fixed.bottom-6 {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

---

---

## Bug 11: Reduce Upgrade Plan card size on mobile

**File:** `xpert-app/src/pages/agents/AgentDiscover.jsx` (or the Upgrade Modal component)

**Current Behavior:** When a user with a free plan tries to "Find Helper" (add an agent) and exceeds the limit, the upgrade plan modal/card is too large on mobile, causing poor UX.

**Expected Behavior:** The upgrade plan card should have reduced padding, smaller font sizes, and a more compact layout on mobile screens (<640px).

---

## Bug 12: Add close button to "Helper Added" notification

**File:** `xpert-app/src/components/notifications/NotificationToast.jsx` (or wherever the custom toast is implemented)

**Current Behavior:** When a user adds a helper, a notification pops up but cannot be manually closed; it only disappears automatically.

**Expected Behavior:** Add a visible "X" (Close) button to the notification popup so users can dismiss it immediately.

---

## Bug 13: Saved Prompts — Copy Feature & Delete Confirmation

**File:** `xpert-app/src/pages/Library.jsx` or `xpert-app/src/components/library/SavedPromptCard.jsx`

**Requirement:** 
1. **Copy Feature:** Add a copy icon/button to each saved prompt card that allows the user to copy the prompt text to their clipboard with a "Copied!" feedback state.
2. **Delete Confirmation:** Before deleting a saved prompt, trigger a confirmation modal (e.g., "Are you sure you want to delete this prompt? This action cannot be undone.") to prevent accidental deletions.

---

## Bug 14: Home Tab Mobile Responsiveness (Strict Fix)

**File:** `xpert-app/src/pages/Dashboard.jsx`

**Current Behavior:** The Home tab (Dashboard) has layout issues on mobile, including misaligned elements, overlapping text, or improper scaling.

**Expected Behavior:** Implement a strictly responsive layout for the Dashboard. Ensure all cards stack correctly, padding is consistent, and the UI feels premium on all mobile screen widths.

---

## Bug 15: Fix "Jan 1 1970" Date Bug in Saved Results

**File:** `xpert-app/src/pages/Library.jsx` and relevant Backend Controller.

**Issue:** Saved results show a default Unix timestamp date (Jan 1, 1970) instead of the actual time they were created.

**Expected Behavior:** The date displayed should be the exact real-time timestamp when the user saved the result. Ensure the backend returns the correct `created_at` date and the frontend formats it properly (e.g., "2 mins ago" or "Oct 12, 2023").

---

## Bug 16: Password Visibility Toggle (Eye Icon)

**Files:** `xpert-app/src/pages/auth/Login.jsx`, `xpert-app/src/pages/auth/Register.jsx`

**Requirement:** Add a "show/hide" eye icon to the password input field on all authentication forms. 
- Clicking the icon should toggle the input `type` between `password` and `text`.
- Use `EyeIcon` and `EyeSlashIcon` from `heroicons`.

## Bug 18: Navigate User Flow in AI Agents (Back Navigation)

**File:** `xpert-app/src/pages/agents/AgentWorkspace.jsx`

**Current Behavior:** 
1. Clicking the browser's back button or the main "Back" arrow icon (top-left) takes the user out of the agent workspace completely, even if they are on Step 2 (Review) or Step 3 (Result).
2. Users lose their progress if they accidentally click back, unless they rely on the session restoration logic.

**Expected Behavior:** 
1. If the user is on Step 3 (AI Response), clicking the back button should return them to Step 2 (Prompt Review).
2. If they are on Step 2, it should return them to Step 1 (Input Form).
3. If they are on Step 1, it should navigate them back to the Workspace or previous page.
4. This should apply to both the UI "Back" button and the browser's hardware/keyboard back actions.

### Steps to Fix:
1. Update `handleBack` in `AgentWorkspace.jsx` to check the current `step` before navigating away:
   ```javascript
   function handleBack() {
     if (step > 1) {
       setStep(s => s - 1);
       setStopped(false);
       return;
     }
     
     const from = location.state?.from;
     if (from) {
       navigate(from);
     } else {
       navigate('/workspace');
     }
   }
   ```
2. (Optional) Sync `step` with URL search params (e.g., `?step=2`) or use `window.history.pushState` to ensure the browser's back button works as expected.

## Bug 21: Auth Stability & Global Language Expansion (25+ Languages)

**Files:** `.env`, `AuthController.php`, `Register.jsx`, `Settings.jsx`, `PromptEngineService.php`, `AgentWorkspace.jsx`, `Landing.jsx`

**Current Issues:**
1. **Auth Failure**: Sign-in and Sign-up are failing for some users despite valid credentials, likely due to `localhost` vs `127.0.0.1` origin mismatches and stale `.env` loading.
2. **Missing Languages**: The signup form only shows 8 languages, while the app promise "20+ languages".
3. **Inconsistencies**: The AI doesn't automatically respond in the user's preferred language, and there are race conditions in navigation/session clearing.

### Steps to Fix:
1. **Infrastructure**: Standardize `VITE_API_URL` and `APP_URL` to `http://localhost:8000` to ensure Chrome treats it as same-site for cookie storage.
2. **Language Expansion**: Populate the `languages` array in `Register.jsx` and `Settings.jsx` with 25+ major world languages.
3. **AI Logic**: Update `PromptEngineService.php` to inject a `[Language Directive]` into every prompt based on the user's `language_preference`.
4. **UX/UI Fixes**: 
   - Fix `AgentWorkspace` cleanup race condition using a `ref`.
   - Implement proactive redirect in `Landing.jsx` for authenticated users.

---

## Deployment Checklist

After implementing all fixes:

1. `cd xpert-app && npm run build` — Verify no build errors
2. `git add -A && git commit -m "fix: mobile responsiveness, stop generating, and chatbot layout"` 
3. `git push origin main`
4. `cd xpert-app && npx vercel deploy --prod` — Deploy to Vercel
5. Test on mobile (Chrome DevTools → iPhone 12/13 Pro) at these pages:
   - `/dashboard` — Cards should stack, no overflow
   - `/agents/{id}` — Step indicator compact, form usable, FAB not blocking buttons
   - `/agents/{id}` Step 3 — Stop button freezes text at click point, response text wraps properly
   - Chatbot widget — Full width on mobile, no overflow in messages
   - Auth forms — Password toggle works
   - Library — Copy works and delete prompts for confirmation
   - Date formats — "Jan 1 1970" is replaced by real-time dates
