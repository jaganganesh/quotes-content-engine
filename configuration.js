// import { randomUUID } from "node:crypto";

// Quotes Content Engine
export const ENGINE_NAME = "quotes-content-engine";
export const USER_AGENT = `${ENGINE_NAME}/0.0.1`;
export const REQUEST_TIMEOUT_MS = 10000;

// Endpoints
export const QUOTE_ENDPOINT = "https://zenquotes.io/api/random";
export const UNSPLASH_ENDPOINT = "https://api.unsplash.com/photos/random";

// Quotes
export const QUOTE_RETRY_ATTEMPTS = 3;
export const QUOTE_RETRY_DELAY_MS = 3000;
export const MIN_QUOTE_LENGTH = 20;
export const MAX_QUOTE_LENGTH = 220;
export const UNKNOWN_AUTHOR_NAME = "Unknown";

// Temporary Storage
export const OUTPUT_PATH = "output";
export const TEMP_PATH = `${OUTPUT_PATH}/temp`;
export const TEMP_IMAGE_STORAGE = `${TEMP_PATH}/image.jpg`;
export const TEMP_MUSIC_STORAGE = `${TEMP_PATH}/sound.wav`;

// Image
export const IMAGE_PATH = "resources/images/";
export const IMAGE_QUERY_LIST = [
  "mountain landscape",
  "misty lake landscape",
  "ocean horizon",
  "sunrise sky",
  "sunset sky gradient",
  "architectural photography",
  "switzerland",
  "castle interior",
  "grassland",
  "embers",
];
export const IMAGE_CONTENT_FILTER = "high";
export const IMAGE_ORIENTATION = "portrait";
export const UNSPLASH_LICENSE = "Unsplash License";

// Music
export const MUSIC_PATH = "resources/music/";
