import React from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/src/shared/components/ui/input';
import { Button } from '@/src/shared/components/ui/button';
import { Text } from '@/src/shared/components/ui/text';
import { notify } from '@/src/shared/utils/notify';
import { http } from '@/src/shared/utils/http';
import { api } from '@/src/shared/api';
import { useRouter } from 'expo-router';
import { ForgotPasswordSchema } from '../validators/forgotPassword.schema';
import { routes } from '@/src/shared/constants/routes';

type ForgotPasswordInputs = z.infer<typeof ForgotPasswordSchema>;

export const PhoneForm = () => {
  const router = useRouter();
  const phoneForm = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { phone_no: '' },
  });

  const phone_no = phoneForm.watch('phone_no');

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
    <View className="w-full">
      <View className="mb-4">
        <Text variant="label" className="mb-1.5 ml-1">
          Phone Number
        </Text>
        <Controller
          control={phoneForm.control}
          name="phone_no"
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <>
              <Input
                placeholder="+1 234 567 8900"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="phone-pad"
                autoComplete="tel"
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
        onPress={phoneForm.handleSubmit(onPhoneSubmit)}
        isLoading={sendOtpMutation.isPending}
      />
    </View>
  );
};
