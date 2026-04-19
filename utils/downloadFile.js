import fs from "fs-extra";
import path from "path";
import { logger } from "./logger.js";

/**
 * Syncs a resource to a destination, supporting both remote URLs and local file paths.
 * @param {string} url - Source URL or file path (supports file:// protocol)
 * @param {string} dest - Target destination path
 * @returns {Promise<string>} Path to the downloaded/copied file
 */
const downloadFile = async (url, dest) => {
  try {
    await fs.ensureDir(path.dirname(dest));

    // Support for local fallbacks in imageLibrary/musicLibrary
    if (url.startsWith("file://")) {
      const localSource = url.replace("file://", "");
      await fs.copy(localSource, dest);
      logger(`Resource copied from local library: ${dest}`);
      return dest;
    }

    // Remote asset download (Unsplash / Quotes API)
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    await fs.writeFile(dest, Buffer.from(buffer));

    logger(`Remote asset successfully downloaded: ${dest}`);
    return dest;
  } catch (error) {
    logger(`Failed to sync resource from ${url}: ${error.message}`, "error");
    throw error;
  }
};

export default downloadFile;
