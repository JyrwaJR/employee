# Project Onboarding Guide: employee-mobile

## 🚀 Overview
Employee Mobile is an Expo-based management application designed for employee self-service and HR automation. It supports complex role-based access control and high-security standards like SSL Pinning.

## 🛠 Tech Stack
- **Framework**: Expo (SDK 54) / React Native
- **Navigation**: Expo Router (File-based)
- **State Management**: 
  - `zustand`: Global UI and simple data state.
  - `@tanstack/react-query`: Server state management for API calls.
- **Styling**: `nativewind` (Tailwind CSS v4) with `class-variance-authority`.
- **Forms**: `react-hook-form` with `zod` validation.
- **Security**: 
  - `react-native-ssl-public-key-pinning` for man-in-the-middle protection.
  - `expo-secure-store` for sensitive data at rest.
  - `expo-local-authentication` for biometric login.

## 🏗 Directory Structure
- `src/app/`: File-based routes for Expo Router.
- `src/features/`: Feature-sliced architecture (Auth, Leave, Salary, Profile, etc.).
- `src/shared/`: Common components, hooks, constants, and utilities.
- `.agents/`: Agentic configuration, rules, plans, and persistent memory logs.

## 🔑 Core Features & Patterns
### 1. Role-Based Access Control (RBAC)
- Implemented via `RoleBaseRoute` component in `src/shared/providers`.
- Uses a `routeRoles` config to map URL paths to required auth states and user roles.

### 2. Multi-App Variants
- Three variants: `Development` (Dev), `Preview` (Preview), `Production` (Prod).
- Managed via `APP_VARIANT` env var in `app.config.ts`, `eas.json`, and `package.json`.
- Allows side-by-side installation on a single device.

### 3. API Communication
- Centralized `axiosInstance` with interceptors for auth headers and error handling.
- Optimized for SSL Public Key Pinning.

## 📝 Recent Progress
- Configured dynamic variants for parallel installation.
- Fixed circular dependencies between logger and HTTP utilities.
- Enhanced `LoginScreen` with password visibility toggles and Lucide icons.
