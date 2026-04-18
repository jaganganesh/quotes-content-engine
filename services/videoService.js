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
  TEMP_IMAGE_STORAGE,
  TEMP_MUSIC_STORAGE,
  TEMP_GRADIENT_OVERLAY_STORAGE,
  OUTPUT_VIDEO_STORAGE,
} from "../configuration.js";
import runFFMPEG from "../utils/ffmpeg.js";

const createVideo = async ({
  backgroundPath = TEMP_IMAGE_STORAGE,
  overlayPath = TEMP_GRADIENT_OVERLAY_STORAGE,
  musicPath = TEMP_MUSIC_STORAGE,
  outputVideoPath = OUTPUT_VIDEO_STORAGE,
}) => {
  try {
    await fs.ensureDir(path.dirname(outputVideoPath));

    const totalFrames = VIDEO_DURATION_SECONDS * VIDEO_FRAME_RATE;
    const zoomProgress = `${VIDEO_BACKGROUND_START_ZOOM}+(${VIDEO_BACKGROUND_END_ZOOM - VIDEO_BACKGROUND_START_ZOOM})*(on/${Math.max(totalFrames - 1, 1)})`;
    const backgroundWidth = OVERLAY_WIDTH * VIDEO_BACKGROUND_SOURCE_MULTIPLIER;
    const backgroundHeight =
      OVERLAY_HEIGHT * VIDEO_BACKGROUND_SOURCE_MULTIPLIER;
    const fadeDuration = VIDEO_FADE_DURATION_SECONDS;
    const fadeOutStart = Math.max(VIDEO_DURATION_SECONDS - fadeDuration, 0);
    const filterGraph = [
      `[0:v]fps=${VIDEO_FRAME_RATE},scale=${backgroundWidth}:${backgroundHeight}:flags=lanczos,setsar=1,zoompan=z='min(${VIDEO_BACKGROUND_END_ZOOM},${zoomProgress})':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${OVERLAY_WIDTH}x${OVERLAY_HEIGHT}:fps=${VIDEO_FRAME_RATE},boxblur=2:1,setsar=1[background]`,
      `[1:v]scale=${OVERLAY_WIDTH}:${OVERLAY_HEIGHT}:flags=lanczos,setsar=1[overlay]`,
      "[background][overlay]overlay=0:0:format=auto,setsar=1,format=yuv420p[video]",
    ].join(";");

    console.log("Starting video creation", {
      backgroundPath,
      overlayPath,
      musicPath,
      outputVideoPath,
      durationSeconds: VIDEO_DURATION_SECONDS,
      frameRate: VIDEO_FRAME_RATE,
      volume: VIDEO_AUDIO_VOLUME,
    });

    // Build ffmpeg command
    const inputOptions = [
      "-y",
      "-loglevel",
      "error",
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
      TEMP_MUSIC_STORAGE,
    ];

    // Video filter graph to handle zoom, overlay, and audio processing
    const videoFilterOptions = [
      "-filter_complex",
      filterGraph,
      "-map",
      "[video]",
      "-map",
      "2:a:0",
      "-af",
      `atrim=duration=${VIDEO_DURATION_SECONDS},asetpts=N/SR/TB,loudnorm=I=-12:LRA=7:TP=-2,volume=${VIDEO_AUDIO_VOLUME},afade=t=in:st=0:d=${fadeDuration},afade=t=out:st=${fadeOutStart}:d=${fadeDuration}`,
    ];

    // Output options for encoding the video
    const outputOptions = [
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
      "-ar",
      "48000",
      "-t",
      String(VIDEO_DURATION_SECONDS),
      "-shortest",
      "-movflags",
      "+faststart",
      outputVideoPath,
    ];

    await runFFMPEG([...inputOptions, ...videoFilterOptions, ...outputOptions]);

    console.log("FFMPEG process completed successfully.");
    return outputVideoPath;
  } catch (error) {
    console.error("Error creating video:", error);
    throw error;
  }
};

export default createVideo;
