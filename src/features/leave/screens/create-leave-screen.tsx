import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, FieldInput, Input, Text, toast } from '@components/ui';
import { FormProvider, useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, KeyboardSafeView, StackHeader } from '@components/layout';
import { SectionHeader } from '@components/base';
import { calculateDaysBetweenDates, formatDateInput } from '@utils/helpers';
import { CreateLeaveSchema, type CreateLeaveInputs } from '../validators';
import { useCreateLeave } from '../hooks';
import { useRouter } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants';
import { LeaveReasonCode, LeaveTypeCode } from '../types';
import { LeaveTypeDropdown, LeaveReasonDropdown } from '../components';

const defaultValues: CreateLeaveInputs = {
  type: 'SL',
  number_of_days: '',
  from_dt: '',
  to_dt: '',
  order_number: '',
  order_dt: '',
  reason: '',
  remarks: '',
};

/**
 * CreateLeaveScreen provides a form for submitting a new leave request.
 *
 * Features:
 * - Bottom-sheet dropdown for leave type selection (COM / EL / SL / HPL / etc.)
 * - Text inputs for date fields with `dd-mm-yyyy` format
 * - Text inputs for order number, reason, and optional remarks
 * - Zod validation via the existing `CreateLeaveSchema`
 * - Defaults: leave type to "SL"
 * - On success: navigates to the leave detail screen; on failure: shows an error toast
 */
export const CreateLeaveScreen = () => {
  const router = useRouter();

  const methods = useForm<CreateLeaveInputs>({
    resolver: zodResolver(CreateLeaveSchema),
    defaultValues,
  });

  const { mutate, isPending } = useCreateLeave();

  // Auto-calculate number_of_days when from_date or to_date changes
  const fromDate = useWatch({ control: methods.control, name: 'from_dt' });
  const toDate = useWatch({ control: methods.control, name: 'to_dt' });

  useEffect(() => {
    const days = calculateDaysBetweenDates(fromDate, toDate);
    if (days) {
      methods.setValue('number_of_days', days, { shouldValidate: true });
    }
  }, [fromDate, toDate, methods]);

  const onSubmit = (data: CreateLeaveInputs) => {
    mutate(data, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.message);
          if (data?.data?.id) {
            router.push(PAGE_ROUTES.LEAVE.DETAILS(data?.data?.id));
            return;
          }
          router.back();
          return data;
        }
        toast.error(data.message);
        return data;
      },
    });
  };

  return (
    <Container className="flex-1">
      <StackHeader />
      {/* KeyboardSafeView ensures the ScrollView remains visible when the soft keyboard opens */}
      <KeyboardSafeView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-4">
          <View className="mt-4">
            <SectionHeader subtitle="Create a new leave request" title="Create Leave" />
          </View>

          <FormProvider {...methods}>
            <View className="w-full gap-y-2">
              {/* Leave Type Dropdown Selector */}
              <Controller
                control={methods.control}
                name="type"
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <LeaveTypeDropdown
                    title="Type"
                    selectedType={value as LeaveTypeCode}
                    error={error?.message}
                    onSelect={(type) => {
                      onChange(type);
                    }}
                  />
                )}
              />

              {/* From Date & To Date — side by side */}
              <View className="flex-row gap-x-3">
                <View className="flex-1">
                  <Controller
                    control={methods.control}
                    name="from_dt"
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                      <View className="my-2 w-full">
                        <Text
                          variant={error ? 'error' : 'label'}
                          weight="medium"
                          className="mb-2 ml-1">
                          From Date
                        </Text>
                        <Input
                          value={value}
                          keyboardType="number-pad"
                          onChangeText={(text) => onChange(formatDateInput(text))}
                          placeholder="dd-mm-yyyy"
                          error={!!error}
                          testID="FROM_DATE_INPUT"
                        />
                        {error && (
                          <Text variant="caption-sm" className="ml-1 mt-2 text-destructive">
                            {error.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={methods.control}
                    name="to_dt"
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                      <View className="my-2 w-full">
                        <Text
                          variant={error ? 'error' : 'label'}
                          weight="medium"
                          className="mb-2 ml-1">
                          To Date
                        </Text>
                        <Input
                          value={value}
                          onChangeText={(text) => onChange(formatDateInput(text))}
                          placeholder="dd-mm-yyyy"
                          keyboardType="number-pad"
                          error={!!error}
                          testID="TO_DATE_INPUT"
                        />
                        {error && (
                          <Text variant="caption-sm" className="ml-1 mt-2 text-destructive">
                            {error.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                </View>
              </View>

              <Controller
                control={methods.control}
                name="number_of_days"
                render={({ field: { value }, fieldState: { error } }) => (
                  <FieldInput
                    name="number_of_days"
                    label="Number of days"
                    keyboardType="number-pad"
                    placeholder="Auto-calculated"
                    value={value}
                    editable={false}
                    testID="NUMBER_OF_DAYS_INPUT"
                    error={!!error?.message}
                  />
                )}
              />
              {/* Order Number */}
              <FieldInput
                name="order_number"
                label="Order Number"
                keyboardType="number-pad"
                placeholder="Enter order number"
                testID="ORDER_NUMBER_INPUT"
              />

              {/* Order Date */}
              <Controller
                control={methods.control}
                name="order_dt"
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <View className="my-2 w-full">
                    <Text variant={error ? 'error' : 'label'} weight="medium" className="mb-2 ml-1">
                      Order Date
                    </Text>
                    <Input
                      value={value}
                      onChangeText={(text) => onChange(formatDateInput(text))}
                      placeholder="dd-mm-yyyy"
                      keyboardType="number-pad"
                      error={!!error}
                      testID="ORDER_DATE_INPUT"
                    />
                    {error && (
                      <Text variant="caption-sm" className="ml-1 mt-2 text-destructive">
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Reason */}
              <Controller
                control={methods.control}
                name="reason"
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <LeaveReasonDropdown
                    selectedReason={value as LeaveReasonCode}
                    onSelect={(reason) => {
                      onChange(reason);
                    }}
                    error={error?.message}
                  />
                )}
              />
              {/* Remarks (optional) */}
              <FieldInput
                name="remarks"
                label="Remarks"
                placeholder="Any additional remarks (optional)"
                keyboardType="default"
                multiline
                numberOfLines={4}
                testID="REMARKS_INPUT"
              />

              {/* Spacer before button */}
              <View className="h-4" />

              {/* Submit Button */}
              <Button
                testID="CREATE_LEAVE_BUTTON"
                title="Submit Leave Request"
                onPress={methods.handleSubmit(onSubmit)}
                disabled={isPending}
              />

              {/* Bottom Spacer */}
              <View className="h-8" />
            </View>
          </FormProvider>
        </ScrollView>
      </KeyboardSafeView>
    </Container>
  );
};
