import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Button, FieldInput, Text } from '@components/ui';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Container, KeyboardSafeView, StackHeader } from '@components/layout';
import { SectionHeader } from '@components/base';
import { CreateLeaveSchema } from '../validators';
import { cn } from '@utils/helpers/cn';
import { LEAVE_TYPES } from '../utils/constants';
import type { LeaveType } from '@sharedTypes/leave';

const LEAVE_TYPE_LIST = Object.keys(LEAVE_TYPES) as LeaveType[];

type CreateLeaveFormInputs = z.infer<typeof CreateLeaveSchema>;

/**
 * Returns today's date formatted as `dd-mm-yyyy`.
 */
const getTodayFormatted = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};

const defaultValues: CreateLeaveFormInputs = {
  type: 'SL',
  from_date: getTodayFormatted(),
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
 * - Chip toggle for leave type selection (COM / EL / SL / HPL)
 * - Text inputs for date fields with `dd-mm-yyyy` format
 * - Text inputs for order number, reason, and optional remarks
 * - Zod validation via the existing `CreateLeaveSchema`
 * - Defaults: leave type to "SL" and from_date to today's date
 *
 * On submit the form data is logged to the console.
 */
export const CreateLeaveScreen = () => {
  const [selectedType, setSelectedType] = useState<LeaveType>('SL');

  const methods = useForm<CreateLeaveFormInputs>({
    resolver: zodResolver(CreateLeaveSchema),
    defaultValues,
  });

  const onSubmit = (data: CreateLeaveFormInputs) => {
    console.log('Create Leave Payload:', JSON.stringify(data, null, 2));
  };

  return (
    <Container className="flex-1">
      <StackHeader />
      <KeyboardSafeView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-4">
          <View className="mt-4">
            <SectionHeader title="Create Leave" />
          </View>

          <FormProvider {...methods}>
            <View className="w-full gap-y-1">
              {/* Leave Type Chip Selector */}
              <View className="my-2 w-full">
                <Text variant="label" weight="medium" className="mb-2 ml-1">
                  Leave Type
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {LEAVE_TYPE_LIST.map((type) => {
                    const isSelected = selectedType === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        activeOpacity={0.7}
                        onPress={() => {
                          setSelectedType(type);
                          methods.setValue('type', type, { shouldValidate: true });
                        }}
                        className={cn(
                          'rounded-xl border-2 px-5 py-3',
                          isSelected
                            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                            : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
                        )}>
                        <Text
                          weight="semibold"
                          className={cn(
                            isSelected
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-400'
                          )}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {methods.formState.errors.type && (
                  <Text variant="error" size="xs" className="ml-1 mt-2">
                    {methods.formState.errors.type.message}
                  </Text>
                )}
              </View>

              {/* From Date */}
              <FieldInput
                name="from_date"
                label="From Date"
                placeholder="dd-mm-yyyy"
                testID="FROM_DATE_INPUT"
              />

              {/* To Date */}
              <FieldInput
                name="to_date"
                label="To Date"
                placeholder="dd-mm-yyyy"
                testID="TO_DATE_INPUT"
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
              <FieldInput
                name="reason"
                label="Reason"
                placeholder="Enter reason for leave"
                multiline
                numberOfLines={3}
                style={{ minHeight: 80, textAlignVertical: 'top' }}
                testID="REASON_INPUT"
              />

              {/* Remarks (optional) */}
              <FieldInput
                name="remarks"
                label="Remarks"
                placeholder="Any additional remarks (optional)"
                multiline
                numberOfLines={2}
                style={{ minHeight: 60, textAlignVertical: 'top' }}
                testID="REMARKS_INPUT"
              />

              {/* Spacer */}
              <View className="h-4" />

              {/* Submit Button */}
              <Button
                testID="CREATE_LEAVE_BUTTON"
                title="Submit Leave Request"
                onPress={methods.handleSubmit(onSubmit)}
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
