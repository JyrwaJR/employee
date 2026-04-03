import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';

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
  const isLoading = user.isLoading;

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isOnPublicPage && isSignedIn && isMounted) {
      router.replace('/');
    }
  }, [isSignedIn, isMounted, isOnPublicPage, router, isLoading]);

  useEffect(() => {
    if (!isOnPublicPage && !isSignedIn && isMounted) {
      router.replace('/auth');
    }
  }, [isSignedIn, isMounted, isOnPublicPage, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
