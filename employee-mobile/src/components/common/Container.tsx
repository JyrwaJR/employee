import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '../../libs/cn';

type Props = {
  children: React.ReactNode;
  className?: string;
};
export const Container = ({ children, className }: Props) => {
  return <SafeAreaView className={cn('flex flex-1 px-2', className)}>{children}</SafeAreaView>;
};
