import { EndpointT } from '@/src/types/endpoints';

type SalaryEndPoints = 'GET_EMPLOYEEE_SALARY' | 'GET_SALARY';

export const SALARY_ENDPOINTS: EndpointT<SalaryEndPoints> = {
  GET_EMPLOYEEE_SALARY: '/salary',
  GET_SALARY: '/salary/:salary_id',
};
