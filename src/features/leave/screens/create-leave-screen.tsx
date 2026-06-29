import React, { useEffect, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, FieldInput, toast } from '@components/ui';
import { FormProvider, useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, KeyboardSafeView, StackHeader } from '@components/layout';
import { SectionHeader } from '@components/base';
import { CreateLeaveSchema, type CreateLeaveInputs } from '../validators';
import { useCreateLeave } from '../hooks';
import { useRouter } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants';
import { LeaveReasonCode, LeaveTypeCode } from '../types';
import { LeaveTypeDropdown, LeaveReasonDropdown } from '../components';

const defaultValues: CreateLeaveInputs = {
  type: 'SL',
  number_of_days: '',
  from_date: '',
  to_date: '',
  order_number: '',
  order_date: '',
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
  const fromDate = useWatch({ control: methods.control, name: 'from_date' });
  const toDate = useWatch({ control: methods.control, name: 'to_date' });

  const calculateDaysFromDate = useCallback(
    (from: string, to: string) => {
      if (!from || !to) return;
      // Parse dd-mm-yyyy into parts
      const [fromDay, fromMonth, fromYear] = from.split('-').map(Number);
      const [toDay, toMonth, toYear] = to.split('-').map(Number);
      if (!fromDay || !fromMonth || !fromYear || !toDay || !toMonth || !toYear) return;

      const fromDateObj = new Date(fromYear, fromMonth - 1, fromDay);
      const toDateObj = new Date(toYear, toMonth - 1, toDay);
      const diffMs = toDateObj.getTime() - fromDateObj.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive

      if (diffDays >= 1) {
        methods.setValue('number_of_days', String(diffDays), { shouldValidate: true });
      }
    },
    [methods]
  );

  useEffect(() => {
    calculateDaysFromDate(fromDate, toDate);
  }, [fromDate, toDate, calculateDaysFromDate]);

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
                  <FieldInput
                    name="from_date"
                    label="From Date"
                    placeholder="dd-mm-yyyy"
                    testID="FROM_DATE_INPUT"
                  />
                </View>
                <View className="flex-1">
                  <FieldInput
                    name="to_date"
                    label="To Date"
                    placeholder="dd-mm-yyyy"
                    testID="TO_DATE_INPUT"
                  />
                </View>
              </View>
              <FieldInput
                name="number_of_days"
                label="Number of days"
                placeholder="Auto-calculated"
                editable={false}
                testID="NUMBER_OF_DAYS_INPUT"
              />
              {/* Order Number */}
              <FieldInput
                name="order_number"
                label="Order Number"
                placeholder="Enter order number"
                testID="ORDER_NUMBER_INPUT"
              />

              {/* Order Date */}
              <FieldInput
                name="order_date"
                label="Order Date"
                placeholder="dd-mm-yyyy"
                testID="ORDER_DATE_INPUT"
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
