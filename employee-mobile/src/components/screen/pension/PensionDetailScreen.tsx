import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Container } from '@/src/components/common/Container';
import { Header } from '@/src/components/common/Header';
import { Text } from '@/src/components/ui/text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MoneyRow } from '../../common/MoneyRow';
import { SectionHeader } from '../../common/SectionHeader';
import { DetailRow } from '../../common/DetailRow';

export const PensionDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // In a real app, fetch data based on ID. Using Mock Data for now corresponding to ID 1
  const data = {
    month: 'January',
    year: '2025',
    name: 'Suresh Kumar',
    ppoNo: '123456789012',
    bankAcct: 'XXXX-XXXX-4567',
    bankName: 'State Bank of India',
    pan: 'ABCDE1234F',
    basicPension: 45000,
    da: 22500,
    medicalAllowance: 1000,
    otherAllowance: 500,
    grossAmount: 69000,
    commutation: 5000,
    incomeTax: 2000,
    recovery: 500,
    totalDeductions: 7500,
    netPayable: 61500,
    status: 'CREDITED',
  };

  const earningsList = [
    { label: 'Basic Pension', value: data.basicPension },
    { label: 'Dearness Relief (DA)', value: data.da },
    { label: 'Medical Allowance', value: data.medicalAllowance },
    { label: 'Other Allowances', value: data.otherAllowance },
  ];

  const deductionsList = [
    { label: 'Commutation Deduction', value: data.commutation },
    { label: 'Income Tax (TDS)', value: data.incomeTax },
    { label: 'Recovery', value: data.recovery },
  ];

  return (
    <>
      <Header title={`Pension Slip`} showBackButton={true} />
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
              Dept of Pension & Pensioners Welfare
            </Text>
            <Text variant="subtext" className="text-center text-sm">
              New Delhi
            </Text>
            <View className="mt-4 rounded-full bg-gray-200 px-4 py-1 dark:bg-gray-800">
              <Text className="text-xs font-bold uppercase text-gray-600 dark:text-gray-300">
                {data.month} {data.year}
              </Text>
            </View>
          </View>

          {/* Net Pay Hero Card */}
          <View className="mb-6 rounded-3xl bg-blue-600 p-6 shadow-xl shadow-blue-900/20 dark:bg-blue-700">
            <Text className="mb-1 text-sm font-medium text-blue-100">Net Pension Disbursed</Text>
            <Text className="mb-6 text-4xl font-bold text-white">
              ₹{data.netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>

            <View className="mb-4 h-[1px] w-full bg-blue-500/50" />

            <View className="flex-row justify-between">
              <View>
                <Text className="mb-1 text-xs text-blue-200">PPO No</Text>
                <Text className="font-semibold text-white">{data.ppoNo}</Text>
              </View>
              <View>
                <Text className="mb-1 text-xs text-blue-200">Bank Acct</Text>
                <Text className="font-semibold text-white">•••• 4567</Text>
              </View>
              <View>
                <Text className="mb-1 text-xs text-blue-200">Status</Text>
                <Text className="font-semibold uppercase text-white">{data.status}</Text>
              </View>
            </View>
          </View>

          {/* Pensioner Details Grid */}
          <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              Pensioner Particulars
            </Text>
            <DetailRow label="Name" value={data.name} />
            <DetailRow label="Bank Name" value={data.bankName} />
            <DetailRow label="PAN No" value={data.pan} />
          </View>

          {/* Earnings Section */}
          <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <SectionHeader title="Earnings" icon="💰" />
            {earningsList.map((item, index) => (
              <MoneyRow key={index} label={item.label} value={item.value} />
            ))}
            <MoneyRow label="Gross Pension" value={data.grossAmount} isBold />
          </View>

          {/* Deductions Section */}
          <View className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <SectionHeader title="Deductions" icon="📉" />
            {deductionsList.map((item, index) => (
              <MoneyRow key={index} label={item.label} value={item.value} isDeduction />
            ))}
            <MoneyRow label="Total Deductions" value={data.totalDeductions} isBold isDeduction />
          </View>

          {/* Footer Note */}
          <Text variant="subtext" className="mb-6 px-8 text-center text-xs leading-5">
            This is a computer-generated pension slip. No signature is required. Generated via NIC
            e-HRMS.
          </Text>

          {/* Actions */}
          <View className="mb-10 flex-row gap-4">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-slate-800">
              <MaterialCommunityIcons name="download-outline" size={20} color="#3B82F6" />
              <Text className="font-semibold text-blue-600 dark:text-blue-400">Download PDF</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Container>
    </>
  );
};
