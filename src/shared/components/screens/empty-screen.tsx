import React from 'react';
import { View } from 'react-native';
import { Icon } from '@components/ui/icon';
import { useTheme } from '@hooks/use-theme';
import { cn } from '@utils/helpers/cn';
import { Container } from '../layout/container';
import { Text } from '../ui/text';
import { Button } from '@components/ui';

interface EmptyScreenProps {
  title: string;
  refresh?: () => void;
  message?: string;
  icon?: string;
  refreshLabel?: string;
}

export const EmptyScreen = ({
  title,
  refresh,
  message,
  icon = 'inbox-outline',
  refreshLabel = 'Refresh',
}: EmptyScreenProps) => {
  const theme = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <Container className={cn('flex-1 items-center justify-center px-6')}>
      <View className={cn('mb-6 h-24 w-24 items-center justify-center rounded-full', 'bg-muted')}>
        <Icon name={icon as any} size={48} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
      </View>

      <Text variant="heading" className={cn('mb-2 text-center text-foreground')}>
        {title}
      </Text>

      {message && (
        <Text variant="subtext" className={cn('mb-8 text-center text-base leading-6')}>
          {message}
        </Text>
      )}

      {!message && <View className={cn('mb-8')} />}

      <Button variant={'outline-ink'} onPress={() => refresh?.()} activeOpacity={0.8}>
        {refreshLabel}
      </Button>
    </Container>
  );
};

EmptyScreen.displayName = 'EmptyScreen';
