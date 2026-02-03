import { EndpointT } from '@/src/types/endpoints';

type EndPoints = 'GET_PENSIONS' | 'GET_PENSION';

export const PENSION_ENDPOINTS: EndpointT<EndPoints> = {
  GET_PENSIONS: '/employees/:id/pension',
  GET_PENSION: '/employees/:id/pension/:pensionId',
};
