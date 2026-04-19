// Global Configuration for @mindsetthroughpain Pipeline
export const ENGINE_NAME = "quotes-content-engine";
export const USER_AGENT = `${ENGINE_NAME}/0.0.1`;
export const REQUEST_TIMEOUT_MS = 10000;

// Debugging
export const DEBUG_MODE = true;

// Endpoints
export const QUOTE_ENDPOINT = "https://zenquotes.io/api/random";
export const UNSPLASH_ENDPOINT = "https://api.unsplash.com/photos/random";

// Quotes Logic
export const QUOTE_RETRY_ATTEMPTS = 3;
export const QUOTE_RETRY_DELAY_MS = 3000;
export const MIN_QUOTE_LENGTH = 20;
export const MAX_QUOTE_LENGTH = 220;
export const UNKNOWN_AUTHOR_NAME = "Unknown";

// Storage Logic
export const OUTPUT_PATH = "output";
export const TEMP_PATH = `${OUTPUT_PATH}/temp`;

// Dynamic File Naming Utilities
export const getTempFilePath = (platform, type, ext) =>
  `${TEMP_PATH}/${type}.${platform.toLowerCase()}.${ext}`;

export const getOutputVideoPath = (platform) =>
  `${OUTPUT_PATH}/video.${platform.toLowerCase()}.mp4`;

// Image Settings
export const IMAGE_PATH = "resources/images/";
export const IMAGE_QUERY_LIST = [
  "mountain landscape",
  "misty lake landscape",
  "dark academia",
  "minimalist office",
  "ocean horizon",
  "sunrise sky",
  "city rain",
  "switzerland",
  "castle interior",
  "embers",
];
export const IMAGE_CONTENT_FILTER = "high";
export const IMAGE_ORIENTATION = "portrait";
export const UNSPLASH_LICENSE = "Unsplash License";

// Resources
export const MUSIC_PATH = "resources/music/";
export const FONT_PATH = "resources/fonts";

// Overlay Settings
export const OVERLAY_WIDTH = 1080;
export const OVERLAY_HEIGHT = 1920;
export const OVERLAY_SAFE_TOP = 220;
export const OVERLAY_SAFE_BOTTOM = 300;
export const OVERLAY_SAFE_SIDES_PADDING = 120;

// Text Styling
export const AUTHOR_FONT_START = 60;
export const AUTHOR_FONT_MIN = 30;
export const AUTHOR_FONT_GAP = 90;

export const QUOTE_FONT_START = 80;
export const QUOTE_FONT_MIN = 40;

// Watermark Settings
export const WATERMARK_IMAGE_PATH = "resources/images/watermark.png";
export const WATERMARK_SIZE = 190;
export const WATERMARK_MARGIN_RIGHT = 60;
export const WATERMARK_MARGIN_BOTTOM = 60;
export const WATERMARK_OPACITY = 0.72;

// Gradient Settings
export const GRADIENT_MIN_OPACITY = 0.4;
export const GRADIENT_MAX_OPACITY = 0.8;
export const GRADIENT_MIN_RGB_VALUE = 0;
export const GRADIENT_MAX_RGB_VALUE = 80;

// Video Encoding Settings
export const VIDEO_AUDIO_VOLUME = 0.8;
export const VIDEO_FRAME_RATE = 60;
export const VIDEO_DURATION_SECONDS = 10;
export const VIDEO_BACKGROUND_START_ZOOM = 1;
export const VIDEO_BACKGROUND_END_ZOOM = 1.1;
export const VIDEO_BACKGROUND_SOURCE_MULTIPLIER = 2;
export const VIDEO_FADE_DURATION_SECONDS = 2;
