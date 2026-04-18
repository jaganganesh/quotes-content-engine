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
export const TEMP_GRADIENT_OVERLAY_STORAGE = `${TEMP_PATH}/overlay.png`;

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

// Gradient
export const GRADIENT_MIN_OPACITY = 0.2;
export const GRADIENT_MAX_OPACITY = 0.8;
export const GRADIENT_MIN_RGB_VALUE = 0;
export const GRADIENT_MAX_RGB_VALUE = 80;

// Font
export const FONT_PATH = "resources/fonts";

// Author Text
export const AUTHOR_FONT_START = 60;
export const AUTHOR_FONT_MIN = 30;
export const AUTHOR_FONT_GAP = 90;

// Quote Text
export const QUOTE_FONT_START = 80;
export const QUOTE_FONT_MIN = 40;

// Watermark
export const WATERMARK_IMAGE_PATH = "resources/images/watermark.png";
export const WATERMARK_SIZE = 190;
export const WATERMARK_MARGIN_RIGHT = 60;
export const WATERMARK_MARGIN_BOTTOM = 60;
export const WATERMARK_OPACITY = 0.72;

// Output Configuration
export const OVERLAY_WIDTH = 1080;
export const OVERLAY_HEIGHT = 1920;
export const OVERLAY_SAFE_TOP = 220;
export const OVERLAY_SAFE_BOTTOM = 280;
export const OVERLAY_SAFE_SIDES_PADDING = 120;
