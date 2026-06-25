import { ExpoConfig, ConfigContext } from 'expo/config';

const APP_VARIANT = process.env.APP_VARIANT;

const isDev = APP_VARIANT === 'development';
const isPreview = APP_VARIANT === 'preview';
const APP_VERSION = '1.0.0';

const getAppName = (baseName: string) => {
  if (isDev) return `${baseName} (Dev)`;
  if (isPreview) return `${baseName} (Preview)`;
  return baseName;
};

const getIdentifier = (baseIdentifier: string) => {
  if (isDev) return `${baseIdentifier}`;
  if (isPreview) return `${baseIdentifier}`;
  return baseIdentifier;
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
    'expo-web-browser',
    [
      'expo-local-authentication',
      {
        faceIDPermission: 'Allow $(PRODUCT_NAME) to use Biometric authentication.',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './src/shared/assets/icon.png',
        color: '#ffffff',
        defaultChannel: 'default',
        enableBackgroundRemoteNotifications: true,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  orientation: 'portrait',
  icon: './src/shared/assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './src/shared/assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: getIdentifier('com.jyrwaboys.employeemobile'),
  },
  android: {
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    adaptiveIcon: {
      foregroundImage: './src/shared/assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: getIdentifier('com.jyrwaboys.employeemobile'),
  },
  extra: {
    router: {},
    eas: {
      projectId: '274cfcf8-439f-4622-ab99-76fa09023690',
    },
  },
  owner: 'jyrwajr',
  updates: {
    url: 'https://u.expo.dev/14849a6b-819c-4e05-9b59-022a381d8999',
  },
  runtimeVersion: APP_VERSION,
});
