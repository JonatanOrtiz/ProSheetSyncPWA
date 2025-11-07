import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ThemeMode } from '@/types';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial theme from localStorage or default to light
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    return savedMode || 'light';
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Create MUI theme based on current mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light theme colors
                primary: {
                  main: '#5e72e4',
                  light: '#7889f1',
                  dark: '#4c5fc7'
                },
                secondary: {
                  main: '#2dce89',
                  light: '#57d8a1',
                  dark: '#24a56d'
                },
                background: {
                  default: '#f5f7fa',
                  paper: '#ffffff'
                },
                text: {
                  primary: '#32325d',
                  secondary: '#525f7f'
                },
                error: {
                  main: '#f5365c'
                },
                warning: {
                  main: '#fb6340'
                },
                info: {
                  main: '#11cdef'
                },
                success: {
                  main: '#2dce89'
                }
              }
            : {
                // Dark theme colors
                primary: {
                  main: '#5e72e4',
                  light: '#7889f1',
                  dark: '#4c5fc7'
                },
                secondary: {
                  main: '#2dce89',
                  light: '#57d8a1',
                  dark: '#24a56d'
                },
                background: {
                  default: '#0a0e27',
                  paper: '#151933'
                },
                text: {
                  primary: '#f7fafc',
                  secondary: '#cbd5e0'
                },
                error: {
                  main: '#f56565'
                },
                warning: {
                  main: '#ed8936'
                },
                info: {
                  main: '#4299e1'
                },
                success: {
                  main: '#48bb78'
                }
              })
        },
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
          ].join(','),
          h1: {
            fontWeight: 700
          },
          h2: {
            fontWeight: 700
          },
          h3: {
            fontWeight: 600
          },
          h4: {
            fontWeight: 600
          },
          h5: {
            fontWeight: 600
          },
          h6: {
            fontWeight: 600
          }
        },
        shape: {
          borderRadius: 12
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 8
              }
            }
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: mode === 'light'
                  ? '0 0 2rem 0 rgba(136,152,170,.15)'
                  : '0 0 2rem 0 rgba(0,0,0,.3)'
              }
            }
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8
                }
              }
            }
          },
          // ⚠️ ALTURA DA BARRA INFERIOR - CONFIGURAÇÃO 6 (OPCIONAL):
          // Você pode adicionar customizações globais para o BottomNavigation aqui
          // Exemplo para alterar a altura padrão:
          // MuiBottomNavigation: {
          //   styleOverrides: {
          //     root: {
          //       height: 48  // Altura customizada (padrão é 56px)
          //     }
          //   }
          // },
          // MuiBottomNavigationAction: {
          //   styleOverrides: {
          //     root: {
          //       minHeight: 48,  // Altura mínima dos botões
          //       padding: '6px 12px'  // Padding interno dos botões
          //     }
          //   }
          // }
        }
      }),
    [mode]
  );

  const value: ThemeContextType = {
    mode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
