import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Container } from '@components/layout/container';
import { Text } from '@components/ui/text';
import { Card } from '@components/ui/card';
import { Icon } from '@components/ui/icon';
import { MoneyRow } from '@components/common/money-row';
import { SectionHeader } from '@components/common/section-header';
import { DetailRow } from '@components/common/detail-row';
import { GovtHeader } from '@components/common/govt-header';
import { SummaryCard } from '@components/common/summary-card';

export const PensionDetailScreen = () => {
  const { id: _id } = useLocalSearchParams();

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

  const summaryDetails = [
    { label: 'PPO No', value: data.ppoNo },
    { label: 'Bank Acct', value: '•••• 4567' },
    { label: 'Status', value: data.status },
  ];

  return (
    <Container className="flex-1">
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <GovtHeader
          title="Dept of Pension & Pensioners Welfare"
          subtitle="New Delhi"
          badge={`${data.month} ${data.year}`}
        />
        <SummaryCard
          label="Net Pension Disbursed"
          amount={`₹${data.netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          details={summaryDetails}
        />
        {/* Pensioner Details Grid */}
        ...
        <Card variant="bordered" className="mb-6 p-5">
          <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-graphite">
            Pensioner Particulars
          </Text>
          <DetailRow label="Name" value={data.name} />
          <DetailRow label="Bank Name" value={data.bankName} />
          <DetailRow label="PAN No" value={data.pan} />
        </Card>
        {/* Earnings Section */}
        <Card variant="bordered" className="mb-6 p-5">
          <SectionHeader title="Earnings" icon="💰" />
          {earningsList.map((item, index) => (
            <MoneyRow key={index} label={item.label} value={item.value} />
          ))}
          <MoneyRow label="Gross Pension" value={data.grossAmount} isBold />
        </Card>
        {/* Deductions Section */}
        <Card variant="bordered" className="mb-8 p-5">
          <SectionHeader title="Deductions" icon="📉" />
          {deductionsList.map((item, index) => (
            <MoneyRow key={index} label={item.label} value={item.value} isDeduction />
          ))}
          <MoneyRow label="Total Deductions" value={data.totalDeductions} isBold isDeduction />
        </Card>
        {/* Footer Note */}
        <Text variant="subtext" className="mb-6 px-8 text-center text-xs leading-5">
          This is a computer-generated pension slip. No signature is required. Generated via NIC
          e-HRMS.
        </Text>
        {/* Actions */}
        <View className="mb-10 flex-row gap-4">
          <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-card p-4">
            <Icon name="download-outline" size={20} color="#024ad8" />
            <Text className="font-semibold text-primary">Download PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
};
