import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { createContext, useContext } from 'react';

type ThemeSettings = {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
};

type ThemeContextType = {
  themeSettings: ThemeSettings;
  setThemeSettings: (settings: ThemeSettings) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useThemeControl = () => useContext(ThemeContext)!;

export const ThemeControllerProvider = ({ children }: { children: React.ReactNode }) => {

  const muiTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
  );
};
