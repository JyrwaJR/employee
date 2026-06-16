# Implementation Plan: Remove Notification Registry & Standardize Barrel Exports

## Overview

Remove the over-engineered notification and toast mapping system (`src/shared/utils/notify.ts` and `src/shared/constants/notifications.ts`) and replace all usages with direct invocations of the `toast` utility from `src/shared/components/ui/toaster.tsx`. In addition, create and update barrel exports (`index.ts` or `index.tsx`) in all shared directories and subdirectories to adhere to project standards.

## Requirements

- Completely remove `src/shared/utils/notify.ts` and `src/shared/constants/notifications.ts`.
- Replace all occurrences of `notify()` in the codebase with direct call to `toast.success()` or `toast.error()`.
- Add missing barrel exports (`index.ts` or `index.tsx`) in all folders under `src/shared/` that lack them.
- Ensure all exported modules, constants, hooks, types, utilities, etc., are clean, complete, and properly exported from their directory's index files.

## Architecture Changes

- **Deleted files:**
  - `src/shared/utils/notify.ts`
  - `src/shared/constants/notifications.ts`
- **New barrel exports:**
  - `src/shared/components/index.ts`
  - `src/shared/components/auth/index.ts`
  - `src/shared/components/base/index.ts`
  - `src/shared/components/display/index.ts`
  - `src/shared/components/feedback/index.ts`
  - `src/shared/components/screens/index.ts`
  - `src/shared/hooks/index.ts`
  - `src/shared/providers/index.ts`
  - `src/shared/services/index.ts`
  - `src/shared/stores/index.ts`
  - `src/shared/types/index.ts`
  - `src/shared/validators/index.ts`
  - `src/shared/utils/index.ts`
- **Modified files:**
  - `src/features/auth/components/PhoneForm.tsx` (Use direct `toast`)
  - `src/features/auth/components/VerifyOtpForm.tsx` (Use direct `toast`)
  - `src/features/auth/hooks/useLoginMutation.ts` (Use direct `toast`)
  - `src/features/auth/hooks/useResetPassword.ts` (Use direct `toast`)
  - `src/features/auth/hooks/useSignUpMutation.ts` (Use direct `toast`)
  - `src/features/employee/hooks/useEmployees.ts` (Use direct `toast`)
  - `src/features/employee/screens/EmployeeDetails.tsx` (Use direct `toast`)
  - `src/features/employee/screens/EmployeeListScreen.tsx` (Use direct `toast`)
  - `src/features/salary/hooks/usePayslipData.ts` (Use direct `toast`)
  - `src/features/salary/screens/SalaryStatementsScreen.tsx` (Use direct `toast`)
  - `src/shared/hooks/useNotifications.ts` (Use direct `toast`)
  - `src/shared/providers/AuthProvider.tsx` (Use direct `toast`)
  - `src/shared/types/api.ts` (Remove comment reference to notify utility)
  - `src/shared/constants/index.ts` (Properly export all constants, remove notifications)
  - `src/shared/components/layout/index.ts` (Add `ScreenHeader` export)

## Implementation Steps

### Phase 1: Update code to use direct toast (12 files)

1. **Update PhoneForm** (File: `src/features/auth/components/PhoneForm.tsx`)
   - Action: Replace `notify` with `toast.success` and `toast.error`.
2. **Update VerifyOtpForm** (File: `src/features/auth/components/VerifyOtpForm.tsx`)
   - Action: Replace `notify` with `toast.success` and `toast.error`.
3. **Update useLoginMutation** (File: `src/features/auth/hooks/useLoginMutation.ts`)
   - Action: Replace `notify` with `toast.success` and `toast.error`.
4. **Update useResetPassword** (File: `src/features/auth/hooks/useResetPassword.ts`)
   - Action: Replace `notify` with `toast.success` and `toast.error`.
5. **Update useSignUpMutation** (File: `src/features/auth/hooks/useSignUpMutation.ts`)
   - Action: Replace `notify` with `toast.success` and `toast.error`.
