# XPERT Deployment Fix Plan (Supabase & PHP 8.4)

This plan resolves the build failures on Render and enables connectivity to Supabase PostgreSQL.

## Phase 13: PostgreSQL & PHP 8.4 Upgrade
**Goal**: Upgrade the container environment to support modern Laravel 12 dependencies and production database drivers.

- [x] **13.1 Composer Upgrade**: Changed PHP requirement from `^8.2` to `^8.4` in `composer.json`. <!-- id: 0 -->
- [x] **13.2 Multi-Stage Dockerfile**: Refactored `Dockerfile` to a production-ready multi-stage image. <!-- id: 1 -->
- [x] **13.3 DB Drivers**: Installed `pdo_pgsql` and `pgsql` extensions in the production container. <!-- id: 2 -->
- [x] **13.4 Verification**: Ran `php artisan test` and confirmed all 42 tests pass with PHP 8.4 context. <!-- id: 3 -->

## Verification Plan

### Automated
- [x] `php artisan test` (Backend integrity) <!-- id: 4 -->
- [x] `npm run build` in `xpert-app` (Frontend build check) <!-- id: 5 -->

### Manual (Post-Deployment)
- [ ] Set `DB_CONNECTION=pgsql` on Render.
- [ ] Set `DATABASE_URL` (Supabase URI) on Render.
- [ ] confirm `/api/health` returns `{ "status": "ok" }`.
