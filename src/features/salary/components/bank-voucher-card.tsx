import React from 'react';
import { View } from 'react-native';
import { Card } from '@components/ui/card';
import { Text } from '@components/ui/text';

/** Props for the BankVoucherCard component. */
interface BankVoucherCardProps {
  /** Bank account number. */
  bankNo: string;
  /** Voucher number. */
  voucherNo: string;
  /** Voucher date in DD/MM/YYYY format. */
  voucherDate: string;
}

/**
 * Renders the Bank & Voucher Details card.
 * Displays the bank account number, voucher number, and voucher date
 * extracted from the salary statement.
 */
export const BankVoucherCard = ({ bankNo, voucherNo, voucherDate }: BankVoucherCardProps) => (
  <Card variant="bordered" className="p-5">
    <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-graphite">
      Bank & Voucher Details
    </Text>
    <View className="mb-2 flex-row justify-between">
      <Text className="text-sm text-graphite">Bank Account</Text>
      <Text className="text-sm font-semibold text-foreground">{bankNo}</Text>
    </View>
    <View className="mb-2 flex-row justify-between">
      <Text className="text-sm text-graphite">Voucher Number</Text>
      <Text className="text-sm font-semibold text-foreground">{voucherNo}</Text>
    </View>
    <View className="flex-row justify-between">
      <Text className="text-sm text-graphite">Voucher Date</Text>
      <Text className="text-sm font-semibold text-foreground">{voucherDate}</Text>
    </View>
  </Card>
);
