import {
  UNSPLASH_ENDPOINT,
  IMAGE_QUERY_LIST,
  IMAGE_CONTENT_FILTER,
  IMAGE_ORIENTATION,
  UNSPLASH_LICENSE,
  USER_AGENT,
  REQUEST_TIMEOUT_MS,
  ENGINE_NAME,
  IMAGE_PATH,
} from "../configuration.js";
import fallbackImage from "../libraries/imageLibrary.js";
import randomPick from "../utils/randomPick.js";
import { logger } from "../utils/logger.js";

/**
 * Handles API failure by returning a local fallback image.
 * @param {string} reason
 * @returns {Object}
 */
const fallbackResponse = (reason) => {
  logger(`Fallback triggered: ${reason}`, "warn");
  const pick = fallbackImage[0];
  return {
    url: `file://${IMAGE_PATH}${pick.path}`,
    author: pick.author,
    sourceUrl: pick.sourceUrl,
    license: pick.license,
  };
};

/**
 * Fetches high-quality portrait images from Unsplash.
 * @returns {Promise<Object>}
 */
const getImage = async () => {
  const accessKey = (
    process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_API_KEY
  )?.trim();
  if (!accessKey) return fallbackResponse("No API Key");

  const query = randomPick(IMAGE_QUERY_LIST);
  const params = new URLSearchParams({
    query,
    content_filter: IMAGE_CONTENT_FILTER,
    orientation: IMAGE_ORIENTATION,
  }).toString();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    logger(`Fetching Unsplash image for query: ${query}`);
    const response = await fetch(`${UNSPLASH_ENDPOINT}?${params}`, {
      headers: {
        "X-Engine-Name": ENGINE_NAME,
        "User-Agent": USER_AGENT,
        Authorization: `Client-ID ${accessKey}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return fallbackResponse(`API Error ${response.status}`);

    const data = await response.json();
    return {
      url: data.urls.regular,
      author: data.user.name,
      sourceUrl: data.user.links.html,
      license: UNSPLASH_LICENSE,
    };
  } catch (error) {
    return fallbackResponse(error.message);
  }
};

export default getImage;
