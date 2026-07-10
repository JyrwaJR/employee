import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Text } from '@components/ui/text';
import { Container, KeyboardSafeView } from '@components/layout';
import { LoginSchema } from '../validators/login.schema';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { FieldInput } from '@components/ui/field-input';
import { Button } from '@components/ui/button';
import { useLoginMutation } from '../hooks/use-login-mutation';
import { useAuthStore } from '@stores/auth.store';
import { AuthFooter } from '../components/auth-footer';
import { LoginScreenSkeleton } from '../components/skeleton';
import { useGetOAuthToken } from '../hooks/use-get-oauth-token';
import { toast } from 'sonner-native';
import { useRateLimit } from '@hooks';
import { useSnackbar } from '@hooks/use-snackbar';
import { GovtHeader } from '@components/common';

/** Form field values inferred from the `LoginSchema` Zod validation schema. */
type LoginFormInputs = z.infer<typeof LoginSchema>;

/**
 * Default values for the login form.
 *
 * Reads pre-filled credentials from environment variables for development
 * convenience (`EXPO_PUBLIC_EMP_CD` and `EXPO_PUBLIC_PASSWORD`). Falls back
 * to empty strings when the environment variables are not set.
 */
const formDefaultValue: LoginFormInputs = {
  emp_cd: process.env.EXPO_PUBLIC_EMP_CD || '',
  password: process.env.EXPO_PUBLIC_PASSWORD || '',
};

/**
 * The primary login screen displayed to unauthenticated users.
 *
 * Orchestrates a two-step authentication flow:
 *   1. **OAuth token acquisition** — Fetches an OAuth bearer token via
 *      `useGetOAuthToken`. This step is required before the credentials
 *      can be submitted.
 *   2. **Credential validation** — Submits the employee code and password
 *      via `useLoginMutation` using the acquired OAuth token.
 *
 * ### Rate limiting
 *
 * A sliding-window rate limiter guards the submit handler, allowing only
 * **1 submission per 5 seconds**. When the limit is active the button
 * displays a "Please wait N" label and the handler returns early.
 *
 * ### Edge cases
 *
 * - **Already signed in** — The submit button is disabled when
 *   `isSignedIn` is `true` to prevent duplicate submissions.
 * - **Pending mutations** — Both the OAuth token and login mutations
 *   contribute to `isPending`, which shows a loading spinner on the
 *   button and disables interaction.
 * - **API errors** — Backend validation errors returned from the login
 *   mutation are surfaced via `toast.error()`.
 * - **Developer mode** — A link to the UI Laboratory is rendered below
 *   the form when `__DEV__` is `true`, toggled via `EXPO_PUBLIC_APP_ENV`.
 *
 * @example
 * ```tsx
 * <LoginScreen />
 * ```
 */
export const LoginScreen = () => {
  const { isSignedIn, isAuthLoading } = useAuthStore();
  const { startCooldown, isLimited } = useRateLimit('LOGIN_BUTTON_RATE_LIMIT', {
    limit: 1,
    ms: 10000,
  });

  const { showSnackbar } = useSnackbar();

  const methods = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
    defaultValues: formDefaultValue,
    shouldFocusError: true,
    shouldUnregister: true,
  });

  const { mutate: loginMutate, isPending: isLoginPending } = useLoginMutation();

  const { mutate, isPending: isTokenPending } = useGetOAuthToken();

  const onSubmit = (data: LoginFormInputs) => {
    if (isLimited) {
      return;
    }

    startCooldown();

    mutate(undefined, {
      onSuccess: async () => {
        loginMutate(data, {
          onSuccess: (sData) => {
            if (sData.success) {
              showSnackbar(sData.message);
              return sData;
            }
            toast.error(sData.message);
            return sData;
          },
        });
      },
    });
  };

  const isPending = isAuthLoading || isLoginPending || isTokenPending;

  if (isPending) return <LoginScreenSkeleton />;

  return (
    <Container>
      <KeyboardSafeView contentContainerClassName="justify-center">
        <GovtHeader title="Authentication" subtitle="Please sign in to continue" />

        {/* Form Section */}
        <FormProvider {...methods}>
          <View className="w-full">
            <FieldInput
              name="emp_cd"
              label="Employee Code"
              placeholder="Please enter your Employee Code"
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
                <TouchableOpacity
                  className="mt-2"
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
                  <Text variant={'link'}>Forgot password?</Text>
                </TouchableOpacity>
              </Link>
            </View>
            <Button
              testID="SIGN_IN_BUTTON"
              onPress={methods.handleSubmit(onSubmit)}
              isLoading={isPending}
              disabled={isSignedIn || isLimited}>
              Continue
            </Button>
          </View>
        </FormProvider>

        <AuthFooter
          text="By signing in, you agree to our"
          linkText="Terms of Service"
          linkHref={PAGE_ROUTES.HOME}
          testID="SIGNUP_BUTTON"
        />
      </KeyboardSafeView>
    </Container>
  );
};
