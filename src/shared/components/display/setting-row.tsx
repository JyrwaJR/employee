import React from 'react';
import { View, TouchableOpacity, Switch } from 'react-native';
import { Text } from '@components/ui/text';
import { Icon } from '@components/ui/icon';
import { cn } from '@utils/helpers/cn';
interface SettingRowProps {
  icon: string;
  label: string;
  description?: string;
  isDestructive?: boolean;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showBorder?: boolean;
  value?: boolean;
  onValueChange?: (val: boolean) => void;
  iconColor?: string;
}

export const SettingRow = ({
  icon,
  label,
  description,
  isDestructive,
  onPress,
  rightElement,
  showBorder = true,
  value,
  onValueChange,
  iconColor,
}: SettingRowProps) => {
  const content = (
    <View
      className={cn(
        'flex-row items-center justify-between py-4',
        showBorder ? 'border-b border-gray-100 dark:border-gray-800' : ''
      )}>
      <View className="flex-row items-center gap-4">
        <View
          className={cn(
            'items-center justify-center rounded-full p-2',
            isDestructive ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-slate-800'
          )}>
          <Icon
            name={icon}
            size={20}
            color={iconColor || (isDestructive ? '#EF4444' : '#64748B')}
          />
        </View>
        <View>
          <Text
            className={cn(
              'text-base font-medium',
              isDestructive ? 'text-red-600' : 'text-gray-900 dark:text-white'
            )}>
            {label}
          </Text>
          {description && (
            <Text className="text-xs text-gray-500 dark:text-gray-400">{description}</Text>
          )}
        </View>
      </View>

      {rightElement ? (
        rightElement
      ) : onValueChange !== undefined ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
          thumbColor={value ? '#2563EB' : '#F3F4F6'}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      ) : (
        <Icon name="chevron-right" size={20} color="#CBD5E1" />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};
