import { usePathname, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Platform, View, TouchableOpacity, Text, StatusBar } from 'react-native';
import colors from 'tailwindcss/colors';
import type { ReactNode } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerToggleButton } from '@react-navigation/drawer';

type Props = {
  back?: boolean;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  options: {
    title: string;
  };
};

export const CustomHeader: React.FC<Props> = ({ back, headerRight, options }) => {
  const router = useRouter();
  const pathName = usePathname();
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const onPressBackButton = () => router.back();
  const isShowDrawerButton = pathName === '/';

  return (
    <SafeAreaView className="h-8 border border-red-500">
      <View
        className="w-full flex-row items-center justify-between"
        style={{
          paddingLeft: insets.left + 9,
          paddingRight: insets.right + 9,
        }}>
        <View className="h-full flex-1 flex-row items-center justify-start gap-2">
          {back ? (
            <View className="p-2">
              <TouchableOpacity
                hitSlop={4}
                onPress={onPressBackButton}
                style={{ alignItems: 'center', justifyContent: 'center' }}>
                {Platform.OS === 'ios' ? (
                  <MaterialCommunityIcons
                    size={25}
                    name="chevron-left"
                    color={isDarkMode ? colors.black : colors.white}
                  />
                ) : (
                  <MaterialCommunityIcons
                    size={20}
                    name="arrow-left"
                    color={isDarkMode ? colors.black : colors.white}
                  />
                )}
              </TouchableOpacity>
            </View>
          ) : isShowDrawerButton ? (
            <>
              <View className="p-1">
                <DrawerToggleButton tintColor={isDarkMode ? colors.black : colors.white} />
              </View>
            </>
          ) : null}
        </View>
        <View className="flex-1 flex-row items-center justify-center">
          <Text className="text-lg font-bold">{options.title}</Text>
        </View>
        <View className="flex-1 flex-row items-center justify-end gap-2">{headerRight}</View>
      </View>
    </SafeAreaView>
  );
};
