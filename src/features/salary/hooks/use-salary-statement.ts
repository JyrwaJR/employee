import { useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { METHODS, QUERY_KEYS, STALE_TIMES } from '@utils/constants';
import { toast } from '@components/ui';
import { rpc } from '@utils/api';
import { useAuthStore } from '@stores/auth.store';
import { SalaryStatement } from '@sharedTypes/satatement';

const parseAmount = (value?: string | null): number => {
  return parseFloat(value || '0');
};

export const useSalaryStatement = (salaryId: string) => {
  const { emp_cd, isSignedIn } = useAuthStore();

  const query = useQuery({
    queryKey: QUERY_KEYS.SALARY.PAYSLIP(salaryId, emp_cd),
    queryFn: () =>
      rpc<SalaryStatement>(METHODS.GET_EMP_SALARY_STATEMENTS_DETAILS, {
        emp_cd,
        statement_id: salaryId,
      }),
    staleTime: STALE_TIMES.SALARY,
    select: (res) => res.data,
    enabled: !!salaryId && isSignedIn,
  });

  const { data, refetch, isError, error, isFetching, isLoading } = query;

  useEffect(() => {
    if (isError) {
      toast.error('Access Error', {
        description: (error as any)?.message || 'Could not retrieve payroll details',
      });
    }
  }, [isError, error]);

  const parsedData = useMemo(() => {
    if (!data) {
      return {
        earningsList: [],
        deductionsList: [],
        totalEarnings: 0,
        totalDeductions: 0,
        netPay: 0,
      };
    }

    const earn = [
      { label: 'Basic Pay', value: parseAmount(data.basic_pay) },
      { label: 'Dearness Allowance (DA)', value: parseAmount(data.da) },
      { label: 'House Rent Allowance (HRA)', value: parseAmount(data.hra) },
      { label: 'Transport Allowance (TA)', value: parseAmount(data.transport_allow) },
      { label: 'DA on TA', value: parseAmount(data.da_on_ta) },
      { label: 'Non-Practicing Allowance (NPA)', value: parseAmount(data.npa) },
      { label: 'Special Duty Allowance (SBA)', value: parseAmount(data.sba) },
      { label: 'Arrears', value: parseAmount(data.arrears) },
      { label: 'Bonus', value: parseAmount(data.bonus) },
    ].filter((item) => item.value > 0);

    const ded = [
      { label: 'NPS Contribution (Tier-I)', value: parseAmount(data.nps_tier_1) },
      { label: 'CGHS Contribution', value: parseAmount(data.cghs) },
      { label: 'CGEGIS', value: parseAmount(data.cgegis) },
      { label: 'License Fee (Govt Quarter)', value: parseAmount(data.license_fee) },
      { label: 'Income Tax (TDS)', value: parseAmount(data.income_tax) },
      { label: 'Professional Tax', value: parseAmount(data.prof_tax) },
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

  return {
    data,
    isLoading,
    isFetching,
    refetch,
    isError,
    error,
    ...parsedData,
  };
};
