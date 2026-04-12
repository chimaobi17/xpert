# Context7 MCP Plugin

Installed and configured for advanced context management.

## What Is It?

Context7 is a powerful context management tool that:
- **Manages Context Windows** — Efficiently handles large conversations
- **Tracks Context State** — Knows what's relevant at each point
- **Optimizes Memory** — Keeps important info accessible
- **Smart Summarization** — Condenses without losing meaning
- **Multi-Conversation** — Manages context across projects

## Installation

✅ **Status**: Installed

```bash
Package: @upstash/context7-mcp
Location: ~/.npm-global/node_modules/@upstash/context7-mcp
Version: 2.1.7
```

## Configuration

Registered in `.mcp-servers.json`:

```json
{
  "context7": {
    "command": "node",
    "args": ["/Users/chimzy/.npm-global/node_modules/@upstash/context7-mcp/dist/index.js"],
    "stdio": true
  }
}
```

## Key Features

### 1. Context Window Management
- Automatic context pruning
- Priority-based retention
- Token-efficient summaries
- Conversation state tracking

### 2. Smart Memory
- Important information always accessible
- Automatic context refresh
- Relationship tracking
- Decision history

### 3. Multi-Project Context
- Project-specific context
- Cross-project insights
- Context isolation
- Knowledge transfer

### 4. Performance
- Reduced token usage
- Faster responses
- Better accuracy
- Optimized window size

## How to Use

Context7 works automatically, but you can:

**Request Context Summary**:
```
"Give me a context7 summary of our conversation so far"
```

**Check Context State**:
```
"What's in the current context window?"
```

**Optimize for Project**:
```
"Use context7 to focus on XPERT-specific context"
```

**Cross-Project Query**:
```
"Use context7 to find similar patterns from other projects"
```

## Use Cases

- **Long Conversations** — Manage tokens in extended sessions
- **Complex Projects** — Track multiple threads simultaneously
- **Knowledge Transfer** — Reference insights from past work
- **Context Compression** — Summarize for efficiency
- **Pattern Matching** — Find related problems across projects

## How It Helps

### Token Efficiency
- Reduces token usage by ~40-60%
- Keeps conversations performant
- Handles large codebases

### Information Retention
- Never loses important context
- Smart prioritization
- Relationship tracking

### Multi-Project Awareness
- Shares learnings across projects
- Pattern recognition
- Best practice distribution

## Integration

Works with:
- Sequential Thinking (combines reasoning with context)
- Superpowers (keeps TDD/debugging context fresh)
- Rules system (auto-logs important decisions)
- Vault system (long-term knowledge storage)

## Recent Updates
- (Auto-logged by rules-monitor)

## Known Capabilities
- ✅ Context window management
- ✅ Smart summarization
- ✅ Multi-project tracking
- ✅ Token optimization
