/**
 * Text manipulation utilities.
 *
 * @module text
 */

/** Options for the truncation position and ellipsis character. */
type TruncateOptionsT = {
  /** Where to apply the ellipsis: start, middle, or end (default `"end"`). */
  position?: 'end' | 'middle' | 'start';
  /** Ellipsis character(s) to append (default `"..."`). */
  ellipsis?: string;
};

/** Input properties for {@link truncateText}. */
type TruncateProps = {
  /** The text to truncate. */
  text: string;
  /** Maximum length including the ellipsis (default `20`). */
  maxLength?: number;
  /** Truncation behaviour options. */
  options?: TruncateOptionsT;
};

/**
 * Truncates text based on length and position.
 *
 * Supports truncation at the start, middle, or end of the string,
 * with a configurable ellipsis character.
 *
 * @returns The truncated string.
 *
 * @example
 * ```ts
 * truncateText({ text: "Hello World", maxLength: 8 })            // "Hello..."
 * truncateText({ text: "Hello World", maxLength: 8, options: { position: 'middle' } }) // "He...rld"
 * ```
 */
export const truncateText = ({ text, maxLength = 20, options }: TruncateProps): string => {
  const { position = 'end', ellipsis = '...' } = { ...options };

  const ellipsisLength = ellipsis.length;
  const displayLength = maxLength - ellipsisLength;

  if (text.length <= maxLength) return text;
  if (displayLength <= 0) return ellipsis;

  const half = Math.floor(displayLength / 2);

  switch (position) {
    case 'start':
      return ellipsis + text.slice(-displayLength);
    case 'middle':
      return text.slice(0, half) + ellipsis + text.slice(-half);
    case 'end':
    default:
      return text.slice(0, displayLength) + ellipsis;
  }
};
