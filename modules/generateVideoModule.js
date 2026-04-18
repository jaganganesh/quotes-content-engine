import dotenv from "dotenv";
import getQuote from "../services/quoteService.js";
import getImage from "../services/imageService.js";
import getMusic from "../services/musicService.js";
import renderOverlay from "../services/renderService.js";
import createVideo from "../services/videoService.js";
import downloadFile from "../utils/downloadFile.js";

dotenv.config();

const generateVideo = async () => {
  try {
    const quote = await getQuote();
    console.log("Quote fetched:", quote);

    // Parallelize image and music fetching
    const [image, music] = await Promise.all([getImage(), getMusic()]);
    console.log("Image URL:", image.url);
    console.log(
      "Image Author, Source and License:",
      image.author,
      image.sourceUrl,
      image.license
    );
    console.log("Music URL:", music.url);
    console.log(
      "Music Author, Source, License:",
      music.author,
      music.sourceUrl,
      music.license
    );

    // Parallelize downloads
    await Promise.all([
      downloadFile(image.url, image.path),
      downloadFile(music.url, music.path),
    ]);

    // Render overlay with quote and image
    const overlayData = await renderOverlay({
      quote: quote.quote,
      author: quote.author,
      showWatermark: true,
    });

    console.log("Overlay data:", overlayData);

    // Create video with background image, overlay, and music
    await createVideo({
      backgroundPath: image.path,
      overlayPath: overlayData.overlayPath,
      musicPath: music.path,
    });

    console.log("Video creation completed successfully.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Video creation failed:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Video creation failed with unknown error:", error);
    }
    process.exit(1);
  }
};

generateVideo();
