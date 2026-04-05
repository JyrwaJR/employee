import React from 'react';
import { View, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/src/shared/components/ui/input';
import { ModernButton } from '@/src/shared/components/ui/button';
import { AUTH_ENDPOINTS } from '@/src/features/auth/constants/auth.endpoints';
import { toast } from 'sonner-native';
import { TokenStoreManager } from '@/src/shared/store/token.store';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { http } from '@/src/shared/utils/http';
import { Text } from '@/src/shared/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import { Container } from '@/src/shared/components/layout/Container';
import { LoginSchema } from '../schema/login.schema';
import { routes } from '@/src/shared/constants/routes';

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
  const [showPassword, setShowPassword] = React.useState(false);

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
                    testID="PHONE_INPUT"
                    placeholder="9876543210"
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
                  <View className="relative">
                    <Input
                      testID="PASSWORD_INPUT"
                      placeholder="••••••••"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={!showPassword}
                      error={!!error}
                      className="pr-12"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute bottom-1 right-1 top-1 w-10 items-center justify-center rounded-r-2xl"
                      activeOpacity={0.7}>
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  </View>
                  {error && (
                    <Text variant="error" size="sm" className="ml-1 mt-1">
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          <Link href={routes.auth.forgotPassword()} asChild>
            <TouchableOpacity className="mb-8 items-end">
              <Text variant={'link'}>Forgot password?</Text>
            </TouchableOpacity>
          </Link>

          <ModernButton
            testID="SIGN_IN_BUTTON"
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
          <Link href={routes.auth.signUp}>
            <Text variant={'link'}>Sign up</Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};
