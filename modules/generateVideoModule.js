/**
 * @module generateVideoModule
 * @description The core engine that orchestrates asset fetching, rendering, and assembly.
 */

import dotenv from "dotenv";
import fs from "fs-extra";
import {
  TEMP_PATH,
  OUTPUT_PATH,
  getTempFilePath,
  getOutputVideoPath,
} from "../configuration.js";

// Services
import getQuote from "../services/quoteService.js";
import getImage from "../services/imageService.js";
import getMusic from "../services/musicService.js";
import renderOverlay from "../services/renderService.js";
import createVideo from "../services/videoService.js";
import generateContent from "../services/contentService.js";

// Utilities
import downloadFile from "../utils/downloadFile.js";
import { logger } from "../utils/logger.js";
import {
  getPlatformConfig,
  getPlatformPayloadStorage,
} from "../libraries/platformLibrary.js";

dotenv.config();

/**
 * Orchestrates the full video generation pipeline for a specific platform.
 */
export const generateVideo = async (platform) => {
  const platformKey = platform.toLowerCase();

  const paths = {
    video: getOutputVideoPath(platformKey),
    payload: getPlatformPayloadStorage(platformKey),
    image: getTempFilePath(platformKey, "image", "jpg"),
    music: getTempFilePath(platformKey, "sound", "wav"),
    overlay: getTempFilePath(platformKey, "overlay", "png"),
  };

  try {
    logger(`🚀 [${platformKey.toUpperCase()}] Starting Video Pipeline...`);

    await fs.ensureDir(TEMP_PATH);
    await fs.ensureDir(OUTPUT_PATH);

    const [quote, imageMeta, musicMeta] = await Promise.all([
      getQuote(),
      getImage(),
      getMusic(),
    ]);

    await Promise.all([
      downloadFile(imageMeta.url, paths.image),
      downloadFile(musicMeta.url, paths.music),
    ]);

    const config = getPlatformConfig(platformKey);
    const overlay = await renderOverlay({
      quote: quote.quote,
      author: quote.author,
      showWatermark: config.watermark.enabled,
      outputPath: paths.overlay,
    });

    await createVideo({
      backgroundPath: paths.image,
      overlayPath: overlay.overlayPath,
      musicPath: paths.music,
      outputVideoPath: paths.video,
    });

    const content = generateContent({
      platform: platformKey,
      quoteData: quote,
      imageData: imageMeta,
      musicData: musicMeta,
    });

    await fs.writeJSON(
      paths.payload,
      { ...content, videoPath: paths.video },
      { spaces: 2 }
    );

    logger(`✅ [${platformKey.toUpperCase()}] Success! Video: ${paths.video}`);
  } catch (error) {
    logger(
      `❌ [${platformKey.toUpperCase()}] Pipeline Failed: ${error.message}`,
      "error"
    );
    throw error;
  }
};

export default generateVideo;
