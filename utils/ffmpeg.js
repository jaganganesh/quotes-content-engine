import { spawn } from "child_process";

const runFFMPEG = async (args) => {
  return new Promise((resolve, reject) => {
    const ffmpegProcess = spawn("ffmpeg", args, {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stderrOutput = "";

    ffmpegProcess.stderr.on("data", (chunk) => {
      stderrOutput += chunk.toString();
    });

    ffmpegProcess.on("error", (error) => {
      reject(new Error(`Failed to start ffmpeg process: ${error.message}`));
    });

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        const errorMessage =
          stderrOutput.trim() || `ffmpeg exited with code ${code}`;
        reject(
          new Error(
            `ffmpeg command failed: ${errorMessage}. Command: ffmpeg ${args.join(" ")}`
          )
        );
      }
    });
  });
};

export default runFFMPEG;
