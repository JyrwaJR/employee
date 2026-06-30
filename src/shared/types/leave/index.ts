/**
 * Represents a single leave request record returned from the backend API.
 *
 * Each leave record includes the leave type, date range, reason, and
 * verification status. Date fields are provided in two formats:
 * `DD/MM/YYYY` (display) and `YYYY-MM-DD` (machine / sorting).
 *
 * @example
 * ```ts
 * const leave: Leave = {
 *   from_dt: '01/06/2026',
 *   from_dt1: '2026-06-01',
 *   leave_cd: 'SL',
 *   leave_desc: 'Sick Leave',
 *   no_days: '3',
 *   order_dt: '25/05/2026',
 *   order_dt1: '2026-05-25',
 *   reason_for_leave: 'Medical appointment',
 *   to_dt: '03/06/2026',
 *   to_dt1: '2026-06-03',
 *   verify_flg_desc: 'Approved',
 * };
 * ```
 */
export interface Leave {
  /** Leave start date in `DD/MM/YYYY` display format. */
  from_dt: string;

  /** Leave start date in `YYYY-MM-DD` machine format (ISO-8601 compatible). */
  from_dt1: string;

  /** Leave type code (e.g. `SL` for Sick Leave, `VL` for Vacation Leave). */
  leave_cd: string;

  /** Human-readable leave type description (e.g. `Sick Leave`). */
  leave_desc: string;

  /** Number of leave days as a string (parsed from the backend). */
  no_days: string;

  /** Order / approval date in `DD/MM/YYYY` display format. */
  order_dt: string;

  /** Order / approval date in `YYYY-MM-DD` machine format (ISO-8601 compatible). */
  order_dt1: string;

  /** Free-text reason provided by the employee for the leave request. */
  reason_for_leave: string;

  /** Leave end date in `DD/MM/YYYY` display format. */
  to_dt: string;

  /** Leave end date in `YYYY-MM-DD` machine format (ISO-8601 compatible). */
  to_dt1: string;

  /** Verification / approval status description (e.g. `Approved`, `Pending`). */
  verify_flg_desc: string;
}
export type LeaveBal = {};
