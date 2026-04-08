import React from 'react';
import { Toaster as SonnerToaster } from 'sonner-native';
import { useThemeStore } from '@/src/shared/store/theme.store';
import { Appearance, Platform } from 'react-native';
import { cssInterop } from 'nativewind';

/**
 * Configure sonner-native to be tailwind-aware in v4
 */
cssInterop(SonnerToaster, {
  className: 'style',
});

/**
 * A custom shadcn/ui inspired Toaster component.
 * Wraps sonner-native and applies project-wide design tokens.
 */
export const Toaster = () => {
  const { theme } = useThemeStore();
  
  // Resolve actual theme color scheme for sonner-native's internal logic
  // Android specifically requires explicit theme passing to match system colors correctly
  const isDark = theme === 'system' 
    ? Appearance.getColorScheme() === 'dark' 
    : theme === 'dark';

  return (
    <SonnerToaster
      position="top-center"
      theme={isDark ? 'dark' : 'light'}
      richColors={true}
      toastOptions={{
        // Match shadcn design tokens
        style: {
          borderRadius: 24, // Matches our rounded-2xl
          padding: 16,
          backgroundColor: isDark ? '#020617' : '#FFFFFF', // slate-950 or white
          borderWidth: 1,
          borderColor: isDark ? '#1e293b' : '#e2e8f0', // slate-800 or slate-200
          // Android specific visibility fixes
          ...Platform.select({
            android: {
              elevation: 100,
              zIndex: 1000,
            },
            ios: {
              zIndex: 9999,
            }
          })
        },
        titleStyle: {
          fontSize: 14,
          fontWeight: '600',
          color: isDark ? '#f8fafc' : '#0f172a', // slate-50 or slate-900
        },
        descriptionStyle: {
          fontSize: 12,
          color: isDark ? '#94a3b8' : '#64748b', // slate-400 or slate-500
        },
      }}
    />
  );
};
