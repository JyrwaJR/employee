# 🚀 Workflow: Create Feature

## 🕹️ Trigger

-   `plans/active_feature_plan.md` task tagged `[IMPL]` or `[CREATE]`
-   New feature specification available in `prd/features/`

## 🛠️ Execution Protocol

1.  **Orient**: Confirm feature name and path against `src/app/` (Expo Router).
2.  **Scaffold structure**:
    -   `api/`: Features-specific React Query/Axios hooks.
    -   `components/`: UI specific to this feature.
    -   `hooks/`: Shared logic for feature screens.
    -   `store/`: Local state management (Zustand).
    -   `validators/`: Mandatory **Zod** schema logic (Rule §11: A03).
    -   **`index.ts`**: **The Gateway.** Only export what is necessary.
3.  **Validate**: Write Zod schemas first based on PRD requirements.
4.  **Register**: Define routes and layouts in `src/app/[feature-name]`.
5.  **Review**: Run `pnpm lint` and `tsc` to verify modular integrity.

## 🛡️ Senior Mandate & Laws

-   [ ] [SEC] Verify no cross-feature imports (must use feature's shared gateway).
-   [ ] [SEC] Ensure all sensitive input is validated in `validators/`.
-   [ ] [ARCHITECTURE] No direct shared/ imports if feature-specific hook exists.

## 🧠 Output

-   `[IMPL]` Fully scaffolded, type-safe feature module.
-   `Log to memory.md`: Modular construction `COMPLETE`.
