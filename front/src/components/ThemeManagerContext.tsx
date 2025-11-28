/**
 * ThemeManagerContext - Centralized theme management with backend integration
 * Provides: colors, logos, favicon, icons
 * Uses localStorage caching for faster initial loads
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themeService } from '../services/theme.service';
import { themeStore, type StoredTheme } from '../stores/theme.store';

export interface ThemeManagerColors {
  primary: string;
  secondary: string;
  background: string;
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
    main: string;
    adminHeader: string;
    userHeader: string;
  };
}

export interface ThemeManagerBranding {
  favicon: string;
  icon: string;
  logo: string;
  siteName: string;
}

export interface ThemeManagerConfig {
  colors: ThemeManagerColors;
  branding: ThemeManagerBranding;
}

// Default theme configuration (fallback)
const defaultTheme: ThemeManagerConfig = {
  colors: {
    primary: '#007EFF',
    secondary: '#FFBB62',
    background: '#12171C',
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
      main: 'linear-gradient(135deg, #12171C 0%, #1a2025 50%, #12171C 100%)',
      adminHeader: 'linear-gradient(135deg, #FF9A3C 35%, #007EFF 100%)',
      userHeader: 'linear-gradient(135deg, #007EFF 0%, #0066CC 50%, #FFBB62 100%)'
    }
  },
  branding: {
    favicon: '/favicon.ico',
    icon: '/icon.png',
    logo: '/logo.png',
    siteName: 'SN-Radio'
  }
};

interface ThemeManagerContextType {
  theme: ThemeManagerConfig;
  isLoading: boolean;
  refreshTheme: () => Promise<void>;
}

const ThemeManagerContext = createContext<ThemeManagerContextType | undefined>(undefined);

interface ThemeManagerProviderProps {
  children: ReactNode;
}

export function ThemeManagerProvider({ children }: ThemeManagerProviderProps) {


  const buildThemeConfig = (storedTheme: StoredTheme): ThemeManagerConfig => {
    const newTheme: ThemeManagerConfig = {
      ...defaultTheme,
      colors: {
        ...defaultTheme.colors,
        primary: storedTheme.primaryColor,
        secondary: storedTheme.secondaryColor,
        background: storedTheme.backgroundColor,
      },
      branding: {
        favicon: storedTheme.favicon || defaultTheme.branding.favicon,
        icon: storedTheme.icon || defaultTheme.branding.icon,
        logo: storedTheme.logo || defaultTheme.branding.logo,
        siteName: storedTheme.siteName || defaultTheme.branding.siteName,
      }
    };

    // Update gradient colors based on primary/secondary
    newTheme.colors.button.primary = `linear-gradient(135deg, ${newTheme.colors.primary}, ${newTheme.colors.secondary})`;
    newTheme.colors.gradient.adminHeader = `linear-gradient(135deg, #FF9A3C 35%, ${newTheme.colors.primary} 100%)`;
    newTheme.colors.gradient.userHeader = `linear-gradient(135deg, ${newTheme.colors.primary} 0%, #0066CC 50%, ${newTheme.colors.secondary} 100%)`;

    return newTheme;
  };

  const [theme, setTheme] = useState<ThemeManagerConfig>(() => {
    // Try to load theme from localStorage on initial render
    const cachedTheme = themeStore.load();
    if (cachedTheme) {
      return buildThemeConfig(cachedTheme);
    }
    return defaultTheme;
  });
  const [isLoading, setIsLoading] = useState(true);


  const loadThemeFromBackend = async () => {
    try {
      setIsLoading(true);
      const activeTheme = await themeService.getActiveTheme();
      
      if (!activeTheme) {
        setTheme(defaultTheme);
        themeStore.clear();
        return;
      }

      // Save to localStorage for next time
      themeStore.save({
        primaryColor: activeTheme.primaryColor,
        secondaryColor: activeTheme.secondaryColor,
        backgroundColor: activeTheme.backgroundColor,
        favicon: activeTheme.favicon || null,
        icon: activeTheme.icon || null,
        logo: activeTheme.logo || null,
        siteName: activeTheme.siteName,
        slug: activeTheme.slug,
      });

      // Build theme config
      const newTheme = buildThemeConfig({
        primaryColor: activeTheme.primaryColor,
        secondaryColor: activeTheme.secondaryColor,
        backgroundColor: activeTheme.backgroundColor,
        favicon: activeTheme.favicon || null,
        icon: activeTheme.icon || null,
        logo: activeTheme.logo || null,
        siteName: activeTheme.siteName,
        slug: activeTheme.slug,
      });

      setTheme(newTheme);
      
      // Update favicon dynamically
      updateFavicon(newTheme.branding.favicon);
      
      // Update document title
      document.title = newTheme.branding.siteName;
      
    } catch (error) {
      console.error('Error loading theme from backend:', error);
      setTheme(defaultTheme);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFavicon = (faviconUrl: string) => {
    const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  };

  useEffect(() => {
    // Apply cached theme immediately (if available)
    const cachedTheme = themeStore.load();
    if (cachedTheme) {
      updateFavicon(cachedTheme.favicon || defaultTheme.branding.favicon);
      document.title = cachedTheme.siteName || defaultTheme.branding.siteName;
    }

    // Then load fresh theme from backend
    loadThemeFromBackend();
  }, []);

  const refreshTheme = async () => {
    await loadThemeFromBackend();
  };

  return (
    <ThemeManagerContext.Provider value={{ theme, isLoading, refreshTheme }}>
      {children}
    </ThemeManagerContext.Provider>
  );
}

export function useThemeManager(): ThemeManagerContextType {
  const context = useContext(ThemeManagerContext);
  if (context === undefined) {
    throw new Error('useThemeManager must be used within a ThemeManagerProvider');
  }
  return context;
}
