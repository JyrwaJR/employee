export type UserRole = "ADMIN" | "HR" | "EMPLOYEE";

export type CityClass = "X" | "Y" | "Z";

export type Month =
  | "JANUARY"
  | "FEBRUARY"
  | "MARCH"
  | "APRIL"
  | "MAY"
  | "JUNE"
  | "JULY"
  | "AUGUST"
  | "SEPTEMBER"
  | "OCTOBER"
  | "NOVEMBER"
  | "DECEMBER";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSED"
  | "PAID"
  | "FAILED"
  | "HELD";

export type RevisionType =
  | "JOINING"
  | "ANNUAL_INCREMENT"
  | "MACP"
  | "PROMOTION"
  | "DA_HIKE"
  | "CORRECTION";

// --- Sub-Entities ---

export interface EmployeeProfileT {
  empId: string;
  designation: string;
  department: string;
  officeLocation: string;
  cityClass: CityClass;
  payLevel: number;
  payCell: number;
  dateOfJoining: string; // ISO Date String
  status: string; // 'ACTIVE' | 'RETIRED' etc.
  panNumber: string;
  pranNumber: string;
  cghsCardNo?: string;
  uanNumber?: string | null;
  bankAccountNo: string;
  bankIfsc: string;
}

export interface SalaryStructureT {
  basicPay: number;
  daRate: number;
  hraFixed: number | null;
  transportAllow: number;
  npa: number;
  isNpsActive: boolean;
  cghsTierAmount: number;
  cgegisAmount: number;
  licenseFee: number;
}

export interface SalaryRevisionT {
  effectiveDate: string; // ISO Date String
  type: RevisionType;
  prevPayLevel: number;
  prevPayCell: number;
  prevBasic: number;
  newPayLevel: number;
  newPayCell: number;
  newBasic: number;
  remarks: string;
  approvedBy: string;
}

export interface SalarySlipT {
  month: Month;
  year: number;
  status: PaymentStatus;
  paymentDate: string; // ISO Date String

  // Earnings
  basicPay: number;
  da: number;
  hra: number;
  transportAllow: number;
  daOnTa: number;
  npa: number;
  sba: number;
  arrears: number;
  bonus: number;
  totalEarnings: number;

  // Deductions
  npsTier1: number;
  cghs: number;
  cgegis: number;
  licenseFee: number;
  incomeTax: number;
  profTax: number;
  gpf: number;
  recovery: number;
  totalDeductions: number;

  // Final
  netPayable: number;
  remarks: string | null;
  generatedBy: string;
}

// --- Main User Type ---

export interface UserSalaryDataT {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;

  // Relations
  employeeProfile: EmployeeProfileT;
  currentSalaryStructure: SalaryStructureT;
  salaryRevisions: SalaryRevisionT[];
  salarySlips: SalarySlipT[];
}
