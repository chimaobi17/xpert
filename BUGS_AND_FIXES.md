# XPERT — Bugs & Fixes

> **Priority:** HIGH
> **Target:** Mobile responsiveness + AI response page UX
> **Instructions for Claude Code:** Implement each fix in order. Test on mobile (375px) and desktop (1024px+). Push to GitHub when done and deploy via `npx vercel deploy --prod` from the `xpert-app/` directory.

---

## ✅ Previously Fixed (Already Deployed)

These issues have already been resolved and deployed to production. **Do NOT re-implement these.**

### Fix A: Skip button error toast suppressed
- **Files changed:** `xpert-app/src/components/onboarding/OnboardingFlow.jsx`
- **What was done:** Switched from `patch()` (apiClient with auto-toast) to `api.patch()` (raw axios, silent). The skip button now closes the onboarding modal without showing any error toast, even when the backend returns 500.

### Fix B: Onboarding shows for every new user
- **Files changed:** `xpert-app/src/contexts/AuthContext.jsx`
- **What was done:** Added `sessionStorage.removeItem('xpert_onboarding_shown')` to `login()`, `register()`, and `logout()` functions. This ensures the session flag is cleared on every fresh sign-in so new users always see the onboarding modal.

---

## 🔧 Outstanding Bugs (Implement These)

## Bug 1: "Stop Generating" shows full response instead of stopping at exact point

**File:** `xpert-app/src/components/agents/AiResponse.jsx`

**Current Behavior:** When the user clicks "Stop Generating", the streaming animation stops but `setDisplayedText(response)` is called, which reveals the **entire** AI response. The user sees the full answer even though they clicked stop.

**Expected Behavior:** When "Stop Generating" is clicked, the text should freeze at the **exact character position** it was at when the user clicked stop. The partial text should remain visible — do NOT reveal the full response.

### Steps to Fix:
1. In the `useEffect` that listens for `stopped` (around line 80-86), change `setDisplayedText(response || '')` to `setDisplayedText(prev => prev)` — keep whatever was already displayed.
2. In the `setInterval` callback (around line 57-62), when `stoppedRef.current` is true, do NOT call `setDisplayedText(response)`. Instead, call `stopInterval()` and `setStreaming(false)` without changing `displayedText`.
3. Ensure the action buttons (Copy, Save, Regenerate, etc.) still appear after stopping, even with partial text.
4. Update `handleCopy` to copy `displayedText` (the partial text) instead of `response` (the full text), so the user copies what they actually see.

---

## Bug 2: AI Response output overflows outside its container on mobile

**Files:**
- `xpert-app/src/components/agents/AiResponse.jsx`
- `xpert-app/src/styles/globals.css` (or `index.css`)

**Current Behavior:** On mobile devices, the AI response text (rendered as Markdown) **breaks out of its container** and extends beyond the screen width. This is especially bad when the AI outputs:
- Code blocks with long lines (they push the entire page wider)
- Long URLs or file paths that don't break
- Tables that are wider than the viewport
- Inline code that doesn't wrap

The user has to scroll horizontally on the whole page just to read the response, which is a broken experience. **The AI output must stay within the card/container boundaries on every screen size.**

**Expected Behavior:**
- The entire AI response (text, code, tables, images) must be **fully contained** within its parent card on all devices
- Code blocks should scroll **horizontally within themselves** (not push the page wider)
- Long words, URLs, and file paths should **wrap/break** to fit the container
- Tables should scroll within their own container
- The response should look clean and readable on a 375px-wide phone screen

### Steps to Fix:

1. **In `AiResponse.jsx`** — Update the response container div (around line 107) to constrain overflow:
   ```jsx
   <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 overflow-hidden">
   ```

2. **In `AiResponse.jsx`** — Update the prose/markdown wrapper (around line 118) to prevent overflow:
   ```jsx
   <div className="prose prose-sm max-w-none text-[var(--color-text)] overflow-x-auto break-words [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_table]:block [&_table]:overflow-x-auto">
   ```

