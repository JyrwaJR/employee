import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@components/ui/skeleton';
import { Container } from '@components/layout/container';
import { GovtHeaderSkeleton } from '@components/skeleton/govt-header';

/**
 * Skeleton placeholder that mimics the {@link SummaryCard} component.
 *
 * Layout:
 * - "Net Pay Disbursed" label
 * - Large rupee amount
 * - 3 detail rows (Pay Level, Bank Acct, Status)
 */
const SummaryCardSkeleton = () => (
  <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <Skeleton className="mb-2 h-3 w-32 rounded" />
    <Skeleton className="mb-4 h-8 w-40 rounded-md" />
    <View className="gap-y-2">
      {['Pay Level', 'Bank Acct', 'Status'].map((_, i) => (
        <View key={i} className="flex-row items-center justify-between">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-3 w-28 rounded" />
        </View>
      ))}
    </View>
  </View>
);

/**
 * Skeleton placeholder that mimics the "Employee Particulars" details card.
 *
 * Layout:
 * - Section title "Employee Particulars"
 * - 5 info rows: Name, Designation, Emp Code, PAN No, Scale | Level
 */
const EmployeeDetailsSkeleton = () => (
  <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <Skeleton className="mb-4 h-4 w-36 rounded" />
    {['Name', 'Designation', 'Emp Code', 'PAN No', 'Scale | Level'].map((_, i) => (
      <View key={i} className="mb-4 flex-row items-center justify-between">
        <Skeleton className="h-3 w-16 rounded" />
        <Skeleton className="h-4 w-36 rounded" />
      </View>
    ))}
  </View>
);

/**
 * Skeleton placeholder that mimics the Earnings or Deductions section card.
 *
 * Layout:
 * - Section title with emoji icon placeholder
 * - 4 item rows (label + value)
 * - Total row (bold)
 */
const MoneySectionSkeleton = ({
  hasIcon = true,
}: {
  /** Whether to show an icon placeholder next to the title. Defaults to true. */
  hasIcon?: boolean;
}) => (
  <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <View className="mb-4 flex-row items-center gap-2">
      {hasIcon && <Skeleton className="h-5 w-5 rounded" />}
      <Skeleton className="h-4 w-28 rounded" />
    </View>
    {Array.from({ length: 4 }).map((_, i) => (
      <View key={i} className="mb-3 flex-row items-center justify-between">
        <Skeleton className="h-3 w-32 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
      </View>
    ))}
    <View className="mt-1 border-t border-gray-100 pt-3 dark:border-gray-800">
      <View className="flex-row items-center justify-between">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
      </View>
    </View>
  </View>
);

/**
 * Skeleton loading state for the salary statement details screen.
 *
 * Renders stacked skeleton cards that mirror the detail screen layout:
 * `GovtHeader` → `SummaryCard` → `EmployeeParticulars` → `Earnings` →
 * `Deductions` → Download button → Footer note.
 *
 * The `StackHeader` is NOT included here — it is rendered separately by
 * the screen so the back button remains interactive during loading.
 *
 * @example
 * ```tsx
 * <>
 *   <StackHeader />
 *   <SalaryStatementsDetailSkeleton />
 * </>
 * ```
 */
export const SalaryStatementsDetailSkeleton = () => (
  <Container className="flex-1">
    <View>
      {/* GovtHeader placeholder */}
      <GovtHeaderSkeleton />

      {/* SummaryCard placeholder */}
      <SummaryCardSkeleton />

      {/* Employee Particulars placeholder */}
      <EmployeeDetailsSkeleton />

      {/* Earnings section placeholder */}
      <MoneySectionSkeleton />

      {/* Deductions section placeholder */}
      <MoneySectionSkeleton />

      {/* Download button placeholder */}
      <Skeleton className="mb-4 h-12 w-full rounded-md" />

      {/* Footer note placeholder */}
      <View className="mb-10 items-center px-8">
        <Skeleton className="h-3 w-full rounded" />
      </View>
    </View>
  </Container>
);
