import { View } from 'react-native';
import { Text } from '@components/ui/text';

export const AuthTermsText = () => (
  <View className="p-2">
    <Text variant="subtext" size="xs">
      By creating an account, you agree to our{' '}
      <Text variant="link" size="xs">
        Terms of Service
      </Text>{' '}
      and{' '}
      <Text variant="link" size="xs">
        Privacy Policy
      </Text>
      .
    </Text>
  </View>
);
