import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Container } from '../../common/Container';
import { SALARY_ENDPOINTS } from '@/src/libs/endpoints/salary';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/src/utils/http';
import { LoadingScreen } from '../../common/LoadingScreen';
import { SalarySlip } from '@/src/types/employee';
import { Text } from '../../ui/text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DetailRow } from '../../common/DetailRow';
import { SectionHeader } from '../../common/SectionHeader';
import { MoneyRow } from '../../common/MoneyRow';

const parseAmount = (value?: string | null): number => {
  return parseFloat(value || '0');
};

type Props = { salaryId: string };

export const PayslipScreen = ({ salaryId }: Props) => {
  const url = SALARY_ENDPOINTS.GET_SALARY.replace(':salary_id', salaryId);

  const { data, isFetching } = useQuery({
    queryKey: ['salary', salaryId],
    queryFn: () => http.get<SalarySlip>(url),
    select: (res) => res.data,
    enabled: !!salaryId,
  });
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
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Government Header Block */}
        <View className="mb-8 items-center">
          <View className="mb-3 h-12 w-12 items-center justify-center opacity-80">
            <Text className="text-3xl">🏛️</Text>
          </View>
          <Text className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Government of India
          </Text>
          <Text variant="heading" size="lg" className="text-center text-gray-900 dark:text-white">
            {/* Fallback to generic if department is missing */}
            {data?.employee?.department || 'Central Government Department'}
          </Text>
          <Text variant="subtext" className="text-center text-sm">
            {data?.employee?.office_location || 'New Delhi'}
          </Text>
          <View className="mt-4 rounded-full bg-gray-200 px-4 py-1 dark:bg-gray-800">
            <Text className="text-xs font-bold uppercase text-gray-600 dark:text-gray-300">
              {data?.month} {data?.year}
            </Text>
          </View>
        </View>

        {/* Net Pay Hero Card */}
        <View className="mb-6 rounded-3xl bg-blue-600 p-6 shadow-xl shadow-blue-900/20 dark:bg-blue-700">
          <Text className="mb-1 text-sm font-medium text-blue-100">Net Pay Disbursed</Text>
          <Text className="mb-6 text-4xl font-bold text-white">
            ₹{netPay.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>

          <View className="mb-4 h-[1px] w-full bg-blue-500/50" />

          <View className="flex-row justify-between">
            <View>
              <Text className="mb-1 text-xs text-blue-200">Pay Level</Text>
              <Text className="font-semibold text-white">
                {data?.employee?.pay_level ? `L-${data.employee.pay_level}` : '-'}
              </Text>
            </View>
            <View>
              <Text className="mb-1 text-xs text-blue-200">Bank Acct</Text>
              <Text className="font-semibold text-white">
                {data?.employee?.bank_account_no
                  ? `•••• ${data.employee.bank_account_no.slice(-4)}`
                  : '-'}
              </Text>
            </View>
            <View>
              <Text className="mb-1 text-xs text-blue-200">Status</Text>
              <Text className="font-semibold uppercase text-white">{data?.status || 'PAID'}</Text>
            </View>
          </View>
        </View>

        {/* Employee Details Grid */}
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
