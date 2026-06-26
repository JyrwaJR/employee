import { randomUUID } from 'expo-crypto';
export function transformData<T extends object>(data: T[]): (T & { id: string })[] {
  return data.map((item) => ({
    ...item,
    id: randomUUID(), // or crypto.randomUUID()
  }));
}
