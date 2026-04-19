import {
  QUOTE_ENDPOINT,
  USER_AGENT,
  ENGINE_NAME,
  MAX_QUOTE_LENGTH,
  MIN_QUOTE_LENGTH,
  REQUEST_TIMEOUT_MS,
  QUOTE_RETRY_ATTEMPTS,
  QUOTE_RETRY_DELAY_MS,
  UNKNOWN_AUTHOR_NAME,
} from "../configuration.js";
import quotesLibrary from "../libraries/quoteLibrary.js";
import randomPick from "../utils/randomPick.js";
import { logger } from "../utils/logger.js";

/**
 * Normalizes and validates raw quote data.
 * @param {Object} quote
 * @returns {Object|null}
 */
const normalizeQuote = (quote) => {
  if (!quote || typeof quote.q !== "string") return null;
  const text = quote.q.trim().replace(/\s+/g, " ");
  const author = quote.a?.trim() || UNKNOWN_AUTHOR_NAME;

  if (
    text.length < MIN_QUOTE_LENGTH ||
    text.length > MAX_QUOTE_LENGTH ||
    text.includes("http")
  ) {
    return null;
  }
  return { quote: text, author };
};

/**
 * Fetches a quote with retry logic and local fail-safe.
 * @returns {Promise<Object>}
 */
const getQuote = async () => {
  for (let attempt = 1; attempt <= QUOTE_RETRY_ATTEMPTS; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS
      );

      const response = await fetch(QUOTE_ENDPOINT, {
        headers: { "X-Engine-Name": ENGINE_NAME, "User-Agent": USER_AGENT },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        logger(
          "Rate limited by Quote API. Switching to local library.",
          "warn"
        );
        return randomPick(quotesLibrary);
      }

      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const data = await response.json();
      const normalized = normalizeQuote(data[0]);

      if (!normalized) throw new Error("Quote validation failed");

      logger(`Successfully fetched quote by ${normalized.author}`);
      return normalized;
    } catch (error) {
      logger(`Quote fetch attempt ${attempt} failed: ${error.message}`, "warn");

      if (attempt === QUOTE_RETRY_ATTEMPTS) {
        logger("All retries failed. Using local library.", "warn");
        return randomPick(quotesLibrary);
      }

      await new Promise((r) => setTimeout(r, QUOTE_RETRY_DELAY_MS));
    }
  }
};

export default getQuote;
