import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Container } from '@components/layout/container';
import { Text } from '@components/ui/text';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, toast } from '@components/ui';
import { SectionHeader } from '@components/common/section-header';
import { EditTaxSkeleton } from '../components/skeleton';
import { FieldInput } from '@components/ui/field-input';
import { useEmployeeTax, useUpdateTaxDetail } from '../hooks';
import { UpdateTaxSchema, UpdateTaxInput } from '../validators/tax.validator';
import { router } from 'expo-router';

export default function EditTaxDetailScreen() {
  const { data, isLoading } = useEmployeeTax();
  const updateMutation = useUpdateTaxDetail();

  const methods = useForm<UpdateTaxInput>({
    resolver: zodResolver(UpdateTaxSchema) as any,
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

  const { control, handleSubmit, reset, formState } = methods;
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    if (data) {
      reset({
        regime: data.regime,
        deductions80C: data.deductions80C,
        deductions80D: data.deductions80D,
        hraExemption: data.hraExemption,
        ltaExemption: data.ltaExemption,
        homeLoanInterest: data.homeLoanInterest,
        npsContribution: data.npsContribution,
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: UpdateTaxInput) => {
    try {
      await updateMutation.mutateAsync(values);
      toast.success('Tax Details Updated', {
        description: 'The employee tax details have been saved successfully.',
      });
      router.back();
    } catch (err: any) {
      toast.error('Update Failed', {
        description: err?.message || 'Could not update tax details.',
      });
    }
  };

  if (isLoading) return <EditTaxSkeleton />;

  return (
    <Container className="flex-1">
      <FormProvider {...methods}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="mb-6">
            <SectionHeader title="Tax Regime" />
            <Text className="mb-3 text-xs text-gray-500">
              Select the tax regime applicable for this employee.
            </Text>
            <View className="flex-row gap-3">
              <Controller
                control={control}
                name="regime"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-1 flex-row gap-3">
                    <Button
                      onPress={() => onChange('NEW')}
                      className="flex-1"
                      variant={value === 'NEW' ? 'primary' : 'outline'}>
                      New Regime
                    </Button>
                    <Button
                      onPress={() => onChange('OLD')}
                      className="flex-1"
                      variant={value === 'OLD' ? 'primary' : 'outline'}>
                      Old Regime
                    </Button>
                  </View>
                )}
              />
            </View>
            {errors.regime && (
              <Text className="mt-1 text-xs text-red-500">{errors.regime.message}</Text>
            )}
          </View>

          <View className="mb-6">
            <SectionHeader title="Deductions (Old Regime)" />
            <Text className="mb-4 text-xs text-gray-500">
              Enter the deduction amounts claimed by the employee.
            </Text>

            <FieldInput
              name="deductions80C"
              label="Section 80C"
              placeholder="Max Rs 1,50,000"
              keyboardType="numeric"
            />
            <FieldInput
              name="deductions80D"
              label="Section 80D (Health Insurance)"
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

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting || updateMutation.isPending}>
            {isSubmitting || updateMutation.isPending ? 'Saving...' : 'Save Tax Details'}
          </Button>
        </ScrollView>
      </FormProvider>
    </Container>
  );
}
