# Environment Variables

This project uses `expo-constants` and standard environment variables for configuration across different variants (Dev, Preview, Production).

## Standard Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `APP_VARIANT` | Yes | Defines the app environment (`development`, `preview`, `production`). | `development` |
| `NODE_ENV` | No | Automatically set by the bundler. | `development`, `production` |

## Expo Public Variables

These variables are prefixed with `EXPO_PUBLIC_` to be accessible in the client-side code.

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Yes | The base URL for the backend API. | `https://api.example.com` |
| `EXPO_PUBLIC_APP_NAME` | No | Overrides the display name in the UI. | `Employee Portal` |
| `EXPO_PUBLIC_CURRENT_LEAF_HASH` | Yes | SSL Public Key hash for pinning (Base64). | `sha256/xxxxxxxxxxx` |

## Build-time Variables (EAS)

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_SERVICES_JSON` | No | Path to the `google-services.json` file for Android. |

## Setting up .env

Create a `.env` file in the root directory (this file is gitignored):

```env
APP_VARIANT=development
EXPO_PUBLIC_API_URL=https://your-api-url.com/api
EXPO_PUBLIC_APP_NAME=Employee Dev
EXPO_PUBLIC_CURRENT_LEAF_HASH=sha256/your-hash-here
```

> **Note**: For EAS builds, these variables should be configured in the EAS dashboard or `eas.json` under the `env` section for the respective profile.
