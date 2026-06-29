export type LeaveReasonCode =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13';

export type LeaveTypeCode =
  | 'COM'
  | 'LND'
  | 'EOL'
  | 'LPA'
  | 'EL'
  | 'HPL'
  | 'ML'
  | 'SL'
  | 'WPL'
  | 'PL';

export interface LeaveReason {
  code_text: string;
  code_value: LeaveReasonCode;
}

export interface LeaveType {
  leave_cd: LeaveTypeCode;
  leave_desc: string;
}
