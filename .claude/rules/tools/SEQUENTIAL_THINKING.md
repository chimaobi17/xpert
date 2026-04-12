# Sequential Thinking MCP Server

Installed and configured for XPERT project.

## What Is It?

The Sequential Thinking MCP server enables Claude to:
- Use structured thinking and reasoning tools
- Break down complex problems step-by-step
- Show detailed reasoning process
- Improve code quality through thorough analysis

## Installation

✅ **Status**: Installed

```bash
Location: ~/.npm-global/node_modules/@modelcontextprotocol/server-sequential-thinking
Version: 2025.12.18
```

## Configuration

Registered in `.mcp-servers.json`:

```json
{
  "sequential-thinking": {
    "command": "node",
    "args": ["/Users/chimzy/.npm-global/node_modules/@modelcontextprotocol/server-sequential-thinking/dist/index.js"],
    "stdio": true
  }
}
```

## How to Use

When Claude has access to sequential thinking, it can:

1. **Use extended thinking for complex problems**
   - Architectural decisions
   - Algorithm design
   - Debug analysis
   - Test strategy

2. **Request step-by-step reasoning**
   - "Think through this authentication flow"
   - "Walk me through the optimization options"
   - "Reason about which approach is better"

3. **Show detailed working**
   - Intermediate steps shown to user
   - Full reasoning visible
   - Better explanations of why choices were made

## Tools Available

When enabled, Claude can use:
- `think` — Extended reasoning for complex tasks
- `step` — Individual reasoning steps
- `conclude` — Summary of thinking

## Use Cases

**Code Review**:
- Sequential analysis of code changes
- Detailed reasoning about potential issues
- Step-by-step optimization recommendations

**Architecture**:
- Detailed architectural reasoning
- Trade-off analysis with full thinking shown
- Scalability assessment with working

**Debugging**:
- Step-by-step root cause analysis
- Detailed investigation of issues
- Comprehensive problem-solving approach

**Feature Design**:
- Detailed feature specification reasoning
- User flow analysis
- Implementation strategy planning

## Next Steps

This is now enabled by default. Use it by:
1. Asking Claude complex questions
2. Requesting step-by-step reasoning
3. Asking for detailed analysis of decisions

The server will automatically provide extended thinking when appropriate.

## Recent Updates
- (Auto-logged by rules-monitor)

## Known Limitations
- (Auto-logged by rules-monitor)
