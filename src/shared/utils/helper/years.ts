import { MonthT } from '../../types/common';

const thisYear = new Date().getFullYear();

export const years = Array.from({ length: 100 }, (_, i) => String(thisYear - i));

export const months: MonthT[] = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];
