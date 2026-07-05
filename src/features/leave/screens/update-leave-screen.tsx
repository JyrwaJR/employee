import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { FieldInput, Input, Text } from '@components/ui';
import { FormProvider, useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, KeyboardSafeView } from '@components/layout';
import { SectionHeader } from '@components/common';
import { calculateDaysBetweenDatesWithoutWeekends, formatDateInput } from '@utils/helpers';
import { UpdateLeaveSchema, type UpdateLeaveInput } from '../validators';
import { useLeaveDetail, useLeaveReason } from '../hooks';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants';
import { LeaveReasonCode, LeaveTypeCode } from '../types';
import {
  LeaveTypeDropdown,
  LeaveReasonDropdown,
  UpdateLeaveSkeleton,
  CreateLeaveSubmitButton,
} from '../components';
import { useSnackbar } from '@hooks/use-snackbar';
import { useUpdateLeave } from '../hooks/use-update-leave';

/**
 * Route search parameters expected by the update leave screen.
 *
 * All three values are extracted from the URL query string and serve as
 * the composite key to identify the leave record being edited.
 */
type UpdateLeaveSearchParamsT = {
  /** Leave type code (e.g. `SL` for Sick Leave). */
  leave_cd: LeaveTypeCode;
  /** Leave start date in `DD/MM/YYYY` display format. */
  from_dt: string;
  /** Order / approval date in `DD/MM/YYYY` display format. */
  order_dt: string;
};

const defaultValues: UpdateLeaveInput = {
  leave_cd: 'SL',
  from_dt: '',
  to_dt: '',
  no_days: '',
  reason_text: '',
  reason_cd: '',
  remarks: '',
};

/**
 * UpdateLeaveScreen provides a form for editing an existing leave request.
 *
 * Reads the leave composite key (`leave_cd`, `from_dt`, `order_dt`) from
 * the route's search params, fetches the existing record via
 * {@link useLeaveDetail}, and pre-populates the form fields.
 *
 * Uses the same validation schema (`CreateLeaveSchema`) and the same
 * mutation hook (`useCreateUpdateLeave`) but with `flag: 'F'` to signal
 * a full update rather than a new creation.
 *
 * ### States
 *
 * - **Loading leave data** — Shows a skeleton while the existing record
 *   is being fetched.
 * - **Ready** — Displays the pre-populated form for editing.
 * - **Submitting** — Shows skeleton while the update mutation is in-flight.
 *
 * @example
 * ```tsx
 * // Navigation to this screen:
 * router.push(
 *   PAGE_ROUTES.LEAVE.UPDATE({ leave_cd: 'SL', from_dt: '01/06/2026', order_dt: '25/05/2026' })
 * );
 * ```
 */

export const UpdateLeaveScreen = () => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { leave_cd, from_dt, order_dt } = useLocalSearchParams<UpdateLeaveSearchParamsT>();

  // Fetch existing leave record for pre-population
  const { data: existingLeave, isLoading: isLoadingLeave } = useLeaveDetail({
    from_dt,
    leave_cd,
    order_dt,
  });

  const isVerified = existingLeave?.verify_flg_desc === 'Verified';

  const { mutate, isPending } = useUpdateLeave();
  const { data: LeaveReason } = useLeaveReason();

  const methods = useForm<UpdateLeaveInput>({
    resolver: zodResolver(UpdateLeaveSchema),
    defaultValues,
  });

  // Pre-populate form when existing leave data is loaded
  useEffect(() => {
    if (existingLeave) {
      methods.reset({
        leave_cd: existingLeave.leave_cd,
        from_dt: existingLeave.from_dt,
        to_dt: existingLeave.to_dt,
        no_days: existingLeave.no_days,
        reason_cd: existingLeave.leave_reason_cd.toString(),
        remarks: existingLeave.remakrs,
      });
    }
  }, [existingLeave, methods]);

  // Auto-calculate no_days when from_date or to_date changes
  const fromDate = useWatch({ control: methods.control, name: 'from_dt' });
  const toDate = useWatch({ control: methods.control, name: 'to_dt' });
  const reasonCode = useWatch({ control: methods.control, name: 'reason_cd' });

  useEffect(() => {
    const days = calculateDaysBetweenDatesWithoutWeekends(fromDate, toDate);
    if (days) {
      methods.setValue('no_days', days, { shouldValidate: true });
    }
  }, [fromDate, toDate, methods]);

  useEffect(() => {
    const selectedReason = LeaveReason?.find((reason) => reason.code_value === reasonCode);
    if (selectedReason) {
      methods.setValue('reason_text', selectedReason.code_text, {
        shouldValidate: true,
      });
    }
  }, [reasonCode, LeaveReason, methods]);

  const onSubmit = (data: UpdateLeaveInput) => {
    mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          const leave = response.data;
          showSnackbar(response.message);
          if (leave) {
            const pageUrl = PAGE_ROUTES.LEAVE.INDEX;
            router.push(pageUrl);
            return;
          }
          router.back();
          return;
        }
        showSnackbar(response.message);
      },
    });
  };

  if (isPending || isLoadingLeave) {
    return <UpdateLeaveSkeleton />;
  }

  return (
    <Container className="flex-1">
      <KeyboardSafeView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-4">
          <View className="mt-4">
            <SectionHeader subtitle="Update your leave request" title="Update Leave" />
          </View>

          <FormProvider {...methods}>
            <View className="w-full gap-y-2">
              {/* Leave Type Dropdown Selector */}
              <Controller
                control={methods.control}
                name="leave_cd"
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <LeaveTypeDropdown
                    title="Type"
                    disabled={isVerified}
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
                          placeholder="yyyy-mm-dd"
                          readOnly={isVerified}
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
                          placeholder="yyyy-mm-dd"
                          keyboardType="number-pad"
                          readOnly={isVerified}
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
                name="no_days"
                render={({ field: { value }, fieldState: { error } }) => (
                  <FieldInput
                    readOnly={isVerified}
                    name="no_days"
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

              {/* Reason */}
              <Controller
                control={methods.control}
                name="reason_cd"
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <LeaveReasonDropdown
                    disabled={isVerified}
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
                readOnly={isVerified}
              />

              {/* Spacer before button */}
              <View className="h-4" />

              {/* Submit Button with built-in rate limiting */}
              <CreateLeaveSubmitButton
                onPress={methods.handleSubmit(onSubmit)}
                isDirty={methods.formState.isDirty}
                isPending={isPending || isVerified}
                label="Update Leave"
                loadingText={isVerified ? 'Leave Verified' : 'Updating Leave...'}
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
