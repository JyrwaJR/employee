import { useMutation } from '@tanstack/react-query';
import { TokenStoreManager } from '@stores/token.store';
import { logger } from '@utils/logger';
import { axiosInstanceWithoutEncryption } from '@utils/api/axios';

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
  return useMutation({
    mutationFn: () =>
      axiosInstanceWithoutEncryption.post<GetOAuthResponse>(
        url,
        new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
        { headers }
      ),
    onSuccess: async (res) => {
      const data = res.data;

      if (!data) return;

      logger.info('Get OAuth Token Success', { accessToken: !!data.access_token });

      if (data.access_token) {
        logger.info('Setting access token');
        await TokenStoreManager.addAccessToken(data.access_token);
        logger.info('Successfully set access token');
      }

      return data as GetOAuthResponse;
    },
  });
}
