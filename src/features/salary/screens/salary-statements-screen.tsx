import React, { useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { Container } from '@components/layout/container';
import { useSalaryStatements } from '../hooks';
import { EmptyScreen } from '@components/screens';
import { FilterCard, SectionHeader } from '@components/common';
import { SalaryStatementsListSkeleton } from '../components/skeleton';
import { getCurrentYear, getPreviousMonth, months } from '@utils/helpers';
import { useSalaryYears } from '@hooks/use-salary-years';
import {
  EmployeeInfoCard,
  GPFInfoCard,
  BankVoucherCard,
  SalaryBreakdownCard,
  TotalsCard,
  NetPayWordsCard,
} from '../components';

const currentMonth: string = getPreviousMonth();
const currentYear: string = getCurrentYear().toString();

/**
 * Displays a single salary statement for the selected month and year.
 *
 * Delegates distinct sections of the statement to individual card components:
 * - EmployeeInfoCard — authenticated user details + pay information
 * - GPFInfoCard — GPF description and number
 * - BankVoucherCard — bank account and voucher details
 * - SalaryBreakdownCard — line-item salary breakdown
 * - TotalsCard — aggregated totals (emolument, pay items, net amounts)
 * - NetPayWordsCard — net pay expressed in words (conditional)
 *
 * A month/year filter at the top lets the user pick which period to
 * view. When no statement is available for the selected period, an
 * empty state is shown.
 */
export const StatementScreen = () => {
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth.toUpperCase());
  const {
    data: salaryYears,
    isFetching: isFetchingSalYear,
    isLoading: isLoadingSalYear,
  } = useSalaryYears();

  const {
    data: statement,
    isLoading,
    isFetching,
    refetch,
  } = useSalaryStatements({
    month: selectedMonth,
    year: parseInt(selectedYear),
  });

  if (isLoading || isLoadingSalYear) {
    return <SalaryStatementsListSkeleton />;
  }

  if (!statement) {
    return (
      <Container className="flex-1">
        <SectionHeader title="Salary Statement" />
        <FilterCard
          year={selectedYear}
          years={salaryYears?.map((year) => year.sal_year)}
          onYearChange={(value) => setSelectedYear(value)}
          month={selectedMonth}
          months={months}
          onMonthChange={(value) => setSelectedMonth(value)}
          isOpen={isFetchingSalYear || isLoadingSalYear ? false : true}
        />
        <EmptyScreen
          title="No Statement Found"
          message="No salary statement is available for the selected month and year"
          refresh={refetch}
        />
      </Container>
    );
  }

  return (
    <Container className="flex-1 gap-y-2">
      <FilterCard
        year={selectedYear}
        years={salaryYears?.map((year) => year.sal_year)}
        onYearChange={(value) => setSelectedYear(value)}
        month={selectedMonth}
        months={months}
        onMonthChange={(value) => setSelectedMonth(value)}
        isOpen={isFetchingSalYear || isLoadingSalYear ? false : undefined}
      />
      <ScrollView
        className="flex-1 gap-y-2"
        contentContainerClassName="gap-y-2"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}>
        <EmployeeInfoCard
          payInPb={statement.pay_in_pb}
          gradePay={statement.grade_pay}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />

        <GPFInfoCard gpfDesc={statement.gpf_desc} gpfNo={statement.gpf_no} />

        <BankVoucherCard
          bankNo={statement.bank_no}
          voucherNo={statement.voucher_no}
          voucherDate={statement.voucher_date}
        />

        <SalaryBreakdownCard items={statement.s_data} />

        <TotalsCard
          totalEmolument={statement.totalEmolument}
          totalPayItem={statement.totalPayItem}
          totalng={statement.totalng}
          netPay={statement.net_pay}
        />

        {statement.net_pay_in_word ? (
          <NetPayWordsCard netPayInWord={statement.net_pay_in_word} />
        ) : null}
      </ScrollView>
    </Container>
  );
};
