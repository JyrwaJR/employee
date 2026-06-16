import { View } from 'react-native';
import { cn } from '../../utils/cn';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const Container = ({ children, className }: Props) => {
  return <View className={cn('flex-1 bg-white p-2 dark:bg-slate-950', className)}>{children}</View>;
};
