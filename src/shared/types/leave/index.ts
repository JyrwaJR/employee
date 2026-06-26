export type LeaveCodeT = 'COM' | 'EL' | 'SL';

export interface Leave {
  leave_cd: LeaveCodeT;
  order_dt: string; // DD-MM-YYYY
  reason_for_leave: string;
  verify_flg_desc: string;
  from_dt: string; // DD-MM-YYYY
  to_dt: string; // DD-MM-YYYY
  no_days: string;
  leave_desc: string;
  order_dt1: string; // YYYY-MM-DD
  from_dt1: string; // YYYY-MM-DD
  to_dt1: string; // YYYY-MM-DD
}
