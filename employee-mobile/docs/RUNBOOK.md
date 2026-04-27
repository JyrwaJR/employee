# Runbook

Operational procedures for the Employee Mobile application.

## 🚀 Deployment (EAS Build)

The app uses Expo Application Services (EAS) for building and distribution.

### 1. Development Build
```bash
pnpm build:dev
```
Or manually:
```bash
eas build --profile development --platform [ios|android]
```

### 2. Preview (Staging)
```bash
eas build --profile preview --platform [ios|android]
```

### 3. Production Release
```bash
eas build --profile production --platform [ios|android]
```

## 🔐 Security Maintenance

### SSL Pinning Updates
When the backend SSL certificate changes, the public key hash must be updated in the app.

1. Obtain the new Base64-encoded SHA256 hash of the public key.
2. Update `EXPO_PUBLIC_CURRENT_LEAF_HASH` in `.env` and EAS Secrets.
3. Rebuild the app or push an OTA update:
   ```bash
   eas update --branch [branch-name]
   ```

## 🐛 Troubleshooting

### Metro Cache Issues
If the app behaves strangely after adding packages or changing config:
```bash
pnpm dev --clear
```

### Dependency Conflicts
If `pnpm install` fails or `node_modules` is corrupted:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Android Build Failures
Check if `GOOGLE_SERVICES_JSON` is correctly set and the file exists if you are doing a local native build.

## 📊 Monitoring

- **EAS Dashboard**: Check build logs and submission status.
- **Sentry/LogRocket**: (If implemented) Monitor runtime crashes and performance.
