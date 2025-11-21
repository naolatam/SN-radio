/**
 * Better Auth Client Configuration
 * Provides type-safe authentication client for the frontend
 */

import { createAuthClient } from 'better-auth/react';
import config from '../config/env.config';

export const authClient = createAuthClient({
  baseURL: config.apiUrl,
});

export type Session = typeof authClient.$Infer.Session;
