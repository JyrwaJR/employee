import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Text } from '@/src/shared/components/ui/text';
import { KeyboardSafeView } from '@/src/shared/components/layout';
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
    <KeyboardSafeView contentContainerClassName="px-6 justify-center">
      {/* Header Section */}
      <View className="mb-10 items-center">
        <View className="mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
          <Text variant={'heading'} className="text-white" size={'2xl'}>
            ✨
          </Text>
        </View>
        <Text variant={'heading'} size={'3xl'} weight={'semibold'}>
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
            placeholder="07XXXXXXXX"
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="tel"
            testID="PHONE_INPUT"
            returnKeyType="next"
            onChangeText={(value) => {
              const cleaned = value.replace(/[^0-9]/g, '');
              if (cleaned.length <= 10) {
                methods.setValue('phone_no', cleaned, { shouldValidate: true });
              }
            }}
          />

          <FieldInput
            name="password"
            testID="PASSWORD_INPUT"
            secureTextEntry
            label="Password"
            placeholder="••••••••"
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={methods.handleSubmit(onSubmit)}
          />

          <View className="mb-8 items-end">
            <Link href={routes.auth.forgotPassword()} asChild>
              <TouchableOpacity>
                <Text variant={'link'}>Forgot password?</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Button
            testID="SIGN_IN_BUTTON"
            title="Sign in"
            onPress={methods.handleSubmit(onSubmit)}
            isLoading={loginMutation.isPending}
          />
        </View>
      </FormProvider>

      <View className="mt-10 flex-row justify-center">
        <Text variant={'subtext'}>Don&apos;t have an account? </Text>
        <Link testID={'SIGNUP_BUTTON'} href={routes.auth.signUp}>
          <Text variant={'link'}>Sign up</Text>
        </Link>
      </View>

      {/* Developer UI Laboratory Entrance */}
      {__DEV__ && (
        <View className="mt-12 items-center border-t border-slate-100 pt-8 dark:border-slate-800">
          <Link href="/(dev)/ui-lab" asChild>
            <TouchableOpacity className="flex-row items-center rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-800">
              <Text className="text-sm font-medium text-slate-600 dark:text-slate-400">
                🛠 Open UI Laboratory
              </Text>
            </TouchableOpacity>
          </Link>
          <Text variant="subtext" size="xs" className="mt-2">
            Visible in Development only
          </Text>
        </View>
      )}
    </KeyboardSafeView>
  );
};
