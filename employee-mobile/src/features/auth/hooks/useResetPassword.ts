import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import { http } from '@/src/shared/utils/http';
import { sharedEndpoints } from '@/src/shared/api';
import { notify } from '@/src/shared/utils/notify';
import { routes } from '@/src/shared/constants/routes';
import {
  ResetPasswordSchema,
  ResetPasswordOtpSchema,
  ResetPasswordInputs,
  ResetPasswordOtpInputs,
} from '../validators/resetPassword.schema';

export const useResetPassword = () => {
  const router = useRouter();
  const search = useSearchParams();
  const phone_no = search.get('phone') || '';

  const [status, setStatus] = useState<'INPUT_PASSWORD' | 'INPUT_OTP'>('INPUT_PASSWORD');
  const [passwordData, setPasswordData] = useState<ResetPasswordInputs | null>(null);

  const passwordMethods = useForm<ResetPasswordInputs>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });

  const otpMethods = useForm<ResetPasswordOtpInputs>({
    resolver: zodResolver(ResetPasswordOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (data: { phone_no: string }) => http.post(sharedEndpoints.auth.getOtp, data),
    onSuccess: (data: any) => {
      if (data.success) {
        setStatus('INPUT_OTP');
      }
      notify(data, 'AUTH_OTP');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: {
      phone_no: string;
      otp: string;
      password: string;
      confirm_password: string;
    }) => {
      return http.post(sharedEndpoints.auth.forgotPassword, data);
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

  return {
    status,
    phone_no,
    passwordMethods,
    otpMethods,
    sendOtpMutation,
    resetPasswordMutation,
    onPasswordSubmit,
    onOtpSubmit,
  };
};
