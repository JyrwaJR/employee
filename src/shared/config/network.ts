/**
 * SSL Pinning and Network Configuration
 */

// 1. Define the pins (Safety Net + Env)
// These hashes are used to verify the server certificate identity.
const PINS = [
  process.env.EXPO_PUBLIC_CURRENT_LEAF_HASH,
  // process.env.EXPO_PUBLIC_NEXT_LEAF_HASH,
  'C5+lpZ7tc+LRfQ1S3s1S3s1S3s1S3s1S3s1S3s1S3s1=', // Backup R10
  'Di5jJ4P+iS6icS6iS6icS6iS6icS6iS6icS6iS6icS6=', // Backup E5
].filter(Boolean) as string[];

/**
 * Global SSL Pinning Configuration
 */
export const SSL_CONFIG = {
  'employee-nic.vercel.app': {
    includeSubdomains: true,
    publicKeyHashes: PINS,
  },
};

/**
 * Base API URL Configuration
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://employee-nic.vercel.app/api';
