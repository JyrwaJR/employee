import type { ReactNode } from 'react';

export interface PageHeaderConfig {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  bottomContent?: ReactNode;
  background?: string;
}

export const PAGE_HEADERS = {
  '/settings': { title: 'Settings', showBackButton: true },
  '/announcements': { title: 'Announcement Board', showBackButton: true },
  '/employees': { title: 'Employees', showBackButton: true },
  '/employees/[id]': { title: 'Employee Details', showBackButton: true },
  '/employees/[id]/salary': { title: 'Salary History', showBackButton: true },
  '/employees/salary/[id]': { title: 'Pay Slip', showBackButton: true },
  '/pension/[id]': { title: 'Pension Slip', showBackButton: true },
} as const satisfies Record<string, PageHeaderConfig>;

export type PageHeaderRoute = keyof typeof PAGE_HEADERS;
