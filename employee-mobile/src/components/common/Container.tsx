import { cn } from '../../libs/cn';
import { SafeAreaView, View } from 'react-native';

type Props = {
  children: React.ReactNode;
  className?: string;
};
export const Container = ({ children, className }: Props) => {
  return (
    <SafeAreaView className={cn('flex-1 bg-gray-50 px-2', className)}>{children}</SafeAreaView>
  );
};
