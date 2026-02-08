import React from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@components/ui/input';
import { ModernButton } from '@components/ui/button';
import { Text } from '@/src/components/ui/text';
import { passwordValidation } from '@/src/utils/validiation/auth';
import { toast } from 'sonner-native';
import { http } from '@/src/utils/http';
import { AUTH_ENDPOINTS } from '@/src/libs/endpoints/auth';
import { useSearchParams } from 'expo-router/build/hooks';
import { useRouter } from 'expo-router';

// Schema for Step 1: New Password & Confirm Password
const NewPasswordSchema = z
  .object({
    password: passwordValidation,
    confirm_password: passwordValidation,
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirm_password'],
      });
    }
  });

// Schema for Step 2: OTP
const OtpSchema = z.object({
  otp: z
    .string('OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^[0-9]+$/, 'OTP must only contain numbers'),
});

type NewPasswordInputs = z.infer<typeof NewPasswordSchema>;

type OtpInputs = z.infer<typeof OtpSchema>;

export const ResetPasswordForm = () => {
  const router = useRouter();
  const search = useSearchParams();
  const phone_no = search.get('phone') || '';

  // 'INPUT_PASSWORD' = User enters new password first
  // 'INPUT_OTP' = OTP input shows up
  const [status, setStatus] = React.useState<'INPUT_PASSWORD' | 'INPUT_OTP'>('INPUT_PASSWORD');

  // We need to store the password from step 1 to send it in step 2
  const [passwordData, setPasswordData] = React.useState<NewPasswordInputs | null>(null);

  const passwordForm = useForm<NewPasswordInputs>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });

  const otpForm = useForm<OtpInputs>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // 1. Send OTP Mutation (Triggered after password validation)
  const sendOtpMutation = useMutation({
    mutationFn: async (data: { phone_no: string }) => http.post(AUTH_ENDPOINTS.POST_GET_OTP, data),
    onSuccess: (data: any) => {
      // Assuming generic response format
      if (data.success) {
        toast.success(data.message || 'OTP sent successfully');
        setStatus('INPUT_OTP');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
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
      return http.post(AUTH_ENDPOINTS.POST_FORGOT_PASSWORD, data);
    },
    onSuccess: (data: any) => {
      if (data.success) {
        toast.success(data.message || 'Password reset successfully');
        router.replace('/auth'); // Or correct login route
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    },
  });

  const onPasswordSubmit = (data: NewPasswordInputs) => {
    if (!phone_no) {
      toast.error('Phone number missing!');
      return;
    }
    setPasswordData(data);
    // Call API to send OTP
    sendOtpMutation.mutate({ phone_no });
  };

  const onOtpSubmit = (data: OtpInputs) => {
    if (!passwordData || !phone_no) {
      toast.error('Missing data for reset.');
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

          <ModernButton
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

          <ModernButton
            title="Reset Password"
            onPress={otpForm.handleSubmit(onOtpSubmit)}
            isLoading={resetPasswordMutation.isPending}
          />
        </>
      )}
    </View>
  );
};
