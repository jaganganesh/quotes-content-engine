import { platformLibrary } from "../libraries/platformLibrary.js";
import randomPick from "../utils/randomPick.js";
import { logger } from "../utils/logger.js";

/**
 * Generates SEO-optimized viral content payload for specific platforms.
 * @param {Object} contentData - Raw source metadata for video components.
 * @returns {Object}
 */
const generateContent = (contentData) => {
  const { platform, quoteData, imageData, musicData } = contentData;
  const platformKey = platform.toLowerCase();
  const config = platformLibrary[platformKey];

  if (!config) throw new Error(`Platform configuration missing: ${platform}`);

  const meta = config.metadata;
  logger(`Generating SEO metadata for ${platformKey}`);

  // Standard viral components with guard clauses
  const hook = meta.hooks?.length ? randomPick(meta.hooks) : "";
  const title = meta.titleTemplates?.length
    ? randomPick(meta.titleTemplates)
    : "Mindset";
  const cta =
    platformKey === "instagram" && meta.ctaTemplates?.length
      ? randomPick(meta.ctaTemplates)
      : "";

  // Hashtag rotation logic
  let finalTags = "";
  if (meta.hashtags) {
    const core = meta.hashtags.core || [];
    const rotation = meta.hashtags.rotational?.length
      ? randomPick(meta.hashtags.rotational)
      : [];
    finalTags = [...core, ...rotation]
      .map((t) => `#${t.replace(/\s+/g, "")}`)
      .join(" ");
  }

  let postDescription;

  // Platform-specific formatting
  switch (platformKey) {
    case "youtube": {
      const lead = meta.descriptionLeads?.length
        ? randomPick(meta.descriptionLeads)
        : "Daily Motivation";
      postDescription = `${lead}\n\n"${quoteData.quote}"\n\n#Shorts ${finalTags}`;
      break;
    }

    case "instagram": {
      postDescription = `${hook}\n\n"${quoteData.quote}"\n\n${cta}\n\n${finalTags}`;
      break;
    }

    case "tiktok": {
      postDescription = `${title}\n\n${quoteData.quote}\n\n${finalTags}`;
      break;
    }

    default: {
      postDescription = `${quoteData.quote}\n\n${finalTags}`;
    }
  }

  return {
    platform: platformKey,
    postTitle: title,
    postDescription,
    fullCaption: `${postDescription}\n\n---\nVisuals: ${imageData.author}\nAudio: ${musicData.author}`,
    metadata: {
      searchKeywords: meta.keywordPhrases?.join(", ") || "",
      generatedAt: new Date().toISOString(),
    },
  };
};

export default generateContent;
