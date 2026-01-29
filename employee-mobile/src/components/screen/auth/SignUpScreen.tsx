import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { SignUpSchema } from '@utils/validiation/auth';
import { ModernButton } from '../../ui/button';
import { ModernInput } from '../../ui/input';
import { http } from '@/src/utils/http';
import { AUTH_ENDPOINTS } from '@/src/libs/endpoints/auth';
import { toast } from 'sonner-native';

// --- 2. Zod Validation Schema (Updated) ---
type SignUpFormInputs = z.infer<typeof SignUpSchema>;

export const SignUpScreen = () => {
  const router = useRouter();

  const signUpMutation = useMutation({
    mutationFn: (data: SignUpFormInputs) => http.post(AUTH_ENDPOINTS.POST_SIGN_UP, data),
    onSuccess: (data) => {
      if (data.success) {
        router.replace('/auth');
        toast.success(data.message);
        return data;
      }
      toast.error(data.message);
      return data;
    },
  });

  const { control, handleSubmit } = useForm<SignUpFormInputs>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = (data: SignUpFormInputs) => signUpMutation.mutate(data);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
          className="px-6">
          {/* Header */}
          <View className="mb-8 mt-4 items-center">
            {/* Small animated entry icon or logo */}
            <View className="mb-4 h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Text className="text-xl">🚀</Text>
            </View>
            <Text className="text-3xl font-bold tracking-tight text-gray-900">Create account</Text>
            <Text className="mt-2 text-center text-base text-gray-500">
              Provide your details to register.
            </Text>
          </View>

          {/* Form */}
          <View className="w-full">
            {/* Name Row: Flex container for First/Last name */}
            <View className="flex-row justify-between gap-x-2">
              <ModernInput
                control={control}
                name="first_name"
                label="First name"
                placeholder="John"
                className="w-full flex-1"
              />
              <ModernInput
                className="w-full flex-1"
                control={control}
                name="last_name"
                label="Last name"
                placeholder="Doe"
              />
            </View>

            <ModernInput
              control={control}
              name="email"
              label="Email"
              placeholder="name@company.com"
            />

            <ModernInput
              control={control}
              name="password"
              label="Password"
              placeholder="Create a password"
              secureTextEntry
            />

            <ModernInput
              control={control}
              name="confirm_password"
              label="Confirm Password"
              placeholder="Create a password"
              secureTextEntry
            />

            {/* Terms Text */}
            <Text className="mb-6 text-xs leading-5 text-gray-400">
              By creating an account, you agree to our{' '}
              <Text className="font-medium text-gray-900">Terms of Service</Text> and{' '}
              <Text className="font-medium text-gray-900">Privacy Policy</Text>.
            </Text>

            <ModernButton
              title="Create account"
              onPress={handleSubmit(onSubmit)}
              isLoading={signUpMutation.isPending}
            />

            <View className="my-6 flex-row items-center">
              <View className="h-[1px] flex-1 bg-gray-200" />
              <Text className="mx-4 text-xs font-medium uppercase text-gray-400">Or</Text>
              <View className="h-[1px] flex-1 bg-gray-200" />
            </View>

            <ModernButton title="Sign up with Google" variant="google" onPress={() => {}} />
          </View>

          {/* Footer */}
          <View className="my-8 flex-row justify-center">
            <Text className="text-gray-500">Already have an account? </Text>
            <Link href="/auth">
              <Text className="font-semibold text-gray-900">Sign in</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
