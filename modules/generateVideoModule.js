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
 * Ensures no file conflicts by using platform-specific temporary storage.
 * @param {string} platform - The target social media platform (instagram, tiktok, youtube)
 * @returns {Promise<void>}
 */
export const generateVideo = async (platform) => {
  const platformKey = platform.toLowerCase();

  // Define unique paths for this specific build to prevent concurrency conflicts
  const paths = {
    video: getOutputVideoPath(platformKey),
    payload: getPlatformPayloadStorage(platformKey),
    image: getTempFilePath(platformKey, "image", "jpg"),
    music: getTempFilePath(platformKey, "sound", "wav"),
    overlay: getTempFilePath(platformKey, "overlay", "png"),
  };

  try {
    logger(`🚀 [${platformKey.toUpperCase()}] Starting Video Pipeline...`);

    // Ensure directory structure exists
    await fs.ensureDir(TEMP_PATH);
    await fs.ensureDir(OUTPUT_PATH);

    // 1. Concurrent Data Fetching
    logger(`[${platformKey}] Fetching assets from APIs and Local Libraries...`);
    const [quote, imageMeta, musicMeta] = await Promise.all([
      getQuote(),
      getImage(),
      getMusic(),
    ]);

    // 2. Physical File Download/Sync
    logger(`[${platformKey}] Downloading resources to temporary storage...`);
    await Promise.all([
      downloadFile(imageMeta.url, paths.image),
      downloadFile(musicMeta.url, paths.music),
    ]);

    // 3. Graphical Rendering
    const config = getPlatformConfig(platformKey);
    logger(`[${platformKey}] Rendering canvas overlay...`);
    const overlay = await renderOverlay({
      quote: quote.quote,
      author: quote.author,
      showWatermark: config.watermark.enabled,
      outputPath: paths.overlay,
    });

    // 4. FFmpeg Video Assembly
    logger(`[${platformKey}] Encoding final video via FFmpeg...`);
    await createVideo({
      backgroundPath: paths.image,
      overlayPath: overlay.overlayPath,
      musicPath: paths.music,
      outputVideoPath: paths.video,
    });

    // 5. Metadata & SEO Generation
    logger(`[${platformKey}] Generating SEO-optimized content payload...`);
    const content = generateContent({
      platform: platformKey,
      quoteData: quote,
      imageData: imageMeta,
      musicData: musicMeta,
    });

    // Save the metadata for the separate upload script/GH Action
    await fs.writeJSON(paths.payload, content, { spaces: 2 });

    logger(
      `✅ [${platformKey.toUpperCase()}] Success! Video saved to: ${paths.video}`
    );
  } catch (error) {
    logger(
      `❌ [${platformKey.toUpperCase()}] Pipeline Failed: ${error.message}`,
      "error"
    );

    throw error;
  }
};

await generateVideo("youtube");

export default generateVideo;
