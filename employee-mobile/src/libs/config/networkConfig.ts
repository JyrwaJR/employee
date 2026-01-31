// src/config/networkConfig.ts

// 1. Define the pins (Safety Net + Env)
const PINS = [
  process.env.EXPO_PUBLIC_CURRENT_LEAF_HASH,
  // process.env.EXPO_PUBLIC_NEXT_LEAF_HASH,
  'C5+lpZ7tc+LRfQ1S3s1S3s1S3s1S3s1S3s1S3s1S3s1=', // R10 Backup
  'Di5jJ4P+iS6icS6iS6icS6iS6icS6iS6icS6iS6icS6=', // E5 Backup
].filter(Boolean) as string[];

// 2. Format it correctly for the library
export const SSL_CONFIG = {
  'employee-nic.vercel.app': {
    includeSubdomains: true,
    publicKeyHashes: PINS,
  },
};
