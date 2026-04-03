# Product Requirements Document: "Dream"

**Status:** Draft / Review Required  
**Version:** 1.0.0  
**Main Function:** `dream`

---

## 1. Executive Summary

As a Retrieval-Augmented Generation (RAG) system grows, it suffers from **Semantic Entropy**: redundant information, outdated context, and fragmented memories that increase token costs and decrease retrieval accuracy.

**"Dreaming"** is a background maintenance process that allows the agent to reflect on the entire memory vault. By identifying redundancies and merging related snippets, the `dream` function ensures the memory system remains a high-fidelity source of truth rather than a cluttered archive.

---

## 2. Problem Statement

- **Memory Bloat:** Multiple files often contain overlapping information about the same feature, confusing the retriever and wasting context window space.
- **Context Fragmentation:** Small "micro-memories" (e.g., individual bug fix logs) lose their value unless synthesized into a larger architectural context.
- **Stale Data:** Project directions change, but old memories remain, leading to "hallucinations" caused by outdated ground truths.

---

## 3. Goals & Objectives

- **Consolidate:** Merge multiple related low-level snippets into high-level "Master Memories."
- **Prune:** Delete obsolete or redundant files that offer zero unique semantic value.
- **Align:** Re-align the memory vault with the current project state.
- **Synthesize:** Extract "Strategic Insights" or "Plans" from fragmented histories to update the agent's internal roadmap.

---

## 4. Functional Requirements

### 4.1 The `dream` Tool Interface

The core function must handle batch processing of files with the following parameters:

| Parameter   | Type    | Default     | Description                                                                   |
| :---------- | :------ | :---------- | :---------------------------------------------------------------------------- |
| `dryRun`    | Boolean | `true`      | If true, returns a report of proposed changes without modifying the disk.     |
| `focus`     | String  | `null`      | Optional path or category (e.g., `"auth"`) to limit the scope of the session. |
| `depth`     | Enum    | `"surface"` | `"surface"` (deduplication only) vs `"deep"` (re-summarizing and rewriting).  |
| `threshold` | Float   | `0.85`      | Similarity score threshold for clustering files.                              |

### 4.2 Core Maintenance Pipeline

1.  **Clustering (Map):** Group memories by folder structure, metadata tags, or vector similarity.
2.  **Analysis:** Send a "Batch Manifest" (titles, summaries, and timestamps) to the LLM.
3.  **Synthesis (Reduce):** The LLM generates a **Consolidation Plan** consisting of:
    - **MERGE**: Group $X$ and $Y$ into a new file $Z$.
    - **DELETE**: Remove file $A$ as it is fully contained within file $B$.
    - **REFINE**: Update file $C$ to remove contradictory information.
4.  **Execution:** Orchestrate physical file deletions and creations via the `VaultFileManager`.
5.  **Re-Indexing:** Automatically trigger `sync_index` to refresh the vector database.

---

## 5. Technical Specifications

### 5.1 Hierarchical Dreaming (Batching Strategy)

For vaults exceeding 100 files, the system must use a recursive approach:

- **Local Dream:** Consolidate files within specific sub-directories.
- **Global Dream:** Compare the "Local Dream" outputs to identify cross-directory redundancies.

### 5.2 Persistence of "Plans"

Strategic insights generated during a dream (e.g., "The project has shifted from React to Next.js") must be stored in a dedicated system file:
`vault/.system/evolution_log.md`
This file provides the agent with a "History of Thought" that persists across sessions.

---

## 6. Safety & Guardrails

### 6.1 Data Preservation

- **Archive over Delete:** Instead of permanent deletion, files should be moved to a `.trash/` or `archive/` directory within the vault.
- **Protected Files:** Any file containing the frontmatter tag `protected: true` must be ignored by the dreaming process.

### 6.2 The Dream Report

The function must return a structured result to the user:

- `deletedCount`: Total files removed.
- `mergedCount`: Total clusters consolidated.
- `newMemories`: List of titles of new consolidated files.
- `suggestions`: Strategic insights or architectural warnings inferred from the data.

---

## 7. Verification Plan

### 7.1 Automated Testing

- **Idempotency Test:** Running `dream` twice on a clean vault should result in zero changes the second time.
- **Lossless Merge Test:** Verify that keywords present in two source files exist in the consolidated output file.

### 7.2 Manual Acceptance Criteria

1.  Call `dream` with `dryRun: true` and verify the `suggestions` align with actual project history.
2.  Call `dream` with `dryRun: false` and verify the `vault/` directory is cleaner and the vector search remains accurate.

---

## 8. Open Questions

- **Contradiction Handling:** If two files provide opposing instructions, should the `dream` tool choose the newest one or prompt the user for resolution?
- **Resource Management:** Should dreaming be restricted to specific times (e.g., system idle) to prevent LLM rate-limiting during active work?
