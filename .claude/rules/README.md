# .claude/rules - Automated Project Documentation

This directory contains all project rules, standards, patterns, and monitoring logs.

## Directory Structure

```
.claude/rules/
├── README.md                      ← This file
├── database/
│   └── SCHEMA.md                  ← Database design rules
├── frontend/
│   └── DESIGN_SYSTEM.md          ← Frontend design standards
├── backend/
│   └── API_STANDARDS.md          ← Backend API rules
├── coding-standards/
│   ├── PHP_STANDARDS.md          ← Laravel/PHP style guide
│   └── JAVASCRIPT_STANDARDS.md   ← React/JS style guide
├── architecture/
│   └── OVERVIEW.md               ← System architecture
├── patterns/
│   └── REUSABLE_PATTERNS.md      ← Code patterns and conventions
├── logs/
│   └── SESSION_LOG.md            ← Auto-populated session logs
├── failures/
│   └── KNOWN_ISSUES.md           ← Auto-populated error log
└── performance/
    └── METRICS.md                ← Auto-populated metrics
```

## How It Works

### Manual Documentation
You edit these files to document project rules:
- Database schema rules
- Frontend design system
- Backend API standards
- Coding standards (PHP and JavaScript)
- Architecture overview
- Reusable code patterns

### Automated Logging
The `rules-monitor.py` sub-agent automatically populates:
- **SESSION_LOG.md** — What changed in each session
- **KNOWN_ISSUES.md** — Errors and failures encountered
- **METRICS.md** — Performance observations

## Using the Rules Monitor

### Log a Session
```bash
python3 ~/.claude/scripts/rules-monitor.py \
  /Users/chimzy/Documents/workspace/xpert \
  session '{"files_changed":["file1.js","file2.php"],"features":["Auth"],"bugs_fixed":["Issue 1"],"patterns":["Custom Hook"],"next_steps":["Deploy"]}'
```

### Log a Failure
```bash
python3 ~/.claude/scripts/rules-monitor.py \
  /Users/chimzy/Documents/workspace/xpert \
  failure '{
    "title": "Avatar upload fails",
    "severity": "High",
    "description": "Users cannot upload images > 2MB",
    "root_cause": "Base64 encoding increases size",
    "impact": "Users cannot set profile pictures",
    "status": "Resolved",
    "resolution": "Increased limit to 3MB",
    "prevention": "Add client-side preview"
  }'
```

### Log a Pattern
```bash
python3 ~/.claude/scripts/rules-monitor.py \
  /Users/chimzy/Documents/workspace/xpert \
  pattern '{
    "name": "Form Request Validation",
    "category": "Backend",
    "description": "Standard pattern for API validation",
    "language": "php",
    "code": "class StorePromptRequest extends FormRequest { ... }",
    "when_to_use": "All endpoints accepting user input",
    "related": ["Service Class Pattern"]
  }'
```

### Log Performance
```bash
python3 ~/.claude/scripts/rules-monitor.py \
  /Users/chimzy/Documents/workspace/xpert \
  performance '{
    "category": "frontend",
    "metric": "Bundle size",
    "value": "450KB",
    "target": "< 500KB",
    "status": "ok",
    "impact": "Fast load times on 3G",
    "action": "Monitor"
  }'
```

### Scan for Patterns
```bash
python3 ~/.claude/scripts/rules-monitor.py \
  /Users/chimzy/Documents/workspace/xpert \
  scan
```

### Generate Report
```bash
python3 ~/.claude/scripts/rules-monitor.py \
  /Users/chimzy/Documents/workspace/xpert \
  report
```

## Integration with Claude Sessions

At the end of each Claude Code session, the following happens:
1. Session activity is extracted from chat history
2. `rules-monitor.py session` is called to log changes
3. New failures are logged to KNOWN_ISSUES.md
4. New patterns are logged to REUSABLE_PATTERNS.md
5. Performance metrics are added to METRICS.md

## Quick Reference

### When to Update Each File

**SCHEMA.md**: When database design changes
- New migrations
- Schema changes
- Performance optimizations

**DESIGN_SYSTEM.md**: When frontend standards change
- New components added
- Design pattern changes
- Color/theme updates

**API_STANDARDS.md**: When backend conventions change
- New API endpoints
- Authorization changes
- Error handling updates

**PHP_STANDARDS.md** / **JAVASCRIPT_STANDARDS.md**: When code style changes
- New naming conventions
- New patterns adopted
- Linter rule changes

**OVERVIEW.md**: When architecture changes
- New services added
- Flow changes
- Scaling decisions

**REUSABLE_PATTERNS.md**: As patterns are discovered
- New code patterns
- Best practices
- Examples and usage

**SESSION_LOG.md**: Auto-populated, review for insights
- Track what changed
- Identify trends
- Plan next work

**KNOWN_ISSUES.md**: Auto-populated, review regularly
- Stay aware of issues
- Track resolutions
- Prevent regressions

**METRICS.md**: Auto-populated, monitor regularly
- Performance trends
- Bottleneck identification
- Optimization opportunities

## Best Practices

1. **Keep Rules Updated**: Update rules as standards change
2. **Review Logs Regularly**: Check SESSION_LOG.md weekly
3. **Address Failures Quickly**: Resolve issues logged in KNOWN_ISSUES.md
4. **Share Patterns**: Document new patterns for team/future self
5. **Monitor Performance**: Keep METRICS.md in view during development

## Integration with Vault

The `.claude/rules/` system complements your Obsidian vault:
- **Vault** = High-level knowledge, decisions, cross-project insights
- **Rules** = Project-specific standards, patterns, monitoring
- Both stay in sync via the rules-monitor sub-agent

## Next Steps

1. ✅ Review all rule files for accuracy
2. ✅ Configure rules-monitor in CLAUDE.md
3. ✅ Update rules as you work
4. ✅ Monitor logs and failures weekly
5. ✅ Share patterns with team
