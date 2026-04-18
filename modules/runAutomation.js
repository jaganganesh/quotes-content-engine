import dotenv from "dotenv";
import getQuote from "../services/quoteService.js";
import getImage from "../services/imageService.js";
import downloadFile from "../utils/downloadFile.js";

dotenv.config();

const runAutomation = async () => {
  try {
    const quote = await getQuote();
    console.log("Quote fetched:", quote);

    const image = await getImage();
    console.log("Image URL:", image.url);
    console.log("Image Author:", image.author);
    console.log("Image Author URL:", image.author_url);

    await downloadFile(image.url, image.path);
    console.log("Automation completed successfully");
  } catch (error) {
    console.error("Automation failed:", error);
    process.exit(1);
  }
};

runAutomation();
