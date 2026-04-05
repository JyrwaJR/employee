import React from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/src/shared/components/ui/input';
import { Button } from '@/src/shared/components/ui/button';
import { Text } from '@/src/shared/components/ui/text';
import { notify } from '@/src/shared/utils/notify';
import { http } from '@/src/shared/utils/http';
import { api } from '@/src/shared/api';
import { useSearchParams } from 'expo-router/build/hooks';
import { useRouter } from 'expo-router';
import { routes } from '@/src/shared/constants/routes';
import {
  ResetPasswordSchema,
  ResetPasswordOtpSchema,
  ResetPasswordInputs,
  ResetPasswordOtpInputs,
} from '../validators/resetPassword.schema';

export const ResetPasswordForm = () => {
  const router = useRouter();
  const search = useSearchParams();
  const phone_no = search.get('phone') || '';

  // 'INPUT_PASSWORD' = User enters new password first
  // 'INPUT_OTP' = OTP input shows up
  const [status, setStatus] = React.useState<'INPUT_PASSWORD' | 'INPUT_OTP'>('INPUT_PASSWORD');

  // We need to store the password from step 1 to send it in step 2
  const [passwordData, setPasswordData] = React.useState<ResetPasswordInputs | null>(null);

  const passwordForm = useForm<ResetPasswordInputs>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });

  const otpForm = useForm<ResetPasswordOtpInputs>({
    resolver: zodResolver(ResetPasswordOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // 1. Send OTP Mutation (Triggered after password validation)
  const sendOtpMutation = useMutation({
    mutationFn: async (data: { phone_no: string }) => http.post(api.auth.getOtp, data),
    onSuccess: (data: any) => {
      if (data.success) {
        setStatus('INPUT_OTP');
      }
      notify(data, 'AUTH_OTP');
    },
  });

  // 2. Verified OTP & Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: {
      phone_no: string;
      otp: string;
      password: string;
      confirm_password: string;
    }) => {
      return http.post(api.auth.forgotPassword, data);
    },
    onSuccess: (data: any) => {
      if (data.success) {
        router.replace(routes.auth.login);
      }
      notify(data, 'AUTH_RESET');
    },
  });

  const onPasswordSubmit = (data: ResetPasswordInputs) => {
    if (!phone_no) {
      notify({ success: false, message: 'Phone number missing!' }, 'AUTH_RESET');
      return;
    }
    setPasswordData(data);
    // Call API to send OTP
    sendOtpMutation.mutate({ phone_no });
  };

  const onOtpSubmit = (data: ResetPasswordOtpInputs) => {
    if (!passwordData || !phone_no) {
      notify({ success: false, message: 'Missing data for reset.' }, 'AUTH_RESET');
      return;
    }
    resetPasswordMutation.mutate({
      phone_no,
      otp: data.otp,
      password: passwordData.password,
      confirm_password: passwordData.confirm_password,
    });
  };

  return (
    <View className="w-full">
      {status === 'INPUT_PASSWORD' && (
        <>
          <View className="mb-4">
            <Text variant="label" className="mb-1.5 ml-1">
              New Password
            </Text>
            <Controller
              control={passwordForm.control}
              name="password"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <Input
                    placeholder="••••••••"
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
              control={passwordForm.control}
              name="confirm_password"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <Input
                    placeholder="••••••••"
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

          <Button
            title="Send OTP"
            onPress={passwordForm.handleSubmit(onPasswordSubmit)}
            isLoading={sendOtpMutation.isPending}
          />
        </>
      )}

      {status === 'INPUT_OTP' && (
        <>
          <View className="mb-4">
            <Text variant="subtext" className="mb-6 text-center">
              OTP sent to {phone_no}
            </Text>
            <Text variant="label" className="mb-1.5 ml-1">
              Enter OTP
            </Text>
            <Controller
              control={otpForm.control}
              name="otp"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <Input
                    placeholder="123456"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="number-pad"
                    maxLength={6}
                    error={!!error}
                    className="text-center text-2xl tracking-widest"
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

          <Button
            title="Reset Password"
            onPress={otpForm.handleSubmit(onOtpSubmit)}
            isLoading={resetPasswordMutation.isPending}
          />
        </>
      )}
    </View>
  );
};
