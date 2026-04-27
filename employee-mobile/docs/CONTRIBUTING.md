# Contributing Guide

Welcome to the Employee Mobile project! We appreciate your contributions.

## Development Setup

1. **Clone the Repo**
2. **Install Dependencies**: `pnpm install`
3. **Environment Setup**: Copy variables from `docs/ENV.md` to a local `.env` file.
4. **Start Development**: `pnpm dev`

## Branching Strategy

- **main**: Production-ready code.
- **feature/***: New features.
- **bugfix/***: Bug fixes.
- **hotfix/***: Urgent production fixes.

## Coding Standards

- **TypeScript**: Strict mode enabled. Always define types/interfaces.
- **Components**: Functional components with hooks.
- **Styling**: Use NativeWind (Tailwind CSS) utility classes.
- **Formatting**: Run `pnpm format` before every commit.
- **Linting**: Ensure `pnpm lint` passes.

## Feature Architecture

We follow a feature-sliced architecture in `src/features/`. Each feature should ideally contain:
- `api/`: API services and hooks.
- `components/`: UI components specific to the feature.
- `store/`: Local state management.
- `types/`: Type definitions.
- `utils/`: Helper functions.

## Pull Request Process

1. Create a branch from `main`.
2. Implement your changes.
3. Add/Update tests if applicable (E2E with Maestro).
4. Run `pnpm lint` and `pnpm format`.
5. Submit a PR and wait for review.

## E2E Testing with Maestro

Maestro flows are located in the `maestro/` directory.

```bash
# Run all flows
maestro test maestro/
```
