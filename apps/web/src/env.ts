/**
 * Typed, validated environment variable accessors.
 *
 * - `serverEnv` — server-only vars (no NEXT_PUBLIC_ prefix). Throw clearly if
 *   a required variable is absent, so misconfiguration is caught immediately.
 * - `clientEnv` — public vars (NEXT_PUBLIC_ prefix), safe to import anywhere.
 *
 * Import rule:
 *   - Server Components, Route Handlers, middleware → can use both
 *   - Client Components                             → clientEnv ONLY
 */

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[env] Missing required environment variable: "${key}"\n` +
        `      Add it to .env.local (see .env.example).`,
    );
  }
  return value;
}

/** Server-side only — do NOT import in Client Components. */
export const serverEnv = {
  /** NestJS API base URL, e.g. "http://localhost:3000" */
  get apiUrl() {
    return required('API_URL');
  },
  /** Shared with apps/api JWT_SECRET — used in middleware to decode tokens */
  get jwtSecret() {
    return required('JWT_SECRET');
  },
  /** Shared with apps/api JWT_REFRESH_SECRET */
  get jwtRefreshSecret() {
    return required('JWT_REFRESH_SECRET');
  },
} as const;

/** Public — safe to import in Client Components. */
export const clientEnv = {
  appName: process.env['NEXT_PUBLIC_APP_NAME'] ?? '2Care',
  appUrl: process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:4200',
} as const;
