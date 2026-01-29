import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Share } from 'react-native';
import { Container } from '../../common/Container';
import { cn } from '@/src/libs/cn';

// --- Mock Data: Central Govt Employee (Level 10) ---
const SALARY_DATA = {
  month: 'January 2026',
  org: {
    name: 'Ministry of Electronics & IT',
    sub: 'National Informatics Centre (NIC)',
    location: 'New Delhi',
  },
  employee: {
    name: 'Amit Kumar Sharma',
    designation: 'Senior Technical Officer',
    empId: 'GOV-2024-8821',
    pan: 'ABCDE1234F',
    pran: '110022334455', // Permanent Retirement Account Number (NPS)
    level: '10', // Pay Matrix Level
    cell: '1',
    bankAcct: 'XXXX-XXXX-9876',
  },
  earnings: [
    { label: 'Basic Pay', value: 56100.0 },
    { label: 'Dearness Allowance (DA) @ 50%', value: 28050.0 },
    { label: 'House Rent Allowance (HRA)', value: 15147.0 }, // ~27% for Class X City
    { label: 'Transport Allowance (TA)', value: 7200.0 },
    { label: 'DA on TA', value: 3600.0 },
  ],
  deductions: [
    { label: 'NPS Contribution (Tier-I)', value: 8415.0 }, // 10% of (Basic + DA)
    { label: 'CGEGIS', value: 60.0 }, // Insurance
    { label: 'CGHS Contribution', value: 650.0 }, // Health Scheme
    { label: 'Income Tax (TDS)', value: 8500.0 },
    { label: 'Professional Tax', value: 200.0 },
  ],
};

// Calculations
const TOTAL_EARNINGS = SALARY_DATA.earnings.reduce((acc, curr) => acc + curr.value, 0);
const TOTAL_DEDUCTIONS = SALARY_DATA.deductions.reduce((acc, curr) => acc + curr.value, 0);
const NET_PAY = TOTAL_EARNINGS - TOTAL_DEDUCTIONS;

// --- Components ---

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View className="mb-2 flex-row justify-between">
    <Text className="text-sm font-medium text-gray-500">{label}</Text>
    <Text className="text-sm font-semibold text-gray-900">{value}</Text>
  </View>
);

const MoneyRow = ({
  label,
  value,
  isBold = false,
  isDeduction = false,
}: {
  label: string;
  value: number;
  isBold?: boolean;
  isDeduction?: boolean;
}) => (
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

// --- Main Screen ---

export const PayslipScreen = () => {
  const handleDownload = () => {
    Share.share({
      message: `Salary Slip for ${SALARY_DATA.month} generated. Net Pay: ₹${NET_PAY}`,
    });
  };

  return (
    <Container className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Government Header Block */}
        <View className="mb-8 items-center">
          <View className="mb-3 h-12 w-12 items-center justify-center opacity-80">
            {/* Use an SVG of the Ashoka Chakra or Emblem here */}
            <Text className="text-3xl">🏛️</Text>
          </View>
          <Text className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Government of India
          </Text>
          <Text className="text-center text-lg font-bold text-gray-900">
            {SALARY_DATA.org.name}
          </Text>
          <Text className="text-center text-sm text-gray-500">{SALARY_DATA.org.sub}</Text>
          <View className="mt-4 rounded-full bg-gray-200 px-4 py-1">
            <Text className="text-xs font-bold uppercase text-gray-600">{SALARY_DATA.month}</Text>
          </View>
        </View>

        {/* Net Pay Hero Card */}
        <View className="mb-6 rounded-3xl bg-gray-900 p-6 shadow-xl shadow-blue-900/20">
          <Text className="mb-1 text-sm font-medium text-gray-400">Net Pay Disbursed</Text>
          <Text className="mb-6 text-4xl font-bold text-white">
            ₹{NET_PAY.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>

          <View className="mb-4 h-[1px] w-full bg-gray-700" />

          <View className="flex-row justify-between">
            <View>
              <Text className="mb-1 text-xs text-gray-400">Pay Level</Text>
              <Text className="font-semibold text-white">L-{SALARY_DATA.employee.level}</Text>
            </View>
            <View>
              <Text className="mb-1 text-xs text-gray-400">Bank Acct</Text>
              <Text className="font-semibold text-white">{SALARY_DATA.employee.bankAcct}</Text>
            </View>
            <View>
              <Text className="mb-1 text-xs text-gray-400">Days Worked</Text>
              <Text className="font-semibold text-white">31</Text>
            </View>
          </View>
        </View>

        {/* Employee Details Grid */}
        <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
            Employee Particulars
          </Text>
          <DetailRow label="Employee Name" value={SALARY_DATA.employee.name} />
          <DetailRow label="Designation" value={SALARY_DATA.employee.designation} />
          <DetailRow label="Emp ID" value={SALARY_DATA.employee.empId} />
          <DetailRow label="PAN No" value={SALARY_DATA.employee.pan} />
          <DetailRow label="PRAN (NPS)" value={SALARY_DATA.employee.pran} />
        </View>

        {/* Earnings Section */}
        <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <SectionHeader title="Earnings" icon="💰" />
          {SALARY_DATA.earnings.map((item, index) => (
            <MoneyRow key={index} label={item.label} value={item.value} />
          ))}
          <MoneyRow label="Gross Salary" value={TOTAL_EARNINGS} isBold />
        </View>

        {/* Deductions Section */}
        <View className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <SectionHeader title="Deductions" icon="📉" />
          {SALARY_DATA.deductions.map((item, index) => (
            <MoneyRow key={index} label={item.label} value={item.value} isDeduction />
          ))}
          <MoneyRow label="Total Deductions" value={TOTAL_DEDUCTIONS} isBold isDeduction />
        </View>

        {/* Footer Note */}
        <Text className="mb-10 px-8 text-center text-xs leading-5 text-gray-400">
          This is a computer-generated payslip. No signature is required. Generated via NIC e-HRMS.
        </Text>
      </ScrollView>

      {/* Floating Action Button for PDF */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          activeOpacity={0.9}
          className="h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
          <Text className="text-xl text-white">⬇️</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};
