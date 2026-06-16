# Active Feature Plan — Endpoint Naming Standardization & Type Fixes

## Status: COMPLETE

## Tasks

### [IMPL] Standardize Endpoint Files & Variable Names
- [x] Rename `*.endpoints.ts` files to singular `*.endpoint.ts` in all features:
  - `src/features/auth/api/auth.endpoints.ts` -> `auth.endpoint.ts`
  - `src/features/employee/api/employee.endpoints.ts` -> `employee.endpoint.ts`
  - `src/features/leave/api/leave.endpoints.ts` -> `leave.endpoint.ts`
  - `src/features/notification/api/notification.endpoints.ts` -> `notification.endpoint.ts`
  - `src/features/pension/api/pension.endpoints.ts` -> `pension.endpoint.ts`
  - `src/features/salary/api/salary.endpoints.ts` -> `salary.endpoint.ts`
- [x] Rename exported endpoint variables to singular (e.g. `authEndpoint`, `employeeEndpoint`)
- [x] Update feature barrel exports (`index.ts` files) to reference the new singular filenames
- [x] Update `src/shared/api/index.ts` to import from the new filenames and export using singular feature keys (e.g., `employee` instead of `employees`)

### [IMPL] Convert Dynamic Endpoints from Strings to Functions
- [x] Update `employee.endpoint.ts`:
  - `details: (id: string) => \`/employees/\${id}\``
- [x] Update `leave.endpoint.ts`:
  - `list: (id: string) => \`/employees/\${id}/leave\``
  - `details: (id: string, leaveId: string) => \`/employees/\${id}/leave/\${leaveId}\``
- [x] Update `pension.endpoint.ts`:
  - `list: (id: string) => \`/employees/\${id}/pension\``
  - `details: (id: string, pensionId: string) => \`/employees/\${id}/pension/\${pensionId}\``
- [x] Update `salary.endpoint.ts`:
  - `list: (id: string) => \`/employees/\${id}/salary\``
  - `details: (id: string) => \`/salary/\${id}\``

### [IMPL] Fix Usages and Typings in Codebase
- [x] Update all references to `endpoints.employees` to `endpoints.employee`
- [x] Fix any compile/link issues in hook and screen files calling these endpoints
- [x] Resolve TypeScript error in `AuthFooter.tsx` (cast `linkHref` or set type to `any`)
- [x] Resolve TypeScript error in `CustomTabBar.tsx` (import `TabRouteT` from `@/src/shared/types/tab`)
- [x] Resolve TypeScript error in `FadeInView.tsx` (import/use `SharedValue` directly from `react-native-reanimated`)

### [TEST] Verify Compilation
- [x] Run `npx tsc --noEmit` to verify a successful clean compilation
- [x] Run `pnpm run lint` to confirm zero ESLint violations