3. **In globals.css / index.css** — Add these rules to globally fix markdown rendering on mobile:
   ```css
   /* ===== AI RESPONSE — MOBILE CONTAINMENT ===== */
   /* Prevent AI response output from overflowing its container */
   .prose {
     overflow-wrap: break-word;
     word-break: break-word;
   }
   .prose pre {
     overflow-x: auto;
     max-width: 100%;
     white-space: pre;          /* keep code formatting */
     word-break: normal;        /* don't break code mid-word */
   }
   .prose code {
     word-break: break-all;     /* inline code can break */
     white-space: pre-wrap;
   }
   .prose pre code {
     word-break: normal;        /* code inside pre blocks shouldn't force-break */
     white-space: pre;
   }
   .prose p,
   .prose li,
   .prose blockquote {
     overflow-wrap: break-word;
     word-break: break-word;
   }
   .prose img {
     max-width: 100%;
     height: auto;
   }
   .prose table {
     display: block;
     overflow-x: auto;
     max-width: 100%;
     white-space: nowrap;
   }
   .prose a {
     word-break: break-all;     /* URLs should break to fit */
   }

   /* Reduce padding on mobile for more content space */
   @media (max-width: 640px) {
     .prose pre {
       padding: 0.75rem;
       font-size: 0.75rem;
       border-radius: 0.5rem;
     }
   }
   ```

4. **IMPORTANT — Test this fix by:**
   - Opening Chrome DevTools → Toggle device toolbar → iPhone 12 Pro (390px)
   - Navigate to an agent workspace, generate a prompt that will produce code (e.g., "Write a function that fetches data from an API with error handling")
   - Verify the code block scrolls horizontally WITHIN the card, not the page
   - Verify regular text wraps properly and stays inside the card

---

## Bug 3: AI Response content should be scrollable with action buttons pinned at the bottom

**File:** `xpert-app/src/components/agents/AiResponse.jsx`

**Current Behavior:** When the AI returns a long response, the entire page scrolls. The action buttons (Copy, Save to Library, Edit Prompt, Regenerate, New Prompt) are at the very bottom of the response. The user has to scroll all the way past the AI output before they can take their next action — this is very annoying on mobile especially.

**Expected Behavior:** 
- The **AI response content** (the markdown area) should be **scrollable within its own container** with a max height
- The **action buttons** (Copy, Save, Edit Prompt, Regenerate, New Prompt) should be **pinned/fixed below the scroll area**, always visible to the user
- The user should be able to read the response by scrolling within the content area, while always having access to Copy/Regenerate/New Prompt without scrolling

### Steps to Fix:

1. **Restructure the AiResponse layout** — Wrap the response content in a scrollable container and keep buttons outside it:
   ```jsx
   return (
     <div className="flex flex-col" style={{ maxHeight: 'calc(100vh - 280px)' }}>
       {/* Scrollable AI content */}
       <div className="flex-1 overflow-y-auto min-h-0">
         <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
           {isImage ? (
             <div className="flex justify-center">
               <img src={`data:image/jpeg;base64,${response}`} alt="AI generated image" className="max-w-full rounded-lg shadow-md" />
             </div>
           ) : (
             <>
               <div className="prose prose-sm max-w-none text-[var(--color-text)] overflow-x-auto break-words">
                 <ReactMarkdown>{displayedText}</ReactMarkdown>
               </div>
               {streaming && !stopped && (
                 <div className="flex items-center gap-3 mt-3">
                   <span className="inline-block w-2 h-4 bg-primary-500 animate-pulse" />
                   <span className="text-xs text-[var(--color-text-tertiary)]">Generating...</span>
                 </div>
               )}
             </>
           )}
         </div>
       </div>

       {/* Fixed action buttons — always visible below the scroll area */}
       {showActions && (
         <div className="flex-shrink-0 pt-4 border-t border-[var(--color-border)] mt-4 bg-[var(--color-bg-secondary)]">
           {!isImage && (
             <div className="flex items-center justify-between text-xs text-[var(--color-text-tertiary)] mb-3">
               <span>Estimated tokens: ~{tokensUsed || Math.ceil(response.length / 4)}</span>
             </div>
           )}
           <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 [&>button]:min-h-[44px]">
             {/* ... action buttons here (Copy, Save, Edit Prompt, Regenerate, New Prompt) ... */}
           </div>
         </div>
       )}
     </div>
   );
   ```

2. **Key details:**
   - `maxHeight: calc(100vh - 280px)` accounts for the navbar, step indicator, and card heading. Adjust the `280px` value if needed.
   - `flex-1 overflow-y-auto min-h-0` makes the content area scrollable while respecting the flex container.
   - The action buttons are in `flex-shrink-0` so they never get pushed off-screen.
   - On mobile, use `grid grid-cols-2` for the action buttons so they're easy to tap.

3. **Also add mobile touch-friendly sizing** for the action buttons:
   - All buttons should have `min-h-[44px]` for proper touch targets on mobile
   - Use `grid grid-cols-2 sm:flex sm:flex-wrap gap-2` to stack buttons in a 2-column grid on mobile

---

## Bug 4: Chatbot FAB overlaps "Generate Prompt" button on mobile

---

## Bug 5: Chatbot FAB overlaps "Generate Prompt" button on mobile

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
