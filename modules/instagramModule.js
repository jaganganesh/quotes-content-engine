import fs from "fs-extra";
import { logger } from "../utils/logger.js";
import { getPlatformPayloadStorage } from "../libraries/platformLibrary.js";
import { generateVideo } from "./generateVideoModule.js";
import instagramPublishModule from "./instagramPublishModule.js";

(async () => {
  const platform = "instagram";
  try {
    logger(`🏁 STARTING ${platform.toUpperCase()} RUNNER`);

    // 1. Generate assets using the platform-specific logic
    await generateVideo(platform);

    // 2. Load the payload created by generateVideo
    const payloadPath = getPlatformPayloadStorage(platform);
    const payload = await fs.readJson(payloadPath);

    // 3. Publish to Instagram
    await instagramPublishModule(payload);

    logger(`✨ ${platform.toUpperCase()} PIPELINE COMPLETE`);
  } catch (err) {
    logger(`💥 FATAL ERROR: ${err.message}`, "error");
    process.exit(1);
  }
})();
