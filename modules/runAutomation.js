import getQuote from "../services/quoteService.js";

const runAutomation = async () => {
  await getQuote();
};
runAutomation();
