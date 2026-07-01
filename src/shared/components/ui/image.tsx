import React, { useState } from 'react';
import { View, Image as RNImage, ImageProps as RNImageProps, StyleSheet } from 'react-native';
import { Skeleton } from './skeleton';
import { Icon } from '@components/ui/icon';
import { cn } from '../../utils/helpers/cn';

interface ImageProps extends RNImageProps {
  containerClassName?: string;
  fallbackIcon?: string;
}

/**
 * Stability-first Image component.
 * Uses direct absolute mapping to ensure the image fills its container
 * regardless of layout nesting issues.
 */
export const Image = ({
  containerClassName,
  className,
  fallbackIcon = 'image-outline',
  ...props
}: ImageProps) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  return (
    <View
      className={cn('relative overflow-hidden bg-muted', containerClassName)}
      style={{ minHeight: 40, minWidth: 40 }}>
      {/* Image Layer */}
      <RNImage
        {...props}
        onLoad={() => setStatus('success')}
        onLoadEnd={() => {
          if (status === 'loading') setStatus('success');
        }}
        onError={() => setStatus('error')}
        className={cn('h-full w-full', className)}
        style={[{ opacity: status === 'success' ? 1 : 0 }, StyleSheet.absoluteFillObject]}
      />

      {/* Skeleton / Loading Layer */}
      {status === 'loading' && (
        <View style={StyleSheet.absoluteFill}>
          <Skeleton className="h-full w-full" />
        </View>
      )}

      {/* Error / Placeholder Layer */}
      {status === 'error' && (
        <View style={StyleSheet.absoluteFill} className="items-center justify-center bg-muted">
          <Icon family="ionicons" name={fallbackIcon} size={32} color="#94a3b8" />
        </View>
      )}
    </View>
  );
};
