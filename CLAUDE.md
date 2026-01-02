# Line Length Guessing Game

## Project Overview

Line-length guessing game where users estimate the length of a displayed line in inches (1/8" increments). Users get 4 guesses with proximity feedback (hot/cold emojis). Features screen calibration for accurate physical measurements and responsive design adapting to mobile/tablet/desktop.

Solo hobby project deployed on Vercel.

## Tech Stack & Dependencies

- **Core**: React 19, TypeScript, React Router 7
- **Build**: Create React App (not ejected), npm
- **Scripts**: See `package.json` for all available scripts
- **UI Libraries**:
  - @headlessui/react - Modal component (accessibility-focused)
  - react-confetti - Win celebration
- **Validation**: Zod - Type-safe input validation
- **Analytics**: @vercel/analytics
- **Deployment**: Vercel
- **Philosophy**: Minimal dependencies, but don't reinvent the wheel

## Design Philosophy & Principles

- Simple, best practice approach
- Modern but not bleeding edge
- Ease of extensibility is a primary focus
- Solo hobby project - pragmatic over perfect
- Abstraction where it adds value (e.g., analytics pattern)

## Project Structure

NOTE: illustrative only, these are not all the files/directories in the repo

```
src/
├── components/     # Reusable UI components
│   ├── LineComponent.tsx
│   └── GameOverModal.tsx
├── pages/         # Route-level page components
│   ├── GamePage.tsx
│   └── CalibrationPage.tsx
├── hooks/         # Custom React hooks
│   └── useCalibration.ts
├── lib/           # Core business logic and "features"
│   ├── Line.ts
│   ├── analytics.ts
│   └── config.ts
├── utils/         # Utility functions
│   ├── fractionalInches.ts
│   └── screenDetection.ts
└── *.css          # Component-level CSS files (co-located)
```

## Key Architectural Patterns

### Analytics Abstraction (`src/lib/analytics.ts`)

- Decouples from Vercel Analytics for provider flexibility
- Type-safe events via enum + mapped types
- Singleton pattern
- **Apply this pattern to other external dependencies**

### Precise Measurement (`src/lib/Line.ts`)

- Internal storage in eighths (integers) to avoid floating-point errors
- Exposes decimal API
- Critical for accurate game logic

### Calibration System (`src/hooks/useCalibration.ts`, `src/pages/CalibrationPage.tsx`)

- User-calibrated screen PPI stored in localStorage
- Validation: 15-300 PPI range
- Fallback: 96 DPI web standard

### Responsive Max Length (`src/utils/screenDetection.ts`)

- Adapts game difficulty to screen size
- Breakpoints: <768px = 2", <1024px = 4", ≥1024px = 6"

## Configuration & Constants (`src/lib/config.ts`)

- INCH_INCREMENT: 8 (1/8"), designed for future 1/16" support
- MAX_GUESSES: 4
- DEFAULT_PPI: 96
- STORAGE_KEY: localStorage key for calibration
- **All game constants centralized here**

## Styling

- Component-level CSS files co-located with components
- No CSS-in-JS, no preprocessors
- Simple, maintainable

## Routing

- `/` - GamePage
- `/calibrate` - CalibrationPage
- React Router 7, no nested routes

## State Management

- React hooks (useState, useEffect)
- Custom hooks for reusable logic (`useCalibration`)
- localStorage for calibration persistence only
- No global state library

## Development & Deployment

- `npm start` - Dev server
- `npm test` - Test runner
- `npm run build` - Production build
- Vercel deployment (git-connected)
- React Testing Library + Jest

## Code Style

- Use ES modules (import/export), not CommonJS (require)
- Destructure imports when possible (e.g., `import { foo } from 'bar'`)
