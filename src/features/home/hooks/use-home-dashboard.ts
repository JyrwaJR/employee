import { HomeDashboardT } from '../types/dashboard';

export function useHomeDashboard(): {
  data: HomeDashboardT;
  isFetching: boolean;
} {
  return {
    data: {
      leaveBalance: {
        annual: { used: 18, total: 30 },
        sick: { used: 4, total: 10 },
      },
      attendance: {
        present: 18,
        workingDays: 22,
      },
      activeLeave: {
        type: 'Annual Leave',
        startDate: '2026-06-28',
        endDate: '2026-06-30',
        status: 'APPROVED',
        days: 3,
      },
      announcements: [
        {
          id: '1',
          title: 'Office Holiday on July 15',
          date: '2026-06-24',
          preview: 'The office will remain closed on July 15th on account of...',
        },
        {
          id: '2',
          title: 'New HR Policy Update',
          date: '2026-06-20',
          preview: 'Please review the updated work-from-home policy on the...',
        },
        {
          id: '3',
          title: 'Salary Credited for June',
          date: '2026-06-01',
          preview: 'Salaries for the month of June have been credited to...',
        },
      ],
    },
    isFetching: false,
  };
}
