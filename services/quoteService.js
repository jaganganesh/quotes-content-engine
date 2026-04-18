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

/**
 * Validates and normalizes a quote object
 * @param {Object} quote - Raw quote data from API
 * @returns {Object|null} Normalized quote with sanitized text and author, or null if invalid
 */
const normalizeQuote = (quote) => {
  if (!quote || typeof quote.q !== "string" || typeof quote.a !== "string") {
    return null;
  }

  const text = quote.q.trim().replace(/\s+/g, " ");
  const author = (quote.a?.trim?.() ?? quote.a) || UNKNOWN_AUTHOR_NAME;

  if (
    !text ||
    text.length < MIN_QUOTE_LENGTH ||
    text.length > MAX_QUOTE_LENGTH ||
    text.includes("http")
  ) {
    return null;
  }

  return {
    quote: text,
    author,
  };
};

/**
 * Fetches a random quote with automatic retry logic
 * @returns {Promise<Object>} Quote object with text and author fields
 * @throws {Error} If all retry attempts fail
 */
const getQuote = async () => {
  for (let attempt = 1; attempt <= QUOTE_RETRY_ATTEMPTS; attempt += 1) {
    try {
      console.log(`Attempt ${attempt} to fetch quote from ${QUOTE_ENDPOINT}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS
      );

      let response;
      try {
        response = await fetch(QUOTE_ENDPOINT, {
          headers: {
            "X-Engine-Name": ENGINE_NAME,
            "User-Agent": USER_AGENT,
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === "AbortError") {
          throw new Error("Request timeout", { cause: fetchError });
        }
        throw fetchError;
      }

      if (!response.ok) {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Response data is not a non-empty array");
      }

      const quoteData = data[0];
      const normalizedQuote = normalizeQuote(quoteData);

      if (!normalizedQuote) {
        throw new Error("Fetched quote did not pass validation");
      }

      console.log("Successfully fetched and validated quote:", normalizedQuote);
      return normalizedQuote;
    } catch (error) {
      console.error(`Attempt ${attempt} to fetch quote failed:`, error.message);

      if (attempt < QUOTE_RETRY_ATTEMPTS) {
        await new Promise((resolve) =>
          setTimeout(resolve, QUOTE_RETRY_DELAY_MS)
        );
      }
    }
  }

  // If all attempts fail, throw an error
  throw new Error(
    `Failed to fetch quote after ${QUOTE_RETRY_ATTEMPTS} attempts`
  );
};
export default getQuote;
