import React from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Container } from '@components/layout/container';
import { Text } from '@components/ui/text';
import { router } from 'expo-router';
import { LoadingScreen } from '@components/screens/loading-screen';
import { GovtHeader } from '@components/common/govt-header';
import { SummaryCard } from '@components/common/summary-card';
import { SectionHeader } from '@components/common/section-header';
import { DetailRow } from '@components/common/detail-row';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { useEmployeeTax } from '@features/income-tax/hooks';

export default function EmployeeTaxDetailScreen() {
  const { data, isFetching, isLoading, refetch } = useEmployeeTax();

  if (isLoading) return <LoadingScreen />;

  if (!data) {
    return (
      <Container className="flex-1 items-center justify-center p-6">
        <Text className="text-gray-500">No tax data available for this employee.</Text>
      </Container>
    );
  }

  return (
    <Container className="flex-1">
      <ScrollView
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}>
        <GovtHeader
          title={data.employeeName}
          subtitle={data.designation}
          badge={'FY ' + data.financialYear}
        />
        <SummaryCard
          label="Total Income Tax"
          amount={'Rs ' + data.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        />

        <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
            Employee Particulars
          </Text>
          <DetailRow label="Name" value={data.employeeName} />
          <DetailRow label="Designation" value={data.designation} />
          <DetailRow label="PAN" value={data.panNumber} />
          <DetailRow label="Department" value={data.department} />
        </View>

        <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <SectionHeader title="Income Summary" />
          <DetailRow
            label="Gross Annual Income"
            value={'Rs ' + data.grossAnnualIncome.toLocaleString('en-IN')}
          />
          <DetailRow
            label="Standard Deduction"
            value={'Rs ' + data.standardDeduction.toLocaleString('en-IN')}
          />
          <DetailRow
            label="Taxable Income"
            value={'Rs ' + data.taxableIncome.toLocaleString('en-IN')}
          />
        </View>

        <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <View className="mb-4 flex-row items-center justify-between">
            <SectionHeader title="Tax Computation" />
            <View
              className={
                'rounded-full px-3 py-1 ' +
                (data.regime === 'NEW'
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : 'bg-amber-100 dark:bg-amber-900/30')
              }>
              <Text
                className={
                  'text-xs font-bold ' +
                  (data.regime === 'NEW'
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-amber-700 dark:text-amber-400')
                }>
                {data.regime === 'NEW' ? 'New Regime' : 'Old Regime'}
              </Text>
            </View>
          </View>
          <View className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
            <View className="mb-2 flex-row border-b border-gray-200 pb-2 dark:border-gray-700">
              <Text className="flex-[2] text-xs font-bold uppercase text-gray-500">Slab</Text>
              <Text className="flex-1 text-right text-xs font-bold uppercase text-gray-500">
                Rate
              </Text>
              <Text className="flex-1 text-right text-xs font-bold uppercase text-gray-500">
                Amount
              </Text>
              <Text className="flex-1 text-right text-xs font-bold uppercase text-gray-500">
                Tax
              </Text>
            </View>
            {data.slabBreakdown.map((slab, index) => (
              <View
                key={index}
                className={
                  'flex-row py-2 ' +
                  (index < data.slabBreakdown.length - 1
                    ? 'border-b border-gray-100 dark:border-gray-700/50'
                    : '')
                }>
                <Text className="flex-[2] text-xs text-gray-700 dark:text-gray-300">
                  {slab.label}
                </Text>
                <Text className="flex-1 text-right text-xs font-medium text-gray-700 dark:text-gray-300">
                  {slab.rate}%
                </Text>
                <Text className="flex-1 text-right text-xs text-gray-600 dark:text-gray-400">
                  Rs {slab.taxableAmount.toLocaleString('en-IN')}
                </Text>
                <Text className="flex-1 text-right text-xs font-semibold text-gray-900 dark:text-white">
                  Rs {slab.taxAtSlab.toLocaleString('en-IN')}
                </Text>
              </View>
            ))}
          </View>
          <View className="mt-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
            <DetailRow label="Base Tax" value={'Rs ' + data.baseTax.toLocaleString('en-IN')} />
            <DetailRow
              label="Rebate u/s 87A"
              value={'Rs ' + data.rebate87A.toLocaleString('en-IN')}
            />
            <DetailRow label="Surcharge" value={'Rs ' + data.surcharge.toLocaleString('en-IN')} />
            <DetailRow
              label="Health & Education Cess (4%)"
              value={'Rs ' + data.cess.toLocaleString('en-IN')}
            />
            <DetailRow
              label="Total Tax Liability"
              value={'Rs ' + data.totalTax.toLocaleString('en-IN')}
            />
            <DetailRow label="Effective Tax Rate" value={data.effectiveTaxRate.toFixed(2) + '%'} />
          </View>
        </View>

        {data.regime === 'OLD' && (
          <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <SectionHeader title="Deductions Claimed" />
            <DetailRow
              label="Section 80C (PF, ELSS, Insurance)"
              value={'Rs ' + data.deductions80C.toLocaleString('en-IN')}
            />
            <DetailRow
              label="Section 80D (Health Insurance)"
              value={'Rs ' + data.deductions80D.toLocaleString('en-IN')}
            />
            <DetailRow
              label="HRA Exemption"
              value={'Rs ' + data.hraExemption.toLocaleString('en-IN')}
            />
            <DetailRow
              label="LTA Exemption"
              value={'Rs ' + data.ltaExemption.toLocaleString('en-IN')}
            />
            <DetailRow
              label="Home Loan Interest u/s 24(b)"
              value={'Rs ' + data.homeLoanInterest.toLocaleString('en-IN')}
            />
            <DetailRow
              label="NPS u/s 80CCD(1B)"
              value={'Rs ' + data.npsContribution.toLocaleString('en-IN')}
            />
          </View>
        )}

        <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <SectionHeader title="Payment Summary" />
          <DetailRow
            label="TDS Deducted"
            value={'Rs ' + data.tdsDeducted.toLocaleString('en-IN')}
          />
          <DetailRow
            label="Tax Paid (Self-Assessment)"
            value={'Rs ' + data.taxPaid.toLocaleString('en-IN')}
          />
          <DetailRow label="Tax Payable" value={'Rs ' + data.taxPayable.toLocaleString('en-IN')} />
          <View className="mt-3 flex-row items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <Text className="text-xs font-medium uppercase text-gray-500">Filing Status</Text>
            <Text
              className={
                'text-sm font-bold ' +
                (data.filingStatus === 'PROCESSED'
                  ? 'text-green-600'
                  : data.filingStatus === 'FILED'
                    ? 'text-amber-600'
                    : 'text-red-600')
              }>
              {data.filingStatus === 'PROCESSED'
                ? 'Processed'
                : data.filingStatus === 'FILED'
                  ? 'Filed'
                  : 'Not Filed'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push(PAGE_ROUTES.TAX.EDIT)}
          className="mb-10 flex-row items-center justify-center rounded-xl bg-blue-600 p-4">
          <Text className="font-semibold text-white">Edit Tax Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
}
