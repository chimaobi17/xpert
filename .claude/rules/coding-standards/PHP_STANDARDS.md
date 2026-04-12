# PHP Coding Standards

## General Rules
- **Standard**: PSR-12 (Extended Coding Style Guide)
- **Indentation**: 4 spaces (not tabs)
- **Line Length**: 120 characters max
- **Namespace**: Follow directory structure

## Class Structure
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    // 1. Properties and constants
    protected $fillable = [];

    // 2. Relationships
    public function posts() {}

    // 3. Accessors/Mutators
    public function getNameAttribute() {}

    // 4. Scopes
    public function scopeActive($query) {}

    // 5. Methods
    public function doSomething() {}
}
```

## Naming Conventions
- Classes: PascalCase (User, AiAgent)
- Methods/functions: camelCase (getUserAgents)
- Constants: UPPER_SNAKE_CASE (MAX_ATTEMPTS)
- Variables: camelCase (userId, agentName)

## Type Hints
- Always use return type hints
- Always use parameter type hints
- Use nullable types: `?string`, `?int`
- Use union types when needed: `string|int`

## Documentation
- Use PHPDoc for classes and public methods
- Include @param, @return, @throws
- Keep comments minimal (code should be self-documenting)

## Error Handling
- Use try/catch for external APIs
- Throw specific exceptions
- Log errors with context
- Never use die() or exit()

## Recent Changes
- (Auto-logged by sub-agent)

## Performance Notes
- (Auto-logged by sub-agent)

## Known Issues
- (Auto-logged by sub-agent)
