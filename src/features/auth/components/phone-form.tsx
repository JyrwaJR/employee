import React from 'react';
import { View } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/src/shared/components/ui/button';
import { toast } from '@/src/shared/components/ui';
import { http } from '@/src/shared/utils/api/http';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { useRouter } from 'expo-router';
import { ForgotPasswordSchema } from '../validators/forgot-password.schema';
import { routes } from '@utils/constants/routes';
import { FieldInput } from '@/src/shared/components/ui/field-input';

type ForgotPasswordInputs = z.infer<typeof ForgotPasswordSchema>;

export const PhoneForm = () => {
  const router = useRouter();
  const methods = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { phone_no: '' },
  });

  const phone_no = methods.watch('phone_no');

  const sendOtpMutation = useMutation({
    mutationFn: async (data: ForgotPasswordInputs) => http.post(ENDPOINTS.AUTH.GET_OTP, data),
    onSuccess: (data) => {
      if (data.success) {
        router.push(routes.auth.forgotPassword(phone_no, 'OTP'));
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

  const onPhoneSubmit = (data: ForgotPasswordInputs) => {
    sendOtpMutation.mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <View className="w-full">
        <FieldInput
          name="phone_no"
          label="Phone Number"
          placeholder="+1 234 567 8900"
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
