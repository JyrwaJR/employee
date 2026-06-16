import React from 'react';
import { View } from 'react-native';
import { FormProvider } from 'react-hook-form';
import { Button } from '@/src/shared/components/ui/button';
import { Text } from '@/src/shared/components/ui/text';
import { FieldInput } from '@/src/shared/components/ui/field-input';
import { useResetPassword } from '../hooks/use-reset-password';

export const ResetPasswordForm = () => {
  const {
    status,
    phone_no,
    passwordMethods,
    otpMethods,
    sendOtpMutation,
    resetPasswordMutation,
    onPasswordSubmit,
    onOtpSubmit,
  } = useResetPassword();

  return (
    <View className="w-full">
      {status === 'INPUT_PASSWORD' && (
        <FormProvider {...passwordMethods}>
          <FieldInput name="password" label="New Password" placeholder="••••••••" secureTextEntry />
          <FieldInput
            name="confirm_password"
            label="Confirm Password"
            placeholder="••••••••"
            secureTextEntry
          />

          <Button
            title="Send OTP"
            onPress={passwordMethods.handleSubmit(onPasswordSubmit)}
            isLoading={sendOtpMutation.isPending}
          />
        </FormProvider>
      )}

      {status === 'INPUT_OTP' && (
        <FormProvider {...otpMethods}>
          <View className="mb-4">
            <Text variant="subtext" className="mb-6 text-center">
              OTP sent to {phone_no}
            </Text>

            <FieldInput
              name="otp"
              label="Enter OTP"
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />
          </View>

          <Button
            title="Reset Password"
            onPress={otpMethods.handleSubmit(onOtpSubmit)}
            isLoading={resetPasswordMutation.isPending}
          />
        </FormProvider>
      )}
    </View>
  );
};
