import { METHODS } from '@utils/constants';
import { rnFetchBlobClient } from './rn-fetch-blob-client';
import { ApiResponse } from '../../types/api';

export type RpcRequest<TParams = unknown> = {
  method: METHODS;
  params?: TParams;
};

export const rpc = async <TResult, TParams = unknown>(
  functionName: string,
  params?: TParams
): Promise<ApiResponse<TResult>> => {
  return rnFetchBlobClient.post<TResult>('/make_request', {
    functionName,
    ...params,
  });
};
