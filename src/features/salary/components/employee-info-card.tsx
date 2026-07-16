import React from 'react';
import { View } from 'react-native';
import { Card } from '@components/ui/card';
import { Text } from '@components/ui/text';
import type { UserT } from '@sharedTypes/auth';

/** Props for the EmployeeInfoCard component. */
interface EmployeeInfoCardProps {
  /** The authenticated user object containing personal and employment details. */
  user: Pick<
    UserT,
    'emp_fname' | 'emp_mname' | 'emp_lname' | 'emp_dept' | 'emp_designation' | 'pay_scale'
  >;
  /** Pay in pay band amount from the salary statement (optional). */
  payInPb?: string;
  /** Grade pay amount from the salary statement (optional). */
  gradePay?: string;
  /** Currently selected month (displayed in the period row). */
  selectedMonth: string;
  /** Currently selected year (displayed in the period row). */
  selectedYear: string;
}

/** Renders the employee information card with name, department, designation, pay level, and period. */
export const EmployeeInfoCard = ({
  user,
  payInPb,
  gradePay,
  selectedMonth,
  selectedYear,
}: EmployeeInfoCardProps) => {
  const fullName = [user.emp_fname, user.emp_mname, user.emp_lname].filter(Boolean).join(' ');

  return (
    <Card variant="bordered" className="p-5">
      <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-graphite">
        Employee Information
      </Text>
      <View className="mb-2 flex-row justify-between">
        <Text className="text-sm text-graphite">Employee Name</Text>
        <Text className="max-w-[60%] text-right text-sm font-semibold text-foreground">
          {fullName}
        </Text>
      </View>
      <View className="mb-2 flex-row justify-between">
        <Text className="text-sm text-graphite">Office / Department</Text>
        <Text className="max-w-[60%] text-right text-sm font-semibold text-foreground">
          {user.emp_dept || '-'}
        </Text>
      </View>
      <View className="mb-2 flex-row justify-between">
        <Text className="text-sm text-graphite">Designation</Text>
        <Text className="max-w-[60%] text-right text-sm font-semibold text-foreground">
          {user.emp_designation || '-'}
        </Text>
      </View>
      <View className="mb-2 flex-row justify-between">
        <Text className="text-sm text-graphite">Pay Level</Text>
        <Text className="text-sm font-semibold text-foreground">{user.pay_scale || '-'}</Text>
      </View>
      {payInPb ? (
        <View className="mb-2 flex-row justify-between">
          <Text className="text-sm text-graphite">Pay in Pay Band</Text>
          <Text className="text-sm font-semibold text-foreground">{payInPb}</Text>
        </View>
      ) : null}
      {gradePay ? (
        <View className="mb-2 flex-row justify-between">
          <Text className="text-sm text-graphite">Grade Pay</Text>
          <Text className="text-sm font-semibold text-foreground">{gradePay}</Text>
        </View>
      ) : null}
      <View className="mb-2 flex-row justify-between">
        <Text className="text-sm text-graphite">Period</Text>
        <Text className="text-sm font-semibold text-foreground">
          {selectedMonth} {selectedYear}
        </Text>
      </View>
    </Card>
  );
};
