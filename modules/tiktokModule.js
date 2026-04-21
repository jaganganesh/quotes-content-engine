import fs from "fs-extra";
import { logger } from "../utils/logger.js";
import { getPlatformPayloadStorage } from "../libraries/platformLibrary.js";
import { generateVideo } from "./generateVideoModule.js";
import tiktokPublishModule from "./tiktokPublishModule.js";

(async () => {
  const platform = "tiktok";
  try {
    await generateVideo(platform);
    const payload = await fs.readJson(getPlatformPayloadStorage(platform));
    await tiktokPublishModule(payload);
    logger(`✨ ${platform.toUpperCase()} PIPELINE COMPLETE`);
  } catch (err) {
    logger(`💥 ERROR: ${err.message}`, "error");
    process.exit(1);
  }
})();
