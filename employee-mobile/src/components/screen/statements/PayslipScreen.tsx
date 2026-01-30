import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Container } from '../../common/Container';
import { cn } from '@/src/libs/cn';
import { Stack } from 'expo-router';
import { SALARY_ENDPOINTS } from '@/src/libs/endpoints/salary';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/src/utils/http';
import { LoadingScreen } from '../../common/LoadingScreen';
import { SalarySlip } from '@/src/types/employee';

const parseAmount = (value?: string | null): number => {
  return parseFloat(value || '0');
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View className="mb-2 flex-row justify-between">
    <Text className="text-sm font-medium text-gray-500">{label}</Text>
    <Text className="text-sm font-semibold text-gray-900">{value}</Text>
  </View>
);

type MoneyRowProps = {
  label: string;
  value: number;
  isBold?: boolean;
  isDeduction?: boolean;
};

const MoneyRow = ({ label, value, isBold = false, isDeduction = false }: MoneyRowProps) => (
  <View
    className={cn(
      'flex-row justify-between border-b border-gray-50 py-3 last:border-0',
      isBold && 'border-t border-gray-100 pt-4'
    )}>
    <Text
      className={cn('text-sm', isBold ? 'font-bold text-gray-900' : 'font-medium text-gray-600')}>
      {label}
    </Text>
    <Text
      className={cn(
        'text-sm font-medium tabular-nums',
        isBold ? 'text-base font-bold' : 'text-gray-900',
        isDeduction && !isBold && 'text-red-600'
      )}>
      {isDeduction && !isBold ? '-' : ''}₹
      {value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
    </Text>
  </View>
);

const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
  <View className="mb-4 flex-row items-center">
    <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-blue-50">
      <Text className="text-xs text-blue-600">{icon}</Text>
    </View>
    <Text className="text-lg font-bold text-gray-900">{title}</Text>
  </View>
);

type Props = { salaryId: string };

export const PayslipScreen = ({ salaryId }: Props) => {
  const url = SALARY_ENDPOINTS.GET_SALARY.replace(':salary_id', salaryId);

  const { data, isFetching } = useQuery({
    queryKey: ['salary', salaryId],
    queryFn: () => http.get<SalarySlip>(url),
    select: (res) => res.data,
    enabled: !!salaryId,
  });
  console.log(JSON.stringify(data, null, 2));
  const { earningsList, deductionsList, totalEarnings, totalDeductions, netPay } = useMemo(() => {
    if (!data) {
      return {
        earningsList: [],
        deductionsList: [],
        totalEarnings: 0,
        totalDeductions: 0,
        netPay: 0,
      };
    }

    // 1. Build Earnings Array
    const earn = [
      { label: 'Basic Pay', value: parseAmount(data.basic_pay) },
      { label: 'Dearness Allowance (DA)', value: parseAmount(data.da) },
      { label: 'House Rent Allowance (HRA)', value: parseAmount(data.hra) },
      { label: 'Transport Allowance (TA)', value: parseAmount(data.transport_allow) },
      { label: 'DA on TA', value: parseAmount(data.da_on_ta) },
      // Optional fields: Only show if > 0
      { label: 'Non-Practicing Allowance (NPA)', value: parseAmount(data.npa) },
      { label: 'Special Duty Allowance (SBA)', value: parseAmount(data.sba) },
      { label: 'Arrears', value: parseAmount(data.arrears) },
      { label: 'Bonus', value: parseAmount(data.bonus) },
    ].filter((item) => item.value > 0);

    // 2. Build Deductions Array
    const ded = [
      { label: 'NPS Contribution (Tier-I)', value: parseAmount(data.nps_tier_1) },
      { label: 'CGHS Contribution', value: parseAmount(data.cghs) },
      { label: 'CGEGIS', value: parseAmount(data.cgegis) },
      { label: 'License Fee (Govt Quarter)', value: parseAmount(data.license_fee) },
      { label: 'Income Tax (TDS)', value: parseAmount(data.income_tax) },
      { label: 'Professional Tax', value: parseAmount(data.prof_tax) },
      // Optional fields
      { label: 'GPF', value: parseAmount(data.gpf) },
      { label: 'Recovery/Advances', value: parseAmount(data.recovery) },
    ].filter((item) => item.value > 0);

    return {
      earningsList: earn,
      deductionsList: ded,
      totalEarnings: parseAmount(data.total_earnings),
      totalDeductions: parseAmount(data.total_deductions),
      netPay: parseAmount(data.net_payable),
    };
  }, [data]);

  if (isFetching) return <LoadingScreen />;

  return (
    <Container className="flex-1">
      <Stack.Screen
        options={{
          title: 'Payslip',
          headerShown: true,
          headerBackButtonDisplayMode: 'generic',
        }}
      />
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Government Header Block */}
        <View className="mb-8 items-center">
          <View className="mb-3 h-12 w-12 items-center justify-center opacity-80">
            <Text className="text-3xl">🏛️</Text>
          </View>
          <Text className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Government of India
          </Text>
          <Text className="text-center text-lg font-bold text-gray-900">
            {/* Fallback to generic if department is missing */}
            {data?.employee?.department || 'Central Government Department'}
          </Text>
          <Text className="text-center text-sm text-gray-500">
            {data?.employee?.office_location || 'New Delhi'}
          </Text>
          <View className="mt-4 rounded-full bg-gray-200 px-4 py-1">
            <Text className="text-xs font-bold uppercase text-gray-600">
              {data?.month} {data?.year}
            </Text>
          </View>
        </View>

        {/* Net Pay Hero Card */}
        <View className="mb-6 rounded-3xl bg-gray-900 p-6 shadow-xl shadow-blue-900/20">
          <Text className="mb-1 text-sm font-medium text-gray-400">Net Pay Disbursed</Text>
          <Text className="mb-6 text-4xl font-bold text-white">
            ₹{netPay.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>

          <View className="mb-4 h-[1px] w-full bg-gray-700" />

          <View className="flex-row justify-between">
            <View>
              <Text className="mb-1 text-xs text-gray-400">Pay Level</Text>
              <Text className="font-semibold text-white">
                {data?.employee?.pay_level ? `L-${data.employee.pay_level}` : '-'}
              </Text>
            </View>
            <View>
              <Text className="mb-1 text-xs text-gray-400">Bank Acct</Text>
              <Text className="font-semibold text-white">
                {data?.employee?.bank_account_no
                  ? `•••• ${data.employee.bank_account_no.slice(-4)}`
                  : '-'}
              </Text>
            </View>
            <View>
              <Text className="mb-1 text-xs text-gray-400">Status</Text>
              <Text className="font-semibold uppercase text-white">{data?.status || 'PAID'}</Text>
            </View>
          </View>
        </View>

        {/* Employee Details Grid */}
        <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
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
        <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <SectionHeader title="Earnings" icon="💰" />
          {earningsList.map((item, index) => (
            <MoneyRow key={index} label={item.label} value={item.value} />
          ))}
          <MoneyRow label="Gross Salary" value={totalEarnings} isBold />
        </View>

        {/* Deductions Section */}
        <View className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <SectionHeader title="Deductions" icon="📉" />
          {deductionsList.map((item, index) => (
            <MoneyRow key={index} label={item.label} value={item.value} isDeduction />
          ))}
          <MoneyRow label="Total Deductions" value={totalDeductions} isBold isDeduction />
        </View>

        {/* Footer Note */}
        <Text className="mb-10 px-8 text-center text-xs leading-5 text-gray-400">
          This is a computer-generated payslip. No signature is required. Generated via NIC e-HRMS.
        </Text>
      </ScrollView>
    </Container>
  );
};
