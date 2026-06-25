import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@components/ui/text';
import { TabRouteT } from '@sharedTypes/tab';

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  insets,
  tabConfig,
}: any & { tabConfig: TabRouteT[] }) => {
  return (
    <View
      className="flex-row items-center justify-center gap-0 border-t border-gray-200 bg-white px-4 py-2 shadow-sm dark:border-gray-800 dark:bg-slate-950"
      style={{ paddingBottom: insets.bottom + 8 }}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const config = tabConfig.find((t: TabRouteT) => t.name === route.name);
        const iconName = config?.icon || 'help';
        const label =
          (options.tabBarLabel as string) || options.title || config?.title || route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            testID={`TAB_${route.name.toUpperCase().replace('INDEX', 'HOME')}`}
            className="flex-1 items-center justify-center p-2">
            <MaterialIcons
              name={iconName}
              size={24}
              color={isFocused ? '#2563EB' : '#9CA3AF'}
              style={{ marginBottom: 4 }}
            />
            <Text
              variant="subtext"
              size="xs"
              style={{
                color: isFocused ? '#2563EB' : '#9CA3AF',
                fontWeight: isFocused ? '600' : '500',
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
