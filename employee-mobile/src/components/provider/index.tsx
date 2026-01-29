import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TQueryProvider } from '@components/provider/query';
import { View } from 'react-native';
import { Toaster } from 'sonner-native';
import { AuthContextProvider } from './auth';
import { AuthRedirect } from '../common/AuthRedirect';

type Props = {
  children: React.ReactNode;
};

export const ProviderWrapper = ({ children }: Props) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider className="flex-1 bg-white">
        <TQueryProvider>
          <AuthContextProvider>
            <AuthRedirect>
              <View className="flex-1 bg-red-500">{children}</View>
              <Toaster />
            </AuthRedirect>
          </AuthContextProvider>
        </TQueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
