import { MonthT } from '@sharedTypes/common';

export type SalarySlipStatus = 'PENDING' | 'PROCESSED' | 'PAID' | 'FAILED' | 'HELD';

// ===== Salary Slip =====
export type SalarySlip = {
  id: string;
  employee_id: string;
  month: MonthT;
  year: number;
  status: SalarySlipStatus;
  payment_date: string | null;

  basic_pay: string;
  da: string;
  hra: string;
  transport_allow: string;
  da_on_ta: string;
  npa: string;
  sba: string;
  arrears: string;
  bonus: string;
  total_earnings: string;

  nps_tier_1: string;
  cghs: string;
  cgegis: string;
  license_fee: string;
  income_tax: string;
  prof_tax: string;
  gpf: string;
  recovery: string;
  total_deductions: string;

  net_payable: string;
  remarks: string;
  generated_by: string | null;
  created_at: string; // ISO date
  structure: CurrentSalaryStructure;
};

// ===== Current Salary Structure =====
export type CurrentSalaryStructure = {
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
