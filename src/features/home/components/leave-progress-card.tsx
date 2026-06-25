import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '@components/ui/card';
import { Text } from '@components/ui/text';
import { LeaveBalanceT } from '../types/dashboard';

interface ProgressBarProps {
  label: string;
  used: number;
  total: number;
  color: string;
}

const ProgressBar = ({ label, used, total, color }: ProgressBarProps) => {
  const percentage = total > 0 ? used / total : 0;
  return (
    <View className="mb-4">
      <View className="mb-1.5 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Text>
        <Text className="text-sm font-semibold text-gray-900 dark:text-white">
          {used}/{total}
        </Text>
      </View>
      <View className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <View
          className="h-full rounded-full"
          style={{
            width: `${Math.min(percentage * 100, 100)}%`,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
};

interface LeaveProgressCardProps {
  annual: LeaveBalanceT;
  sick: LeaveBalanceT;
  present: number;
  workingDays: number;
}

export const LeaveProgressCard = ({
  annual,
  sick,
  present,
  workingDays,
}: LeaveProgressCardProps) => (
  <Card className="mx-6">
    <CardContent className="p-5">
      <Text variant="heading" size="lg" className="mb-4 text-gray-900 dark:text-white">
        Leave & Attendance
      </Text>
      <ProgressBar label="Annual Leave" used={annual.used} total={annual.total} color="#3B82F6" />
      <ProgressBar label="Sick Leave" used={sick.used} total={sick.total} color="#F59E0B" />
      <ProgressBar label="Present (Month)" used={present} total={workingDays} color="#10B981" />
    </CardContent>
  </Card>
);
