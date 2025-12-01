# GitHub Copilot Instructions for `mkulima-express`

## High-level Architecture
- **Single-page React app** bootstrapped with **Vite**; entry is `index.tsx`, main UI and routing are in `App.tsx`.
- **State & data flow** are managed via React context providers:
  - Legacy in `App.tsx`: inline `DataProvider`, `AuthProvider`, `NotificationProvider` with local `api.ts` helpers.
  - New, canonical data layer in `contexts/DataContext.tsx` using `supabaseHelpers.ts` + `supabaseClient.ts` (Supabase backend).
- **Domain types** live in `types.ts` and should be treated as the single source of truth for `User`, `Produce`, `Contract`, `Transaction`, `Message`, enums, etc.
- Supabase backend schema and RLS behavior are defined in `supabase-schema.sql` and described in `BACKEND_INTEGRATION.md` / `README_SUPABASE.md`.

## Where to Add or Edit Features
- **New UI screens / flows**: Prefer creating small components under `components/` and clean screen-level containers in `App.tsx` (or split into `src/` later). Keep JSX presentational and delegate data mutations to context hooks.
- **Data & business logic**:
  - For anything that hits the database, use `contexts/DataContext.tsx` + `supabaseHelpers.ts`.
  - Add new high-level operations (e.g., escrow actions, contract lifecycle) as **methods on the DataContext** that orchestrate multiple `dbOperations.*` calls and wallet/transaction updates.
- **Supabase access**:
  - Use `supabaseHelpers.ts` functions (`dbOperations`, `sendOTP`, `verifyOTP`, `initAuthSession`, `subscribeToMessages`, `subscribeToAuthChanges`).
  - Do **not** call `supabase` directly from UI components unless extending `supabaseHelpers.ts` first.

## Data & Supabase Conventions
- **CamelCase in TS, snake_case in DB**:
  - All TypeScript interfaces & enums are camelCase (`walletBalance`, `pricePerKg`).
  - The DB uses snake_case (`wallet_balance`, `price_per_kg`).
  - Always use `toCamelCase` / `toSnakeCase` via `supabaseHelpers.ts` when adding or updating DB operations.
- **Contract status history**:
  - `Contract.status` is an enum in `types.ts`; `statusHistory` holds an ordered array of `{ status, timestamp }`.
  - When you change a status, **append** to `statusHistory` using the helper pattern in `contexts/DataContext.tsx` (`pushStatus`, `updateContractWithHistory`) so history and `status_history` JSONB stay in sync.
- **Wallet & escrow accounting**:
  - All balance changes go through `DataContext` helpers (`updateWalletBalance`, `recordTransaction`, and the escrow lifecycle methods like `proposeContract`, `acceptContract`, `rejectContract`, `confirmDelivery`, `releaseEscrow`, `finalizeContract`, `disputeContract`).
  - Never mutate `walletBalance` directly in components; call the appropriate context method to ensure `transactions` are created and RLS-safe writes happen.

## Auth and User Profiles
- Authentication is handled via Supabase (OTP or email/password depending on flow). The canonical helpers are in `supabaseHelpers.ts` (`sendOTP`, `verifyOTP`, `initAuthSession`, `subscribeToAuthChanges`).
- `AuthContext` (in `App.tsx`) currently mixes Supabase usage and local `api.ts`. When adding new auth-related behavior, prefer reusing `supabaseHelpers.ts` patterns and keep side effects (session/profile updates) inside the context.
- User records in Supabase must respect RLS:
  - Inserts must use `auth.uid()` as `users.id`; see `dbOperations.createUser` for the allowed payload.
  - Updates should go through `dbOperations.updateUser` so RLS policies apply and fields are correctly snake_cased.

## Realtime & Messaging
- Realtime chat for contracts is implemented by subscribing to `messages`:
  - Use `subscribeToMessages` in `supabaseHelpers.ts` to react to `INSERT` events and merge new messages into context state without duplicates.
  - UI message flows (e.g., `ContractDetailScreen` chat) should call `DataContext.addMessage`, which wraps `dbOperations.createMessage` and handles optimistic updates + deduplication.

## Build, Run, and Testing
- To run locally, from the repo root:
  - `npm install`
  - `npm run dev`
- The production build is `npm run build`; fix TS/React issues so this passes.
- Supabase connectivity can be verified via `testSupabase.ts` as described in `BACKEND_INTEGRATION.md` / `QUICKSTART.md`.

## Patterns & Gotchas for AI Agents
- **Do not hard-code Supabase keys**: `supabaseClient.ts` currently contains an anon key; if changing this, read from environment (e.g., `import.meta.env`) and keep secrets out of source.
- **Avoid duplicating business logic**:
  - `App.tsx` contains older in-memory implementations of features now backed by Supabase via `contexts/DataContext.tsx`.
  - When extending features like contracts, wallet, or disputes, prefer updating the **Supabase-backed `DataContext`** and gradually aligning UI to use it rather than copying the in-memory patterns.
- **Respect RLS expectations**:
  - For write operations, make sure the current authed user is the logical actor (e.g., only contract parties can change `contracts`, only owners can change their `produce`). The helpers already enforce many of these constraints—reuse them.
- **Keep types in sync**:
  - If you add fields to domain objects, update `types.ts`, `supabase-schema.sql`, and any relevant `dbOperations.*` mappers together.
  - Ensure new enums or status values are reflected wherever `ContractStatus` or `TransactionType` are used in UI filters, timelines, and badges.

## When in Doubt
- Check these files first for examples:
  - `contexts/DataContext.tsx` – canonical pattern for orchestrating Supabase operations, wallet/escrow logic, and status history.
  - `supabaseHelpers.ts` – DB access layer, camel/snake conversion, auth + realtime helpers.
  - `App.tsx` – current routing and UI screens for contracts, produce, wallet, profile.
  - `BACKEND_INTEGRATION.md` / `QUICKSTART.md` – architecture overview and setup.
- Prefer small, incremental changes that plug into these existing layers instead of inventing new parallel patterns.