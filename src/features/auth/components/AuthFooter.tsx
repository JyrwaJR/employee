import React from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import { Text } from '@/src/shared/components/ui/text';
import { cn } from '@/src/shared/utils/cn';

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkHref: any;
  testID?: string;
  className?: string;
}

export const AuthFooter = ({ text, linkText, linkHref, testID, className }: AuthFooterProps) => (
  <View className={cn('mt-10 flex-row justify-center', className)}>
    <Text variant="subtext">{text} </Text>
    <Link testID={testID} href={linkHref}>
      <Text variant="link" weight="semibold">
        {linkText}
      </Text>
    </Link>
  </View>
);
