import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../utils/api/client';

export type Theme = 'default' | 'halloween';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundGradient: string;
  surface: string;
  border: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  button: {
    primary: string;
    secondary: string;
    ghost: string;
  };
  gradient: {
    adminHeader: string;
    userHeader: string;
  };
}

export const themes: Record<Theme, ThemeColors> = {
  default: {
    primary: '#007EFF',
    secondary: '#FFBB62',
    accent: '#CE8E20',
    background: '#12171C',
    backgroundGradient: 'linear-gradient(135deg, #12171C 0%, #1a2025 50%, #12171C 100%)',
    surface: '#1a2025',
    border: 'rgba(255, 255, 255, 0.1)',
    text: {
      primary: '#ffffff',
      secondary: '#e5e7eb',
      muted: '#9ca3af'
    },
    button: {
      primary: 'linear-gradient(135deg, #007EFF, #FFBB62)',
      secondary: 'linear-gradient(135deg, #FFBB62, #CE8E20)',
      ghost: 'rgba(255, 255, 255, 0.1)'
    },
    gradient: {
      adminHeader: 'linear-gradient(135deg, #FFBB62 0%, #CE8E20 50%, #007EFF 100%)',
      userHeader: 'linear-gradient(135deg, #007EFF 0%, #0066CC 50%, #FFBB62 100%)'
    }
  },
  halloween: {
    primary: '#FF6600',
    secondary: '#F0E68C',
    accent: '#D84315',
    background: '#1A0E0E',
    backgroundGradient: 'linear-gradient(135deg, #1A0E0E 0%, #2E1A1A 50%, #1A0E0E 100%)',
    surface: '#2E1A1A',
    border: 'rgba(255, 102, 0, 0.2)',
    text: {
      primary: '#F0E68C',
      secondary: '#ffffff',
      muted: '#E0D0A0'
    },
    button: {
      primary: 'linear-gradient(135deg, #FF6600, #F0E68C)',
      secondary: 'linear-gradient(135deg, #D84315, #FF6600)',
      ghost: 'rgba(255, 102, 0, 0.1)'
    },
    gradient: {
      adminHeader: 'linear-gradient(135deg, #F0E68C 0%, #D84315 50%, #FF6600 100%)',
      userHeader: 'linear-gradient(135deg, #FF6600 0%, #D84315 50%, #F0E68C 100%)'
    }
  }
};

interface ThemeContextType {
  theme: Theme;
  themeColors: ThemeColors;
  setTheme: (theme: Theme) => void;
  getThemeStyle: (property: keyof ThemeColors | string) => string;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('default');
  const [isLoading, setIsLoading] = useState(true);

  const themeColors = themes[theme];

  // Charger le thème depuis le serveur
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const data = await apiClient.getTheme();
        setThemeState(data.theme || 'default');
      } catch (error) {
        console.log('Erreur lors du chargement du thème:', error);
        // Fallback sur localStorage si le serveur n'est pas disponible
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('sn-radio-theme');
          if (stored) {
            setThemeState(stored as Theme);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
    
    // Polling pour détecter les changements de thème (toutes les 10 secondes)
    const interval = setInterval(async () => {
      try {
        const data = await apiClient.getTheme();
        if (data.theme !== theme) {
          setThemeState(data.theme || 'default');
        }
      } catch (error) {
        // Ignore les erreurs de polling
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [theme]);

  // Appliquer les styles CSS
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      // Sauvegarder en local comme backup
      localStorage.setItem('sn-radio-theme', theme);
      
      // Appliquer les variables CSS globales
      const root = document.documentElement;
      
      // Mettre à jour les variables CSS personnalisées pour le thème actuel
      root.style.setProperty('--theme-primary', themeColors.primary);
      root.style.setProperty('--theme-secondary', themeColors.secondary);
      root.style.setProperty('--theme-accent', themeColors.accent);
      root.style.setProperty('--theme-background', themeColors.background);
      root.style.setProperty('--theme-surface', themeColors.surface);
      root.style.setProperty('--theme-border', themeColors.border);
      root.style.setProperty('--theme-text-primary', themeColors.text.primary);
      root.style.setProperty('--theme-text-secondary', themeColors.text.secondary);
      root.style.setProperty('--theme-text-muted', themeColors.text.muted);
      
      // Appliquer une classe au body pour identifier le thème
      document.body.className = document.body.className.replace(/theme-\w+/g, '');
      document.body.classList.add(`theme-${theme}`);
    }
  }, [theme, themeColors, isLoading]);

  const setTheme = async (newTheme: Theme) => {
    try {
      // Mettre à jour immédiatement l'interface
      setThemeState(newTheme);
      
      // Envoyer la mise à jour au serveur (nécessite des privilèges admin)
      await apiClient.setTheme(newTheme);
    } catch (error) {
      console.log('Erreur lors du changement de thème:', error);
      // Revenir au thème précédent en cas d'erreur
      // Cette fonction sera principalement appelée depuis l'interface admin
    }
  };

  const getThemeStyle = (property: string): string => {
    const keys = property.split('.');
    let value: any = themeColors;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value || '';
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      themeColors,
      setTheme,
      getThemeStyle,
      isLoading
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook pour obtenir les styles inline pour un composant
export function useThemeStyles() {
  const { themeColors, getThemeStyle } = useTheme();
  
  return {
    background: themeColors.backgroundGradient,
    surface: { backgroundColor: themeColors.surface },
    card: { 
      backgroundColor: themeColors.surface,
      borderColor: themeColors.border
    },
    primaryButton: { background: themeColors.button.primary },
    secondaryButton: { background: themeColors.button.secondary },
    border: { borderColor: themeColors.border },
    textPrimary: { color: themeColors.text.primary },
    textSecondary: { color: themeColors.text.secondary },
    textMuted: { color: themeColors.text.muted },
    getStyle: getThemeStyle
  };
}