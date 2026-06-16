# Architecture Guide

Employee Mobile follows a modular, feature-sliced architecture designed for scalability, security, and maintainability.

## 🏗 High-Level Overview

The app is built with **Expo Router**, utilizing file-based routing and a directory structure that separates core logic from feature-specific code.

### 1. Routing (`src/app/`)
- Uses `expo-router` for file-based navigation.
- Routes are organized into groups:
  - `(auth)`: Public routes for login and signup.
  - `(admin)`: Management features.
  - `(drawers)`: Main navigation structure.
- **RBAC**: Implemented via `RoleBaseRoute` provider that checks user permissions before rendering routes.

### 2. Features (`src/features/`)
Each directory represents a standalone feature module (e.g., `leave`, `salary`, `pension`).
- **Isolation**: Features should not directly import from other features.
- **Shared Access**: Features use `src/shared/` for common functionality.

### 3. Shared Layer (`src/shared/`)
- **api/**: Centralized API client and interceptors.
- **components/**: Reusable UI primitives (buttons, cards, inputs).
- **hooks/**: Generic hooks (useAuth, useTheme).
- **providers/**: Context providers (SSLPinning, Auth, Query).
- **store/**: Global state definitions (Zustand).
- **utils/**: Pure utility functions.

## 🔐 Security Architecture

### SSL Public Key Pinning
- **Provider**: `src/shared/providers/SSLPinningProvider.tsx`
- **Config**: `src/shared/config/network.ts`
- Ensures the app only communicates with verified backend servers.

### Authentication & Biometrics
- **Secure Store**: Auth tokens are stored in `expo-secure-store`.
- **Local Auth**: Biometric login implemented via `expo-local-authentication`.

## 🔄 Data Flow

1. **Request**: Triggered by a UI component using a hook from `src/features/[name]/api/`.
2. **Server State**: Managed by `@tanstack/react-query`.
3. **API Client**: `src/shared/utils/api.ts` handles the request, applying auth headers and SSL pinning.
4. **Response**: Data is cached by React Query and returned to the component.
5. **UI Update**: Component re-renders with the fresh data.

## 🎨 Styling System

- **NativeWind (Tailwind CSS v4)**: Used for rapid UI development with utility classes.
- **class-variance-authority (CVA)**: Used for managing component variants (e.g., Button types).
- **Inter-op**: `react-native-css-interop` ensures Tailwind classes work seamlessly across platforms.
