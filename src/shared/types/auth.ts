export type RoleT = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export type UserT = {
  id: number;
  emp_cd: string;
  emp_fname: string;
  emp_mname: string;
  emp_lname: string;
  emp_birth_dt: string;
  emp_sex: 'M' | 'F' | 'O';
  emp_role: RoleT;
  emp_dept: string;
  emp_email: string;
  emp_address: string;
  emp_phone: string;
  emp_status: string;
  emp_designation: string;
  emp_date_of_joining: string;
  emp_city_class: 'B ';
  emp_bank_account_no: string | null;
  emp_bank_ifsc: string | null;
  emp_pan_number: string | null;
  pay_scale: string | null;
};
