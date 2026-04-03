# Core PRD: Employee Mobile App

## 1. Project Overview
The Employee Mobile App is a high-performance, secure mobile application built with Expo and React Native. It is designed to empower employees with self-service capabilities for managing their employment details, benefits, leave, and profiles, while providing administrators with tools to oversee employee records.

## 2. Architecture & Tech Stack

### 2.1 Technical Core
- **Framework**: Expo (SDK 54) / React Native (0.81.5)
- **Navigation**: Expo Router (File-based routing with Tabs and Drawers)
- **Language**: TypeScript (Strict mode)
- **State Management**:
  - **Server State**: TanStack Query (v5) for efficient fetching, caching, and synchronization.
  - **Global/Local State**: Zustand (v4) for lightweight store management (Theme, Tokens, Local Auth).
- **Styling**: NativeWind (Tailwind CSS v3) for utility-first responsive styling.
- **Forms**: React Hook Form with Zod for robust schema validation.

### 2.2 Infrastructure & DevOps
- **Networking**: Axios with custom interceptors and SSL Public Key Pinning.
- **Environment Management**: Dynamic app variants (Development, Preview, Production) managed via `app.config.ts`.
- **Deployment**: EAS (Expo Application Services) for builds and OTA updates.

## 3. Detailed Feature Breakdown

### 3.1 Authentication & Security (src/features/auth)
- **Multi-factor Auth**: Support for standard login and OTP-based verification.
- **Silent Refresh**: Automatic token renewal using refresh tokens stored securely.
- **Local Authentication**: Biometric (FaceID/Fingerprint) secondary gate for app access.
- **Secure Storage**: Sensitive tokens stored using `expo-secure-store`.
- **SSL Pinning**: Hardened network security using `react-native-ssl-public-key-pinning` to prevent MITM attacks.

### 3.2 Dashboard (src/features/home)
- **Personalized Greeting**: Dynamic greeting based on time of day and user profile.
- **Analytics Overview**: Quick-view stats (Total Staff, Active Now, On Leave).
- **Search**: Global employee search capability.
- **Notifications**: Integrated notification center for system alerts.

### 3.3 Employee Management (src/features/employee)
- **Employee Directory**: Searchable list of all employees with status indicators.
- **Detailed Profiles**: Comprehensive view of employee information.
- **Admin Roles**: Specific `(admin)` route group for managing employee-specific salary and records.

### 3.4 Leave & Benefits (src/features/leave, src/features/pension)
- **Leave Tracking**: View historical and current leave applications.
- **Pension Management**: Access to pension contribution details and statements.
- **Dynamic Routing**: Deep-linking support for specific leave/pension records.

### 3.5 Salary & Finance (src/features/salary)
- **Payslips**: View and download monthly payslips.
- **Statements**: Access to annual and periodic salary statements.

### 3.6 System Features (src/features/notification, src/features/settings, src/features/profile)
- **Push Notifications**: Integrated via `expo-notifications`.
- **Theming**: System-wide Dark/Light mode support via `ThemeProvider`.
- **User Profile**: Self-service profile management.

## 4. Folder Structure & Conventions

The project follows a **Feature-Driven Architecture**, separating concerns by domain while maintaining a unified shared layer.

```bash
src/
├── app/               # Expo Router entry points (File-based routes)
│   ├── (admin)/       # Administrative routes (Employees, Salary management)
│   ├── (drawers)/     # Main application shell with Drawer and Tab navigation
│   ├── auth/          # Authentication screens (Login, Sign-up, OTP)
│   └── global.css     # Tailwind/NativeWind global styles
├── features/          # Domain-specific logic (Self-contained)
│   ├── [feature-name]/
│   │   ├── components/ # Feature-specific UI
│   │   ├── hooks/      # Custom hooks for the feature
│   │   ├── services/   # API definitions and logic
│   │   ├── store/      # Feature-specific Zustand stores
│   │   └── types/      # TypeScript definitions
├── shared/            # Reusable core across all features
│   ├── components/    # Atomic UI library (ui, base, layout, display)
│   ├── config/        # Network and app-wide configurations
│   ├── constants/     # Static values and enums
│   ├── providers/     # Context providers (Auth, Theme, Query)
│   ├── store/         # Global stores (Token, Theme)
│   └── utils/         # Helper functions and utilities
└── assets/            # Static assets (Images, Fonts, Icons)
```

## 5. Security Mandates
- **Zero Plaintext**: No secrets or connection strings in source code.
- **SSL Enforcement**: All network requests must pass through the SSL Pinning provider.
- **Input Validation**: Every user input must be validated via Zod schemas at the feature level.
- **Authorization**: Role-based access control (RBAC) enforced via the `(admin)` route protection.

## 6. Success Metrics
- **Performance**: < 2s initial app load time.
- **Security**: 0 vulnerability findings in SSL and Local Auth audits.
- **Engagement**: High adoption of self-service features (Payslip downloads, Leave applications).
