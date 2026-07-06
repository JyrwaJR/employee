/**
 * Returns Tailwind CSS classes and icon data for a given status label.
 *
 * Supports three statuses — `'Verified'`, `'Pending'`, and `'Rejected'` —
 * each with distinct colour schemes (green, orange, red). Any unrecognised
 * status falls back to a neutral gray theme.
 *
 * @param status - The status label (e.g. `'Verified'`, `'Pending'`, `'Rejected'`).
 * @returns An object containing background/text class names, icon colour, and icon name.
 */
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAID':
    case 'Verified':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-400',
        icon: '#166534',
        iconName: 'check-circle' as string,
        border: 'border-green-800 dark:border-green-400',
      };
    case 'Entry':
    case 'Pending':
      return {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-800 dark:text-orange-400',
        icon: '#C2410C',
        iconName: 'clock-outline' as string,
        border: 'border-orange-800 dark:border-orange-400',
      };
    case 'Rejected':
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-400',
        icon: '#991B1B',
        iconName: 'close-circle' as string,
        border: 'border-red-800 dark:border-red-400',
      };
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-800 dark:text-gray-400',
        icon: '#4B5563',
        iconName: 'help-circle' as string,
        border: 'border-gray-800 dark:border-gray-400',
      };
  }
};
