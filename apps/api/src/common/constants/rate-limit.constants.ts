/**
 * Rate limiting constants for API endpoints
 */

/** Time window for rate limiting (1 minute in milliseconds) */
export const RATE_LIMIT_TTL = 60000;

/** Default rate limit for most endpoints */
export const RATE_LIMIT_DEFAULT = 10;

/** Rate limit for registration endpoint */
export const RATE_LIMIT_REGISTER = 3;

/** Rate limit for login endpoint */
export const RATE_LIMIT_LOGIN = 5;

/** Rate limit for token refresh endpoint */
export const RATE_LIMIT_REFRESH = 10;
