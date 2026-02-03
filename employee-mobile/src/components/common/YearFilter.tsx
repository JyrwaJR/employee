import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { cn } from '@/src/libs/cn';

type Props = {
    selected: boolean;
    year: string;
    onPress: () => void;
};

export const YearFilter = ({ selected, year, onPress }: Props) => (
    <TouchableOpacity
        onPress={onPress}
        className={cn(
            'mr-3 rounded-full border px-5 py-2',
            selected
                ? 'border-blue-600 bg-blue-600'
                : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
        )}>
        <Text
            className={cn(
                'text-sm font-semibold',
                selected ? 'text-white' : 'text-gray-600 dark:text-gray-300'
            )}>
            {year}
        </Text>
    </TouchableOpacity>
);
