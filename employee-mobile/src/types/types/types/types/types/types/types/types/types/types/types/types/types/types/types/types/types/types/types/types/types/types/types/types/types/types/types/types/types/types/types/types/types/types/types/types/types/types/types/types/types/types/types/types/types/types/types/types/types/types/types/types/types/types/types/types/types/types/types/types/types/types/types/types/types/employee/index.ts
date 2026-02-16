import { UserT } from '../context/auth';

export type CityClass = 'X' | 'Y' | 'Z';

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export type Month =
  | 'JANUARY'
  | 'FEBRUARY'
  | 'MARCH'
  | 'APRIL'
  | 'MAY'
  | 'JUNE'
  | 'JULY'
  | 'AUGUST'
  | 'SEPTEMBER'
  | 'OCTOBER'
  | 'NOVEMBER'
  | 'DECEMBER';

export type SalarySlipStatus = 'PENDING' | 'PROCESSED' | 'PAID' | 'FAILED' | 'HELD';

// ===== Salary Slip =====
export type SalarySlip = {
  id: string;
  employee_id: string;
  month: Month;
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
  employee: EmployeeT;
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

// ===== Employee Core =====
export type EmployeeT = {
  id: string;
  userId: string;
  employee_id: string;
  designation: string;
  department: string;
  office_location: string;
  city_class: CityClass;
  pay_level: number;
  pay_cell: number;
  date_of_joining: string;
  status: EmployeeStatus;

  pan_number: string | null;
  pran_number: string | null;
  cghs_card_no: string | null;
  uan_number: string | null;
  bank_account_no: string | null;
  bank_ifsc: string | null;

  createdAt: string;
  updatedAt: string;

  salary_slips: SalarySlip[];
  current_structure: CurrentSalaryStructure;
  user: UserT;
};
