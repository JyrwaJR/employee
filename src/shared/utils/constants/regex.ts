/**
 * Common validation regex patterns.
 *
 * @module regex
 */

/** Matches strings containing only digits (empty string also matches). */
export const ONLY_NUMBER_REGEX = /^[0-9]*$/;

/** Matches strings containing only ASCII letters (empty string also matches). */
export const ONLY_LETTER_REGEX = /^[a-zA-Z]*$/;

/** Matches any string that contains at least one special character. */
export const SPECIAL_CHARACTER_REGEX = /[!@#$%^&*(),.?":{}|<>_\-\\[\]`~+=;/]/;

/** Matches any string that contains a lowercase ASCII letter. */
export const LOWERCASE_LETTER_REGEX = /[a-z]/;

/** Matches any string that contains an uppercase ASCII letter. */
export const UPPERCASE_LETTER_REGEX = /[A-Z]/;

/** Matches any string that contains a digit. */
export const NUMBER_REGEX = /\d/;
