import { EndpointT } from '@/src/types/endpoints';

type EndPoints = 'POST_REG_PUSH_TOKEN' | 'POST_UNREG_PUSH_TOKEN';

export const NOTIFICATION_ENDPOINTS: EndpointT<EndPoints> = {
  POST_REG_PUSH_TOKEN: '/notification/register',
  POST_UNREG_PUSH_TOKEN: '/notification/unregister',
};
