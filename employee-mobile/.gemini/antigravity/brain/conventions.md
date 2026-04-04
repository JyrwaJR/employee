# Project Conventions & Guidelines

**Last Updated:** 2026-04-04

---

## Project Structure & Module Organization
- **App Routes:** `src/app/` following Expo Router conventions (`index.tsx`, `_layout.tsx`, dynamic segments `[id]`).
- **Features:** Grouped under `src/features/` by domain (`auth`, `employee`, `leave`, `salary`, `pension`, `settings`).
- **Shared:** UI, hooks, stores, providers, constants, and utilities in `src/shared/`.
- **Assets:** Static assets in `src/assets/`.
- **E2E/Maestro:** YAML flows in `meastro/`.
- **Notes:** Project notes in `notes/`.
- **Aliases:** Use TypeScript path aliases: `@features/*`, `@shared/*`, `@assets/*`, `@components/*`, `@utils/*`, `@types/*`.

## Build, Test, and Development Commands
- `pnpm install`: Install dependencies.
- `pnpm dev`: start Expo in development mode and clear cache.
- `pnpm android`: run the development build on Android.
- `pnpm ios`: run the development build on iOS.
- `pnpm web`: start the web target.
- `pnpm lint`: run ESLint and Prettier checks.
- `pnpm format`: apply ESLint fixes and Prettier formatting.
- `pnpm build:preview`: create an EAS preview build.
- `pnpm build:dev`: create a local Android development build.

## Coding Style & Naming Conventions
- **Language:** TypeScript with `strict` mode enabled.
- **Formatting:** Prettier (2-space, single quotes, 100 printWidth, trailing commas).
- **Tailwind:** Class ordering by `prettier-plugin-tailwindcss`.
- **Naming:** 
  - React components/screens: PascalCase (`ProfileScreen.tsx`).
  - Hooks: `use-*.ts` or `use*.ts`.
  - Stores: `*.store.ts`.
  - Services: `*.service.ts`.
  - Schemas: `*.schema.ts`.

## Testing Guidelines
- **Unit Testing:** None configured yet in `package.json`.
- **Minimum Validation:** `pnpm lint`.
- **Flow Testing:** Maestro YAML scenarios in `meastro/` (e.g., `login.yaml`, `navigation.yaml`).

## Commit & Pull Request Guidelines
- **Commits:** Short, imperative subjects (e.g., `refactor:`, `feat: add salary details`).
- **PRs:** Include summary, linked issue, testing notes, and screenshots/recordings for UI changes. Call out config changes in `app.config.ts`, `eas.json`, or network/security code.

## Security & Configuration Tips
- No secrets in commits.
- Review changes to `src/shared/config/network.ts`, `src/shared/providers/SSLPinningProvider.tsx`, and auth flows with extra care.
