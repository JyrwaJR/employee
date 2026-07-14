export type SalaryStatementStatus = 'PENDING' | 'PROCESSED' | 'PAID' | 'FAILED' | 'HELD';

export type SalaryStructure = {
  id: string;
  employee_id: string;
  basic_pay: string;
  da_rate: string;
  hra_fixed: string | null;
  transport_allow: string;
  npa: string;
  is_nps_active: boolean;
  cghs_tier_amount: string;
  cgegis_amount: string;
  license_fee: string;
  effective_date: string; // ISO date
  updated_at: string; // ISO date
};

type SalaryItem = {
  pName: string;
  amount: string;
};

export type SalaryStatement = {
  gpf_desc: string;
  gpf_no: string;
  bank_no: string;
  voucher_no: string;
  voucher_date: string; // Format: DD/MM/YYYY
  s_data: SalaryItem[];
  totalEmolument: number;
  totalPayItem: number;
  totalng: number;
};
