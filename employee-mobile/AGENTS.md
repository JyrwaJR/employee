# Repository Guidelines

## Project Structure & Module Organization
Application routes live in `src/app/` and follow Expo Router conventions such as `index.tsx`, `_layout.tsx`, and dynamic segments like `[id]`. Feature code is grouped under `src/features/` by domain (`auth`, `employee`, `leave`, `salary`, `pension`, `settings`). Shared UI, hooks, stores, providers, constants, and utilities live in `src/shared/`. Static assets are in `src/assets/`. End-to-end mobile flows are kept as YAML files in `meastro/`, and project notes live in `notes/`.

Use TypeScript path aliases from `tsconfig.json` where possible: `@features/*`, `@shared/*`, `@assets/*`, `@components/*`, `@utils/*`, and `@types/*`.

## Build, Test, and Development Commands
Install dependencies with `pnpm install`.

- `pnpm dev`: start Expo in development mode and clear cache.
- `pnpm android`: run the development build on Android.
- `pnpm ios`: run the development build on iOS.
- `pnpm web`: start the web target.
- `pnpm lint`: run ESLint and Prettier checks.
- `pnpm format`: apply ESLint fixes and Prettier formatting.
- `pnpm build:preview`: create an EAS preview build.
- `pnpm build:dev`: create a local Android development build.

## Coding Style & Naming Conventions
This repo uses TypeScript with `strict` mode enabled. Follow Prettier defaults from `prettier.config.js`: 2-space indentation, `printWidth: 100`, single quotes, and trailing commas where valid in ES5. Tailwind class ordering is handled by `prettier-plugin-tailwindcss`.

Name React components and screens in PascalCase (`ProfileScreen.tsx`, `EmployeeListItem.tsx`). Keep hooks in `use-*.ts` or `use*.ts`, stores in `*.store.ts`, services in `*.service.ts`, and schemas in `*.schema.ts`.

## Testing Guidelines
There is no unit-test runner configured in `package.json` yet. Treat `pnpm lint` as the minimum required validation before opening a PR. For flow testing, keep YAML scenarios in `meastro/` focused and task-based, for example `meastro/auth/login.yaml` and `meastro/tabs/navigation.yaml`.

## Commit & Pull Request Guidelines
Recent history shows short, imperative commit subjects, sometimes with prefixes like `refactor:`. Prefer clearer messages such as `feat: add employee salary details screen` or `fix: handle expired auth token`.

PRs should include a concise summary, linked issue or ticket, testing notes (`pnpm lint`, device checks, Maestro flow run), and screenshots or recordings for UI changes. Call out config changes in `app.config.ts`, `eas.json`, or network/security code explicitly.

## Security & Configuration Tips
Do not commit secrets or environment-specific values. Review changes touching `src/shared/config/network.ts`, `src/shared/providers/SSLPinningProvider.tsx`, auth flows, and push notification registration with extra care.
