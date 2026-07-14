import React, { useState } from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { Container } from '@components/layout/container';
import { useAuthStore } from '@stores/auth.store';
import { useSalaryStatements } from '../hooks';
import { EmptyScreen } from '@components/screens';
import { FilterCard, SectionHeader } from '@components/common';
import { SalaryStatementsListSkeleton } from '../components/skeleton';
import { months, years } from '@utils/helpers';
import { Card } from '@components/ui/card';
import { Text } from '@components/ui/text';

/**
 * Displays a single salary statement for the selected month and year.
 *
 * The API returns one `SalaryStatement` object per month/year query
 * (not an array). This screen renders the statement's GPF information,
 * bank/voucher details, salary breakdown items, and totals in a
 * scrollable card-based layout.
 *
 * A month/year filter at the top lets the user pick which period to
 * view. When no statement is available for the selected period, an
 * empty state is shown.
 */
export const StatementScreen = () => {
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedMonth, setSelectedMonth] = useState<string>('JAN');
  const { user } = useAuthStore();
  const {
    data: statement,
    isLoading,
    isFetching,
    refetch,
  } = useSalaryStatements({
    month: selectedMonth,
    year: parseInt(selectedYear),
  });

  if (isLoading) {
    return <SalaryStatementsListSkeleton />;
  }

  if (!statement) {
    return (
      <Container className="flex-1">
        <SectionHeader title="Salary Statement" />
        <FilterCard
          year={selectedYear}
          years={years}
          onYearChange={(value) => setSelectedYear(value)}
          month={selectedMonth}
          months={months}
          onMonthChange={(value) => setSelectedMonth(value)}
          isOpen
        />
        <EmptyScreen
          title="No Statement Found"
          message="No salary statement is available for the selected month and year"
          refresh={refetch}
        />
      </Container>
    );
  }

  return (
    <Container className="flex-1 gap-y-2">
      <SectionHeader title="Salary Statement" />
      <FilterCard
        year={selectedYear}
        years={years}
        onYearChange={(value) => setSelectedYear(value)}
        month={selectedMonth}
        months={months}
        onMonthChange={(value) => setSelectedMonth(value)}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}>
        {/* Employee Information */}
        <Card variant="bordered" className="p-5">
          <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-graphite">
            Employee Information
          </Text>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-graphite">Employee Name</Text>
            <Text className="max-w-[60%] text-right text-sm font-semibold text-foreground">
              {[user?.emp_fname, user?.emp_mname, user?.emp_lname].filter(Boolean).join(' ')}
            </Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-graphite">Office / Department</Text>
            <Text className="max-w-[60%] text-right text-sm font-semibold text-foreground">
              {user?.emp_dept || '-'}
            </Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-graphite">Designation</Text>
            <Text className="max-w-[60%] text-right text-sm font-semibold text-foreground">
              {user?.emp_designation || '-'}
            </Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-graphite">Pay Level</Text>
            <Text className="text-sm font-semibold text-foreground">{user?.pay_scale || '-'}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-graphite">Period</Text>
            <Text className="text-sm font-semibold text-foreground">
              {selectedMonth} {selectedYear}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-graphite">GPF Number</Text>
            <Text className="text-sm font-semibold text-foreground">{statement.gpf_no}</Text>
          </View>
        </Card>

        {/* GPF Information */}
        <Card variant="bordered" className="p-5">
          <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-graphite">
            GPF Information
          </Text>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-graphite">Description</Text>
            <Text className="text-sm font-semibold text-foreground">{statement.gpf_desc}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-graphite">GPF Number</Text>
            <Text className="text-sm font-semibold text-foreground">{statement.gpf_no}</Text>
          </View>
        </Card>

        {/* Bank & Voucher Details */}
        <Card variant="bordered" className="p-5">
          <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-graphite">
            Bank & Voucher Details
          </Text>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-graphite">Bank Account</Text>
            <Text className="text-sm font-semibold text-foreground">{statement.bank_no}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-graphite">Voucher Number</Text>
            <Text className="text-sm font-semibold text-foreground">{statement.voucher_no}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-graphite">Voucher Date</Text>
            <Text className="text-sm font-semibold text-foreground">{statement.voucher_date}</Text>
          </View>
        </Card>

        {/* Salary Breakdown */}
        <Card variant="bordered" className="p-5">
          <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-graphite">
            Salary Breakdown
          </Text>
          {statement.s_data.map((item, index) => (
            <View
              key={index}
              className="flex-row justify-between py-2"
              style={{
                borderBottomWidth: index < statement.s_data.length - 1 ? 1 : 0,
                borderColor: '#E5E7EB',
              }}>
              <Text className="text-sm text-charcoal">{item.pName}</Text>
              <Text className="text-sm font-semibold text-foreground">{item.amount}</Text>
            </View>
          ))}
        </Card>

        {/* Totals */}
        <Card variant="bordered" className="p-5">
          <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-graphite">
            Totals
          </Text>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-graphite">Total Emolument</Text>
            <Text className="text-sm font-bold text-foreground">{statement.totalEmolument}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-graphite">Total Pay Items</Text>
            <Text className="text-sm font-bold text-foreground">{statement.totalPayItem}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-graphite">Net Amount (NG)</Text>
            <Text className="text-sm font-bold text-semantic-up">{statement.totalng}</Text>
          </View>
        </Card>
      </ScrollView>
    </Container>
  );
};
