# XPERT Frontend Feature Extensions (UX & State Management)

> **CROSS-REFERENCE**: This plan's backend is implemented in `XPERT_IMPLEMENTATION_PLAN.md`. All API calls, error codes, and data shapes referenced here must match the backend plan.

**Glassmorphism Integration**: The following UI elements must use glassmorphism styling (Tailwind `backdrop-blur-md` + semi-transparent backgrounds):
- All modals (upgrade modal, confirm modals, block modal)
- The upgrade/payment overlay
- Dropdown menus and popovers
- The onboarding questionnaire overlay
- Notification toasts (subtle glass effect on the toast container)
- The premium agent lock overlay on agent cards

Glassmorphism must adapt to the theme:
- **Light mode**: `bg-white/60 backdrop-blur-md border border-white/20 shadow-lg`
- **Dark mode**: `bg-gray-900/60 backdrop-blur-md border border-white/10 shadow-lg`

All other surfaces (cards, sidebar, page backgrounds) remain solid as per the existing design system. Glassmorphism is an accent treatment, not the base.

**Directive:** The overarching UI style and design system for XPERT is already established. This plan outlines the structural UX flow, state management, and component architecture for integrating the new Onboarding and Agent Discovery features. **Claude Code must inherit and reuse existing UI components, CSS classes, and layouts.** The only new aesthetic addition permitted is **glassmorphism** (e.g., using Tailwind's `backdrop-blur` utilities). This must be integrated tastefully within the crucibles of the existing UI and coding structure. Do not invent any other new styling rules.

---

## 1. Onboarding UX Flow (The Questionnaire)

**DEPENDENCY**: The Onboarding Flow (Section 1) and Agent Discovery (Section 2) require backend Phase 8 to be complete. During frontend development before Phase 8 is built, these features must use mock data:
- Mock `PATCH /api/user/profile` → simulate success, update local AuthContext with mock profile fields.
- Mock `GET /api/user/agents` → return mock agent list from `/mock/userAgents.js`.
- Mock `POST /api/user/agents/{id}` → add agent to local mock state.
- Mock auto-assign → when onboarding completes, populate mock workspace with hardcoded agents per domain.
When backend Phase 8 is deployed, swap mock calls to real `apiClient` calls. The component structure must not change — only the data source.

### User Response Shape API Contract
```json
// GET /api/user — Authenticated user profile
{
  "id": 1,
  "name": "Chimaobi",
  "email": "chimaobi@example.com",
  "role": "user",
  "plan_level": "free",
  "job_title": "Full-Stack Developer" | null,
  "purpose": "Build AI-powered tools" | null,
  "field_of_specialization": "technology" | null,
  "onboarding_complete": true | false,
  "banned_until": null,
  "ban_reason": null,
  "created_at": "2025-07-01T00:00:00Z"
}
```

- **Trigger**: When a user logs in (or registers) and `user.onboarding_complete === false` (this is a computed accessor returned by the backend).
- **Component Flow**: 
  - Intercept the main dashboard routing and render an `OnboardingFlow` component (modal or page) using the existing design system.
- **Data Capture**:
  1. **Job Title**: Text input.
  2. **Purpose**: Text input or predefined selection.
  3. **Specialization**: Select/dropdown. The options must match backend validation exactly (case-sensitive array sent to backend: `technology`, `creative`, `business`, `research`, `language`).
- **Submission Logic**: 
  - Submit the form data to the `PATCH /api/user/profile` endpoint.
  - On success, update the global `AuthContext` user state with the new profile data.
  - **Experience Customization**: The backend will automatically assign a tailored starter-pack of free agents based *strictly* on the user's questionnaire answers. Fetch the user's updated agent list and route them to a personalized "My Workspace" dashboard pre-populated for their specific needs.

## 2. Agent Discovery and Search (The Marketplace)
- **Routing**: Create a new route (e.g., `/agents/discover`) distinctly separate from the user's personal agents view.
- **Search & Filtering Components**: 
  - **Text Search**: Render a text input for searching agents by `name` or `description`.
  - **Domain Filters**: Provide a filter component (tabs or pills) for domains (`All`, `Technology`, `Creative`, `Business`, `Research`, `Language`).
    - **Smart Default**: Read the user's `field_of_specialization` from context and auto-select that domain filter by default.
  - **Tier Filters**: Provide a secondary filter control (like a stylish glassmorphic dropdown or toggles) to filter agents by access level (`All Tiers`, `Free Only`, `Premium Only`).
- **Agent Card Interactions**:
  - Display agents fetched from `GET /api/agents`.
  - Visually distinguish between **Free** and **Premium** agents on the card UI.
  - Check the user's active agents array to determine the interaction state:
    - **Already Added**: Render card in a disabled/added state.
    - **Available to Add**: Render an "Add to Workspace" button.
  - **Click Logic ("Add to Workspace")**:
    - **If Free Agent**: Call the `POST /api/user/agents/{agent_id}` endpoint and update the local user state optimistically.
    - **If Premium Agent (and user lacks premium plan)**: Intercept the click and trigger an **Upgrade/Payment Modal** leveraging the glassmorphism aesthetic. This modal must clearly explain the premium requirement and present the payment gateway UI to upgrade their account plan in order to unlock access.

## 3. "My Workspace" & Navigation UX Architecture
- **Navigation Routing Table**:
| Route | Name | Data Source | Purpose |
|---|---|---|---|
| `/dashboard` | Dashboard / Home | Mixed: user stats (mock), recent activity, quick actions | Landing page after login. Overview with stats, recent activity, and quick-start buttons. |
| `/workspace` | My Workspace | `GET /api/user/agents` | User's active agents only. This is where they go to use agents. Each card clicks through to prompt flow. Shows "Discover more agents" nudge. |
| `/agents/discover` | Agent Discovery | `GET /api/agents` (with `is_added` field) | Marketplace/browse view. Search, filter by domain and tier. Add agents to workspace. Premium gating here. |
| `/agents/:agentId` | Agent Workspace | Single agent prompt flow | The three-step smart prompt generation flow for a specific agent. |

- **Navigation Menus**:
  - Mobile bottom tabs become: **Home** (dashboard), **Workspace** (my agents), **Discover** (browse agents), **Profile** (settings).
  - Desktop sidebar becomes: Dashboard, My Workspace, Discover Agents, Prompt Library, Notifications, Help, Settings.
- **Purpose**: "My Workspace" is the primary view where the user interacts with their active agents (assigned at onboarding + any added from Discovery).
- **Data Fetching**: Fetch and render agents from `GET /api/user/agents`.
- **Interaction**: Clicking an agent card in this view routes the user directly to the Prompt Generation flow for that specific agent.
- **Discovery Nudge**: Render a link/button routing the user to the Agent Discovery `/agents/discover` page so they can continue to expand their workspace.

## 4. Settings & Theming UX
- **Location**: Add a new `/settings/theme` or `/profile` view accessible from the user's avatar or main navigation.
- **Theme Toggles**:
  - `ThemeContext` stores one of three values: `'light'`, `'dark'`, `'system'`.
  - When `'system'` is selected, listen to `window.matchMedia('(prefers-color-scheme: dark)')` and apply accordingly. Update in real-time if the user changes their OS theme.
  - The settings UI shows three options as a segmented control (not a simple toggle): ☀️ Light | 🌙 Dark | 💻 System.
  - Enforce the original primary brand colors across both modes. The app's core brand identity must remain consistent, while the background, text, and surface colors shift appropriately.
- **State Management**: Persist the selected `theme` state in `localStorage` key `xpert-theme` and a global Context provider. Default for new users is `'system'`. The HTML tag (e.g. `<html class="dark">`) should update dynamically so the theme applies instantly without a page reload.
- **Glassmorphic Adaptation**: Ensure the glassmorphism classes dynamically read the theme state (e.g., using `bg-white/40 border-white/20` for light mode overlays and `bg-black/40 border-white/10` for dark mode overlays) to maintain aesthetics flawlessly in both environments.

## 5. Admin Dashboard UX Integrations (`xpert-admin-dashboard`)
- **Location**: The existing User Management table/view inside the admin frontend.
- **Data Rendering**: Add columns or detailed view panels to display the newly collected onboarding data:
  1. `job_title`
  2. `purpose`
  3. `field_of_specialization`
  4. `role` (user or admin)
- **Filtering Capability**: 
  - Add dropdown filters to the admin users table so admins can sort/filter their userbase specifically by `field_of_specialization`.
  - Add a **Role filter** (e.g., a toggle or dropdown) so admins can instantly view *only* other admins vs regular users.
- **Role Management UI**: Add a quick-action button/toggle to promote a regular user to an `admin`, or demote an admin. **Visibility Guard**: The `user.role` field from AuthContext will be one of `user`, `admin`, or `super_admin`. The admin dashboard must check `user.role === 'super_admin'` before rendering promote/demote and permanent delete buttons. Regular `admin` users see these buttons as disabled with a tooltip: 'Only super admins can perform this action.'
  - Call Endpoint: `PUT /api/admin/users/{id}/promote`
- **Admin Moderation Actions**:
  - Add red-accented quick-actions for managing rule-breakers: **Block User**, **Unblock User**, and **Delete User**.
  - **Block UI flow**: Clicking Block User opens a Glassmorphic Modal asking for:
    1. **Duration**: Simple dropdown (24h/7d/30d or permanent).
    2. **Reasoning**: A mandatory textarea explaining the ban.
  - Submitting the block calls `PUT /api/admin/users/{id}/block`. This locks the account via middleware.
  - Unblocking calls `PUT /api/admin/users/{id}/unblock`.
  - **Delete UI Flow**: Clicking Delete must prompt a strict confirmation warning ("Are you sure? This deletes all data forever") and call `DELETE /api/admin/users/{id}` (Super Admins only).


## 6. Global Error Handling & Suspended Accounts

Add these error handlers to the central `apiClient` switch statement:

```javascript
case 'account_blocked':
  showBlockedScreen(error.message, error.banned_until);
  break;
```

**Blocked Screen Overlay**: A full-page overlay (no navigation, no sidebar) showing the XPERT logo, "Account Suspended", the ban reason, the ban duration ("until [date]" or "permanently"), and a "Logout" button. Added to the main prompt's screen list.

**Login Screen Error**: The login page must handle `account_blocked` errors directly. Instead of a toast, show an inline error panel: "Your account has been suspended", display reason/duration, provide a "Contact Support" link, and stay on the login page (do not redirect). App mount checking `GET /api/user` returns `account_blocked` -> immediately show Blocked Screen.

### Error Code Reference Table
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
| `account_blocked` | 403 | No | No | Show blocked screen with reason, duration, support link |
| `premium_required` | 402 | No | Yes | Show upgrade modal with agent name |
| `agent_already_added` | 409 | No | No | Toast "This agent is already in your workspace" |
| `agent_limit_reached` | 403 | No | Yes | Toast "Free plan limited to X agents. Upgrade for more." |


## 7. In-App Help Chatbot (Non-AI)

**Overview**: A self-contained floating widget that answers common app questions and navigates the user. **Zero AI API calls, zero token consumption.** It uses pure client-side keyword matching against a cached knowledge base. Built AFTER all existing screens are complete.

### Directory Structure (`src/components/Chatbot/`)
- `ChatbotWidget.jsx` (root widget overlay)
- `ChatbotWidget.css` (animations, glassmorphism)
- `ChatbotBubble.jsx` (floating button)
- `ChatbotPanel.jsx` (expanded area)
- `ChatbotMessageList.jsx`, `ChatbotMessage.jsx`, `ChatbotInput.jsx`
- `ChatbotQuickActions.jsx` (grid of shortcut buttons)
- `ChatbotContextHint.jsx` (route-aware top banner)
- `ChatbotMatcher.js` (pure JS keyword logic)

### Component Behaviors
- **ChatbotWidget**: Circular fixed button (bottom-right 24x24 desktop, 80x16 mobile) that opens a glassmorphic panel (380x500 desktop, full width mobile 75vh). Integration is ONE line in `App.jsx` root: `{isAuthenticated && <ChatbotWidget />}`. Does not render on login/register.
- **On Open**: First time shows Welcome Message ("Hi! Ask me anything...") + `<ChatbotQuickActions>` (6-8 buttons like "Browse agents", "What are tokens?").
- **Knowledge Base Fetching**: Lazy-loads `GET /api/chatbot/knowledge` on first open. Cached in browser. If API fails, falls back to `FALLBACK_KNOWLEDGE` exported within `ChatbotMatcher.js`.
- **ChatbotMatcher Logic**: Splits user input into words. Iterates through the knowledge base array. If `word` matches array `keywords`, adds to score. Highest score wins (threshold 1). Returns `{ matched: boolean, answer: text, action: { type, target } }`.
- **Fallback**: If no match, responds "I'm not sure about that. Here are some things I can help with:" and displays the Quick Actions grid again.
- **Actions**:
  - `action.type === 'navigate'`: Calls `router.push('/target')`, closes panel. Shows pill badge: "🔗 Navigated to Settings".
  - `action.type === 'modal'`: Opens existing app modals (like the upgrade panel).
- **Context Hints**: `ChatbotContextHint` reads React Router route and shows dynamic banner (e.g., if on `/workspace` → "Click any agent card to start the prompt flow.").

### No State Persistence
- Chat history is stored in React state only (clears on refresh/tab close). This is intentional; it's a help assistant, not a conversation log.
