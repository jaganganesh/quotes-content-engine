import { OUTPUT_PATH } from "../configuration.js";

export const platformLibrary = {
  youtube: {
    label: "YouTube",
    watermark: {
      enabled: true,
    },
    metadata: {
      title: [],
      description: [],
      tags: {
        coreTags: [],
        rotationalTags: [[], []],
      },
    },
  },
  instagram: {
    label: "Instagram",
    watermark: {
      enabled: true,
    },
    metadata: {
      title: [],
      description: [],
      tags: {
        coreTags: [],
        rotationalTags: [[], []],
      },
    },
  },
  tiktok: {
    label: "TikTok",
    watermark: {
      enabled: true,
    },
    metadata: {
      title: [],
      description: [],
      tags: {
        coreTags: [],
        rotationalTags: [[], []],
      },
    },
  },
};

export const getPlatformConfig = (platform) => {
  const config = platformLibrary[platform.toLowerCase()];
  if (!config) {
    throw new Error(`Unsupported platform: ${platform}`);
  }
  return config;
};

export const getPlatformPayloadStorage = (platform) =>
  `${OUTPUT_PATH}/payload.${platform}.json`;

export const getPlatformVideoStorage = (platform) =>
  `${OUTPUT_PATH}/video.${platform}.mp4`;
