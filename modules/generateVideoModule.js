import dotenv from "dotenv";
import fs from "fs-extra";
import { TEMP_PATH, OUTPUT_PATH } from "../configuration.js";
import getQuote from "../services/quoteService.js";
import getImage from "../services/imageService.js";
import getMusic from "../services/musicService.js";
import renderOverlay from "../services/renderService.js";
import createVideo from "../services/videoService.js";
import generateContent from "../services/contentService.js";
import downloadFile from "../utils/downloadFile.js";
import {
  getPlatformConfig,
  getPlatformVideoStorage,
  getPlatformPayloadStorage,
} from "../libraries/platformLibrary.js";

dotenv.config();

const generateVideo = async (platform) => {
  const platformConfig = getPlatformConfig(platform);
  const outputVideoPath = getPlatformVideoStorage(platform);
  const outputPayloadPath = getPlatformPayloadStorage(platform);
  console.log(`Started video generation for: ${platformConfig.label}`);
  console.log(`Output video path: ${outputVideoPath}`);
  console.log(`Output payload path: ${outputPayloadPath}`);

  try {
    await Promise.all([fs.ensureDir(TEMP_PATH), fs.ensureDir(OUTPUT_PATH)]);

    const quoteData = await getQuote();
    console.log("Quote fetched:", quoteData);

    // Parallelize image and music fetching
    const [imageData, musicData] = await Promise.all([getImage(), getMusic()]);
    console.log("Image URL:", imageData.url);
    console.log(
      "Image Author, Source and License:",
      imageData.author,
      imageData.sourceUrl,
      imageData.license
    );
    console.log("Music URL:", musicData.url);
    console.log(
      "Music Author, Source, License:",
      musicData.author,
      musicData.sourceUrl,
      musicData.license
    );

    // Parallelize downloads
    await Promise.all([
      downloadFile(imageData.url, imageData.path),
      downloadFile(musicData.url, musicData.path),
    ]);

    // Render overlay with quote and image
    const overlayData = await renderOverlay({
      quote: quoteData.quote,
      author: quoteData.author,
      showWatermark: platformConfig.watermark.enabled,
    });

    console.log("Overlay data:", overlayData);

    // Create video with background image, overlay, and music
    await createVideo({
      backgroundPath: imageData.path,
      overlayPath: overlayData.overlayPath,
      musicPath: musicData.path,
      outputVideoPath,
    });

    console.log("Video creation completed successfully.");

    // Payload to save
    const postContent = generateContent({
      platform,
      quoteData,
      imageData,
      musicData,
    });
    await fs.writeJSON(outputPayloadPath, postContent, { spaces: 2 });
    console.log(`Payload saved to ${outputPayloadPath}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Video creation failed:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Video creation failed with unknown error:", error);
    }
    process.exit(1);
  }
};

generateVideo("instagram");
