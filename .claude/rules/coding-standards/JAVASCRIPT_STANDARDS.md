# JavaScript / React Coding Standards

## General Rules
- **Standard**: Airbnb JavaScript Style Guide (modified)
- **Indentation**: 2 spaces
- **Quote Style**: Single quotes for strings
- **Semicolons**: Required
- **Linter**: ESLint configured

## React Component Structure
```jsx
import React, { useState } from 'react';

// 1. Props type definition
interface ComponentProps {
  title: string;
  onClose?: () => void;
}

// 2. Component definition
export const Component = ({ title, onClose }: ComponentProps) => {
  // 3. State
  const [isOpen, setIsOpen] = useState(false);

  // 4. Effects
  useEffect(() => {}, []);

  // 5. Handlers
  const handleClick = () => {};

  // 6. Render
  return <div>{title}</div>;
};

export default Component;
```

## Naming Conventions
- Components: PascalCase (UserProfile, AgentCard)
- Files: PascalCase for components, camelCase for utils
- Functions: camelCase (getUserData, formatDate)
- Constants: UPPER_SNAKE_CASE (MAX_RETRIES)
- CSS classes: kebab-case (user-profile-card)

## Component Rules
- Functional components only (hooks)
- One component per file
- Props interface at top of file
- Custom hooks in `src/hooks/`
- Utilities in `src/lib/` or `src/utils/`

## State Management
- Local state: useState
- Form state: FormContext or custom hook
- Global state: Context API (no Redux for MVP)
- API data: React Query or custom hook

## Styling
- Tailwind CSS classes only
- No inline styles
- Use clsx for conditional classes
- CSS custom properties for theming

## Recent Changes
- (Auto-logged by sub-agent)

## Performance Notes
- (Auto-logged by sub-agent)

## Known Issues
- (Auto-logged by sub-agent)
