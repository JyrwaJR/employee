import Constants, { ExecutionEnvironment } from 'expo-constants';

export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export const JWT_TOKEN_KEY = 'token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export * from './routes';
export * from './regex';
export * from './query-keys';
export * from './auth';
export * from './method';
