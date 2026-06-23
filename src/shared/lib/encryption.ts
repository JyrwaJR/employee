import CryptoJS from 'crypto-js';

const appSk = process.env.EXPO_PUBLIC_APP_SK ?? '';
const appIv = process.env.EXPO_PUBLIC_APP_IV ?? '';

const getKeyAndIv = () => {
  if (!appSk || !appIv) {
    throw new Error('Missing environment variables');
  }

  const keyHash = CryptoJS.SHA256(appSk).toString();
  const ivHash = CryptoJS.SHA256(appIv).toString();

  return {
    key: CryptoJS.enc.Utf8.parse(keyHash.substring(0, 32)),
    iv: CryptoJS.enc.Utf8.parse(ivHash.substring(0, 16)),
  };
};

export function encrypt(plain: string): string {
  const { key, iv } = getKeyAndIv();

  const encrypted = CryptoJS.AES.encrypt(plain, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // openssl_encrypt() output
  const opensslOutput = encrypted.toString();

  // PHP does: base64_encode(openssl_encrypt(...))
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(opensslOutput));
}

export function decrypt(cipherText: string): string {
  if (!cipherText) {
    console.log('cipherText is empty');
    return '';
  }

  const { key, iv } = getKeyAndIv();

  // Undo PHP's outer base64_encode()
  const opensslOutput = CryptoJS.enc.Base64.parse(cipherText).toString(CryptoJS.enc.Utf8);

  const decrypted = CryptoJS.AES.decrypt(opensslOutput, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
