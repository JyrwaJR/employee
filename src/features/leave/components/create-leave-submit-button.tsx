import React from 'react';
import { Button } from '@components/ui/button';
import { useRateLimit } from '@hooks';

/**
 * Props for the {@link CreateLeaveSubmitButton} component.
 */
interface CreateLeaveSubmitButtonProps {
  /** React Hook Form submission handler (wrapped via `handleSubmit`). */
  onPress: () => void;
  /** Whether any form field has been touched (`formState.isDirty`). */
  isDirty: boolean;
  /** Whether the mutation is currently in flight. */
  isPending?: boolean;
}

/**
 * Submit button for the create-leave form with built-in rate limiting.
 *
 * Isolates the rate-limit hook (which ticks every second to update the
 * countdown display) inside this small component so the rest of the form
 * does not re-render on each tick.
 *
 * @example
 * ```tsx
 * <CreateLeaveSubmitButton
 *   onPress={methods.handleSubmit(onSubmit)}
 *   isDirty={methods.formState.isDirty}
 *   isPending={isPending}
 * />
 * ```
 */
export const CreateLeaveSubmitButton = ({
  onPress,
  isDirty,
  isPending,
}: CreateLeaveSubmitButtonProps) => {
  const { isLimited, secondsRemaining } = useRateLimit('CREATE_LEAVE_SUBMIT', {
    limit: 1,
    ms: 5000,
  });

  return (
    <Button
      testID="CREATE_LEAVE_BUTTON"
      title={
        isPending
          ? 'Creating Leave...'
          : isLimited
            ? `Please wait ${secondsRemaining}`
            : 'Create Leave'
      }
      onPress={onPress}
      disabled={isPending || isLimited || !isDirty}
    />
  );
};

CreateLeaveSubmitButton.displayName = 'CreateLeaveSubmitButton';
