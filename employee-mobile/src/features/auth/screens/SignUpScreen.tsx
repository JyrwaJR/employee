import React from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from '@/src/shared/components/ui/text';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { ModernButton } from '@/src/shared/components/ui/button';
import { Input } from '@/src/shared/components/ui/input';
import { http } from '@/src/shared/utils/http';
import { api } from '@/src/shared/api';
import { notify } from '@/src/shared/utils/notify';
import { Container } from '@/src/shared/components/layout/Container';
import { SignUpSchema } from '../schema/signup.schema';
import { routes } from '@/src/shared/constants/routes';

// --- 2. Zod Validation Schema (Updated) ---
type SignUpFormInputs = z.infer<typeof SignUpSchema>;

export const SignUpScreen = () => {
  const router = useRouter();

  const signUpMutation = useMutation({
    mutationFn: (data: SignUpFormInputs) => http.post(api.auth.signUp, data),
    onSuccess: (data) => {
      if (data.success) {
        router.replace(routes.auth.login);
      }
      notify(data, 'AUTH_REGISTER');
      return data;
    },
  });

  const { control, handleSubmit } = useForm({
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
              <Text variant={'heading'} size={'2xl'}>
                🚀
              </Text>
            </View>
            <Text variant={'heading'} size={'3xl'} weight={'semibold'}>
              Create account
            </Text>
            <Text variant={'subtext'}>Provide your details to register.</Text>
          </View>

          {/* Form */}
          <View className="w-full">
            <View className="mb-4 flex-row justify-between gap-x-2">
              <View className="flex-1">
                <Text variant="label" className="mb-1.5 ml-1">
                  First name
                </Text>
                <Controller
                  control={control}
                  name="first_name"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <>
                      <Input
                        testID="FIRST_NAME_INPUT"
                        placeholder="John"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
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
              <View className="flex-1">
                <Text variant="label" className="mb-1.5 ml-1">
                  Last name
                </Text>
                <Controller
                  control={control}
                  name="last_name"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <>
                      <Input
                        testID="LAST_NAME_INPUT"
                        placeholder="Doe"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
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
            </View>

            <View className="mb-4">
              <Text variant="label" className="mb-1.5 ml-1">
                Phone Number
              </Text>
              <Controller
                control={control}
                name="phone_no"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <>
                    <Input
                      testID="PHONE_NUMBER_INPUT"
                      placeholder="9876543210"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="phone-pad"
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
                      testID="PASSWORD_INPUT"
                      placeholder="Create a password"
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

            <View className="mb-4">
              <Text variant="label" className="mb-1.5 ml-1">
                Confirm Password
              </Text>
              <Controller
                control={control}
                name="confirm_password"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <>
                    <Input
                      testID="CONFIRM_PASSWORD_INPUT"
                      placeholder="Create a password"
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

            {/* Terms Text */}
            <View className="mb-6">
              <Text>
                By creating an account, you agree to our <Text>Terms of Service</Text> and{' '}
                <Text>Privacy Policy</Text>.
              </Text>
            </View>

            <ModernButton
              testID="CREATE_ACCOUNT_BUTTON"
              title="Create account"
              onPress={handleSubmit(onSubmit)}
              isLoading={signUpMutation.isPending}
            />

            <View className="my-6 flex-row items-center gap-x-4">
              <View className="h-[1px] flex-1 bg-gray-200" />
              <Text variant={'subtext'} weight={'medium'}>
                Or
              </Text>
              <View className="h-[1px] flex-1 bg-gray-200" />
            </View>

            <ModernButton title="Sign up with Google" variant="google" onPress={() => {}} />
          </View>

          {/* Footer */}
          <View className="my-8 flex-row justify-center">
            <Text variant={'subtext'} weight={'medium'}>
              Already have an account?{' '}
            </Text>
            <Link href={routes.auth.login}>
              <Text variant={'link'} weight={'semibold'}>
                Sign in
              </Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};
