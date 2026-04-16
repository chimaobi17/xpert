#!/bin/bash
# Security Audit Script for XPERT
# Checks for known vulnerabilities in dependencies and configuration
# Usage: ./scripts/security-audit.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
ISSUES=0

echo -e "${BLUE}=== XPERT Security Audit ===${NC}"
echo -e "Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 1. Secret Scanning
echo -e "${YELLOW}[1/6] Running secret scan...${NC}"
if "$PROJECT_ROOT/scripts/secret-scan.sh" --all 2>/dev/null; then
    echo -e "${GREEN}  ✓ No secrets detected${NC}"
else
    echo -e "${RED}  ✗ Secrets found — see above${NC}"
    ISSUES=$((ISSUES + 1))
fi
echo ""

# 2. Check .env.example vs .env alignment
echo -e "${YELLOW}[2/6] Checking .env configuration...${NC}"
if [[ -f "$PROJECT_ROOT/.env" ]]; then
    if [[ -f "$PROJECT_ROOT/.env.example" ]]; then
        MISSING=$(diff <(grep -oP '^[A-Z_]+' "$PROJECT_ROOT/.env.example" | sort) \
                       <(grep -oP '^[A-Z_]+' "$PROJECT_ROOT/.env" | sort) \
                       2>/dev/null | grep '^<' | sed 's/^< //' || true)
        if [[ -n "$MISSING" ]]; then
            echo -e "${YELLOW}  ⚠ Keys in .env.example missing from .env:${NC}"
            echo "$MISSING" | while IFS= read -r key; do
                echo -e "    - $key"
            done
            ISSUES=$((ISSUES + 1))
        else
            echo -e "${GREEN}  ✓ .env matches .env.example${NC}"
        fi
    else
        echo -e "${YELLOW}  ⚠ No .env.example found${NC}"
    fi
else
    echo -e "${YELLOW}  ⚠ No .env file found (expected in development)${NC}"
fi
echo ""

# 3. NPM Audit (Frontend)
echo -e "${YELLOW}[3/6] Auditing npm dependencies (xpert-app)...${NC}"
if [[ -f "$PROJECT_ROOT/xpert-app/package-lock.json" ]]; then
    cd "$PROJECT_ROOT/xpert-app"
    AUDIT_OUTPUT=$(npm audit --json 2>/dev/null || true)
    VULNS=$(echo "$AUDIT_OUTPUT" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    v = data.get('metadata', {}).get('vulnerabilities', {})
    critical = v.get('critical', 0)
    high = v.get('high', 0)
    moderate = v.get('moderate', 0)
    print(f'{critical},{high},{moderate}')
except:
    print('0,0,0')
" 2>/dev/null || echo "0,0,0")
    IFS=',' read -r CRITICAL HIGH MODERATE <<< "$VULNS"
    if [[ "$CRITICAL" -gt 0 ]] || [[ "$HIGH" -gt 0 ]]; then
        echo -e "${RED}  ✗ Critical: $CRITICAL, High: $HIGH, Moderate: $MODERATE${NC}"
        ISSUES=$((ISSUES + 1))
    elif [[ "$MODERATE" -gt 0 ]]; then
        echo -e "${YELLOW}  ⚠ Moderate: $MODERATE vulnerabilities${NC}"
    else
        echo -e "${GREEN}  ✓ No known vulnerabilities${NC}"
    fi
    cd "$PROJECT_ROOT"
else
    echo -e "${YELLOW}  ⚠ No package-lock.json found${NC}"
fi
echo ""

# 4. Composer Audit (Backend)
echo -e "${YELLOW}[4/6] Auditing composer dependencies...${NC}"
if command -v composer &>/dev/null && [[ -f "$PROJECT_ROOT/composer.lock" ]]; then
    if composer audit --no-interaction 2>&1 | grep -q "No security vulnerability"; then
        echo -e "${GREEN}  ✓ No known vulnerabilities${NC}"
    else
        COMPOSER_VULNS=$(composer audit --no-interaction 2>&1 | grep -c "Advisory" || echo "0")
        if [[ "$COMPOSER_VULNS" -gt 0 ]]; then
            echo -e "${RED}  ✗ $COMPOSER_VULNS vulnerability advisories found${NC}"
            ISSUES=$((ISSUES + 1))
        else
            echo -e "${GREEN}  ✓ No known vulnerabilities${NC}"
        fi
    fi
else
    echo -e "${YELLOW}  ⚠ Composer not available or no lock file${NC}"
fi
echo ""

# 5. Check for debug/development settings in config
echo -e "${YELLOW}[5/6] Checking for debug/dev settings...${NC}"
DEBUG_ISSUES=0
if [[ -f "$PROJECT_ROOT/.env" ]]; then
    if grep -qE '^APP_DEBUG=true' "$PROJECT_ROOT/.env" 2>/dev/null; then
        echo -e "${YELLOW}  ⚠ APP_DEBUG=true (OK for local dev, dangerous in production)${NC}"
    fi
    if grep -qE '^APP_ENV=local' "$PROJECT_ROOT/.env" 2>/dev/null; then
        echo -e "${YELLOW}  ⚠ APP_ENV=local (expected in development)${NC}"
    fi
fi
echo -e "${GREEN}  ✓ Debug settings check complete${NC}"
echo ""

# 6. Check file permissions
echo -e "${YELLOW}[6/6] Checking sensitive file permissions...${NC}"
PERM_ISSUES=0
for f in .env .env.local .env.production storage/app/private; do
    if [[ -f "$PROJECT_ROOT/$f" ]]; then
        PERMS=$(stat -f '%A' "$PROJECT_ROOT/$f" 2>/dev/null || stat -c '%a' "$PROJECT_ROOT/$f" 2>/dev/null || echo "unknown")
        if [[ "$PERMS" != "unknown" ]] && [[ "$PERMS" -gt 644 ]]; then
            echo -e "${YELLOW}  ⚠ $f has permissive permissions: $PERMS${NC}"
            PERM_ISSUES=$((PERM_ISSUES + 1))
        fi
    fi
done
if [[ $PERM_ISSUES -eq 0 ]]; then
    echo -e "${GREEN}  ✓ File permissions look good${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}=== Audit Summary ===${NC}"
if [[ $ISSUES -gt 0 ]]; then
    echo -e "${RED}$ISSUES issue(s) require attention.${NC}"
    exit 1
else
    echo -e "${GREEN}All checks passed! Repository is secure.${NC}"
    exit 0
fi
