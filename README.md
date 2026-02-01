# Employee Management System

A full-stack solution for managing employee data and salary structures, featuring a secure Next.js backend and a high-performance Expo mobile application.

## 📁 Project Structure

```text
.
├── employee-backend/   # Next.js API & Database (Prisma)
└── employee-mobile/    # Expo (React Native) Mobile App

```

---

## 🚀 Getting Started

### 1. Backend Setup (`/employee-backend`)

The backend handles data persistence, salary calculations, and security middleware.

**Prerequisites:** Node.js, PostgreSQL/MySQL.

**Environment Variables (`.env`):**
Create a `.env` file in the `employee-backend` folder:

```bash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
DATABASE_URL=
DIRECT_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
SALT=
ACCESS_TOKEN_TTL=
REFRESH_TOKEN_TTL=
NODE_ENV=
```

**Installation & Run:**

```bash
cd employee-backend
npm install
npx prisma generate
npx prisma db seed      # Populate with 10 years of salary history
npm run dev

```

### 2. Mobile Setup (`/employee-mobile`)

The mobile app is built with Expo and features advanced security like SSL Pinning.

**Prerequisites:** EAS CLI (`npm install -g eas-cli`).

**Environment Variables (`.env`):**
Create a `.env` file in the `employee-mobile` folder:

```bash
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_CURRENT_LEAF_HASH=Your current leaf hash ssl pinning
EXPO_PUBLIC_NEXT_LEAF_HASH=

```

**Installation & Run:**

```bash
cd employee-mobile
npm install
npx expo prebuild       # Required for native SSL pinning modules
npx expo run:android    # Or run:ios
```

---

## 🛠 Features Implemented

### Backend (Next.js)

- **Prisma Seeding:** Automated generation of 40+ employees with 10-year salary history based on Indian pay structures.
- **Security Middleware:** Integrated **Helmet.js** for secure headers, **CORS** management, and **Rate Limiting** to prevent brute force.
- **Data Validation:** Strict schema validation using **Zod** for all incoming API requests.

### Mobile (Expo)

- **SSL Public Key Pinning:** Implemented via `react-native-ssl-public-key-pinning` to prevent Man-in-the-Middle (MITM) attacks.
- **Network Layer:** Unified **Axios** fetcher with automated timeout handling and global SSL validation.
- **CI/CD Workflow:** Custom scripts for local development and Over-The-Air (OTA) updates via EAS Preview channels.

---

## 📦 Maintenance Scripts

| Command                  | Action                                                              |
| ------------------------ | ------------------------------------------------------------------- |
| `npm run local:android`  | Build and run a production-release APK locally to test SSL pinning. |
| `npm run update:preview` | Push an OTA update to the Expo `preview` channel for testing.       |
| `npx prisma db seed`     | (Backend) Refresh the database with calculated salary data.         |

---

## 🔒 Security Note

This project uses **SSL Public Key Pinning**. If the backend SSL certificate is rotated on Vercel, the mobile app must be updated with the new hash via an OTA update _before_ the old certificate expires to avoid a connection deadlock.

**Would you like me to help you draft a specific `CONTRIBUTING.md` file for your team as well?**
