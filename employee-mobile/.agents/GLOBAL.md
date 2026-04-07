@import "~/.gemini/GEMINI.md"

# 🏗️ Project Architecture: Employee Mobile (Feature-First)

## 📁 Directory Contract & Mapping

The agent MUST follow this map for all file creation. Forbidden to deviate without user approval.

### 🛠️ The Cognitive Layer (.agents/)

- **docs/**: [Documentation] All documentation, brainstorm.
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

## 🧠 Agent Cognitive Protocol & Behavior

### 🔍 Pre-Task Validation & Research

- **95% Confidence Threshold**: Only proceed with a task if there is a minimum of **95% confidence** in the solution's accuracy and alignment with the PRD.
- **Mandatory Context Retrieval**: Before execution, the agent must:
  - **Search Agent Memory**: Review `.agents/memory/` or agentic memory mcp for historical context, previous "Dreaming" logs, or session continuity.
  - **Search the Web**: Gather the latest documentation and best practices for the relevant tech stack (Next.js, Expo, Zod, etc.) to ensure a high success rate.
- **Clarification First**: If confidence is below 95%, the agent must pause and ask clarifying questions regarding the file, topic, or specific logic.
- **Open Discussion**: Every file and logic choice is open to question and debate to ensure the best possible technical outcome.
- **Memory**: The agent must **always search the memory for information or clarifications** before proceeding with a task.
- **Thinking Out Loud**: The agent must **always perform a sequencial thinking** out loud to ensure a clear understanding of the task.
- **Plan Artifact**: The agent must **always produce a plan artifact** before proceeding with a task.
- **Multi Agents**: Multiple agents can work on the same task concurrently on every task there should also include agent for review code and security check.

### 🤝 Human-in-the-Loop (HITL) Gate

- **Explicit Approval Required**: The agent must always wait for **human approval** before proceeding with any file write or deployment task.
- **Strategic Planning**: Provide a detailed plan of action for review before implementation begins.

### 📝 Post-Task Reflection & Persistence

- **Memory Synthesis**: Once a task is completed, the agent must reflect on the process and append findings to the **Agent Memory** (`.agents/memory/`).
- **Content of Reflection**: Include what was solved, any deviations from the plan, and potential improvements for future tasks.

### 💡 Collaborative Mindset

- **Proactive Innovation**: Agents are not just executors; they are open to new ideas and must suggest new features or architectural improvements.
- **Open Discussion**: Every file and logic choice is open to question and debate to ensure the best possible technical outcome.

## 🛡️ Security & Quality Mandates

Every `write_file` operation and Plan Artifact must comply with these protocols:

1. **Strict Mode Gate**: [MANDATORY] Any task tagged `[SEC]` or `[RELEASE]` must use **Strict Mode**. This requires a `request_feedback = true` flag on all implementation plans and security review artifacts.
2. **Zero-Knowledge Principle**: No PII in logs; use `expo-secure-store` for tokens.
3. **Network Security**: Enforce HTTPS and **Public Key Pinning (SPKI)** for `*`. Use stable SPKI hashes in `src/shared/api/` to survive 90-day certificate rotations.
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
