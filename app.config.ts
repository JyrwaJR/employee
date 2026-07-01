import { ExpoConfig, ConfigContext } from 'expo/config';

const APP_VARIANT = process.env.APP_VARIANT;

const isDev = APP_VARIANT === 'development';
const isPreview = APP_VARIANT === 'preview';
const APP_VERSION = '1.0.0';

const iconAssetUrl = './src/shared/assets/icon.png';
const adaptiveIcon = './src/shared/assets/icon-android.png';
const splashAssetUrl = './src/shared/assets/splash.png';

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
        icon: iconAssetUrl,
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
  icon: iconAssetUrl,
  userInterfaceStyle: 'light',
  splash: {
    image: splashAssetUrl,
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
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
      foregroundImage: adaptiveIcon,
      backgroundColor: '#ffffff',
    },
    package: getIdentifier(),
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
