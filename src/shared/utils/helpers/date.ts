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
/**
 * Formats raw digit input into a `dd-mm-yyyy` mask as the user types.
 *
 * Strips all non-digit characters from the input, then groups the digits
 * into day (2), month (2), and year (4) segments joined by dashes.
 * Partial input produces a partial mask — no trailing dashes are added
 * when a segment is incomplete (e.g. `"2"` → `"2"`, `"22"` → `"22"`,
 * `"220"` → `"22-0"`).
 *
 * Designed to be used as an `onChangeText` handler for date inputs so
 * the user never has to type the dash manually.
 *
 * @param input - The raw text from the input (digits + any typed dashes).
 * @returns The formatted `dd-mm-yyyy` string (partial or complete), or
 *          an empty string when `input` is empty.
 *
 * @example
 * ```ts
 * formatDateInput('22012025')  // "22-01-2025"
 * formatDateInput('22')        // "22"
 * formatDateInput('220')       // "22-0"
 * formatDateInput('')          // ""
 * ```
 */
export function formatDateInput(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 8);
  if (!digits) return '';

  const parts: string[] = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));

  return parts.join('-');
}

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
