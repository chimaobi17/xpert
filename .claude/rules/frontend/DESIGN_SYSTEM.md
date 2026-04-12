# Frontend Design System & Rules

## Design Language
- **Theme**: GREEN (#22c55e) and WHITE
- **Mode Support**: Light / Dark / System
- **Framework**: React 19 + Vite 6 + Tailwind CSS 3.4
- **Styling**: Tailwind + CSS custom properties (no inline styles)

## Component Standards
- Functional components only (hooks)
- One component per file
- Props interface defined at top
- PropTypes or TypeScript for validation
- Reusable components in `src/components/ui/`

## Layout Rules
- Mobile-first responsive design
- Min touch target: 44px × 44px
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Glassmorphism on modals: `backdrop-blur-md` + semi-transparent bg

## Color Palette
```css
--primary: #22c55e (Green)
--secondary: #f3f4f6 (Light gray)
--accent: #3b82f6 (Blue)
--danger: #ef4444 (Red)
--warning: #f59e0b (Amber)
```

## Component Inventory
- [ ] Button
- [ ] Input
- [ ] Modal
- [ ] Dropdown
- [ ] Card
- [ ] Form
- [ ] Navbar
- (Auto-logged by sub-agent)

## Recent Changes
- (Auto-logged by sub-agent)

## Performance Notes
- (Auto-logged by sub-agent)

## Known Issues
- (Auto-logged by sub-agent)
