import React from 'react';
import { View, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Text } from '@/src/shared/components/ui/text';
import { Container } from '@/src/shared/components/layout/Container';
import { LoginSchema } from '../validators/login.schema';
import { routes } from '@/src/shared/constants/routes';
import { FieldInput } from '@/src/shared/components/ui/field-input';
import { Button } from '@components/ui/button';
import { useLoginMutation } from '../hooks/useLoginMutation';

type LoginFormInputs = z.infer<typeof LoginSchema>;

export const LoginScreen = () => {
  const methods = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      phone_no: '',
      password: '',
    },
  });

  const loginMutation = useLoginMutation();

  const onSubmit = (data: LoginFormInputs) => {
    loginMutation.mutate(data);
  };

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
        <FormProvider {...methods}>
          <View className="w-full">
            <FieldInput
              name="phone_no"
              label="Phone No."
              placeholder="e.g. 07XXXXXXXX"
              keyboardType="phone-pad"
            />

            <FieldInput name="password" label="Password" placeholder="••••••••" />

            <Link href={routes.auth.forgotPassword()} asChild>
              <TouchableOpacity className="mb-8 items-end">
                <Text variant={'link'}>Forgot password?</Text>
              </TouchableOpacity>
            </Link>

            <Button
              testID="SIGN_IN_BUTTON"
              title="Sign in"
              onPress={methods.handleSubmit(onSubmit)}
              isLoading={loginMutation.isPending}
            />

            <View className="my-8 flex-row items-center gap-x-2">
              <View className="h-[1px] flex-1 bg-gray-200" />
              <Text variant={'subtext'}>Or continue with</Text>
              <View className="h-[1px] flex-1 bg-gray-200" />
            </View>

            <Button title="Google" variant="google" onPress={() => Alert.alert('Google Auth')} />
          </View>
        </FormProvider>

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