6. **Update useEmployees** (File: `src/features/employee/hooks/useEmployees.ts`)
   - Action: Replace `notify` with `toast.error`.
7. **Update EmployeeDetails** (File: `src/features/employee/screens/EmployeeDetails.tsx`)
   - Action: Replace `notify` with `toast.error`.
8. **Update EmployeeListScreen** (File: `src/features/employee/screens/EmployeeListScreen.tsx`)
   - Action: Replace `notify` with `toast.error`.
9. **Update usePayslipData** (File: `src/features/salary/hooks/usePayslipData.ts`)
   - Action: Replace `notify` with `toast.error`.
10. **Update SalaryStatementsScreen** (File: `src/features/salary/screens/SalaryStatementsScreen.tsx`)
    - Action: Replace `notify` with `toast.error`.
11. **Update useNotifications** (File: `src/shared/hooks/useNotifications.ts`)
    - Action: Replace `notify` with `toast.success`.
12. **Update AuthProvider** (File: `src/shared/providers/AuthProvider.tsx`)
    - Action: Replace `notify` with `toast.success` and `toast.error`.
13. **Update api.ts** (File: `src/shared/types/api.ts`)
    - Action: Remove JSDoc comment reference to notify.

### Phase 2: Delete Old Files & Update Constants (3 files)

14. **Delete notify.ts and notifications.ts**
    - Action: Delete `src/shared/utils/notify.ts` and `src/shared/constants/notifications.ts`.
15. **Update constants/index.ts** (File: `src/shared/constants/index.ts`)
    - Action: Export all constants files (routes, regex, endpoints, query-keys, auth) and remove any references to notifications.

### Phase 3: Create Barrel Exports for all subdirectories (14 files)

16. **Shared components subdirectories**
    - Action: Create `index.ts` files for `auth`, `base`, `display`, `feedback`, `screens` subdirectories under `src/shared/components`.
    - Action: Add `ScreenHeader` export to `src/shared/components/layout/index.ts`.
    - Action: Create a top-level `src/shared/components/index.ts` that exports all of these subdirectories.
17. **Shared hooks subdirectory**
    - Action: Create `src/shared/hooks/index.ts` exporting all custom hooks.
18. **Shared providers subdirectory**
    - Action: Create `src/shared/providers/index.ts` exporting all providers.
19. **Shared services subdirectory**
    - Action: Create `src/shared/services/index.ts` exporting all services.
20. **Shared stores subdirectory**
    - Action: Create `src/shared/stores/index.ts` exporting all stores.
21. **Shared types subdirectory**
    - Action: Create `src/shared/types/index.ts` exporting all types.
22. **Shared validators subdirectory**
    - Action: Create `src/shared/validators/index.ts` exporting all validators (e.g. common.ts, token subdirectory).
23. **Shared utils subdirectory**
    - Action: Create `src/shared/utils/index.ts` exporting all utilities (connected, getStatusColor, cn, text, http, api, retry, url, logger, reactQuery).

### Phase 4: Validation & Quality Control

24. **Run TypeScript Check & Lint**
    - Action: Execute `npx tsc --noEmit` and `pnpm run lint` to verify that there are no type errors or lint warnings.

## Testing Strategy

- Code compilation check: `npx tsc --noEmit`
- Linter checks: `pnpm run lint`

## Risks & Mitigations

- **Risk**: Missing imports or circular dependencies created by new barrel exports.
  - **Mitigation**: Run compiler validation immediately after adding barrel exports and check for dependency cycles. Ensure imports inside the shared folder itself are not imported through the barrel itself to avoid circular issues.

## Success Criteria

- [x] All occurrences of `notify()` removed.
- [x] Direct `toast` notifications display correct titles/descriptions.
- [x] `src/shared/utils/notify.ts` and `src/shared/constants/notifications.ts` deleted.
- [x] Every shared subdirectory contains a barrel export.
- [x] Project compiles cleanly without type or lint errors.
