import { useTheme } from '@/src/store/theme';
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