import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Icon } from '@components/ui/icon';
import * as Updates from 'expo-updates';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logger } from '@utils/logger';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === 'production') {
      logger.error('[GlobalErrorBoundary] caught error:', error, errorInfo);
    }
  }

  private handleReset = async () => {
    try {
      if (__DEV__) {
        // In dev, we can't easily "restart" but we can clear state
        this.setState({ hasError: false, error: null });
      } else {
        await Updates.reloadAsync();
      }
    } catch {
      this.setState({ hasError: false, error: null });
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="flex-1 items-center justify-center px-6">
            <BlurView
              intensity={40}
              tint="light"
              className="w-full overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-8 shadow-2xl">
              <View className="items-center">
                <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-red-100">
                  <Icon family="ionicons" name="alert-circle-outline" size={48} color="#ef4444" />
                </View>

                <Text className="mb-3 text-center text-2xl font-bold text-gray-900">
                  Something went wrong
                </Text>

                <Text className="mb-8 text-center text-base text-gray-600">
                  An unexpected error occurred. We&apos;ve been notified and are looking into it.
                </Text>

                {__DEV__ && this.state.error && (
                  <View className="mb-8 w-full rounded-xl bg-black/5 p-4">
                    <Text className="font-mono text-xs text-red-600">
                      {this.state.error.toString()}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={this.handleReset}
                  activeOpacity={0.8}
                  className="w-full items-center justify-center rounded-2xl bg-gray-900 py-4 shadow-lg">
                  <Text className="text-lg font-bold text-white">Try Again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.setState({ hasError: false, error: null })}
                  className="mt-4">
                  <Text className="text-sm font-medium text-gray-500 underline">Dismiss</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
