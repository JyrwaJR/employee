import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { ModernInput } from '../../ui/input';
import { ModernButton } from '../../ui/button';
import { LoginSchema } from '@utils/validiation/auth';
import { AUTH_ENDPOINTS } from '@/src/libs/endpoints/auth';
import { http } from '@/src/utils/http';
import { toast } from 'sonner-native';

type LoginFormInputs = z.infer<typeof LoginSchema>;

// --- 6. Main Login Screen ---
export const LoginScreen = () => {
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormInputs) => http.post(AUTH_ENDPOINTS.POST_SIGN_IN, data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Signed in successfully.');
        return data;
      }
      toast.error(data.message);
    },
  });

  const { control, handleSubmit } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginFormInputs) => loginMutation.mutate(data);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6">
        {/* Header Section */}
        <View className="mb-10 items-center">
          <View className="mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            {/* Logo Placeholder */}
            <Text className="text-2xl">✨</Text>
          </View>
          <Text className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</Text>
          <Text className="mt-2 text-base text-gray-500">
            Please enter your details to sign in.
          </Text>
        </View>

        {/* Form Section */}
        <View className="w-full">
          <ModernInput
            control={control}
            name="email"
            label="Email"
            placeholder="name@company.com"
          />
          <ModernInput
            control={control}
            name="password"
            label="Password"
            placeholder="••••••••"
            secureTextEntry
          />

          <TouchableOpacity className="mb-8 items-end">
            <Text className="text-sm font-semibold text-blue-600">Forgot password?</Text>
          </TouchableOpacity>

          <ModernButton
            title="Sign in"
            onPress={handleSubmit(onSubmit)}
            isLoading={loginMutation.isPending}
          />

          <View className="my-8 flex-row items-center">
            <View className="h-[1px] flex-1 bg-gray-200" />
            <Text className="mx-4 text-xs font-medium uppercase text-gray-400">
              Or continue with
            </Text>
            <View className="h-[1px] flex-1 bg-gray-200" />
          </View>

          <ModernButton
            title="Google"
            variant="google"
            onPress={() => Alert.alert('Google Auth')}
          />
        </View>

        {/* Footer */}
        <View className="mt-10 flex-row justify-center">
          <Text className="text-gray-500">Don&apos;t have an account? </Text>
          <Link href={'/auth/sign-up'}>
            <Text className="font-semibold text-gray-900">Sign up</Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
