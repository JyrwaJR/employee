@import "~/.gemini/GEMINI.md"

# 🏗️ Project Architecture: Employee Mobile (Feature-First)

## 📁 Directory Contract & Mapping

The agent MUST follow this map for all file creation. Forbidden to deviate without user approval.

### 🛠️ The Cognitive Layer (.agents/)

- **prd/**: [Source of Truth] All feature requirements and core visions.
- **rules/common/**: [Mandatory] Security, coding standards, and orchestration laws.
- **plans/**: [Execution] Step-by-step implementation strategies and task logs.
- **workflows/**: [Automation] Scripts for migrations, deployments, and audits.
- **memory/**: [Persistence] Append-only logs for agent "Dreaming" and session continuity.

### 🚀 The Source Layer (src/)

- **app/**: [Expo Router] Maps directly to feature domains.
  - `(group)/[feature]`: Logical grouping (e.g., `(admin)/dashboard`).
  - `auth/`: Dedicated authentication flow.
- **features/[feature-name]/**: [Bounded Contexts] Self-contained modules.
  - `api/`: Feature-specific React Query/Axios hooks.
  - `components/`: UI specific to this feature only.
  - `hooks/`: Logic used across this feature's screens.
  - `store/`: Local state management (Zustand/Slices).
  - `index.ts`: **The Gateway.** Only export what is necessary for other features.
- **shared/**: [Global Infrastructure] Reusable by 3+ features.
  - `api/`: Centralized client config (SSL Pinning, Interceptors).
  - `providers/`: Global context wrappers (Theme, Auth, QueryClient).
  - `utils/`: Common helpers (e.g., `crypto.ts`, `validation.ts`).

### 🧪 Validation & Testing (maestro/)

- **flows/**: E2E test flows for critical paths.
- **fixtures/**: Mock data for consistent testing.

---

## 🛡️ Security & Quality Mandates

Every `write_file` operation and Plan Artifact must comply with these protocols:

1. **Strict Mode Gate**: [MANDATORY] Any task tagged `[SEC]` or `[RELEASE]` must use **Strict Mode**. This requires a `request_feedback = true` flag on all implementation plans and security review artifacts.
2. **Zero-Knowledge Principle**: No PII in logs; use `expo-secure-store` for tokens.
3. **Network Security**: Enforce HTTPS and **Public Key Pinning (SPKI)** for `employee-nic.vercel.app`. Use stable SPKI hashes in `src/shared/api/` to survive 90-day certificate rotations.
4. **Validation**: All API and User Input must be wrapped in **Zod** schemas in `validators/`.
5. **Architecture Integrity**: No cross-feature imports except via the feature's `index.ts` gateway.

---

## ⚙️ Agentic Workflows & Scripts

| Command           | Trigger Event        | Agent Action                                         |
| :---------------- | :------------------- | :--------------------------------------------------- |
| `pnpm lint`       | After `write_file`   | Fix all linting/formatting errors before completion. |
| `pnpm test`       | After major refactor | Run `tsc --noEmit` to verify type safety.            |
| `/security-audit` | Manual / Weekly      | Scan for hardcoded keys and unencrypted storage.     |
| `/strict-release` | Before EAS Build     | Activate **Strict Mode Gate** and run full audit.    |
