# MCP Tools & Plugins

All advanced MCP (Model Context Protocol) servers installed and configured.

## Quick Reference

| Plugin | Purpose | Status |
|--------|---------|--------|
| **Sequential Thinking** | Extended reasoning, step-by-step analysis | ✅ Active |
| **Superpowers** | TDD, debugging, collaboration, best practices | ✅ Active |
| **Context7** | Smart context management, token optimization | ✅ Active |
| **Simplifier** | Code simplification, low-code patterns | ✅ Active |

---

## 🧠 Sequential Thinking

**File**: [SEQUENTIAL_THINKING.md](SEQUENTIAL_THINKING.md)

Extended reasoning for complex problems.

**Use When**:
- Architecture decisions
- Algorithm design
- Deep debugging
- Detailed analysis

**Command**: "Think through this step-by-step"

---

## 💪 Superpowers

**File**: [SUPERPOWERS.md](SUPERPOWERS.md)

TDD, debugging, collaboration, best practices.

**Use When**:
- Writing tests first
- Debugging complex issues
- Code reviews
- Team workflows

**Command**: "Use superpowers TDD for this feature"

---

## 🎯 Context7

**File**: [CONTEXT7.md](CONTEXT7.md)

Smart context management and token optimization.

**Works**:
- Automatically in background
- Reduces tokens 40-60%
- Keeps important context
- Manages large conversations

**Benefit**: Longer conversations, faster responses, lower cost

---

## 📦 Simplifier

**File**: [SIMPLIFIER.md](SIMPLIFIER.md)

Code simplification and low-code patterns.

**Use When**:
- Complex code needs simplification
- Generating boilerplate
- Creating integrations
- Rapid prototyping

**Command**: "Simplify this code" or "Generate low-code pattern"

---

## Configuration

All plugins configured in `.mcp-servers.json`:

```json
{
  "sequential-thinking": { ... },
  "superpowers": { ... },
  "context7": { ... },
  "simplifier": { ... }
}
```

## How They Work Together

```
Your Request
    ↓
Context7 (optimizes context)
    ↓
Sequential Thinking (reasons through)
    ↓
Superpowers (applies best practices)
    ↓
Simplifier (generates clean code)
    ↓
Better Code & Decisions
```

## Installation Locations

```bash
~/.npm-global/node_modules/
├── superpowers-mcp/
├── @upstash/context7-mcp/
├── @simplifierag/simplifier-mcp/
└── @modelcontextprotocol/server-sequential-thinking/
```

## Getting Maximum Value

### For Development
1. Use Sequential Thinking for architecture
2. Apply Superpowers TDD workflow
3. Simplifier generates clean code
4. Context7 keeps you efficient

### For Debugging
1. Sequential Thinking traces through problem
2. Superpowers debugging techniques
3. Context7 maintains focus
4. Find root cause faster

### For Code Review
1. Superpowers checks best practices
2. Sequential Thinking analyzes design
3. Simplifier suggests improvements
4. Context7 remembers patterns

### For Team Collaboration
1. Superpowers documents best practices
2. Sequential Thinking explains decisions
3. Simplifier creates reusable patterns
4. Context7 shares learnings across projects

## Status Dashboard

✅ **All 4 plugins installed and operational**

- Sequential Thinking: v2025.12.18
- Superpowers: Latest
- Context7: v2.1.7
- Simplifier: Latest

## Troubleshooting

**Plugin not responding?**
- Check `.mcp-servers.json` configuration
- Verify Node.js version (v24.12.0+)
- Restart Claude Code session

**Token usage high?**
- Context7 should optimize automatically
- Check for large file uploads
- Review context window size

**Simplifications not working?**
- Some code may already be simplified
- Try with larger/more complex functions
- Review generated patterns

## Next Steps

1. ✅ Install all plugins
2. ✅ Configure in .mcp-servers.json
3. ✅ Document in rules system
4. Start using in daily workflow

## Reference Docs

- [SEQUENTIAL_THINKING.md](SEQUENTIAL_THINKING.md) — Full documentation
- [SUPERPOWERS.md](SUPERPOWERS.md) — TDD & debugging workflows
- [CONTEXT7.md](CONTEXT7.md) — Context optimization
- [SIMPLIFIER.md](SIMPLIFIER.md) — Code simplification patterns
- [project CLAUDE.md](../../CLAUDE.md) — Integration guide

---

**Last Updated**: 2026-04-11
**Auto-Logged**: Yes (rules-monitor tracks updates)
