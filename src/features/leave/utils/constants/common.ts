import { LeaveTypeCode } from '@sharedTypes/leave';
import type { IoniconsIconName } from '@react-native-vector-icons/ionicons';

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
 * Maps every recognised {@link LeaveTypeCode} to a matching Ionicons
 * glyph so leave cards and headers show a distinct visual per type.
 *
 * Falls back to `'calendar-outline'` when the type is unknown (e.g.
 * during loading or a new server-side type not yet in the union).
 */
export const LEAVE_ICONS: Record<LeaveTypeCode, IoniconsIconName> = {
  /** Compensatory Off */
  COM: 'heart',
  /** Leave Not Due */
  LND: 'business',
  /** Extra Ordinary Leave */
  EOL: 'sunny-outline',
  /** Leave Preparatory to Retirement */
  LPA: 'hand-left',
  /** Earned Leave */
  EL: 'umbrella',
  /** Half Pay Leave */
  HPL: 'time-outline',
  /** Maternity Leave */
  ML: 'woman',
  /** Sick Leave */
  SL: 'medkit',
  /** Work Place Leave */
  WPL: 'home',
  /** Personal / Privilege Leave */
  PL: 'shield-checkmark',
};
