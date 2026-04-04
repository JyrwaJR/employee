import { ExpoConfig, ConfigContext } from 'expo/config';

const APP_VARIANT = process.env.APP_VARIANT;

const isDev = APP_VARIANT === 'development';
const isPreview = APP_VARIANT === 'preview';

const getAppName = (baseName: string) => {
  if (isDev) return `${baseName} (Dev)`;
  if (isPreview) return `${baseName} (Preview)`;
  return baseName;
};

const getIdentifier = (baseIdentifier: string) => {
  if (isDev) return `${baseIdentifier}.dev`;
  if (isPreview) return `${baseIdentifier}.preview`;
  return baseIdentifier;
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName('employee-mobile'),
  slug: 'employee',
  version: '1.0.0',
  scheme: 'employee-mobile',
  platforms: ['ios', 'android'],
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './src/assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-splash-screen',
    [
      'expo-local-authentication',
      {
        faceIDPermission: 'Allow $(PRODUCT_NAME) to use Face ID.',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './src/assets/icon.png',
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
  icon: './src/assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './src/assets/splash.png',
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
      foregroundImage: './src/assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: getIdentifier('com.jyrwaboys.employeemobile'),
  },
  extra: {
    router: {},
    eas: {
      projectId: '14849a6b-819c-4e05-9b59-022a381d8999',
    },
  },
  owner: 'pixel-thread',
  updates: {
    url: 'https://u.expo.dev/14849a6b-819c-4e05-9b59-022a381d8999',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
});
