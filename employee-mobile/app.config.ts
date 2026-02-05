import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'employee-mobile',
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
        bundleIdentifier: 'com.jyrwaboys.employeemobile',
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './src/assets/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
        package: 'com.jyrwaboys.employeemobile',
    },
    extra: {
        router: {},
        eas: {
            projectId: '14849a6b-819c-4e05-9b59-022a381d8999',
        },
    },
    owner: 'pixel-thread',
});
