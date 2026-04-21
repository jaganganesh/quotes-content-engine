import fs from "fs-extra";
import { logger } from "../utils/logger.js";

const API_BASE_URL = "https://graph.facebook.com/v19.0";

const instagramPublishModule = async (payload) => {
  const userId = process.env.INSTAGRAM_USER_ID;
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const videoPath = payload.videoPath;

  try {
    if (!(await fs.pathExists(videoPath)))
      throw new Error(`File missing: ${videoPath}`);
    const stats = await fs.stat(videoPath);

    // Use stats to log file size, satisfying the 'no-unused-vars' rule
    logger(
      `[INSTAGRAM] Initializing Resumable Upload (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`
    );

    const init = await fetch(`${API_BASE_URL}/${userId}/media`, {
      method: "POST",
      body: new URLSearchParams({
        media_type: "REELS",
        upload_type: "resumable",
        caption: payload.fullCaption,
        access_token: token,
      }),
    }).then((res) => res.json());

    if (!init.id) throw new Error(`Init Failed: ${JSON.stringify(init)}`);

    const videoBuffer = await fs.readFile(videoPath);
    await fetch(init.uri, {
      method: "POST",
      headers: {
        Authorization: `OAuth ${token}`,
        file_size: videoBuffer.length.toString(),
      },
      body: videoBuffer,
    });

    logger("[INSTAGRAM] Polling status...");
    let isReady = false;
    let attempts = 0;
    while (!isReady && attempts < 15) {
      attempts++;
      const status = await fetch(
        `${API_BASE_URL}/${init.id}?fields=status_code&access_token=${token}`
      ).then((res) => res.json());
      if (status.status_code === "FINISHED") isReady = true;
      else if (status.status_code === "ERROR")
        throw new Error("FB Encoding Error");
      else await new Promise((r) => setTimeout(r, 5000));
    }

    const publish = await fetch(`${API_BASE_URL}/${userId}/media_publish`, {
      method: "POST",
      body: new URLSearchParams({ creation_id: init.id, access_token: token }),
    }).then((res) => res.json());

    logger(`✅ [INSTAGRAM] Published: ${publish.id}`);
  } catch (error) {
    logger(`❌ [INSTAGRAM] Failed: ${error.message}`, "error");
    throw error;
  }
};

export default instagramPublishModule;
