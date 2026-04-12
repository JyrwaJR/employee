import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, FieldInput } from '@/src/shared/components/ui';
import { Link } from 'expo-router';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Container } from '@/src/shared/components/layout/Container';
import { SignUpSchema } from '../validators/signup.schema';
import { routes } from '@/src/shared/constants/routes';
import { useSignUpMutation } from '../hooks/useSignUpMutation';
import { KeyboardSafeView } from '@/src/shared/components/layout';

type SignUpFormInputs = z.infer<typeof SignUpSchema>;

const defaultValues: SignUpFormInputs = {
  first_name: '',
  last_name: '',
  phone_no: '',
  password: '',
  confirm_password: '',
};

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

              {/* Terms Text */}
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

              <Button
                testID="CREATE_ACCOUNT_BUTTON"
                title="Create account"
                onPress={methods.handleSubmit(onSubmit)}
                isLoading={signUpMutation.isPending}
              />

              <View className="my-4 flex-row items-center gap-x-4">
                <View className="h-[1px] flex-1 bg-gray-200" />
                <Text variant={'subtext'} weight={'medium'}>
                  Or
                </Text>
                <View className="h-[1px] flex-1 bg-gray-200" />
              </View>
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
      </KeyboardSafeView>
    </Container>
  );
};
