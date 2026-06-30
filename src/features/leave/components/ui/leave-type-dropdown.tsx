import React, { useMemo } from 'react';
import { SelectSheet } from '@components/ui';
import { LeaveTypeCode } from '@features/leave/types';
import { useLeaveType } from '@features/leave/hooks';

interface LeaveTypeDropdownProps {
  /** Currently selected leave type */
  selectedType: LeaveTypeCode;
  /** Called when a new leave type is selected */
  onSelect: (type: LeaveTypeCode) => void;
  /** Optional validation error message */
  error?: string;
  title?: string;
}

/**
 * LeaveTypeDropdown is a leave-type-specific wrapper around the reusable
 * {@link SelectSheet} component.
 *
 * It fetches available leave types via `useLeaveType()` and maps them to
 * {@link SelectSheetOption | options} for the underlying bottom-sheet picker.
 *
 * @example
 * ```tsx
 * <LeaveTypeDropdown
 *   selectedType={selectedType}
 *   onSelect={(type) => setSelectedType(type)}
 *   error={errors.type?.message}
 * />
 * ```
 */
export const LeaveTypeDropdown = ({
  selectedType,
  title = 'Leave Type',
  onSelect,
  error,
}: LeaveTypeDropdownProps) => {
  const { data: leaveTypes } = useLeaveType();

  const options = useMemo(
    () =>
      (leaveTypes ?? []).map((type) => ({
        label: type.leave_desc,
        value: type.leave_cd,
      })),
    [leaveTypes]
  );

  return (
    <SelectSheet
      label={title}
      placeholder="Select leave type"
      title="Select Leave Type"
      options={options}
      selectedValue={selectedType}
      onSelect={(value) => onSelect(value as LeaveTypeCode)}
      error={error}
    />
  );
};
