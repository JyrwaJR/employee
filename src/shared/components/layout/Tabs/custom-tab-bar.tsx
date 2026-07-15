import { TouchableOpacity, View } from 'react-native';
import { Text } from '@components/ui/text';
import { Icon } from '@components/ui/icon';
import { TabRouteT } from '@sharedTypes/tab';
import { cn } from '@utils/helpers/cn';

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  insets,
  tabConfig,
}: any & { tabConfig: TabRouteT[] }) => {
  return (
    <View
      className="flex-row items-center justify-center gap-0 border-t border-border bg-background px-4 py-2 shadow-sm"
      style={{ paddingBottom: insets.bottom + 8 }}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const config = tabConfig.find((t: TabRouteT) => t.name === route.name);
        const iconName = config?.icon || 'help-circle-outline';
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
            <Icon name={iconName} size={24} color={isFocused ? '#024ad8' : '#636363'} />
            <Text
              variant="subtext"
              size="xs"
              className={cn(isFocused ? 'font-semibold text-primary' : 'text-graphite')}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
