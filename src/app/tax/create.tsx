import React from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Container } from '@components/layout/container';
import { Text } from '@components/ui/text';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { toast } from '@components/ui';
import { SectionHeader } from '@components/common/section-header';
import { FieldInput } from '@components/ui/field-input';
import { useUpdateTaxDetail } from '@features/income-tax/hooks';
import {
  updateTaxSchema,
  UpdateTaxFormValues,
} from '@features/income-tax/validators/tax.validator';

export default function CreateTaxRecordScreen() {
  const updateMutation = useUpdateTaxDetail();

  const methods = useForm<UpdateTaxFormValues>({
    resolver: zodResolver(updateTaxSchema),
    defaultValues: {
      regime: 'NEW',
      deductions80C: 0,
      deductions80D: 0,
      hraExemption: 0,
      ltaExemption: 0,
      homeLoanInterest: 0,
      npsContribution: 0,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values: UpdateTaxFormValues) => {
    try {
      await updateMutation.mutateAsync(values);
      toast.success('Tax Record Created', {
        description: 'New tax record has been created.',
      });
      router.back();
    } catch (err: any) {
      toast.error('Creation Failed', {
        description: err?.message || 'Could not create tax record.',
      });
    }
  };

  return (
    <Container className="flex-1">
      <FormProvider {...methods}>
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <SectionHeader title="Tax Regime" />
            <View className="flex-row gap-3">
              <Controller
                control={control}
                name="regime"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TouchableOpacity
                      onPress={() => onChange('NEW')}
                      className={
                        'flex-1 rounded-xl p-4 ' +
                        (value === 'NEW'
                          ? 'bg-blue-600'
                          : 'border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800')
                      }>
                      <Text
                        className={
                          'text-center text-sm font-bold ' +
                          (value === 'NEW' ? 'text-white' : 'text-gray-700 dark:text-gray-300')
                        }>
                        New Regime
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onChange('OLD')}
                      className={
                        'flex-1 rounded-xl p-4 ' +
                        (value === 'OLD'
                          ? 'bg-amber-600'
                          : 'border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800')
                      }>
                      <Text
                        className={
                          'text-center text-sm font-bold ' +
                          (value === 'OLD' ? 'text-white' : 'text-gray-700 dark:text-gray-300')
                        }>
                        Old Regime
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              />
            </View>
          </View>

          <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <SectionHeader title="Deductions" />
            <FieldInput
              name="deductions80C"
              label="Section 80C"
              placeholder="Max Rs 1,50,000"
              keyboardType="numeric"
            />
            <FieldInput
              name="deductions80D"
              label="Section 80D"
              placeholder="Max Rs 1,00,000"
              keyboardType="numeric"
            />
            <FieldInput
              name="hraExemption"
              label="HRA Exemption"
              placeholder="Enter amount"
              keyboardType="numeric"
            />
            <FieldInput
              name="ltaExemption"
              label="LTA Exemption"
              placeholder="Enter amount"
              keyboardType="numeric"
            />
            <FieldInput
              name="homeLoanInterest"
              label="Home Loan Interest u/s 24(b)"
              placeholder="Max Rs 2,00,000"
              keyboardType="numeric"
            />
            <FieldInput
              name="npsContribution"
              label="NPS u/s 80CCD(1B)"
              placeholder="Max Rs 50,000"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting || updateMutation.isPending}
            className={
              'mb-10 flex-row items-center justify-center rounded-xl p-4 ' +
              (isSubmitting || updateMutation.isPending ? 'bg-blue-400' : 'bg-blue-600')
            }>
            {isSubmitting || updateMutation.isPending ? (
              <ActivityIndicator color="white" className="mr-2" />
            ) : null}
            <Text className="font-semibold text-white">
              {isSubmitting || updateMutation.isPending ? 'Creating...' : 'Create Tax Record'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </FormProvider>
    </Container>
  );
}
