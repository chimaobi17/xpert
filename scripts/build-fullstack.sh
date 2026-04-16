#!/usr/bin/env bash
set -euo pipefail

# Build both React SPAs into Laravel's public/ directory
# Usage: bash scripts/build-fullstack.sh
# Laravel Cloud: add to build commands or composer post-install

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "==> Building Xpert user app..."
cd xpert-app
npm ci --prefer-offline 2>/dev/null || npm install
npm run build
cd "$PROJECT_ROOT"

echo "==> Building Xpert admin dashboard..."
cd xpert-admin-dashboard
npm ci --prefer-offline 2>/dev/null || npm install
npm run build
cd "$PROJECT_ROOT"

echo "==> Verifying builds..."
if [ -f public/app/index.html ] && [ -f public/admin/index.html ]; then
    echo "    public/app/index.html  OK"
    echo "    public/admin/index.html  OK"
    echo "==> Fullstack build complete!"
else
    echo "ERROR: One or both SPA builds are missing."
    [ ! -f public/app/index.html ] && echo "    MISSING: public/app/index.html"
    [ ! -f public/admin/index.html ] && echo "    MISSING: public/admin/index.html"
    exit 1
fi
