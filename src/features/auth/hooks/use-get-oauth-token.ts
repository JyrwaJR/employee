import { useMutation } from '@tanstack/react-query';
import RNFetchBlob from 'rn-fetch-blob';
import { TokenStoreManager } from '@stores/token.store';
import { logger } from '@utils/logger';

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
      logger.info('Get OAuth Token Success', {
        accessToken: !!data.access_token,
      });
      if (data.access_token) {
        logger.info('Setting access token');
        TokenStoreManager.addAccessToken(data.access_token);
        logger.info('Successfully set access token');
      }
      return data as GetOAuthResponse;
    },
    onError: (error) => {
      logger.info('Removing access token on error: UseGetOAuthToken', {
        message: error.message,
        error: error,
      });
      TokenStoreManager.removeAccessToken();
      logger.info('Removed access token on error');
    },
  });
}
