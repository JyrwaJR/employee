import { useAuth } from '@/src/hooks/auth/useAuth';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

export const AuthRedirect = ({ children }: Props) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const user = useAuth();
  const pathName = usePathname();
  const isSignedIn = user.isSignedIn;
  const isOnPublicPage =
    pathName === '/auth' || pathName === '/auth/sign-up' || pathName === '/auth/forgot-password';
  const router = useRouter();

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  useEffect(() => {
    if (isOnPublicPage && isSignedIn && isMounted) {
      router.replace('/');
    }
  }, [isSignedIn, isMounted, isOnPublicPage, router]);

  useEffect(() => {
    if (!isOnPublicPage && !isSignedIn && isMounted) {
      router.replace('/auth');
    }
  }, [isSignedIn, isMounted, isOnPublicPage, router]);

  return <>{children}</>;
};
