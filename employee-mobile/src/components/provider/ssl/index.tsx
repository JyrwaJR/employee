import { SSL_CONFIG } from '@/src/libs/config/networkConfig';
import { useEffect } from 'react';
import { initializeSslPinning } from 'react-native-ssl-public-key-pinning';

type Props = {
  children: React.ReactNode;
};

export const SSLPinning = ({ children }: Props) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      initializeSslPinning(SSL_CONFIG);
    }
  }, []);
  return <>{children}</>;
};
