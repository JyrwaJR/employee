import React from 'react';
import { View } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@components/ui/button';
import { toast } from '@components/ui';
import { axioshttp } from '@utils/api/http';
import { AUTH_ENDPOINT } from '@features/auth/utils/constants';
import { useRouter } from 'expo-router';
import { ForgotPasswordSchema } from '../validators/forgot-password.schema';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { FieldInput } from '@components/ui/field-input';

type ForgotPasswordInputs = z.infer<typeof ForgotPasswordSchema>;
const empCode = process.env.EXPO_PUBLIC_EMP_CD ?? '';

export const EmpCodeForm = () => {
  const router = useRouter();
  const methods = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { emp_cd: empCode },
  });

  const emp_cd = methods.watch('emp_cd');

  const sendOtpMutation = useMutation({
    mutationFn: async (data: ForgotPasswordInputs) => axioshttp.post(AUTH_ENDPOINT.GET_OTP, data),
    onSuccess: (data) => {
      if (data.success) {
        router.push(PAGE_ROUTES.AUTH.FORGOT_PASSWORD(emp_cd, 'OTP'));
        toast.success('Secure Code Sent', {
          description: data.message || 'Verification code sent to your phone',
        });
      } else {
        toast.error('OTP Error', {
          description: data.message || 'Failed to send verification code',
        });
      }
      return data;
    },
    onError: (error: any) => {
      toast.error('OTP Error', {
        description: error?.message || 'Failed to send verification code',
      });
    },
  });

  const onPhoneSubmit = (data: ForgotPasswordInputs) => sendOtpMutation.mutate(data);

  return (
    <FormProvider {...methods}>
      <View className="w-full">
        <FieldInput
          name="emp_cd"
          label="Employee Code"
          placeholder="Enter Employee Code"
          keyboardType="phone-pad"
          autoComplete="tel"
          onEndEditing={methods.handleSubmit(onPhoneSubmit)}
        />

        <Button
          title="Send OTP"
          onPress={methods.handleSubmit(onPhoneSubmit)}
          isLoading={sendOtpMutation.isPending}
          className="mt-4"
        />
      </View>
    </FormProvider>
  );
};
