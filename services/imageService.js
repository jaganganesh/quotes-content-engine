import {
  ENGINE_NAME,
  TEMP_IMAGE_STORAGE,
  UNSPLASH_ENDPOINT,
  BACKGROUND_QUERY_LIST,
  IMAGE_ORIENTATION,
  USER_AGENT,
  REQUEST_TIMEOUT_MS,
} from "../configuration.js";
import FALLBACK_IMAGE from "../libraries/imageLibrary.js";
import randomPick from "../utils/randomPick.js";

const fallbackResponse = async (reason, fallbackImagePath) => {
  console.log(`Using fallback image due to: ${reason}`);
  return {
    url: `file://${fallbackImagePath}`,
    path: TEMP_IMAGE_STORAGE,
  };
};

const queryBuilder = () => {
  const randomQuery = randomPick(BACKGROUND_QUERY_LIST);
  console.log(`Random query: "${randomQuery}"`);

  const queryParams = new URLSearchParams({
    query: randomQuery,
    content_filter: "high",
    orientation: IMAGE_ORIENTATION,
  }).toString();

  return queryParams;
};

const getImage = async () => {
  const unsplashAccessKey = process.env["UNSPLASH_ACCESS_KEY"];

  if (!unsplashAccessKey) {
    console.log("Unsplash access key is missing. Using fallback image.");
    return fallbackResponse("Missing Unsplash access key", FALLBACK_IMAGE);
  }

  try {
    const queryParams = queryBuilder();

    const fullPath = `${UNSPLASH_ENDPOINT}?${queryParams}`;
    console.log(`Fetching image from Unsplash with query: ${queryParams}`);

    const response = await fetch(fullPath, {
      method: "GET",
      headers: {
        "X-Engine-Name": ENGINE_NAME,
        "User-Agent": USER_AGENT,
        Authorization: `Client-ID ${unsplashAccessKey}`,
      },
      timeout: REQUEST_TIMEOUT_MS,
    });

    if (!response.ok) {
      return fallbackResponse(
        `Unsplash API error: ${response.status} ${response.statusText}`,
        FALLBACK_IMAGE,
      );
    }

    const data = await response.json();
    console.log("Image fetched successfully from Unsplash", response.ok);

    return {
      url: data.urls.regular,
      path: TEMP_IMAGE_STORAGE,
    };
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return fallbackResponse(error.message, FALLBACK_IMAGE);
  }
};
export default getImage;
