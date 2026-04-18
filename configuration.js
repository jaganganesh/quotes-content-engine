// import { randomUUID } from "node:crypto";

// Quotes Content Engine
export const ENGINE_NAME = "quotes-content-engine";
export const USER_AGENT = `${ENGINE_NAME}/0.0.1`;
export const REQUEST_TIMEOUT_MS = 10000;

// Endpoints
export const QUOTE_ENDPOINT = "https://zenquotes.io/api/random";

// Quotes
export const QUOTE_RETRY_ATTEMPTS = 3;
export const QUOTE_RETRY_DELAY_MS = 3000;
export const MIN_QUOTE_LENGTH = 20;
export const MAX_QUOTE_LENGTH = 220;
export const UNKNOWN_AUTHOR_NAME = "Unknown";
