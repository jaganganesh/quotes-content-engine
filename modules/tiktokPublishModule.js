import fs from "fs-extra";
import { logger } from "../utils/logger.js";

const TIKTOK_API_BASE = "https://open.tiktokapis.com/v2";

const tiktokPublishModule = async (payload) => {
  const token = process.env.TIKTOK_ACCESS_TOKEN;
  const videoPath = payload.videoPath;

  try {
    const stats = await fs.stat(videoPath);
    const init = await fetch(
      `${TIKTOK_API_BASE}/post/publish/inbox/video/init/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_info: {
            source: "FILE_UPLOAD",
            video_size: stats.size,
            chunk_size: stats.size,
            total_chunk_count: 1,
          },
        }),
      }
    ).then((res) => res.json());

    if (init.error) throw new Error(init.error.message);

    await fetch(init.data.upload_url, {
      method: "PUT",
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": stats.size.toString(),
        "Content-Range": `bytes 0-${stats.size - 1}/${stats.size}`,
      },
      body: fs.createReadStream(videoPath),
    });

    logger("✅ [TIKTOK] Upload complete.");
  } catch (error) {
    logger(`❌ [TIKTOK] Failed: ${error.message}`, "error");
    throw error;
  }
};

export default tiktokPublishModule;
