import React from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Text } from '@/src/shared/components/ui/text';
import { Container } from '@/src/shared/components/layout/Container';
import { Ionicons } from '@expo/vector-icons';
import { PhoneForm } from '../components/PhoneForm';
import { VerifyOtpForm } from '../components/VerifyOtpForm';
import { Ternary } from '@/src/shared/components/base/Ternary';
import { useSearchParams } from 'expo-router/build/hooks';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { routes } from '@/src/shared/constants/routes';
import { HeaderStack } from '@/src/shared/components/layout';
import { AuthHeader } from '../components/AuthHeader';

export const ForgotPassword = () => {
  const search = useSearchParams();

  const currentStep = search?.get('step') || 'PHONE';

  const headerTitle =
    currentStep === 'PHONE'
      ? 'Forgot Password?'
      : currentStep === 'OTP'
        ? 'Verify OTP'
        : 'Reset Password';

  const headerSubtitle =
    currentStep === 'PHONE'
      ? 'Don’t worry! It happens. Please enter the phone number associated with your account.'
      : currentStep === 'OTP'
        ? 'Enter the verification code sent to your phone.'
        : 'Create a new strong password for your account.';

  return (
    <Container>
      <HeaderStack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}>
          <AuthHeader
            icon={<Ionicons name="lock-closed" size={32} color="#2563eb" />}
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
                ifFalse={<PhoneForm />}
              />
            }
          />

          {/* Back to Login */}
          <View className="mt-8 flex-row justify-center">
            <Link href={routes.auth.login} asChild>
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
