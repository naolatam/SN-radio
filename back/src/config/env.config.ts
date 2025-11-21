// Environment variables configuration
export interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  FRONTEND_URL: string;
  API_URL: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue!;
};

const getOptionalEnvVar = (key: string): string | undefined => {
  return process.env[key];
};

export const config: EnvConfig = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVar('PORT', '5000'), 10),
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  BETTER_AUTH_SECRET: getEnvVar('BETTER_AUTH_SECRET'),
  BETTER_AUTH_URL: getEnvVar('BETTER_AUTH_URL'),
  FRONTEND_URL: getEnvVar('FRONTEND_URL', 'http://localhost:3000'),
  API_URL: getEnvVar('API_URL', 'http://localhost:5000'),
  GOOGLE_CLIENT_ID: getOptionalEnvVar('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getOptionalEnvVar('GOOGLE_CLIENT_SECRET'),
};
