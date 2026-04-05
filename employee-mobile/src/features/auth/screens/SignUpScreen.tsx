import React from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from '@/src/shared/components/ui/text';
import { Link, useRouter } from 'expo-router';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/src/shared/components/ui/button';
import { http } from '@/src/shared/utils/http';
import { api } from '@/src/shared/api';
import { notify } from '@/src/shared/utils/notify';
import { Container } from '@/src/shared/components/layout/Container';
import { SignUpSchema } from '../validators/signup.schema';
import { routes } from '@/src/shared/constants/routes';
import { FieldInput } from '@/src/shared/components/ui/field-input';

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

  const methods = useForm<SignUpFormInputs>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_no: '',
      password: '',
      confirm_password: '',
    },
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
          <FormProvider {...methods}>
            <View className="w-full">
              <View className="mb-4 flex-row justify-between gap-x-2">
                <View className="flex-1">
                  <FieldInput
                    name="first_name"
                    label="First name"
                    placeholder="John"
                    testID="FIRST_NAME_INPUT"
                  />
                </View>
                <View className="flex-1">
                  <FieldInput
                    name="last_name"
                    label="Last name"
                    placeholder="Doe"
                    testID="LAST_NAME_INPUT"
                  />
                </View>
              </View>

              <FieldInput
                name="phone_no"
                label="Phone Number"
                placeholder="9876543210"
                keyboardType="phone-pad"
                testID="PHONE_NUMBER_INPUT"
              />

              <FieldInput
                name="password"
                label="Password"
                placeholder="Create a password"
                secureTextEntry
                testID="PASSWORD_INPUT"
              />

              <FieldInput
                name="confirm_password"
                label="Confirm Password"
                placeholder="Create a password"
                secureTextEntry
                testID="CONFIRM_PASSWORD_INPUT"
              />

              {/* Terms Text */}
              <View className="mb-6">
                <Text variant="subtext" size="xs">
                  By creating an account, you agree to our{' '}
                  <Text variant="link" size="xs">
                    Terms of Service
                  </Text>{' '}
                  and{' '}
                  <Text variant="link" size="xs">
                    Privacy Policy
                  </Text>
                  .
                </Text>
              </View>

              <Button
                testID="CREATE_ACCOUNT_BUTTON"
                title="Create account"
                onPress={methods.handleSubmit(onSubmit)}
                isLoading={signUpMutation.isPending}
              />

              <View className="my-6 flex-row items-center gap-x-4">
                <View className="h-[1px] flex-1 bg-gray-200" />
                <Text variant={'subtext'} weight={'medium'}>
                  Or
                </Text>
                <View className="h-[1px] flex-1 bg-gray-200" />
              </View>

              <Button title="Sign up with Google" variant="google" onPress={() => {}} />
            </View>
          </FormProvider>

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

