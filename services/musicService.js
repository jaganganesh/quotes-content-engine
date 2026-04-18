import { MUSIC_PATH, TEMP_MUSIC_STORAGE } from "../configuration.js";
import musicLibrary from "../libraries/musicLibrary.js";
import randomPick from "../utils/randomPick.js";

/**
 * Fetches a random music track from the music library
 * @returns {Promise<Object>} Music object with url, path, author, sourceUrl, and license
 */
const getMusic = async () => {
  const randomMusicPick = randomPick(musicLibrary);
  console.log(
    `Random music selected: author=${randomMusicPick.author}, id=${randomMusicPick.id}, license=${randomMusicPick.license}`
  );

  return {
    url: `file://${MUSIC_PATH}${randomMusicPick.id}.wav`,
    path: TEMP_MUSIC_STORAGE,
    author: randomMusicPick.author,
    sourceUrl: randomMusicPick.sourceUrl,
    license: randomMusicPick.license,
  };
};

export default getMusic;
