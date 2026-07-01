import { View, Text } from 'react-native';
import React from 'react';
import { Icon } from '@components/ui/icon';
import { useTheme } from '@hooks/use-theme';
import { useRouter } from 'expo-router';
import { Button } from '@components/ui';
import { PAGE_ROUTES } from '@utils/constants';
import { Container } from '@components/layout';

interface UnderDevelopmentProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

export const UnderDevelopment = ({
  title = 'Under Development',
  message = "We're currently working hard on this feature. Stay tuned!",
  showBackButton = true,
}: UnderDevelopmentProps) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Container className="flex-1 items-center justify-center">
      <View className="mb-6 items-center justify-center rounded-full bg-blue-50 p-6 dark:bg-blue-900/20">
        <Icon name="hammer-wrench" size={48} color={theme === 'dark' ? '#60A5FA' : '#2563EB'} />
      </View>

      <Text className="mb-3 text-center text-xl font-bold text-slate-900 dark:text-white">
        {title}
      </Text>

      <Text className="mb-8 text-center text-base leading-6 text-slate-600 dark:text-slate-400">
        {message}
      </Text>

      {showBackButton && (
        <Button
          variant={'outline'}
          onPress={() => {
            const canGoBack = router.canGoBack();
            if (canGoBack) {
              router.back();
            } else {
              router.push(PAGE_ROUTES.HOME);
            }
          }}>
          Go Back
        </Button>
      )}
    </Container>
  );
};
