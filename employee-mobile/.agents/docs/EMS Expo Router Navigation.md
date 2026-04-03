# 📱 Employee Management System (EMS) - Expo Router Navigation Architecture

## 🎯 Overview
This document defines a **production-ready navigation architecture** for a mobile Employee Management System built with **Expo Router**, supporting:
- Role-based routing
- Drawer + Tabs + Stack navigation
- Scalable folder structure

---

## 🧭 ROOT ROUTING STRUCTURE (Expo Router)

```
app/
├── _layout.tsx                # Root layout (auth check)
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   ├── forgot-password.tsx
│   ├── otp.tsx
│   ├── reset-password.tsx
│
├── (app)/
│   ├── _layout.tsx            # Drawer Layout (protected)
│   │
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Tabs Layout
│   │   ├── index.tsx          # Home
│   │   ├── salary/
│   │   │   ├── index.tsx      # Salary List
│   │   │   ├── [id].tsx       # Salary Detail
│   │   │
│   │   ├── leave/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │
│   │   ├── employees/         # Manager/Admin
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │
│   │   ├── profile.tsx
│   │
│   ├── settings.tsx
│   ├── biometric-lock.tsx
│
├── (system)/
│   ├── loading.tsx
│   ├── error.tsx
│   ├── forbidden.tsx
│   ├── not-found.tsx
```

---

## 🔐 ROLE-BASED ACCESS LOGIC

### Roles:
- Employee
- Manager
- Admin

### Access Control:
| Screen | Employee | Manager | Admin |
|--------|--------|--------|--------|
| Home | ✅ | ✅ | ✅ |
| Salary | ✅ | ✅ | ✅ |
| Leave | ✅ | ✅ | ✅ |
| Employees | ❌ | ✅ | ✅ |
| Approvals | ❌ | ✅ | ✅ |
| Settings | ✅ | ✅ | ✅ |

---

## 📱 TAB STRUCTURE

### Employee Tabs
- Home
- Salary
- Leave
- Profile

### Manager Tabs
- Home
- Team (Employees)
- Approvals
- Profile

### Admin Tabs
- Home
- Employees
- Management
- Profile

---

## 🧱 DRAWER STRUCTURE

### Common:
- Home
- Profile
- Settings
- Logout

### Manager/Admin إضافات:
- Employees
- Approvals
- Management

---

## 🔁 NAVIGATION FLOW

```
Splash → Auth → App (Drawer → Tabs → Stack)
```

---

## 🔐 PROTECTED ROUTES

- Auth required for `(app)`
- Role-based guards in layout
- Redirect unauthorized → `/forbidden`
- Unknown routes → `/not-found`

---

## 📊 LIST SCREEN SYSTEM

All list screens include:
- Search bar
- Filter chips
- Advanced filters (modal)
- Sorting
- Pagination / Infinite scroll
- Skeleton loading
- Empty states

---

## ⚙️ TECH NOTES

- Use `expo-router`
- Use `useSegments()` for role-based routing
- Use context or Zustand for auth state
- Lazy load heavy screens

---

## 📦 OUTPUT

This structure ensures:
- Scalability
- Clean separation of concerns
- Production-ready navigation
