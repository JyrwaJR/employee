# Scripts Reference

Available commands for the Employee Mobile project. Use `pnpm <command>` to run these.

| Command | Description |
|---------|-------------|
| `pnpm start` | Start the Expo development server (Metro bundler). |
| `pnpm dev` | Start the development server for the `development` variant with cleared cache. |
| `pnpm android` | Run the app on an Android emulator/device in development mode. |
| `pnpm prebuild` | Generate native `android/` and `ios/` directories. |
| `pnpm lint` | Run ESLint with auto-fix enabled. |
| `pnpm format` | Run Prettier to format all supported files. |
| `pnpm build:dev` | Trigger an EAS build for the development profile on Android. |

## Development Workflow

1. **Start Metro**: `pnpm dev`
2. **Open on Device**: Scan the QR code with the Expo Go app or use an emulator.
3. **Format Code**: `pnpm format` before committing.

## EAS Commands

For building and submitting to app stores, use the `eas` CLI:

```bash
# Build for specific profile
eas build --profile [development|preview|production] --platform [ios|android]

# Update the app (OTA)
eas update --branch [development|preview|production]
```
