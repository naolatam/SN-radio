/**
 * Environment Configuration
 * Centralized configuration for all environment variables
 */

export const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
  // Radio Stream Configuration
  radioStreamUrl: import.meta.env.VITE_RADIO_STREAM_URL || 'http://sn-radio.online/listen/sn_radio/radio.mp3',
  radioName: import.meta.env.VITE_RADIO_NAME || 'SN-Radio Live',
  
  // Frontend Configuration
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000',
} as const;

export default config;
