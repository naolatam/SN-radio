/**
 * Theme Store - localStorage management for theme caching
 * Improves loading performance by caching theme data
 */

const THEME_STORAGE_KEY = 'sn-radio-theme';

export interface StoredTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  favicon: string | null;
  icon: string | null;
  logo: string | null;
  siteName: string;
  slug: string;
}

export const themeStore = {
  /**
   * Save theme to localStorage
   */
  save(theme: StoredTheme): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  },

  /**
   * Load theme from localStorage
   * Returns null if cache is expired or doesn't exist
   */
  load(): StoredTheme | null {
    try {
      const themeData = localStorage.getItem(THEME_STORAGE_KEY);
      if(!themeData) return null;
      return JSON.parse(themeData);
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
      this.clear();
      return null;
    }
  },

  /**
   * Clear theme from localStorage
   */
  clear(): void {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear theme from localStorage:', error);
    }
  },

};
