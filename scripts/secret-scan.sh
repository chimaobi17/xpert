#!/bin/bash
# Secret Scanner for XPERT Project
# Scans staged files (or all files) for exposed secrets, API keys, and credentials.
# Usage:
#   ./scripts/secret-scan.sh           # Scan staged files only (for pre-push)
#   ./scripts/secret-scan.sh --all     # Scan entire repository

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

FOUND=0

# Patterns that indicate exposed secrets
PATTERNS=(
    # API Keys & Tokens
    'AIzaSy[0-9A-Za-z_-]{33}'                           # Google API Key
    'sk-[0-9a-zA-Z]{20,}'                                # OpenAI API Key
    'hf_[0-9a-zA-Z]{34}'                                 # HuggingFace Token
    'ghp_[0-9a-zA-Z]{36}'                                # GitHub Personal Token
    'gho_[0-9a-zA-Z]{36}'                                # GitHub OAuth Token
    'xoxb-[0-9]{10,}-[0-9a-zA-Z]{24}'                   # Slack Bot Token
    'sk_live_[0-9a-zA-Z]{24,}'                           # Stripe Live Key
    'AKIA[0-9A-Z]{16}'                                    # AWS Access Key

    # Database & Connection Strings
    'mongodb(\+srv)?://[^\s"'"'"']+:[^\s"'"'"']+@'       # MongoDB connection string
    'postgres://[^\s"'"'"']+:[^\s"'"'"']+@'               # PostgreSQL connection string
    'mysql://[^\s"'"'"']+:[^\s"'"'"']+@'                  # MySQL connection string

    # Generic Secrets
    'password\s*=\s*["\x27][^\s"'"'"']{8,}'              # Hardcoded passwords
    'secret\s*=\s*["\x27][^\s"'"'"']{8,}'                # Hardcoded secrets
    'PRIVATE[_ ]KEY'                                       # Private keys
    '-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----'         # PEM private keys
    '-----BEGIN CERTIFICATE-----'                          # Certificates
)

# Files to always skip
SKIP_PATTERNS=(
    '\.sample$'
    'secret-scan\.sh$'
    '\.md$'
    'package-lock\.json$'
    'composer\.lock$'
    'node_modules/'
    'vendor/'
    '\.env\.example$'
    '\.git/'
)

build_skip_args() {
    local args=""
    for pattern in "${SKIP_PATTERNS[@]}"; do
        args="$args --glob=!$pattern"
    done
    echo "$args"
}

echo -e "${YELLOW}=== XPERT Secret Scanner ===${NC}"
echo ""

if [[ "${1:-}" == "--all" ]]; then
    echo -e "Scanning: ${YELLOW}entire repository${NC}"
    TARGET_FILES=$(git ls-files)
else
    echo -e "Scanning: ${YELLOW}staged files${NC}"
    TARGET_FILES=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null || git diff --name-only HEAD~1 2>/dev/null || echo "")
fi

if [[ -z "$TARGET_FILES" ]]; then
    echo -e "${GREEN}No files to scan.${NC}"
    exit 0
fi

for pattern in "${PATTERNS[@]}"; do
    while IFS= read -r file; do
        # Skip binary files and excluded patterns
        skip=false
        for sp in "${SKIP_PATTERNS[@]}"; do
            if [[ "$file" =~ $sp ]]; then
                skip=true
                break
            fi
        done
        $skip && continue

        # Skip if file doesn't exist
        [[ -f "$file" ]] || continue

        # Search for the pattern
        matches=$(grep -nE "$pattern" "$file" 2>/dev/null || true)
        if [[ -n "$matches" ]]; then
            echo -e "${RED}[SECRET FOUND]${NC} $file"
            echo "$matches" | head -3 | while IFS= read -r line; do
                echo -e "  ${RED}→${NC} $line"
            done
            FOUND=$((FOUND + 1))
        fi
    done <<< "$TARGET_FILES"
done

# Check for .env files being committed
while IFS= read -r file; do
    if [[ "$file" =~ ^\.env$ ]] || [[ "$file" =~ ^\.env\.(local|production|staging)$ ]]; then
        echo -e "${RED}[DANGER]${NC} .env file staged for commit: $file"
        FOUND=$((FOUND + 1))
    fi
done <<< "$TARGET_FILES"

echo ""
if [[ $FOUND -gt 0 ]]; then
    echo -e "${RED}=== $FOUND potential secret(s) found! ===${NC}"
    echo -e "${RED}Review and remove secrets before pushing.${NC}"
    echo -e "Tip: Use .env files and environment variables instead."
    exit 1
else
    echo -e "${GREEN}=== No secrets detected. All clear! ===${NC}"
    exit 0
fi
