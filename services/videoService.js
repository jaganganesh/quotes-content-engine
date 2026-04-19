import fs from "fs-extra";
import path from "path";
import {
  VIDEO_AUDIO_VOLUME,
  VIDEO_DURATION_SECONDS,
  VIDEO_FRAME_RATE,
  VIDEO_BACKGROUND_END_ZOOM,
  VIDEO_BACKGROUND_SOURCE_MULTIPLIER,
  VIDEO_BACKGROUND_START_ZOOM,
  VIDEO_FADE_DURATION_SECONDS,
  OVERLAY_HEIGHT,
  OVERLAY_WIDTH,
} from "../configuration.js";
import runFFMPEG from "../utils/ffmpeg.js";
import { logger } from "../utils/logger.js";

/**
 * Encodes final video with high-fidelity 60fps zoompan and audio normalization.
 * @param {Object} params
 * @returns {Promise<string>}
 */
const createVideo = async ({
  backgroundPath,
  overlayPath,
  musicPath,
  outputVideoPath,
}) => {
  try {
    await fs.ensureDir(path.dirname(outputVideoPath));
    const totalFrames = VIDEO_DURATION_SECONDS * VIDEO_FRAME_RATE;

    // Fixed zoompan logic for 2026 discoverability: ensure d and fps are explicitly set
    const zoomProgress = `${VIDEO_BACKGROUND_START_ZOOM}+(${VIDEO_BACKGROUND_END_ZOOM - VIDEO_BACKGROUND_START_ZOOM})*(on/${totalFrames})`;
    const bgW = OVERLAY_WIDTH * VIDEO_BACKGROUND_SOURCE_MULTIPLIER;
    const bgH = OVERLAY_HEIGHT * VIDEO_BACKGROUND_SOURCE_MULTIPLIER;

    const filter = [
      `[0:v]fps=${VIDEO_FRAME_RATE},scale=${bgW}:${bgH}:flags=lanczos,setsar=1,zoompan=z='min(${VIDEO_BACKGROUND_END_ZOOM},${zoomProgress})':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=${OVERLAY_WIDTH}x${OVERLAY_HEIGHT}:fps=${VIDEO_FRAME_RATE},boxblur=2:1,setsar=1[bg]`,
      `[1:v]scale=${OVERLAY_WIDTH}:${OVERLAY_HEIGHT}:flags=lanczos,setsar=1[ov]`,
      "[bg][ov]overlay=0:0:format=auto,format=yuv420p[v]",
    ].join(";");

    const args = [
      "-y",
      "-loop",
      "1",
      "-t",
      String(VIDEO_DURATION_SECONDS),
      "-i",
      backgroundPath,
      "-loop",
      "1",
      "-t",
      String(VIDEO_DURATION_SECONDS),
      "-i",
      overlayPath,
      "-stream_loop",
      "-1",
      "-i",
      musicPath,
      "-filter_complex",
      filter,
      "-map",
      "[v]",
      "-map",
      "2:a:0",
      "-af",
      `atrim=duration=${VIDEO_DURATION_SECONDS},asetpts=N/SR/TB,loudnorm=I=-12:LRA=7:TP=-2,volume=${VIDEO_AUDIO_VOLUME},afade=t=in:st=0:d=${VIDEO_FADE_DURATION_SECONDS},afade=t=out:st=${VIDEO_DURATION_SECONDS - VIDEO_FADE_DURATION_SECONDS}:d=${VIDEO_FADE_DURATION_SECONDS}`,
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-tune",
      "stillimage",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "160k",
      "-t",
      String(VIDEO_DURATION_SECONDS),
      "-movflags",
      "+faststart",
      outputVideoPath,
    ];

    logger(`Starting FFmpeg encoding for: ${outputVideoPath}`);
    await runFFMPEG(args);
    return outputVideoPath;
  } catch (error) {
    logger(`FFmpeg Assembly Error: ${error.message}`, "error");
    throw error;
  }
};

export default createVideo;
