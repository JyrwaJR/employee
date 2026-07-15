import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Container } from '@components/layout/container';
import { Text } from '@components/ui/text';
import { Button } from '@components/ui/button';
import { router } from 'expo-router';
import { TaxDetailSkeleton } from '../components/skeleton';
import { GovtHeader } from '@components/common/govt-header';
import { SummaryCard } from '@components/common/summary-card';
import { SectionHeader } from '@components/common/section-header';
import { EmptyScreen } from '@components/screens';
import { DetailRow } from '@components/common/detail-row';
import { Card } from '@components/ui/card';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { useEmployeeTax } from '../hooks';
import { useAuthStore } from '@stores/auth.store';
import { cn } from '@utils/helpers/cn';

export const EmployeeTaxDetailScreen = () => {
  const { user } = useAuthStore();
  const { data, isFetching, isLoading, refetch } = useEmployeeTax();

  if (isLoading) return <TaxDetailSkeleton />;

  if (!data) {
    return (
      <EmptyScreen
        title="No Tax Data"
        message="Tax data is not yet available for this employee."
        refresh={refetch}
      />
    );
  }

  return (
    <Container className="flex-1">
      <ScrollView
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}
        className="flex-1"
        showsVerticalScrollIndicator={false}>
        <GovtHeader
          title={user?.emp_fname + ' ' + user?.emp_lname}
          subtitle={user?.emp_designation}
        />
        <SummaryCard
          label="Total Income Tax"
          amount={'Rs ' + data.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        />

        <Card variant="bordered" className="mb-6 p-5">
          <Text
            variant="subtext"
            size="xs"
            className="mb-4 font-bold uppercase tracking-wider text-graphite">
            Employee Particulars
          </Text>
          <DetailRow label="Name" value={data.employeeName} />
          <DetailRow label="Designation" value={data.designation} />
          <DetailRow label="PAN" value={data.panNumber} />
          <DetailRow label="Department" value={data.department} />
        </Card>

        <Card variant="bordered" className="mb-6 p-5">
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
        </Card>

        <Card variant="bordered" className="mb-6 p-5">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-1">
              <SectionHeader title="Tax Computation" />
            </View>

            <View
              className={cn(
                'rounded-full px-3 py-1',
                data.regime === 'NEW' ? 'bg-primary-soft' : 'bg-amber-100 dark:bg-amber-900/30'
              )}>
              <Text
                variant="caption-sm"
                className={cn(
                  'font-bold',
                  data.regime === 'NEW' ? 'text-primary' : 'text-amber-700 dark:text-amber-400'
                )}>
                {data.regime === 'NEW' ? 'New Regime' : 'Old Regime'}
              </Text>
            </View>
          </View>
          <View className="rounded-md bg-surface-soft p-3">
            <View className="mb-2 flex-row border-b border-border pb-2">
              <Text variant="subtext" size="xs" className="flex-[2] font-bold uppercase">
                Slab
              </Text>
              <Text variant="subtext" size="xs" className="flex-1 text-right font-bold uppercase">
                Rate
              </Text>
              <Text variant="subtext" size="xs" className="flex-1 text-right font-bold uppercase">
                Amount
              </Text>
              <Text variant="subtext" size="xs" className="flex-1 text-right font-bold uppercase">
                Tax
              </Text>
            </View>
            {data.slabBreakdown.map((slab, index) => (
              <View
                key={index}
                className={cn(
                  'flex-row py-2',
                  index < data.slabBreakdown.length - 1 && 'border-b border-border/50'
                )}>
                <Text variant="subtext" size="xs" className="flex-[2] text-charcoal">
                  {slab.label}
                </Text>
                <Text
                  variant="subtext"
                  size="xs"
                  className="flex-1 text-right font-medium text-charcoal">
                  {slab.rate}%
                </Text>
                <Text variant="subtext" size="xs" className="flex-1 text-right text-graphite">
                  Rs {slab.taxableAmount.toLocaleString('en-IN')}
                </Text>
                <Text
                  variant="subtext"
                  size="xs"
                  className="flex-1 text-right font-semibold text-foreground">
                  Rs {slab.taxAtSlab.toLocaleString('en-IN')}
                </Text>
              </View>
            ))}
          </View>
          <View className="mt-4 rounded-md bg-surface-soft p-3">
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
        </Card>

        {data.regime === 'OLD' && (
          <Card variant="bordered" className="mb-6 p-5">
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
          </Card>
        )}

        <Card variant="bordered" className="mb-6 p-5">
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
          <View className="mt-3 flex-row items-center justify-between rounded-lg bg-surface-soft p-3">
            <Text variant="subtext" size="xs" className="font-medium uppercase text-charcoal">
              Filing Status
            </Text>
            <Text
              variant="body-emphasis"
              className={cn(
                data.filingStatus === 'PROCESSED'
                  ? 'text-semantic-up'
                  : data.filingStatus === 'FILED'
                    ? 'text-[var(--accent-yellow)]'
                    : 'text-destructive'
              )}>
              {data.filingStatus === 'PROCESSED'
                ? 'Processed'
                : data.filingStatus === 'FILED'
                  ? 'Filed'
                  : 'Not Filed'}
            </Text>
          </View>
        </Card>

        <Button onPress={() => router.push(PAGE_ROUTES.TAX.EDIT)}>Edit Tax Details</Button>
      </ScrollView>
    </Container>
  );
};
