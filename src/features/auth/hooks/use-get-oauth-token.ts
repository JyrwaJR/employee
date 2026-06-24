import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const BASIC_AUTH_TOKEN = process.env.EXPO_PUBLIC_BASIC_AUTH;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const url = `${API_URL}/oauth2/token`;

const headers = {
  Authorization: `Basic ${BASIC_AUTH_TOKEN}`,
  'Content-Type': 'application/x-www-form-urlencoded',
};

export function useGetOAuthToken() {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.post(url, 'grant_type=client_credentials', { headers });

      return response.data;
    },

    onSuccess: (data) => {
      console.log('UseGetOAuthToken Data', JSON.stringify(data, null, 2));
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.log('Status:', error.response?.status);
        console.log('Data:', error.response?.data);
      }

      console.log('UseGetOAuthToken Error', error);
    },
  });
}
