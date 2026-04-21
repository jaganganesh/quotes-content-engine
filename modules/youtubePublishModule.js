import fs from "fs";
import { google } from "googleapis";
import { logger } from "../utils/logger.js";

const youtubePublishModule = async (payload) => {
  try {
    const auth = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET
    );
    auth.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
    await auth.getAccessToken();

    const youtube = google.youtube({ version: "v3", auth });
    logger(`[YOUTUBE] Uploading: ${payload.postContent?.title || "Short"}`);

    const response = await youtube.videos.insert(
      {
        part: "snippet,status",
        requestBody: {
          snippet: {
            title: payload.postContent?.title || "Mindset Short",
            description: payload.postContent?.description || "",
            tags: payload.postContent?.tags || [],
            categoryId: "27",
          },
          status: { privacyStatus: "public", selfDeclaredMadeForKids: false },
        },
        media: { body: fs.createReadStream(payload.videoPath) },
      },
      { resumable: true }
    );

    logger(`✅ [YOUTUBE] Success ID: ${response.data.id}`);
  } catch (error) {
    logger(`❌ [YOUTUBE] Failed: ${error.message}`, "error");
    throw error;
  }
};

export default youtubePublishModule;
