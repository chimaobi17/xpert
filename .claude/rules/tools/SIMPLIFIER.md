# Simplifier MCP Plugin

Installed and configured for code simplification and low-code patterns.

## What Is It?

Simplifier-MCP provides tools for:
- **Code Simplification** — Make complex code more readable
- **Low-Code Patterns** — Reduce boilerplate
- **Business Objects** — Structured data handling
- **Connectors** — Integration patterns
- **Rapid Development** — Speed up implementation

## Installation

✅ **Status**: Installed

```bash
Package: @simplifierag/simplifier-mcp
Location: ~/.npm-global/node_modules/@simplifierag/simplifier-mcp
Version: Latest
```

## Configuration

Registered in `.mcp-servers.json`:

```json
{
  "simplifier": {
    "command": "node",
    "args": ["/Users/chimzy/.npm-global/node_modules/@simplifierag/simplifier-mcp/dist/index.js"],
    "stdio": true
  }
}
```

## Key Features

### 1. Code Simplification
- Reduce complexity
- Remove boilerplate
- Improve readability
- Simplify logic flow

### 2. Low-Code Patterns
- Template-based generation
- Reduced manual coding
- Configuration over code
- Rapid prototyping

### 3. Business Objects
- Structured data definitions
- Validation patterns
- Serialization helpers
- Type safety

### 4. Connectors
- Integration patterns
- API connection templates
- Data transformation
- Error handling

## How to Use

Ask Claude to use Simplifier for:

**Code Simplification**:
```
"Use Simplifier to simplify this complex function"
```

**Low-Code Generation**:
```
"Generate a low-code pattern for this feature"
```

**Business Object Definition**:
```
"Create a business object for managing users"
```

**Connector Integration**:
```
"Use Simplifier to create a connector to [API]"
```

## Use Cases

### Feature Development
- Faster implementation
- Less boilerplate
- Clear patterns
- Reduced testing

### Integration Work
- API connectors
- Data transformation
- Error handling
- Retry logic

### Maintenance
- Cleaner code
- Easier refactoring
- Better documentation
- Reduced complexity

### Team Productivity
- Consistent patterns
- Shared conventions
- Faster onboarding
- Reusable components

## Benefits

### Development Speed
- 30-50% faster feature development
- Reduced boilerplate
- Template-based generation
- Built-in patterns

### Code Quality
- Consistent structure
- Better readability
- Fewer errors
- Self-documenting

### Maintainability
- Clear conventions
- Easy refactoring
- Better testing
- Team consistency

## Integration

Works with:
- Superpowers (for TDD of simplified code)
- Sequential Thinking (for complex simplifications)
- Rules system (documents patterns created)
- Patterns library (stores reusable templates)

## Examples

### Before (Complex)
```javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      } else if (response.status === 401) {
        throw new Error('Unauthorized');
      } else {
        throw new Error('Server error');
      }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

### After (Simplified)
```javascript
const fetchUserData = async (userId) => 
  apiConnector.get(`/users/${userId}`);
```

## Recent Updates
- (Auto-logged by rules-monitor)

## Known Capabilities
- ✅ Code simplification
- ✅ Low-code patterns
- ✅ Business objects
- ✅ Connector templates
