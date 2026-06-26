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
  // Need Leave Avialable in days
  // Attendance current month in percentage
};
