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
import { router } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import { OTPSchema } from '../validators/otp.schema';
import { routes } from '@utils/constants/routes';
import { FieldInput } from '@/src/shared/components/ui/field-input';

type OTPInputs = z.infer<typeof OTPSchema>;

export const VerifyOtpForm = () => {
  const search = useSearchParams();
  const phone_no = search.get('phone') || '';
  const methods = useForm<OTPInputs>({
    resolver: zodResolver(OTPSchema),
    defaultValues: { phone_no: phone_no, otp: '' },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (data: OTPInputs) => http.post(ENDPOINTS.AUTH.VERIFY_OTP, data),
    onSuccess: (data) => {
      if (data.success) {
        router.push(routes.auth.forgotPassword(phone_no, 'RESET'));
        toast.success('Verification Success', {
          description: data.message || 'Code verified successfully',
        });
      } else {
        toast.error('Verification Failed', {
          description: data.message || 'Invalid verification code',
        });
      }
      return data;
    },
  });

  const onPhoneSubmit = (data: OTPInputs) => sendOtpMutation.mutate(data);

  return (
    <FormProvider {...methods}>
      <View className="w-full">
        <FieldInput
          name="otp"
          label="OTP Number"
          placeholder="123456"
          keyboardType="number-pad"
          autoComplete="one-time-code"
          maxLength={6}
        />

        <Button
          title="Verify"
          onPress={methods.handleSubmit(onPhoneSubmit)}
          isLoading={sendOtpMutation.isPending}
          className="mt-4"
        />
      </View>
    </FormProvider>
  );
};
