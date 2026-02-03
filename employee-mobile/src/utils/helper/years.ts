import { Month } from '@/src/types/employee';

const thisYear = new Date().getFullYear();

export const years = Array.from({ length: 100 }, (_, i) => String(thisYear - i));

export const months: Month[] = [
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
