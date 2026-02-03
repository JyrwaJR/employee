import { EndpointT } from '@/src/types/endpoints';

type EndPoints = 'GET_LEAVES' | 'GET_LEAVE';

export const LEAVE_ENDPOINTS: EndpointT<EndPoints> = {
  GET_LEAVES: '/employees/:id/leave',
  GET_LEAVE: '/employees/:id/leave/:leaveId',
};
