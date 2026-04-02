# XPERT Maintenance & Security Plan

> **PURPOSE**: This implementation plan is strictly for **Maintenance, Code Review, and Security Guidance**. It outlines the protocols Claude Code must follow during the development process and, most importantly, on the finished application to ensure long-term stability, performance, and bulletproof security.

> **REQUIRED PLUGINS/TOOLS**:
> - **Code Review**: Used to review code for performance, readability, architecture, and maintainability.
> - **Security Guidance**: Used to review code for vulnerabilities, OWASP compliance, secure data handling, and authorization flaws.

---

## Phase 1: Continuous Development Checks (Every Step of the Way)

Maintenance is not just a post-launch activity. During the implementation of the main plans (`XPERT_IMPLEMENTATION_PLAN.md` and `XPERT_FRONTEND_IMPLEMENTATION_PLAN.md`), Claude Code must perform these checks after completing any major feature or component.

### 1.1 Incremental Code Reviews
- **Trigger**: After a new feature (e.g., a new React component, a new Laravel controller, or a new database schema) is fully tested and working.
- **Action**: Use the **Code Review** tool on the modified files.
- **Goals**:
  - Identify code duplication and suggest refactoring into reusable hooks/traits/helpers.
  - Ensure variable naming, component structuring, and file organization adhere to the established project conventions.
  - Confirm that the React components efficiently manage state and avoid unnecessary re-renders.
  - Verify that backend Eloquent queries are optimized (e.g., no N+1 query problems).

### 1.2 Incremental Security Sweeps
- **Trigger**: After writing any code that handles user input, interacts with the database, or manages authentication/authorization.
- **Action**: Use the **Security Guidance** tool.
- **Goals**:
  - Verify that ALL API endpoints use Laravel Form Requests for strict validation.
  - Ensure proper escaping of output in the frontend to prevent Cross-Site Scripting (XSS).
  - Check that no sensitive data (passwords, tokens, API keys) is accidentally exposed in API responses or logs.

---

## Phase 2: Pre-Deployment Audit (The Finished App Sweep)

Before the application is officially deployed to production (Render/Vercel) and the MVP is declared finished, a comprehensive, repository-wide maintenance audit must be conducted.

### 2.1 Complete App Code Review
- **Trigger**: Upon completion of Phase 11 of the main backend plan.
- **Action**: Use the **Code Review** tool to scan all core directories (`app/Http`, `app/Models`, `src/components`, `src/hooks`, `src/pages`).
- **Goals**:
  - Identify dead code (unused imports, deprecated variables, abandoned files).
  - Enforce strict typing and error boundaries in the React frontend.
  - Verify that the central API client (`apiClient.js`) gracefully handles all network failures and aligns perfectly with the Error Code Reference Table.
  - Review background job processes (Queues) for efficiency and failure handling.

### 2.2 Complete App Security Audit
- **Trigger**: Immediately following the Pre-Deployment Code Review.
- **Action**: Use the **Security Guidance** tool to perform a rigorous OWASP Top 10 sweep.
- **Goals**:
  - **Injection**: Verify parameterized queries are exclusively used in Laravel.
  - **Broken Authentication**: Verify Sanctum token lifecycles and secure session management.
  - **Sensitive Data Exposure**: Guarantee that `APP_KEY`, `HUGGINGFACE_API_KEY`, and database credentials are ONLY loaded via `.env` and never fallback to unsafe defaults.
  - **Broken Access Control**: Test the `CheckBanStatus` and `role:*` middlewares to ensure `user`, `admin`, and `super_admin` boundaries are cryptographically enforced.
  - **Security Headers**: Ensure HTTP headers (`Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`) are injected across all API and document responses.

---

## Phase 3: Long-Term Maintenance Operations

Once the app is live, maintenance shifts to keeping the application updated, performant, and secure against evolving threats.

### 3.1 Dependency Management & Auditing
- **Frequency**: Monthly or immediately following major vulnerability disclosures (CVEs).
- **Action**: 
  - Run `npm audit` and `composer audit`.
  - Use the **Security Guidance** tool to evaluate whether updating a vulnerable dependency introduces breaking changes to the XPERT architecture.
  - **Code Review** the `package.json` and `composer.json` files to remove bloatware or unused libraries.

### 3.2 Security Patching & Key Rotation
- **Action**: 
  - Rotate `.env` keys (like `HUGGINGFACE_API_KEY` or `SUPER_ADMIN_PASSWORD` seeds) proactively.
  - Use **Security Guidance** to ensure new zero-day vulnerabilities in the Laravel or React ecosystem are patched via framework updates.

### 3.3 Post-Mortem and Refactoring
- **Trigger**: If an error is caught by Discord alerts or a user reports a bug.
- **Action**:
  - First, use **Code Review** on the faulty file to find the logical gap.
  - Deploy an immediate fix.
  - Then, use **Security Guidance** to determine if the logic gap exposed any user data or system resources.
  - Refactor the code to improve the global exception mapping in `bootstrap/app.php` or `app/Exceptions/Handler.php`.

---

## Phase 4: High Availability, Anti-Crash & Threat Logging

To ensure that the application never goes down and that users can **always** make use of the AI elements in the future, the following safeguards and monitoring techniques must be repeatedly validated:

### 4.1 Server Crash Prevention & High Availability
- **Goal**: Prevent server lockups or outages caused by AI bottlenecks.
- **Action**: 
  - Restrict memory limits and configure strict execution timeouts (e.g., `max_execution_time=30s`) on all API endpoints targeting the AI engine. This ensures that stalled Hugging Face API queries do not exhaust or crash the main server container.
  - Test the degradation system: Ensure heavy loads or failing API calls gracefully fail over to the background database queue without holding synchronous HTTP connections open indefinitely.
  - Verify that the continuous `/api/health` health check is correctly configured on Render to automatically restart crashed or unresponsive server containers.

### 4.2 Anti-Hooking & Bot Mitigation
- **Goal**: Stop malicious traffic from eating up bandwidth and AI rate limits.
- **Action**:
  - Routinely monitor Cloudflare (Free Tier) proxying for Vercel and Render. Review Web Application Firewall (WAF) and Bot Management logs to block malicious scraping tools and hooking scripts.
  - Perform regular penetration tests to confirm strict API Origin validation aggressively rejects any requests originating outside the authorized frontend domains.

### 4.3 Cyber Attack & Distributed Error Logging
- **Goal**: Maintain full visibility into active system threats and unhandled bugs.
- **Action**:
  - Actively monitor the consolidated logging for suspected cyber attacks: brute-force login attempts, massive 404 scans, repeated 429s (Rate Limit Exceeded), and 401/403 anomalies.
  - Periodically review the dedicated `security` logging channel in `config/logging.php` to analyze preserved threat data (Timestamp, Source IP, Target Path, Attack Type).
  - Verify that critical unhandled errors and cyber attack logs (`CRITICAL` and `EMERGENCY`) stream reliably to the designated Discord webhook so admins can intervene immediately before a crash escalates.

---

## Summary Checklist for Claude Code

When explicitly asked to perform Maintenance, Claude Code should:
1. Identify the current stage of the app (Continuous, Pre-Deployment, or Long-Term).
2. Invoke the **Code Review** tool to assess the target files for quality and performance.
3. Invoke the **Security Guidance** tool to audit the target files for vulnerabilities.
4. Provide a structured report to the developer with HIGH, MEDIUM, and LOW priority fixes.
5. Apply the fixes directly to the codebase upon developer approval.
