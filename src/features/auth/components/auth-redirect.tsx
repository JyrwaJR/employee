import { useAuth } from '@/src/shared/hooks/use-auth';
import { usePathname, useRouter, useLocalSearchParams, Route } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoadingScreen } from '@/src/shared/components/screens/loading-screen';
import { ROUTE_ROLES, PUBLIC_ROUTES } from '@/src/shared/constants/auth';
import { useAccess } from '@/src/shared/hooks/use-access';

type Props = {
  children: React.ReactNode;
};

export const AuthRedirect = ({ children }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const { isLoading, isSignedIn, role } = useAuth();
  const { checkAccess } = useAccess();
  const pathName = usePathname();
  const router = useRouter();
  const params = useLocalSearchParams();
  const redirectTo = params.redirect as string;

  const isOnPublicPage = PUBLIC_ROUTES.includes(pathName);

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  useEffect(() => {
    if (isLoading || !isMounted) return;

    // Direct match or wildcard match from our route roles config
    const currentRouteConfig = ROUTE_ROLES.find((route) => {
      if (route.url === pathName) return true;
      if (route.url.endsWith('/*')) {
        const basePath = route.url.replace('/*', '');
        return pathName.startsWith(basePath);
      }
      return false;
    });

    // 1. If user is signed in and on a public-only page (like login)
    if (isSignedIn && isOnPublicPage) {
      // Redirect to the originally intended page OR home
      router.replace((redirectTo as any) || '/');
      return;
    }

    // 2. Not signed in and trying to access a non-public route
    if (!isSignedIn && !isOnPublicPage) {
      // Send them to auth with the current path as redirect param
      const authPath = `/auth${pathName !== '/' ? `?redirect=${encodeURIComponent(pathName)}` : ''}`;
      router.replace(authPath as Route);
      return;
    }

    // 3. Authenticated role check
    if (isSignedIn && currentRouteConfig) {
      const hasRequiredRole = checkAccess(currentRouteConfig.role);
      if (!hasRequiredRole) {
        router.replace((currentRouteConfig.redirect as any) || '/forbidden');
        return;
      }
    }
  }, [
    isSignedIn,
    isMounted,
    isOnPublicPage,
    router,
    isLoading,
    pathName,
    role,
    redirectTo,
    checkAccess,
  ]);

  return (
    <View className="flex-1">
      {(isLoading || !isMounted || (isSignedIn && !role)) && !isOnPublicPage && (
        <View style={StyleSheet.absoluteFill} className="bg-white dark:bg-slate-950">
          <LoadingScreen />
        </View>
      )}
      {children}
    </View>
  );
};
