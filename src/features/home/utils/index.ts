import { Leave } from '@sharedTypes/leave';

export function isActiveLeave(leave: Leave): boolean {
  const today = new Date();
  const from = new Date(leave.from_dt1);
  const to = new Date(leave.to_dt1);
  return today >= from && today <= to;
}
