import { LeaveTypeCode } from '@features/leave/types';

export const LEAVE_TYPES: Record<LeaveTypeCode, LeaveTypeCode> = {
  COM: 'COM',
  LND: 'LND',
  EOL: 'EOL',
  LPA: 'LPA',
  EL: 'EL',
  HPL: 'HPL',
  ML: 'ML',
  SL: 'SL',
  WPL: 'WPL',
  PL: 'PL',
};

/**
 * Maps every recognised {@link LeaveTypeCode} to a matching
 * `MaterialCommunityIcons` glyph so leave cards and headers show
 * a distinct visual per type.
 *
 * Falls back to `'calendar-blank'` when the type is unknown (e.g.
 * during loading or a new server-side type not yet in the union).
 */
export const LEAVE_ICONS: Record<LeaveTypeCode, string> = {
  /** Compensatory Off */
  COM: 'heart',
  /** Leave Not Due */
  LND: 'bank',
  /** Extra Ordinary Leave */
  EOL: 'beach',
  /** Leave Preparatory to Retirement */
  LPA: 'human-greeting',
  /** Earned Leave */
  EL: 'umbrella',
  /** Half Pay Leave */
  HPL: 'clock-outline',
  /** Maternity Leave */
  ML: 'human-female',
  /** Sick Leave */
  SL: 'medical-bag',
  /** Work Place Leave */
  WPL: 'home-account',
  /** Personal / Privilege Leave */
  PL: 'shield-star',
};
