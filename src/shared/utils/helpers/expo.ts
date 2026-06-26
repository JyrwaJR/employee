import * as Device from 'expo-device';

export function isExpo(): boolean {
  return Device.isDevice;
}
