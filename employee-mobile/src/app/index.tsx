import { Stack, Link } from 'expo-router';

import { View } from 'react-native';

import { Button } from '@/src/components/Button';
import { Container } from '@/src/components/Container';
import { ScreenContent } from '@/src/components/ScreenContent';

export default function Home() {
  return (
    <View className={styles.container}>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        <ScreenContent path="app/index.tsx" title="Home"></ScreenContent>
        <Link href={{ pathname: '/details', params: { name: 'Dan' } }} asChild>
          <Button title="Show Details" />
        </Link>
      </Container>
    </View>
  );
}

const styles = {
  container: 'flex flex-1 bg-white',
};
