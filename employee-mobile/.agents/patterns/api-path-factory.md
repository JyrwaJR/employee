# Pattern: Robust API Path & Query Factory (Mobile)

## Overview
This pattern provides a production-grade, type-safe utility for constructing API URLs in Expo/React Native projects. It mirrors the backend `withValidation` pattern, ensuring that data is validated via Zod before any network request is initiated.

## Implementation Details

### Core Utility: `src/shared/api/utils.ts`
The `path` factory handles three main responsibilities:
1. **Schema Validation**: Validates both path parameters (`params`) and query strings (`query`) against Zod schemas.
2. **Path Replacement**: Identifies placeholders (e.g., `:id`, `:leaveId`) using regex and injects values from the input object.
3. **Query Serialization**: Automatically builds URL query strings from a validated object, handling null/undefined values and appending `?key=value`.

### Key Features
- **Regex Word Boundaries**: Uses `\b` in replacement to prevent accidental partial matches.
- **Flexible Inputs**: Supports passing a single string for simple paths or a full object.
- **Fail-Fast**: Throws errors if required placeholders are missing.

## Usage Example
```typescript
const details = path('/employees/:id', {
  params: z.object({ id: z.string().uuid() })
});

const url = details({ id: 'uuid-here' });
```
