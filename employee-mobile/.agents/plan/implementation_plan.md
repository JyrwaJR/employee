# Implementation Plan: Expo OTA Updates Provider & Prompt

**Status:** ACTIVE  
**Goal:** Implement a production-ready Over-The-Air (OTA) update system using `expo-updates`. The system will proactively check for updates, manage download states, gracefully handle errors, and prompt the user with an "Update Now" or "Remind Me Later" modal.

---

## Production Readiness Requirements

To ensure this implementation is production-ready, it must adhere to the following standards:

- **Environment Checks:** OTA update checks must be disabled in local development to prevent disruptions.
- **Error Handling:** Robust try-catch blocks around all `expo-updates` API calls. Silent degradation if the update servers are unreachable.
- **State Persistence:** The "Remind Me Later" selection should be persisted using `AsyncStorage` with a TTL (Time-to-Live) so the user is prompted again after a reasonable period (e.g., 24 hours) or upon next cold boot.
- **Security:** Ensure update logs do not leak any PII or sensitive environment variables.
- **UX/UI:** The modal must be non-blocking initially but clearly visible, matching the app's design system (NativeWind).
- **Offline Behavior:** Fail silently and retry on next launch, preventing any blocking of the user.

---

## Proposed Changes

### 1. Core Logic: Updates Provider

Responsible for monitoring `expo-updates` events and managing global update state.

**File:** `src/shared/providers/UpdatesProvider.tsx`

- **Logic:**
  - Use `expo-updates` API (`Updates.checkForUpdateAsync`, `Updates.fetchUpdateAsync`)
  - Manage state: `isUpdateAvailable`, `isDownloading`, `updateError`, `isUpdateReady`
  - Provide context functions: `checkAndDownloadUpdate`, `runUpdate`, `postponeUpdate`
  - **Resilience:** Handle network failures silently and gracefully (Offline Fallback)

---

### 2. UI: Update Prompt Modal

A polished, user-friendly modal using NativeWind.

**File:** `src/shared/components/display/UpdateModal.tsx`

- **Logic:**
  - Consumes `UpdatesProvider` state
  - Triggered when `isUpdateReady` is true and user hasn't opted to "Remind Later"
  - Actions:
    - "Update Now" → Calls `Updates.reloadAsync()`
    - "Remind Later" → Sets postpone flag
  - **Styling:** High-fidelity, smooth enter/exit animations

---

### 3. Integration

**File:** `src/app/_layout.tsx`

- Wrap the root layout with `UpdatesProvider`
- Inject the `UpdateModal` at the root level so it can overlay any screen

---

## Multi-Agent Execution Strategy

This feature will be executed by multiple specialized agents operating in parallel or sequence.

---

### Agent 1: State & Monitoring Executor (`[IMPL]`)

- **Focus:** `UpdatesProvider.tsx` implementation
- **Responsibilities:**
  - Implement `expo-updates` logic
  - Event listeners
  - State machine
  - Persistence logic for "Remind Me Later" using `AsyncStorage`

---

### Agent 2: UI & Interaction Executor (`[IMPL]`)

- **Focus:** `UpdateModal.tsx` implementation
- **Responsibilities:**
  - Build modal UI using NativeWind
  - Implement animations
  - Bind to context state
  - Integrate into `_layout.tsx`

---

### Agent 3: Reviewer & QA Agent (`[REVIEW]`, `[TEST]`)

- **Focus:** Logic verification and test coverage
- **Responsibilities:**
  - Write unit tests for provider state transitions
  - Verify `reloadAsync` is called correctly
  - Ensure no race conditions between downloading and prompting
  - Test offline behavior (manual or mocked)

---

### Agent 4: Security Architect (`[SEC]`, `[REVIEW]`)

- **Focus:** Hardening and compliance
- **Responsibilities:**
  - Conduct security review
  - Ensure no PII in logs
  - Verify environment checks
  - Ensure update process cannot be hijacked

---

## Verification Plan

### Automated Tests

- Unit tests for `UpdatesProvider` state machine (mocking `expo-updates`)

---

### Manual Verification

- Trigger a published EAS update → verify modal appears
- Test "Remind Later" persistence (close app, reopen, verify TTL behavior)
- Test "Update Now" → triggers successful reload
- Test offline behavior during update check