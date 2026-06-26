import { UserT } from '@sharedTypes/auth';

export type CityClass = 'X' | 'Y' | 'Z';

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

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

  // salary_slips: SalarySlip[];
  // current_structure: CurrentSalaryStructure;
  user: UserT;
};
