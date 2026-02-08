import React from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@components/ui/input';
import { ModernButton } from '@components/ui/button';
import { Text } from '@/src/components/ui/text';
import { ForgotPasswordSchema } from '@/src/utils/validiation/auth';
import { toast } from 'sonner-native';
import { http } from '@/src/utils/http';
import { AUTH_ENDPOINTS } from '@/src/libs/endpoints/auth';
import { useRouter } from 'expo-router';

type ForgotPasswordInputs = z.infer<typeof ForgotPasswordSchema>;

export const PhoneForm = () => {
  const router = useRouter();
  const phoneForm = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { phone_no: '' },
  });

  const phone_no = phoneForm.watch('phone_no');

  const sendOtpMutation = useMutation({
    mutationFn: async (data: ForgotPasswordInputs) => http.post(AUTH_ENDPOINTS.POST_GET_OTP, data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        router.push(`/auth/forgot-password?phone=${phone_no}&step=OTP`);
        return data;
      }
      toast.error(data.message);
      return data;
    },
    onError: () => {
      toast.error('Failed to send OTP. Please try again.');
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
      <ModernButton
        title="Send OTP"
        onPress={phoneForm.handleSubmit(onPhoneSubmit)}
        isLoading={sendOtpMutation.isPending}
      />
    </View>
  );
};
