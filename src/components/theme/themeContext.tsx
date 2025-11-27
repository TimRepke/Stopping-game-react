import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { createContext, useContext, useMemo, useState } from 'react';

type ThemeSettings = {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
};

type ThemeContextType = {
  themeSettings: ThemeSettings;
  setThemeSettings: (settings: ThemeSettings) => void;
};

const defaultSettings: ThemeSettings = {
  mode: 'light',
  primary: '#FABC3F',
  secondary: '#E85C0D',
};

const ThemeContext = createContext<ThemeContextType | null>(null);

// export const useThemeControl = () => useContext(ThemeContext)!;

export const ThemeControllerProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultSettings);

  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: themeSettings.mode,
      primary: { main: themeSettings.primary },
      secondary: { main: themeSettings.secondary },
    },
  }), [themeSettings]);

  return (
    <ThemeContext.Provider value={{ themeSettings, setThemeSettings }}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
