import { spawn } from "node:child_process";
import { logger } from "./logger.js";

/**
 * Promisified wrapper for FFmpeg process execution.
 * @param {string[]} args - Array of command line arguments for FFmpeg
 * @returns {Promise<void>}
 */
const runFFMPEG = (args) => {
  return new Promise((resolve, reject) => {
    const process = spawn("ffmpeg", args);
    let errorLog = "";

    process.stderr.on("data", (data) => {
      const output = data.toString();
      errorLog += output;
      // High-level monitoring of the render progress
      if (output.toLowerCase().includes("error")) {
        logger(`FFmpeg Sub-log: ${output.trim()}`, "warn");
      }
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        logger(`FFmpeg exited with error code ${code}`, "error");
        reject(new Error(`FFmpeg failed to encode video: ${errorLog}`));
      }
    });

    process.on("error", (err) => {
      logger(`Process Spawn Error: ${err.message}`, "error");
      reject(err);
    });
  });
};

export default runFFMPEG;
