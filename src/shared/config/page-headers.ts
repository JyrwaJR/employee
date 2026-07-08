import type { ReactNode } from 'react';

export interface PageHeaderConfig {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showDrawer?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  bottomContent?: ReactNode;
  background?: string;
}

export const PAGE_HEADERS = {
  // TABS
  '/': { title: 'Home', showDrawer: true },
  '/statement': { title: 'Statements', showDrawer: true },
  '/leaves': { title: 'My Leaves', showDrawer: true },
  '/pension': { title: 'Pensions', showDrawer: true },
  '/profile': { title: 'My Profile', showDrawer: true },

  // pages
  '/settings': { title: 'Settings', showBackButton: true },
  '/announcements': { title: 'Announcement Board', showBackButton: true },
  '/employees': { title: 'Employees', showBackButton: true },
  '/employees/[id]': { title: 'Employee Details', showBackButton: true },
  '/employees/[id]/salary': { title: 'Salary History', showBackButton: true },
  '/employees/salary/[id]': { title: 'Pay Slip', showBackButton: true },
  '/pension/[id]': { title: 'Pension Slip', showBackButton: true },
  '/auth/sign-up': { title: 'Sign Up', showBackButton: true },
  '/auth/forgot-password': { title: 'Forgot Password', showBackButton: true },
  '/dev/ui-lab': { title: 'UI Laboratory', showBackButton: true },
  '/leaves/[id]': { title: 'My Leaves', showBackButton: true },
  '/leaves/create': { title: 'Apply for Leaves', showBackButton: true },
  '/ui-lab': { title: 'Ui Lab', showBackButton: true },
  '/tax': { title: 'Income Tax', showBackButton: false, showDrawer: true },
  '/tax/detail': { title: 'Tax Computation', showBackButton: true },
  '/tax/edit': { title: 'Edit Tax Details', showBackButton: true },
  '/tax/create': { title: 'New Tax Record', showBackButton: true },
} as const satisfies Record<string, PageHeaderConfig>;

export type PageHeaderRoute = keyof typeof PAGE_HEADERS;
