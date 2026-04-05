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
import { router } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import { OTPSchema } from '../validators/otp.schema';
import { routes } from '@/src/shared/constants/routes';

type OTPInputs = z.infer<typeof OTPSchema>;

export const VerifyOtpForm = () => {
  const search = useSearchParams();
  const phone_no = search.get('phone') || '';
  const phoneForm = useForm<OTPInputs>({
    resolver: zodResolver(OTPSchema),
    defaultValues: { phone_no: phone_no },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (data: OTPInputs) => http.post(api.auth.verifyOtp, data),
    onSuccess: (data) => {
      if (data.success) {
        router.push(routes.auth.forgotPassword(phone_no, 'RESET'));
      }
      notify(data, 'AUTH_VERIFY');
      return data;
    },
  });

  const onPhoneSubmit = (data: OTPInputs) => sendOtpMutation.mutate(data);

  return (
    <View className="w-full">
      <View className="mb-4">
        <Text variant="label" className="mb-1.5 ml-1">
          OTP Number
        </Text>

        <Controller
          control={phoneForm.control}
          name="otp"
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
        title="Verify"
        onPress={phoneForm.handleSubmit(onPhoneSubmit)}
        isLoading={sendOtpMutation.isPending}
      />
    </View>
  );
};
