import { EndpointT } from '@/src/types/endpoints';

type EmployeeEndPoints = 'GET_EMPLOYEEE' | 'GET_EMPLOYEES';

export const EMPLOYEE_ENDPOINTS: EndpointT<EmployeeEndPoints> = {
  GET_EMPLOYEEE: '/employees/:id',
  GET_EMPLOYEES: '/employees',
};
