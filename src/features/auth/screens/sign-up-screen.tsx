import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, FieldInput } from '@/src/shared/components/ui';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Container } from '@/src/shared/components/layout/container';
import { SignUpSchema } from '../validators/signup.schema';
import { routes } from '@utils/constants/routes';
import { useSignUpMutation } from '../hooks/use-sign-up-mutation';
import { KeyboardSafeView } from '@/src/shared/components/layout';
import { AuthHeader } from '../components/auth-header';
import { AuthFooter } from '../components/auth-footer';
import { AuthDivider } from '../components/auth-divider';
import { Text } from '@/src/shared/components/ui/text';

type SignUpFormInputs = z.infer<typeof SignUpSchema>;

const defaultValues: SignUpFormInputs = {
  first_name: '',
  last_name: '',
  phone_no: '',
  password: '',
  confirm_password: '',
};

const TermsText = () => (
  <View className="p-2">
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
);

export const SignUpScreen = () => {
  const signUpMutation = useSignUpMutation();

  const methods = useForm<SignUpFormInputs>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const onSubmit = (data: SignUpFormInputs) => signUpMutation.mutate(data);

  return (
    <Container>
      <KeyboardSafeView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
          className="px-6">
          <AuthHeader
            emoji="🚀"
            title="Create account"
            subtitle="Provide your details to register."
            iconContainerClassName="bg-blue-50"
          />

          <FormProvider {...methods}>
            <View className="w-full gap-y-2">
              <View className="flex-row justify-between gap-x-2">
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

              <TermsText />

              <Button
                testID="CREATE_ACCOUNT_BUTTON"
                title="Create account"
                onPress={methods.handleSubmit(onSubmit)}
                isLoading={signUpMutation.isPending}
              />

              <AuthDivider />
            </View>
          </FormProvider>

          <AuthFooter
            text="Already have an account?"
            linkText="Sign in"
            linkHref={routes.auth.login}
            className="my-8"
          />
        </ScrollView>
      </KeyboardSafeView>
    </Container>
  );
};
