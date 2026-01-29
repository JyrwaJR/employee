import { JWT_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../constant';
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';

const key = JWT_TOKEN_KEY;

const refreshKey = REFRESH_TOKEN_KEY;

export const TokenStoreManager = {
  async getToken(): Promise<string | null> {
    return await getItemAsync(key);
  },

  async addToken(token: string): Promise<void> {
    return await setItemAsync(key, token);
  },

  async removeToken(): Promise<void> {
    return await deleteItemAsync(key);
  },
  async getRefreshToken(): Promise<string | null> {
    return await getItemAsync(refreshKey);
  },

  async addRefreshToken(token: string): Promise<void> {
    return await setItemAsync(refreshKey, token);
  },

  async removeRefreshToken(): Promise<void> {
    return await deleteItemAsync(refreshKey);
  },
};
