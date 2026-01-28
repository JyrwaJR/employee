import { Stack, Link } from 'expo-router';

import { Text, View } from 'react-native';

import { Container } from '@/src/components/Container';
import { ScreenContent } from '@/src/components/ScreenContent';
import { ModernButton } from '../components/ui/button';

export default function Home() {
  return (
    <View className={styles.container}>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        <ScreenContent path="app/index.tsx" title="Home"></ScreenContent>
        <Link href="/auth/sign-up">
          <Text>Click</Text>
        </Link>
      </Container>
    </View>
  );
}

const styles = {
  container: 'flex flex-1 bg-white',
};
