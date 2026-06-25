import { Stack } from 'expo-router';
import { StackHeaderLayout } from '@components/layout/stack-header-layout';

export default function AdminLayout() {
  return (
    <StackHeaderLayout>
      <Stack screenOptions={{ headerShown: false }} />
    </StackHeaderLayout>
  );
}
