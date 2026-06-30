import React from 'react';
import { View } from 'react-native';
import { cn } from '@utils/helpers/cn';

type Props = {
  /** Content to render inside the container. */
  children: React.ReactNode;
  /** Additional Tailwind/NativeWind classes to merge. */
  className?: string;
};

/**
 * Layout container that wraps content with a full-height flex view and the
 * theme-aware background color.
 *
 * - **Light mode:** `bg-background` resolves to `hsl(0 0% 100%)` — pure white canvas
 * - **Dark mode:**  The explicit `dark:bg-[#1A1A1A]` ensures the background becomes
 *   ink (#1A1A1A), matching the `--background` token defined in `global.css`.
 *
 * @example
 * ```tsx
 * <Container>
 *   <Text>Page content</Text>
 * </Container>
 * ```
 */
export const Container = ({ children, className }: Props) => {
  return <View className={cn('flex-1 bg-background p-2', className)}>{children}</View>;
};
