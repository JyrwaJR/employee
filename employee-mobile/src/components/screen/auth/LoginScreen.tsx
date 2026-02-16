import React from 'react';
import { View, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Input } from '../../ui/input';
import { ModernButton } from '../../ui/button';
import { LoginSchema } from '@utils/validiation/auth';
import { AUTH_ENDPOINTS } from '@/src/libs/endpoints/auth';
import { toast } from 'sonner-native';
import { TokenStoreManager } from '@/src/libs/stores/auth';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { http } from '@/src/utils/http';
import { Text } from '@/src/components/ui/text';
import { Container } from '../../common/Container';

type LoginFormInputs = z.infer<typeof LoginSchema>;

type LoginResT = {
  created_at: string;
  first_name: string;
  last_name: string;
  refresh_token: string;
  role: string;
  updated_at: string;
};

export const LoginScreen = () => {
  const { refresh } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormInputs) => http.post<LoginResT>(AUTH_ENDPOINTS.POST_SIGN_IN, data),
    onSuccess: async (data) => {
      if (data.success) {
        const response = data.data;

        if (data.token && response?.refresh_token) {
          await TokenStoreManager.addToken(data.token);
          await TokenStoreManager.addRefreshToken(response?.refresh_token);
        }
        toast.success('Signed in successfully.');
        refresh();
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
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6">
        {/* Header Section */}
        <View className="mb-10 items-center">
          <View className="mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 dark:bg-blue-600">
            <Text variant={'heading'} className="text-white" size={'2xl'}>
              ✨
            </Text>
          </View>
          <Text variant={'heading'} size={'2xl'} weight={'semibold'}>
            Welcome back
          </Text>
          <Text variant={'subtext'}>Please enter your details to sign in.</Text>
        </View>

        {/* Form Section */}
        <View className="w-full">
          <View className="mb-4">
            <Text variant="label" className="mb-1.5 ml-1">
              Phone No.
            </Text>
            <Controller
              control={control}
              name="phone_no"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <Input
                    placeholder="name@company.com"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    error={!!error}
                  />
                  {error && (
                    <Text variant="error" size="sm" className="ml-1 mt-1">
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          <View className="mb-4">
            <Text variant="label" className="mb-1.5 ml-1">
              Password
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <Input
                    placeholder="••••••••"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    error={!!error}
                  />
                  {error && (
                    <Text variant="error" size="sm" className="ml-1 mt-1">
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          <Link href={'/auth/forgot-password'} asChild>
            <TouchableOpacity className="mb-8 items-end">
              <Text variant={'link'}>Forgot password?</Text>
            </TouchableOpacity>
          </Link>

          <ModernButton
            title="Sign in"
            onPress={handleSubmit(onSubmit)}
            isLoading={loginMutation.isPending}
          />

          <View className="my-8 flex-row items-center gap-x-2">
            <View className="h-[1px] flex-1 bg-gray-200" />
            <Text variant={'subtext'}>Or continue with</Text>
            <View className="h-[1px] flex-1 bg-gray-200" />
          </View>

          <ModernButton
            title="Google"
            variant="google"
            onPress={() => Alert.alert('Google Auth')}
          />
        </View>
        <View className="mt-10 flex-row justify-center">
          <Text variant={'subtext'}>Don&apos;t have an account? </Text>
          <Link href={'/auth/sign-up'}>
            <Text variant={'link'}>Sign up</Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};
