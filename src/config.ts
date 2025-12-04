export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const REDIS_HOST = process.env.REDIS_HOST || "localhost";
export const REDIS_PORT = process.env.REDIS_PORT || 6379;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";
export const REDIS_USERNAME = process.env.REDIS_USERNAME || "";
export const REDIS_MAX_RETRIES_PER_REQUEST =
  process.env.REDIS_MAX_RETRIES_PER_REQUEST || "3";
