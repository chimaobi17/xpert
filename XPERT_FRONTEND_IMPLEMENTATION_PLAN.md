# XPERT Frontend Feature Extensions (UX & State Management)

**Directive:** The overarching UI style and design system for XPERT is already established. This plan outlines the structural UX flow, state management, and component architecture for integrating the new Onboarding and Agent Discovery features. **Claude Code must inherit and reuse existing UI components, CSS classes, and layouts.** The only new aesthetic addition permitted is **glassmorphism** (e.g., using Tailwind's `backdrop-blur` utilities). This must be integrated tastefully within the crucibles of the existing UI and coding structure. Do not invent any other new styling rules.

---

## 1. Onboarding UX Flow (The Questionnaire)
- **Trigger**: When a user logs in (or registers) and their `field_of_specialization` is missing or `null` in the user object.
- **Component Flow**: 
  - Intercept the main dashboard routing and render an `OnboardingFlow` component (modal or page) using the existing design system.
- **Data Capture**:
  1. **Job Title**: Text input.
  2. **Purpose**: Text input or predefined selection.
  3. **Specialization**: Select/dropdown matching the 5 backend domains (Technology, Creative, Business, Research, Language).
- **Submission Logic**: 
  - Submit the form data to the `PATCH /api/user/profile` endpoint.
  - On success, update the global `AuthContext` user state with the new profile data.
  - **Experience Customization**: The backend will automatically assign a tailored starter-pack of free agents based *strictly* on the user's questionnaire answers (specifically their `field_of_specialization`). Fetch the user's updated agent list and route them to a personalized "My Workspace" dashboard pre-populated for their specific needs.

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

## 3. "My Workspace" Dashboard UX
- **Purpose**: The primary view where the user interacts with their active agents (the default ones assigned at onboarding + any added from Discovery).
- **Data Fetching**: Fetch and render only the agents currently attached to the user from the backend.
- **Interaction**: Clicking an agent card in this view routes the user directly to the Prompt Generation flow for that specific agent.
- **Discovery Nudge**: Render a link/button routing the user to the Agent Discovery `/agents/discover` page so they can continue to expand their workspace.

## 4. Settings & Theming UX
- **Location**: Add a new `/settings/theme` or `/profile` view accessible from the user's avatar or main navigation.
- **Theme Toggles**: 
  - Provide a clear, visual toggle to switch between **Light Mode**, **Dark Mode**, and **System Sync**.
  - Enforce the original primary brand colors across both modes. The app's core brand identity must remain consistent, while the background, text, and surface colors shift appropriately.
- **State Management**: Persist the selected `theme` state in `localStorage` and a global Context provider. The HTML tag (e.g. `<html class="dark">`) should update dynamically so the theme applies instantly without a page reload.
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
- **Role Management UI**: Add a quick-action button/toggle in the table row to easily promote a regular user to an `admin`, or demote an admin back to a regular user. **Visibility Guard**: Only render this promote/demote button if the currently logged-in user is a `super_admin`. Regular `admin` users can view and use the dashboard but cannot promote others to admin rank.
- **Admin Moderation Actions**:
  - Add red-accented quick-actions for managing rule-breakers: **Block User** and **Delete User**.
  - **Block UI flow**: Clicking Block User must open a Glassmorphic Modal asking for:
    1. **Duration**: Simple dropdown (Temporary 24h/7d/30d or Permanent).
    2. **Reasoning**: A mandatory textarea explaining the ban.
  - Submitting the block triggers the backend to lock the account and automatically relays the reasoning notification to the user upon next login attempt or via email.
  - **Delete UI Flow**: Clicking Delete must prompt a strict confirmation warning ("Are you sure? This deletes all prompts and history forever") to prevent accidental data loss.
