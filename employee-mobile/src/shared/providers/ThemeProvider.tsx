import { useTheme } from '@/src/features/settings/store/theme.store';
import { useColorScheme } from 'nativewind';
import { ReactNode, useEffect } from 'react';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const theme = useTheme()

    const { setColorScheme } = useColorScheme()

    useEffect(() => {
        if (theme) {
            setColorScheme(theme);
        }
    }, [theme, setColorScheme]);

    return <>{children}</>;
};