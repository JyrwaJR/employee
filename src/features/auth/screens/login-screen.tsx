import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Text } from '@components/ui/text';
import { KeyboardSafeView } from '@components/layout';
import { LoginSchema } from '../validators/login.schema';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { FieldInput } from '@components/ui/field-input';
import { Button } from '@components/ui/button';
import { useLoginMutation } from '../hooks/use-login-mutation';
import { useAuth } from '@hooks/use-auth';
import { AuthHeader } from '../components/auth-header';
import { AuthFooter } from '../components/auth-footer';
import { useGetOAuthToken } from '../hooks/use-get-oauth-token';
import { toast } from 'sonner-native';

type LoginFormInputs = z.infer<typeof LoginSchema>;

const formDefaultValue: LoginFormInputs = {
  emp_cd: process.env.EXPO_PUBLIC_EMP_CD || '',
  password: process.env.EXPO_PUBLIC_PASSWORD || '',
};

export const LoginScreen = () => {
  const { isSignedIn } = useAuth();

  const methods = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
    defaultValues: formDefaultValue,
    shouldFocusError: true,
    shouldUnregister: true,
  });

  const loginMutation = useLoginMutation();
  const { mutate } = useGetOAuthToken();

  const onSubmit = (data: LoginFormInputs) => {
    mutate(undefined, {
      onSuccess: async () => {
        loginMutation.mutate(data, {
          onSuccess: (sData) => {
            if (sData.success) {
              toast.success(sData.message);
              return sData;
            }
            toast.error(sData.message);
            return sData;
          },
        });
      },
      onError: (error) => {
        toast.error('Something went wrong', { description: error.message });
      },
    });
  };

  return (
    <KeyboardSafeView contentContainerClassName="px-6 justify-center">
      <AuthHeader
        emoji="✨"
        title="Welcome back"
        subtitle="Please enter your email and password to sign in."
        iconContainerClassName="bg-blue-600"
      />

      {/* Form Section */}
      <FormProvider {...methods}>
        <View className="w-full">
          <FieldInput
            name="emp_cd"
            label="Employee ID"
            placeholder="07XXXXXXXX"
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            testID="PHONE_INPUT"
            returnKeyType="next"
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
            <Link href={PAGE_ROUTES.AUTH.FORGOT_PASSWORD()} asChild>
              <TouchableOpacity>
                <Text variant={'link'}>Forgot password?</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Button
            testID="SIGN_IN_BUTTON"
            onPress={methods.handleSubmit(onSubmit)}
            isLoading={loginMutation.isPending}
            title="Continue"
            disabled={isSignedIn}
          />
        </View>
      </FormProvider>

      <AuthFooter
        text="Don't have an account?"
        linkText="Sign up"
        linkHref={PAGE_ROUTES.AUTH.SIGN_UP}
        testID="SIGNUP_BUTTON"
      />

      {/* Developer UI Laboratory Entrance */}
      {__DEV__ ? (
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
      ) : null}
    </KeyboardSafeView>
  );
};
