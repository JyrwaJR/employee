# UI Architecture: The Ghost Skeleton Pattern

## Overview
The "Ghost Skeleton" is a declarative loading pattern designed to eliminate layout shifts (CLS) and simplify screen-level logic in Expo projects.

## Components

### 1. SkeletonProvider
A context provider that wraps a screen or a specific section.
- **Prop**: `isLoading` (boolean)

### 2. SkeletonItem
A wrapper for individual UI elements (Text, Avatars, etc.).
- **Behavior**: 
  - If `isLoading` is true: Renders children with `opacity-0` (preserving dimensions) and overlays an absolute-positioned `Skeleton` pulse.
  - If `isLoading` is false: Renders children normally.

## Implementation Details
- **Location**: `src/shared/components/ui/SkeletonContext.tsx`
- **Styling**: Tailored for both Light and Dark modes.
- **Transitions**: Native-thread Reanimated pulses for 60fps performance.

## Usage Example
```tsx
<SkeletonProvider isLoading={isFetching}>
  <SkeletonItem className="rounded-full">
    <Avatar src={user.img} />
  </SkeletonItem>
</SkeletonProvider>
```
