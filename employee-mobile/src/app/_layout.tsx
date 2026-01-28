import { ProviderWrapper } from '../components/provider';
import './global.css';

import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <ProviderWrapper>
      <Stack />
    </ProviderWrapper>
  );
}
