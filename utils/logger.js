import { DEBUG_MODE } from "../configuration.js";

/**
 * Centralized logging utility to maintain consistency across the engine.
 * @param {string} message - Content to log
 * @param {'log'|'warn'|'error'} level - Importance level
 */
export const logger = (message, level = "log") => {
  const time = new Date().toLocaleTimeString();
  const tag = `[${time}] [${level.toUpperCase()}]`;

  if (level === "error") {
    console.error(`${tag}: ${message}`);
    return;
  }

  // Check the global debug switch
  if (DEBUG_MODE) {
    if (level === "warn") {
      console.warn(`${tag}: ${message}`);
    } else {
      console.log(`${tag}: ${message}`);
    }
  }
};

export default logger;
