import React from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { Link, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { SignUpSchema } from '@utils/validiation/auth';
import { ModernButton } from '../../ui/button';
import { Input } from '../../ui/input';
import { Controller } from 'react-hook-form';
import { http } from '@/src/utils/http';
import { AUTH_ENDPOINTS } from '@/src/libs/endpoints/auth';
import { toast } from 'sonner-native';
import { Container } from '../../common/Container';

// --- 2. Zod Validation Schema (Updated) ---
type SignUpFormInputs = z.infer<typeof SignUpSchema>;

export const SignUpScreen = () => {
  const router = useRouter();

  const signUpMutation = useMutation({
    mutationFn: (data: SignUpFormInputs) => http.post(AUTH_ENDPOINTS.POST_SIGN_UP, data),
    onSuccess: (data) => {
      if (data.success) {
        router.replace('/auth');
        toast.success(data.message);
        return data;
      }
      toast.error(data.message);
      return data;
    },
  });

  const { control, handleSubmit } = useForm<SignUpFormInputs>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = (data: SignUpFormInputs) => signUpMutation.mutate(data);

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
          className="px-6">
          {/* Header */}
          <View className="mb-8 mt-4 items-center">
            {/* Small animated entry icon or logo */}
            <View className="mb-4 h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Text variant={'heading'} size={'2xl'}>🚀</Text>
            </View>
            <Text variant={'heading'} size={'3xl'} weight={'semibold'}>Create account</Text>
            <Text variant={'subtext'}>
              Provide your details to register.
            </Text>
          </View>

          {/* Form */}
          <View className="w-full">
            <View className="flex-row justify-between gap-x-2 mb-4">
              <View className="flex-1">
                <Text variant="label" className="mb-1.5 ml-1">First name</Text>
                <Controller
                  control={control}
                  name="first_name"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <>
                      <Input
                        placeholder="John"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={!!error}
                      />
                      {error && <Text variant="error" size="sm" className="ml-1 mt-1">{error.message}</Text>}
                    </>
                  )}
                />
              </View>
              <View className="flex-1">
                <Text variant="label" className="mb-1.5 ml-1">Last name</Text>
                <Controller
                  control={control}
                  name="last_name"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <>
                      <Input
                        placeholder="Doe"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={!!error}
                      />
                      {error && <Text variant="error" size="sm" className="ml-1 mt-1">{error.message}</Text>}
                    </>
                  )}
                />
              </View>
            </View>

            <View className="mb-4">
              <Text variant="label" className="mb-1.5 ml-1">Email</Text>
              <Controller
                control={control}
                name="email"
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
                    {error && <Text variant="error" size="sm" className="ml-1 mt-1">{error.message}</Text>}
                  </>
                )}
              />
            </View>

            <View className="mb-4">
              <Text variant="label" className="mb-1.5 ml-1">Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <>
                    <Input
                      placeholder="Create a password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry
                      error={!!error}
                    />
                    {error && <Text variant="error" size="sm" className="ml-1 mt-1">{error.message}</Text>}
                  </>
                )}
              />
            </View>

            <View className="mb-4">
              <Text variant="label" className="mb-1.5 ml-1">Confirm Password</Text>
              <Controller
                control={control}
                name="confirm_password"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <>
                    <Input
                      placeholder="Create a password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry
                      error={!!error}
                    />
                    {error && <Text variant="error" size="sm" className="ml-1 mt-1">{error.message}</Text>}
                  </>
                )}
              />
            </View>

            {/* Terms Text */}
            <View className='mb-6'>
              <Text >
                By creating an account, you agree to our{' '}
                <Text >Terms of Service</Text> and{' '}
                <Text >Privacy Policy</Text>.
              </Text>
            </View>

            <ModernButton
              title="Create account"
              onPress={handleSubmit(onSubmit)}
              isLoading={signUpMutation.isPending}
            />

            <View className="my-6 flex-row gap-x-4 items-center">
              <View className="h-[1px] flex-1 bg-gray-200" />
              <Text variant={'subtext'} weight={'medium'}
              >Or</Text>
              <View className="h-[1px] flex-1 bg-gray-200" />
            </View>

            <ModernButton

              title="Sign up with Google" variant="google" onPress={() => { }} />
          </View>

          {/* Footer */}
          <View className="my-8 flex-row justify-center">
            <Text variant={'subtext'} weight={'medium'}>Already have an account? </Text>
            <Link href="/auth">
              <Text variant={'link'} weight={'semibold'}>Sign in</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container >
  );
};
