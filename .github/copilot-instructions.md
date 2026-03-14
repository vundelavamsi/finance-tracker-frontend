# Copilot Instructions

## Build, test, and lint commands

- Install dependencies with `npm install`.
- Start the dev server with `npm run dev`. Vite serves the app on port `3000` and proxies `/api` requests to the backend configured in `vite.config.ts`.
- Create a production build with `npm run build`.
- Preview the production build with `npm run preview`.
- There is currently no `test` script, no single-test command, and no `lint` script in `package.json`. `npm run build` is the main validation command available in this repository.

## High-level architecture

- This is a Vite + React + TypeScript single-page app for a finance tracker. `src/main.tsx` mounts the app inside a shared MUI theme from `src/theme.ts`, then `src/App.tsx` defines the full route tree.
- Routing is split between public pages (`/`, `/login`, `/register`, `/auth/verify`) and authenticated pages nested under `/app`. Authenticated pages render through `components/Layout/Layout.tsx`, which provides the persistent `Sidebar`, `Header`, and an `Outlet` for child pages.
- Authentication is centered in `src/contexts/AuthContext.tsx`. It hydrates the session from the token stored by `src/services/api.ts`, exposes login/register/Telegram helpers, and refreshes the current user with `authService.getMe()`.
- `src/services/api.ts` is the shared Axios client. It reads `VITE_API_URL` when present, otherwise uses `/api`, attaches the bearer token from local storage on every request, and clears auth plus redirects to `/login` on `401` responses.
- Most business logic is page-local. Pages in `src/pages/` load their own data, track `loading` and `error` state locally, and call thin service wrappers from `src/services/` for backend access. The service layer usually just issues the request and returns `response.data` with typed models from `src/types/`.
- The dashboard (`src/pages/Dashboard.tsx`) is read-only and builds charts/cards from the aggregated `/dashboard/stats` response. CRUD-heavy pages like `Transactions.tsx` and `Settings.tsx` fetch multiple resources in parallel and then re-run a local `loadData()` function after mutations instead of using a shared cache library.

## Key conventions

- When adding a new authenticated page, update all three places together: the nested `/app` routes in `src/App.tsx`, the sidebar navigation in `src/components/Layout/Sidebar.tsx`, and the page-title map in `src/components/Layout/Header.tsx`.
- Use `getStoredToken()` and `setStoredToken()` from `src/services/api.ts` for session persistence. Do not introduce separate local-storage keys or bypass the shared Axios/auth flow.
- Telegram login is a first-class auth path. Keep `/auth/verify?token=...` working through `src/pages/VerifyAuth.tsx`, and use `VITE_TELEGRAM_BOT_USERNAME` when working on the Telegram widget flow in `src/pages/UserProfile.tsx`.
- Transaction amounts follow a signed-value convention: expenses are stored as negative numbers and incomes as positive numbers. `src/pages/Transactions.tsx` converts the entered absolute amount into the signed backend payload based on `transaction_type`.
- Expense categories can be hierarchical. `Settings.tsx` treats top-level expense categories separately from optional sub-categories, and the backend contract uses `include_children` plus `parent_id` to model that tree.
- Forms that already use `react-hook-form` + `zod` should keep validation in the schema and send normalized values to the service layer. Existing pages commonly convert empty strings to `null`/`undefined` before submission.
- Prefer the shared MUI theme and exported `themeColors` from `src/theme.ts` when extending UI. Existing pages still include some inline `sx` styling, but the palette, typography, card, button, and table defaults are centralized there.
- Re-fetch after writes instead of hand-editing multiple slices of local state unless the page already follows a narrower local update pattern. Existing CRUD pages typically call `loadData()`, `loadMerchants()`, or `refreshUser()` after successful mutations.
