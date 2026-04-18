import {
  ENGINE_NAME,
  TEMP_IMAGE_STORAGE,
  UNSPLASH_ENDPOINT,
  IMAGE_PATH,
  IMAGE_QUERY_LIST,
  IMAGE_CONTENT_FILTER,
  IMAGE_ORIENTATION,
  UNSPLASH_LICENSE,
  USER_AGENT,
  REQUEST_TIMEOUT_MS,
} from "../configuration.js";
import fallbackImage from "../libraries/imageLibrary.js";
import randomPick from "../utils/randomPick.js";

/**
 * Returns a fallback image response when the main image service fails
 * @param {string} reason - The reason for using the fallback
 * @returns {Promise<Object>} Image object with url, path, author, sourceUrl, license
 */
const fallbackResponse = async (reason) => {
  console.log(`Using fallback image due to: ${reason}`);
  return {
    url: `file://${IMAGE_PATH}${fallbackImage[0].path}`,
    path: TEMP_IMAGE_STORAGE,
    author: fallbackImage[0].author,
    sourceUrl: fallbackImage[0].sourceUrl,
    license: fallbackImage[0].license,
  };
};

/**
 * Builds query parameters for Unsplash API request
 * @returns {string} URL-encoded query parameters string
 */
const queryBuilder = () => {
  const randomQuery = randomPick(IMAGE_QUERY_LIST);
  console.log(`Random query: "${randomQuery}"`);

  const queryParams = new URLSearchParams({
    query: randomQuery,
    content_filter: IMAGE_CONTENT_FILTER,
    orientation: IMAGE_ORIENTATION,
  }).toString();

  return queryParams;
};

/**
 * Fetches a random image from Unsplash API
 * @returns {Promise<Object>} Image object with url, path, author, sourceUrl, license
 */
const getImage = async () => {
  const accessKeyRaw = process.env["UNSPLASH_ACCESS_KEY"];
  const unsplashAccessKey =
    typeof accessKeyRaw === "string" ? accessKeyRaw.trim() : "";

  if (!unsplashAccessKey) {
    console.log("Unsplash access key is missing. Using fallback image.");
    return fallbackResponse("Missing Unsplash access key");
  }

  const queryParams = queryBuilder();
  const fullPath = `${UNSPLASH_ENDPOINT}?${queryParams}`;
  console.log(`Fetching image from Unsplash with query: ${queryParams}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    let response;
    try {
      response = await fetch(fullPath, {
        method: "GET",
        headers: {
          "X-Engine-Name": ENGINE_NAME,
          "User-Agent": USER_AGENT,
          Authorization: `Client-ID ${unsplashAccessKey}`,
        },
        signal: controller.signal,
      });
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Image fetch timed out");
        return fallbackResponse("Request timeout");
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      return fallbackResponse(
        `Unsplash API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data?.urls?.regular || !data?.user?.name || !data?.user?.links?.html) {
      return fallbackResponse("Incomplete image data from API");
    }

    console.log(
      `Image fetched successfully: author=${data.user.name}, source=${data.user.links.html}, license=${UNSPLASH_LICENSE}`
    );

    return {
      url: data.urls.regular,
      path: TEMP_IMAGE_STORAGE,
      author: data.user.name,
      sourceUrl: data.user.links.html,
      license: UNSPLASH_LICENSE,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Image fetch timed out");
      return fallbackResponse("Request timeout");
    }
    if (error instanceof SyntaxError) {
      console.error("Error parsing image response:", error.message);
      return fallbackResponse("Invalid API response format");
    }
    console.error("Error fetching image from Unsplash:", error.message);
    return fallbackResponse(error.message);
  }
};
export default getImage;
