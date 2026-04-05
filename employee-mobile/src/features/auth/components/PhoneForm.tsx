import React from 'react';
import { View } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/src/shared/components/ui/button';
import { notify } from '@/src/shared/utils/notify';
import { http } from '@/src/shared/utils/http';
import { api } from '@/src/shared/api';
import { useRouter } from 'expo-router';
import { ForgotPasswordSchema } from '../validators/forgotPassword.schema';
import { routes } from '@/src/shared/constants/routes';
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
    mutationFn: async (data: ForgotPasswordInputs) => http.post(api.auth.getOtp, data),
    onSuccess: (data) => {
      if (data.success) {
        router.push(routes.auth.forgotPassword(phone_no, 'OTP'));
      }
      notify(data, 'AUTH_OTP');
      return data;
    },
    onError: () => {
      notify({ success: false }, 'AUTH_OTP');
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

