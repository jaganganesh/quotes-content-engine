import { MUSIC_PATH } from "../configuration.js";
import musicLibrary from "../libraries/musicLibrary.js";
import randomPick from "../utils/randomPick.js";
import { logger } from "../utils/logger.js";

/**
 * Selects random audio metadata from the local library.
 * @returns {Object}
 */
const getMusic = () => {
  const pick = randomPick(musicLibrary);
  logger(`Selected audio track: ${pick.id} by ${pick.author}`);
  return {
    url: `file://${MUSIC_PATH}${pick.id}.wav`,
    author: pick.author,
    sourceUrl: pick.sourceUrl,
    license: pick.license,
  };
};

export default getMusic;
