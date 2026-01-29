import { CustomDrawerContent } from '@/src/components/common/CustomDrawerContent';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer drawerContent={CustomDrawerContent}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
    </Drawer>
  );
}
