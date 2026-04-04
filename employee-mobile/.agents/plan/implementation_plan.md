# Implementation Plan: EAS Workflows for Master and UAT Branches

Create a robust CI/CD orchestration in the repository using Expo EAS Workflows. This setup will automate native binary creation based on branch activity and allow manual remote execution for testing.

## User Review Required

> [!IMPORTANT]
> **Branch Names**: I am using `master` and `uat` as requested. Please ensure these match your actual Git branch names.
> **Build Profiles**: The plan assumes `production` and `preview` profiles exist in your `eas.json` (which they do, confirmed by auditing ).

## Proposed Changes

Create a new configuration directory `.eas/workflows/` and define the automated pipelines.

### 1. [NEW] `production-build.yml` (`.eas/workflows/production-build.yml`)
- **Trigger**: Automatically run when code is pushed to the `master` branch.
- **Enhanced Dual-Flow Logic**:
  - **Calculate Fingerprint**: Checks the Native UI/Native Plugin state.
  - **Conditional EAS Update**: Sends a fast JS update if native code matches.
  - **Mandatory Fresh Build**: Generates a new Android binary via `eas/build`.
  - **Automated Submission**: If the build succeeds, a downstream job executes `eas/submit` to push the new APK/AAB to **Google Play Store**.
- **Hardware**: Uses `linux-medium`.

### 2. [NEW] `preview-build.yml` (`.eas/workflows/preview-build.yml`)
- **Trigger**: 
  - Automatically run when code is pushed to the `uat` branch.
  - Can be triggered manually via `eas workflow:run preview-build.yml`.
- **Target Platform**: Android only.
- **Conditional Trigger**:
  - The build will only execute if the commit message contains the flag **`eas:build`** OR if triggered manually.
  - Why: Prevents redundant binary builds for small documentation or non-functional changes.

---

## Implementation Steps

### Phase 1: Infrastructure Setup
1. **Initialize Workflow Directory**
   - Create the `.eas/workflows` directory at the project root.
   - Why: This is the standard location where the EAS service looks for YAML definitions.

### Phase 2: Workflow Definitions
2. **Implement Production Workflow with Submission** (File: `.eas/workflows/production-build.yml`)
   - Define `on: push: branches: [master]`.
   - Add a `fingerprint` job.
   - Add an `update` job that triggers only if `needs_build` is false.
   - Add a `build` job that **always** runs to ensure a new binary is created.
   - Add a `submit` job that `needs` the build job.
   - Params: `platform: android`, `profile: production`.
   - Why: Automates the entire release cycle from code push to store submission.

3. **Implement Preview Workflow with Keyword Filter** (File: `.eas/workflows/preview-build.yml`)
   - Define `on: push: branches: [uat]` and `on: manual: {}`.
   - Add a global `if` condition to the jobs: `contains(github.event.head_commit.message, 'eas:build') || github.event_name == 'manual'`.
   - Why: Ensures intentional CI/CD execution for internal testers.

## Testing Strategy
- **Syntax Validation**: I will check the YAML against the stored `EAS Workflows YAML Syntax Reference`.
- **CLI Verification**: I will use `eas workflow:list` locally (if authenticated) or simply verify the files are in the correct place.

## Success Criteria
- [ ] `.eas/workflows/production-build.yml` exists with correct `master` push trigger.
- [ ] `.eas/workflows/preview-build.yml` exists with both `uat` push and `manual` triggers.
- [ ] Both workflows point to the correct profiles defined in `eas.json`.
- [ ] Memory reflection is performed to document this new project-specific pattern.