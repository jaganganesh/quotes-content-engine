import { createWriteStream } from "fs";
import { dirname } from "path";
import { pipeline } from "stream/promises";
import fs from "fs-extra";

/**
 * Downloads a file from a URL or copies a local file
 * @param {string} url - File URL (http/https) or local path (file://)
 * @param {string} filepath - Destination file path
 * @param {Object} options - Optional fetch configuration
 * @throws {Error} If download/copy fails or invalid parameters provided
 */
const downloadFile = async (url, filepath, options = {}) => {
  if (typeof url !== "string" || !url) {
    throw new Error("Invalid url: must be a non-empty string");
  }
  if (typeof filepath !== "string" || !filepath) {
    throw new Error("Invalid filepath: must be a non-empty string");
  }
  if (typeof options !== "object" || options === null) {
    throw new Error("Invalid options: must be an object");
  }

  console.log(`Starting download from ${url} to ${filepath}`);

  try {
    await fs.ensureDir(dirname(filepath));

    // Handle local file:// URLs (e.g., fallback images)
    if (url.startsWith("file://")) {
      const sourceFilePath = url.replace("file://", "");
      await fs.copy(sourceFilePath, filepath);
      console.log(
        `File copied successfully from ${sourceFilePath} to ${filepath}`
      );
      return;
    }

    const response = await fetch(url, {
      method: "GET",
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to download file: ${response.status} ${response.statusText}`
      );
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    await pipeline(response.body, createWriteStream(filepath));
    console.log(`File downloaded successfully from ${url} to ${filepath}`);
  } catch (error) {
    console.error(`Error downloading file from ${url}:`, error);
    throw error;
  }
};
export default downloadFile;
