/**
 * Parses a `dd-mm-yyyy` date string into its year, month, and day components.
 *
 * @param dateStr - A date string in `dd-mm-yyyy` format.
 * @returns An object with `day`, `month`, and `year` as numbers, or `null` if
 *          the string is not a valid `dd-mm-yyyy` date.
 *
 * @example
 * ```ts
 * parseDDMMYYYY('15-01-2025') // { day: 15, month: 1, year: 2025 }
 * parseDDMMYYYY('invalid')    // null
 * ```
 */
function parseDDMMYYYY(dateStr: string): { day: number; month: number; year: number } | null {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  if (!day || !month || !year) return null;
  return { day, month, year };
}

/**
 * Calculates the inclusive number of days between two `dd-mm-yyyy` date strings.
 *
 * Returns `null` when either date is empty, unparseable, or when `toDate` is
 * chronologically before `fromDate` (resulting in a non-positive day count).
 *
 * @param fromDate - Start date in `dd-mm-yyyy` format.
 * @param toDate   - End date in `dd-mm-yyyy` format.
 * @returns The inclusive day count as a string (e.g. `"3"`), or `null` if the
 *          inputs are invalid or `toDate` is before `fromDate`.
 *
 * @example
 * ```ts
 * calculateDaysBetweenDates('01-01-2025', '03-01-2025') // "3"
 * calculateDaysBetweenDates('', '03-01-2025')           // null
 * ```
 */
export function calculateDaysBetweenDates(fromDate: string, toDate: string): string | null {
  if (!fromDate || !toDate) return null;

  const from = parseDDMMYYYY(fromDate);
  const to = parseDDMMYYYY(toDate);
  if (!from || !to) return null;

  const fromDateObj = new Date(from.year, from.month - 1, from.day);
  const toDateObj = new Date(to.year, to.month - 1, to.day);
  const diffMs = toDateObj.getTime() - fromDateObj.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive

  if (diffDays < 1) return null;
  return String(diffDays);
}
