import React from 'react';
import { View } from 'react-native';
import { Container } from '@components/layout/container';
import { KeyboardSafeView } from '@components/layout/keyboard-safe-view';
import { Skeleton } from '@components/ui/skeleton';

/**
 * Skeleton placeholder that mimics the GovtHeader component.
 *
 * Renders shimmer bars for the title and subtitle text.
 */
const LoginHeaderSkeleton = () => (
  <View className="mb-8 items-center">
    <Skeleton className="mb-2 h-8 w-48 rounded-md" />
    <Skeleton className="h-4 w-36 rounded" />
  </View>
);

/**
 * Skeleton placeholder that mimics a single form field (label + input).
 *
 * Used twice — once for Employee Code and once for Password.
 */
const LoginFormFieldSkeleton = () => (
  <View className="mb-4">
    <Skeleton className="mb-2 h-4 w-28 rounded" />
    <Skeleton className="h-12 w-full rounded-lg" />
  </View>
);

/**
 * Skeleton placeholder that mimics the "Forgot password?" link.
 *
 * Renders a small shimmer bar positioned to the right, matching the link layout.
 */
const LoginForgotLinkSkeleton = () => (
  <View className="mb-8 items-end">
    <Skeleton className="h-4 w-36 rounded" />
  </View>
);

/**
 * Skeleton placeholder that mimics the Continue button.
 *
 * Renders a full-width shimmer bar matching Button dimensions.
 */
const LoginButtonSkeleton = () => <Skeleton className="mb-8 h-12 w-full rounded-lg" />;

/**
 * Skeleton placeholder that mimics the AuthFooter component.
 *
 * Renders shimmer bars for the text and link in a centered row.
 */
const LoginFooterSkeleton = () => (
  <View className="flex-row items-center justify-center gap-x-1">
    <Skeleton className="h-4 w-40 rounded" />
    <Skeleton className="h-4 w-24 rounded" />
  </View>
);

/**
 * Full-page skeleton loading state for the login screen.
 *
 * Mirrors the layout of LoginScreen with shimmer placeholders for:
 * - GovtHeader (title + subtitle)
 * - Employee Code field (label + input)
 * - Password field (label + input)
 * - Forgot password link
 * - Continue button
 * - AuthFooter (text + register link)
 *
 * @example
 * ```tsx
 * // In login-screen.tsx:
 * if (isPending) return <LoginScreenSkeleton />;
 * ```
 */
export const LoginScreenSkeleton = () => (
  <Container>
    <KeyboardSafeView contentContainerClassName="px-6 justify-center">
      <LoginHeaderSkeleton />
      <LoginFormFieldSkeleton />
      <LoginFormFieldSkeleton />
      <LoginForgotLinkSkeleton />
      <LoginButtonSkeleton />
      <LoginFooterSkeleton />
    </KeyboardSafeView>
  </Container>
);
