# Core PRD: Employee Mobile App

## 1. Vision & Purpose
A mobile application for employees to manage their employment details, benefits, leave, and profile. Targeted at streamlining HR processes and improving employee engagement via a secure and performant mobile interface.

## 2. Primary Users
- **Employees**: View salary, manage leave, check pension, update profile.
- **Admins**: (Potentially via the app or web) Manage employee records and system settings.

## 3. Core Features [NEEDS HUMAN INPUT]
- **Authentication**: Secure login/logout (Auth feature).
- **Home**: Dashboard with quick actions (Home feature).
- **Leave Management**: Apply for and track leave (Leave feature).
- **Salary & Benefits**: View payslips and pension details (Salary, Pension features).
- **Profile**: Update personal information (Profile feature).
- **Notifications**: System alerts and updates (Notification feature).
- **Settings**: App preferences (Settings feature).

## 4. Non-Functional Requirements [NEEDS HUMAN INPUT]
- **Security**: SSL Pinning, Secure Store, Local Auth (Biometrics).
- **Performance**: Dynamic app variants for Dev/Preview/Prod side-by-side.
- **UX/UI**: Modern mobile design with NativeWind/Tailwind support.

## 5. Architecture Overview
- **Framework**: Expo / React Native
- **Router**: Expo Router (File-based)
- **State**: Zustand (Local/Global), TanStack Query (Server state)
- **Styling**: NativeWind (Tailwind CSS)
- **Networking**: Axios with SSL Pinning
