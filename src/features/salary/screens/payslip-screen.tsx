import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Container } from '@components/layout/container';
import { LoadingScreen } from '@components/screens/loading-screen';
import { Text } from '@components/ui/text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DetailRow } from '@components/display/detail-row';
import { SectionHeader } from '@components/base/section-header';
import { MoneyRow } from '@components/display/money-row';
import { usePayslipData } from '../hooks';
import { GovtHeader } from '@components/display/govt-header';
import { SummaryCard } from '@components/display/summary-card';

type Props = { salaryId: string };

export const PayslipScreen = ({ salaryId }: Props) => {
  const { data, isFetching, earningsList, deductionsList, totalEarnings, totalDeductions, netPay } =
    usePayslipData(salaryId);

  if (isFetching) return <LoadingScreen />;

  const summaryDetails = [
    {
      label: 'Pay Level',
      value: data?.employee?.pay_level ? `L-${data.employee.pay_level}` : '-',
    },
    {
      label: 'Bank Acct',
      value: data?.employee?.bank_account_no
        ? `•••• ${data.employee.bank_account_no.slice(-4)}`
        : '-',
    },
    { label: 'Status', value: data?.status || 'PAID' },
  ];

  return (
    <Container className="flex-1">
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <GovtHeader
          title={data?.employee?.department || 'Central Government Department'}
          subtitle={data?.employee?.office_location || 'New Delhi'}
          badge={`${data?.month} ${data?.year}`}
        />
        <SummaryCard
          label="Net Pay Disbursed"
          amount={`₹${netPay.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          details={summaryDetails}
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
            value={`${data?.employee?.user?.first_name || ''} ${data?.employee?.user?.last_name || ''}`}
          />
          <DetailRow label="Designation" value={data?.employee?.designation || '-'} />
          <DetailRow label="Emp ID" value={data?.employee?.employee_id || '-'} />
          <DetailRow label="PAN No" value={data?.employee?.pan_number || '-'} />
          <DetailRow label="PRAN (NPS)" value={data?.employee?.pran_number || '-'} />
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
            <MaterialCommunityIcons name="download-outline" size={20} color="#3B82F6" />
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
