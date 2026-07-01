import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Container } from '@components/layout/container';
import { Icon } from '@components/ui/icon';
import { EmpCodeForm } from '../components/phone-form';
import { VerifyOtpForm } from '../components/verify-otp-form';
import { Ternary } from '@components/base/ternary';
import { useSearchParams } from 'expo-router/build/hooks';
import { ResetPasswordForm } from '../components/reset-password-form';
import { StackHeader } from '@components/layout';
import { AuthHeader } from '../components/auth-header';

export const ForgotPassword = () => {
  const search = useSearchParams();

  const currentStep = search?.get('step') || 'EMPCODE';

  const headerTitle =
    currentStep === 'EMPCODE'
      ? 'Forgot Password?'
      : currentStep === 'OTP'
        ? 'Verify OTP'
        : 'Reset Password';

  const headerSubtitle =
    currentStep === 'EMPCODE'
      ? 'Don’t worry! It happens. Please enter the Employee Code associated with your account.'
      : currentStep === 'OTP'
        ? 'Enter the verification code sent to your phone.'
        : 'Create a new strong password for your account.';

  return (
    <Container>
      <StackHeader />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}>
          <AuthHeader
            icon={<Icon family="ionicons" name="lock-closed" size={32} color="#2563eb" />}
            title={headerTitle}
            subtitle={headerSubtitle}
          />

          {/* Form Section */}
          <Ternary
            condition={currentStep === 'RESET'}
            ifTrue={<ResetPasswordForm />}
            ifFalse={
              <Ternary
                condition={currentStep === 'OTP'}
                ifTrue={<VerifyOtpForm />}
                ifFalse={<EmpCodeForm />}
              />
            }
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};
