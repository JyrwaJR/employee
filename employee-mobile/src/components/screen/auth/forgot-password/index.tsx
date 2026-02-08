import React, { useState } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Container } from '@components/common/Container';
import { Ionicons } from '@expo/vector-icons';
import { PhoneForm } from './PhoneForm';
import { VerifyOtpForm } from './VerifyOtpForm';
import { logger } from '@/src/utils/logger';
import { Ternary } from '@/src/components/common/Ternary';
import { useSearchParams } from 'expo-router/build/hooks';
import { ResetPasswordForm } from './ResetPasswordForm';

type Step = 'PHONE' | 'OTP' | 'RESET';

export const ForgotPassword = () => {
  const search = useSearchParams();

  const currentStep = search?.get('step') || 'PHONE';
  const phone = search?.get('phone_no') || '';

  const onValueChange = (value: { value: Step; phone_no: string }) => {};

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View className="mb-8 items-center">
            <View className="mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
              <Ionicons name="lock-closed" size={32} color="#2563eb" />
            </View>
            <Text variant={'heading'} size={'2xl'} weight={'semibold'} className="text-center">
              {currentStep === 'PHONE'
                ? 'Forgot Password?'
                : currentStep === 'OTP'
                  ? 'Verify OTP'
                  : 'Reset Password'}
            </Text>
            <Text variant={'subtext'} className="mt-2 text-center">
              {currentStep === 'PHONE'
                ? 'Don’t worry! It happens. Please enter the phone number associated with your account.'
                : currentStep === 'OTP'
                  ? 'Enter the verification code sent to your phone.'
                  : 'Create a new strong password for your account.'}
            </Text>
          </View>

          {/* Form Section */}
          <Ternary
            condition={currentStep === 'RESET'}
            ifTrue={<ResetPasswordForm />}
            ifFalse={
              <Ternary
                condition={currentStep === 'OTP'}
                ifTrue={<VerifyOtpForm />}
                ifFalse={<PhoneForm />}
              />
            }
          />

          {/* Back to Login */}
          <View className="mt-8 flex-row justify-center">
            <Link href="/auth" asChild>
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="arrow-back" size={16} color="#4B5563" style={{ marginRight: 4 }} />
                <Text variant="subtext">Back to log in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};
