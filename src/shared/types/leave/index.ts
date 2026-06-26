export type LeaveType = 'COM' | 'EL' | 'SL' | 'HPL';

export type LeaveStatus = 'Verified' | 'Pending' | 'Rejected';

export type LeaveBal = {
  closing_bal: number;
  closing_bal_as_on: string;
  leave_desc: string;
  leave_type: LeaveType;
  no_days_credited: number;
  opening_bal: number;
};

export type Leave = {
  id: string;
  leave_cd: LeaveType;
  order_dt: string;
  reason_for_leave: string;
  verify_flg_desc: LeaveStatus;
  from_dt: string;
  to_dt: string;
  no_days: string;
  leave_desc: string;
  order_dt1: string;
  from_dt1: string;
  to_dt1: string;
};

export type LeaveResponse = {
  emp_leave_bal_data: LeaveBal[];
  emp_leave_data: Leave[];
};
