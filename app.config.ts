import { ExpoConfig, ConfigContext } from 'expo/config';

const APP_VARIANT = process.env.APP_VARIANT;

const isDev = APP_VARIANT === 'development';
const isPreview = APP_VARIANT === 'preview';
const APP_VERSION = '1.0.0';

const ASSETS = {
  iosIcon: './src/shared/assets/ios-icon-default.png',
  iosSplash: './src/shared/assets/ios-splash.png',
  androidIconForeground: './src/shared/assets/android-icon-foreground.png',
  androidSplash: './src/shared/assets/android-splash.png',
} as const;

const iconBgColor = '#ffffff';

const getAppName = (baseName: string) => {
  if (isDev) return `${baseName} (Dev)`;
  if (isPreview) return `${baseName} (Preview)`;
  return baseName;
};

const getIdentifier = () => {
  if (isDev) return 'com.jyrwaboys.employeemobile';
  if (isPreview) return 'com.jyrwaboys.employeemobile';
  return 'com.jyrwaboys.employeemobile';
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName('Employee'),
  slug: 'employee',
  version: APP_VERSION,
  scheme: 'employee-mobile',
  platforms: ['ios', 'android'],
  plugins: [
    'expo-router',
    'expo-splash-screen',
    'expo-font',
    [
      'expo-local-authentication',
      {
        faceIDPermission: 'Allow $(PRODUCT_NAME) to use Biometric authentication.',
      },
    ],
    [
      'expo-notifications',
      {
        icon: ASSETS.androidIconForeground,
        color: iconBgColor,
        defaultChannel: iconBgColor,
        enableBackgroundRemoteNotifications: true,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  orientation: 'portrait',
  icon: ASSETS.iosIcon,
  userInterfaceStyle: 'light',
  splash: {
    image: ASSETS.iosSplash,
    resizeMode: 'contain',
    backgroundColor: iconBgColor,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: getIdentifier(),
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON_IOS,
  },
  android: {
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    adaptiveIcon: {
      foregroundImage: ASSETS.androidIconForeground,
      backgroundColor: iconBgColor,
    },
    splash: {
      image: ASSETS.androidSplash,
      resizeMode: 'contain',
      backgroundColor: iconBgColor,
    },
    package: getIdentifier(),
  },
  extra: {
    router: {},
    eas: { projectId: '274cfcf8-439f-4622-ab99-76fa09023690' },
  },
  owner: 'jyrwajr',
  updates: {
    url: 'https://u.expo.dev/14849a6b-819c-4e05-9b59-022a381d8999',
  },
  runtimeVersion: APP_VERSION,
});
