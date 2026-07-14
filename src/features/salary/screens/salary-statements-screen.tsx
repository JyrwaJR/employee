import React, { useState } from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { Container } from '@components/layout/container';
import { useSalaryStatements } from '../hooks';
import { EmptyScreen } from '@components/screens';
import { FilterCard, SectionHeader } from '@components/common';
import { SalaryStatementsListSkeleton } from '../components/skeleton';
import { months, years } from '@utils/helpers';
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
        <View className="p-4">
          <FilterCard
            year={selectedYear}
            years={years}
            onYearChange={(value) => setSelectedYear(value)}
            month={selectedMonth}
            months={months}
            onMonthChange={(value) => setSelectedMonth(value)}
            isOpen
          />
        </View>
        <EmptyScreen
          title="No Statement Found"
          message="No salary statement is available for the selected month and year"
          refresh={refetch}
        />
      </Container>
    );
  }

  return (
    <Container className="flex-1">
      <SectionHeader title="Salary Statement" />
      <View className="p-4">
        <FilterCard
          year={selectedYear}
          years={years}
          onYearChange={(value) => setSelectedYear(value)}
          month={selectedMonth}
          months={months}
          onMonthChange={(value) => setSelectedMonth(value)}
          isOpen
        />
      </View>
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}>
        {/* GPF Information */}
        <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-slate-900">
          <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            GPF Information
          </Text>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-gray-500">Description</Text>
            <Text className="text-sm font-semibold text-slate-900 dark:text-white">
              {statement.gpf_desc}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500">GPF Number</Text>
            <Text className="text-sm font-semibold text-slate-900 dark:text-white">
              {statement.gpf_no}
            </Text>
          </View>
        </View>

        {/* Bank & Voucher Details */}
        <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-slate-900">
          <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Bank & Voucher Details
          </Text>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-gray-500">Bank Account</Text>
            <Text className="text-sm font-semibold text-slate-900 dark:text-white">
              {statement.bank_no}
            </Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-gray-500">Voucher Number</Text>
            <Text className="text-sm font-semibold text-slate-900 dark:text-white">
              {statement.voucher_no}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500">Voucher Date</Text>
            <Text className="text-sm font-semibold text-slate-900 dark:text-white">
              {statement.voucher_date}
            </Text>
          </View>
        </View>

        {/* Salary Breakdown */}
        <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-slate-900">
          <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
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
              <Text className="text-sm text-slate-700 dark:text-slate-300">{item.pName}</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                {item.amount}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-slate-900">
          <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Totals
          </Text>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-gray-500">Total Emolument</Text>
            <Text className="text-sm font-bold text-slate-900 dark:text-white">
              {statement.totalEmolument}
            </Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-gray-500">Total Pay Items</Text>
            <Text className="text-sm font-bold text-slate-900 dark:text-white">
              {statement.totalPayItem}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500">Net Amount (NG)</Text>
            <Text className="text-sm font-bold text-green-600 dark:text-green-400">
              {statement.totalng}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};
