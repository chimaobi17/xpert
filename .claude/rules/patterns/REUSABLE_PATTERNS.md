# Reusable Code Patterns

## Backend Patterns

### Form Request Validation
```php
class StorePromptRequest extends FormRequest
{
    public function authorize() {
        return $this->user() !== null;
    }

    public function rules() {
        return [
            'agent_id' => 'required|exists:ai_agents,id',
            'prompt' => 'required|string|max:5000',
        ];
    }
}
```

### Service Class Pattern
```php
class PromptEngineService
{
    public function execute(string $prompt, AiAgent $agent): string
    {
        // 1. Validate
        // 2. Process
        // 3. Cache
        // 4. Return
    }
}
```

### Authorization Policy
```php
class PromptLogPolicy
{
    public function view(User $user, PromptLog $log) {
        return $user->id === $log->user_id;
    }
}
```

## Frontend Patterns

### Custom Hook Pattern
```jsx
const usePromptExecution = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (prompt) => {
    try {
      setLoading(true);
      const response = await apiCall('/api/prompts', { prompt });
      return response.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};
```

### Component Composition
```jsx
export const PromptForm = () => (
  <div>
    <PromptInput />
    <AgentSelector />
    <SubmitButton />
  </div>
);
```

## Patterns Added
- (Auto-logged by sub-agent)

## Usage Examples
- (Auto-logged by sub-agent)

## When to Use
- (Auto-logged by sub-agent)
