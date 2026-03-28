# Frontend Rules

Applies to: `frontend/src/**/*.tsx`, `frontend/src/**/*.ts`

## Component Conventions

- Use functional components with hooks only — no class components
- One component per file. Filename matches component name exactly.
- Props interfaces defined at top of file, named `[ComponentName]Props`
- Use `const` arrow functions: `const LogViewer = ({ logs }: LogViewerProps) => {}`

## The Toggle — Most Important UI Element

- `LogViewer.tsx` holds the Dev/CEO toggle state at the top level
- Toggle state: `type ViewMode = 'developer' | 'ceo'`
- Default view on load: `'developer'`
- Toggle animation: smooth CSS transition, 300ms — make it feel satisfying to click
- Both views must render from the same data object — never fetch separately per mode

## Styling

- Tailwind CSS utility classes only — no custom CSS files except `globals.css`
- Color system: use Tailwind's `slate` for developer view, `indigo` for CEO view
- `severity` badge colors: `critical → red-600`, `high → orange-500`, `medium → yellow-500`, `low → green-500`
- Responsive: design mobile-first, but the primary demo target is 1280px+ desktop

## State Management

- Local `useState` for UI state (toggle, loading, error)
- No external state library for MVP — keep it simple
- Log results stored in parent component, passed down as props

## API Calls

- All API calls in `src/api/logtalk.ts` — never inline fetch in components
- Use `async/await` with try/catch — never `.then().catch()` chains
- Show loading skeleton (not spinner) while AI is processing — it feels faster

## TypeScript

- Strict mode enabled — never use `any`
- Define the full `LogAnalysis` interface matching backend JSON schema
- All API response types defined in `src/types/index.ts`

## Key Components (build in this order)

1. `LogInput.tsx` — paste textarea + file upload
2. `LogViewer.tsx` — container with toggle
3. `DeveloperView.tsx` — technical details panel
4. `CeoView.tsx` — business impact panel  
5. `ImpactCard.tsx` — revenue/users affected hero stat
6. `SeverityBadge.tsx` — reusable severity indicator
