import { METHODS } from '@utils/constants';
import { ApiResponse } from '../../types/api';
import { http } from './http';

export type RpcRequest<TParams = unknown> = {
  method: METHODS;
  params?: TParams;
};

export const rpc = async <TResult, TParams = unknown>(
  functionName: string,
  params?: TParams
): Promise<ApiResponse<TResult>> => {
  return http.post<TResult>('/make_request', {
    functionName,
    ...params,
  });
};
