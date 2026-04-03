import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '../ui/text';

type Props = {
  children: React.ReactNode;
  className?: string;
};
export const Container = ({ children, className }: Props) => {
  return (
    <SafeAreaView className={cn('flex-1 bg-white p-2 dark:bg-slate-950', className)}>
      {children}
    </SafeAreaView>
  );
};
