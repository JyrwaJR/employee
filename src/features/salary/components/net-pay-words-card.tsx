import React from 'react';
import { Card } from '@components/ui/card';
import { Text } from '@components/ui/text';

/** Props for the NetPayWordsCard component. */
interface NetPayWordsCardProps {
  /** Net pay amount expressed in words. */
  netPayInWord: string;
}

/**
 * Renders the Net Pay (in Words) card.
 * Displays the salary net amount as an italicised textual representation.
 * Only rendered when the salary statement includes a net_pay_in_word value.
 */
export const NetPayWordsCard = ({ netPayInWord }: NetPayWordsCardProps) => (
  <Card variant="bordered" className="p-5">
    <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-graphite">
      Net Pay (in Words)
    </Text>
    <Text className="text-sm font-semibold italic text-foreground">{netPayInWord}</Text>
  </Card>
);
