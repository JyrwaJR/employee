import { useMutation } from '@tanstack/react-query';
import RNFetchBlob from 'rn-fetch-blob';
import { TokenStoreManager } from '@stores/token.store';

const BASIC_AUTH_TOKEN = process.env.EXPO_PUBLIC_BASIC_AUTH;

const API_URL = process.env.EXPO_PUBLIC_API_OAUTH_URL;

const url = `${API_URL}/oauth2/token`;

const headers = {
  Authorization: `Basic ${BASIC_AUTH_TOKEN}`,
  'Content-Type': 'application/x-www-form-urlencoded',
};

type GetOAuthResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export function useGetOAuthToken() {
  return useMutation<GetOAuthResponse>({
    mutationFn: async () => {
      const response = await RNFetchBlob.config({ trusty: true }).fetch(
        'POST',
        url,
        headers,
        'grant_type=client_credentials'
      );

      return JSON.parse(response.data) as GetOAuthResponse;
    },
    onSuccess: (data) => {
      if (data.access_token) {
        TokenStoreManager.addAccessToken(data.access_token);
      }
      return data as GetOAuthResponse;
    },
    onError: () => {
      TokenStoreManager.removeAccessToken();
    },
  });
}
