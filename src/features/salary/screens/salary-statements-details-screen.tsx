import React from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Container } from '@components/layout/container';
import { Text } from '@components/ui/text';
import { Icon } from '@components/ui/icon';
import { DetailRow } from '@components/common/detail-row';
import { SectionHeader } from '@components/common/section-header';
import { MoneyRow } from '@components/common/money-row';
import { useSalaryStatement } from '../hooks';
import { GovtHeader } from '@components/common/govt-header';
import { SummaryCard } from '@components/common/summary-card';
import { StackHeader } from '@components/layout';
import { useAuthStore } from '@stores/auth.store';
import { SalaryStatementsDetailSkeleton } from '../components/skeleton';

type Props = { salaryId: string };

export const SalaryStatementDetailsScreen = ({ salaryId }: Props) => {
  const { user } = useAuthStore();
  const {
    data,
    refetch,
    isLoading,
    isFetching,
    earningsList,
    deductionsList,
    totalEarnings,
    totalDeductions,
    netPay,
  } = useSalaryStatement(salaryId);

  if (isLoading)
    return (
      <>
        <StackHeader />
        <SalaryStatementsDetailSkeleton />
      </>
    );

  return (
    <Container className="flex-1">
      <ScrollView
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}>
        <GovtHeader
          title={user?.emp_dept || 'Central Government Department'}
          subtitle={user?.emp_date_of_joining || 'New Delhi'}
          badge={`${data?.month} ${data?.year}`}
        />
        <SummaryCard
          label="Net Pay Disbursed"
          amount={`₹${netPay.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
        />
        {/* Employee Details Grid */}
        ...
        <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
            Employee Particulars
          </Text>
          <DetailRow
            label="Name"
            // Assuming user object has first_name/last_name as strings based on typical auth context
            value={`${user?.emp_fname || ''} ${user?.emp_lname || ''}`}
          />
          <DetailRow label="Designation" value={user?.emp_designation || '-'} />
          <DetailRow label="Emp Code" value={user?.emp_cd || '-'} />
          <DetailRow label="PAN No" value={user?.emp_pan_number || '-'} />
          <DetailRow label="Scale | Level" value={user?.pay_scale || '-'} />
        </View>
        {/* Earnings Section */}
        <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <SectionHeader title="Earnings" icon="💰" />
          {earningsList.map((item, index) => (
            <MoneyRow key={index} label={item.label} value={item.value} />
          ))}
          <MoneyRow label="Gross Salary" value={totalEarnings} isBold />
        </View>
        {/* Deductions Section */}
        <View className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <SectionHeader title="Deductions" icon="📉" />
          {deductionsList.map((item, index) => (
            <MoneyRow key={index} label={item.label} value={item.value} isDeduction />
          ))}
          <MoneyRow label="Total Deductions" value={totalDeductions} isBold isDeduction />
        </View>
        {/* Actions */}
        <View className="mb-10 flex-row gap-4">
          <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-slate-800">
            <Icon name="download-outline" size={20} color="#3B82F6" />
            <Text className="font-semibold text-blue-600 dark:text-blue-400">Download PDF</Text>
          </TouchableOpacity>
        </View>
        {/* Footer Note */}
        <Text variant="subtext" className="mb-10 px-8 text-center text-xs leading-5">
          This is a computer-generated payslip. No signature is required. Generated via NIC e-HRMS.
        </Text>
      </ScrollView>
    </Container>
  );
};
