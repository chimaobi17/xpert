# Known Issues & Failure Log

Auto-populated by sub-agent when errors/issues are encountered.

## Critical Issues
- (None currently - auto-logged by sub-agent)

## High Priority
- (Auto-logged by sub-agent)

## Medium Priority
- (Auto-logged by sub-agent)

## Low Priority
- (Auto-logged by sub-agent)

---

## Issue Format

When logging an issue:
1. **Title**: Brief description
2. **Severity**: Critical / High / Medium / Low
3. **Date Discovered**: YYYY-MM-DD
4. **Description**: What happened
5. **Root Cause**: Why it happened
6. **Impact**: How it affects the system
7. **Status**: Open / In Progress / Resolved
8. **Resolution**: How it was fixed (if resolved)
9. **Prevention**: How to prevent in future

## Example

**Title**: Avatar upload fails for images > 2MB

**Severity**: High

**Date Discovered**: 2026-04-05

**Description**: Users cannot upload profile avatars larger than 2MB. Upload fails silently.

**Root Cause**: Base64 encoding increases file size by ~33%. Form validation limit of 2MB insufficient for 1.5MB images.

**Impact**: Users cannot set custom profile pictures.

**Status**: Resolved

**Resolution**: Increased validation limit to 3MB in FileUploadRequest.

**Prevention**: Add client-side file size preview. Compress images before upload.

---

## Auto-Logged Issues
- (Sub-agent will monitor logs and add failures here)
