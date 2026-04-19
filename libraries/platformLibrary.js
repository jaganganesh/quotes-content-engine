import { OUTPUT_PATH } from "../configuration.js";

export const platformLibrary = Object.freeze({
  instagram: {
    label: "Instagram",
    watermark: { enabled: true },
    metadata: {
      keywordPhrases: [
        "mindset shift",
        "stoic wisdom",
        "discipline quotes",
        "growth mindset",
        "mental toughness",
        "ego is the enemy",
        "resilience",
        "daily stoic",
      ],
      titleTemplates: [
        "Read this when you feel like giving up. 🕯️",
        "The version of you that wins is waiting.",
        "Your future self is watching you right now.",
        "A reminder for the hard days.",
        "This is the shift you've been looking for.",
        "Silence the noise. Focus on the work.",
        "Character is built in the dark.",
        "The obstacle is the path forward.",
        "Growth is painful. Change is painful.",
        "Become unrecognizable.",
      ],
      hooks: [
        "Read that again. 📌",
        "Save this for your next low moment.",
        "The truth about growth no one tells you.",
        "Stop scrolling. This was meant for you.",
        "One line, infinite perspective.",
        "Most people won't understand this.",
        "This is your wake-up call.",
        "The cost of your new life is your old one.",
        "You aren't tired, you're uninspired.",
        "Your potential is calling. Pick up.",
      ],
      ctaTemplates: [
        "Save this to your 'Daily Fuel' folder.",
        "Share this with someone who needs strength today.",
        "Tap 'Save' if you're staying disciplined.",
        "Comment 'STRIVE' if you are committed.",
        "Send this to your future self.",
        "Double tap if you're working in silence.",
      ],
      hashtags: {
        core: ["MindsetThroughPain", "StoicReflections", "QuoteReels"],
        rotational: [
          ["InnerStrength", "SelfGrowth", "Discipline", "MentalFortitude"],
          ["SuccessMindset", "WisdomQuotes", "DailyReminder", "Stoicism"],
          ["HighPerformance", "Grindset", "Focus", "Consistency"],
          ["Unstoppable", "MotivationDaily", "Ambition", "PainIsFuel"],
        ],
        maxCount: 5,
      },
    },
  },
  tiktok: {
    label: "TikTok",
    watermark: { enabled: false },
    metadata: {
      keywordPhrases: [
        "silent growth mindset",
        "dopamine detox",
        "discipline over motivation",
        "stoicism for life",
        "monk mode",
        "dark motivation",
        "lonely road",
        "villain arc",
      ],
      titleTemplates: [
        "POV: You finally stopped making excuses.",
        "How to master your mind in silence.",
        "The blueprint for a 1% mindset.",
        "Uncomfortable truths about your potential.",
        "Why discipline beats motivation every time.",
        "Entering Monk Mode.",
        "The art of disappearing and improving.",
        "How to win the war in your head.",
        "Day 1 or One Day? You decide.",
        "They won't understand the new you.",
      ],
      hooks: [
        "This is your 2026 sign to keep going. ⚡",
        "Most people miss the point of this...",
        "Listen close. This will change your week.",
        "The hardest pill you'll ever swallow.",
        "Stop waiting for the 'right time'.",
        "Your competition is sleeping. Get up.",
        "Watch until the end. This is for you.",
        "You are one decision away from a different life.",
        "Stop complaining and start commanding.",
        "The silent grind produces the loudest results.",
      ],
      hashtags: {
        core: ["SilentGrowth", "Mindset", "TikTokSEO"],
        rotational: [
          ["StoicPhilosophy", "HardWork", "DopamineDetox", "SigmaRules"],
          ["SuccessHabits", "DailyWisdom", "ViralMindset", "LifeLessons"],
          ["MonkMode", "Discipline", "Productivity", "SelfMastery"],
          ["MindsetShift", "Consistency", "Winning", "DarkAesthetic"],
        ],
        maxCount: 4,
      },
    },
  },
  youtube: {
    label: "YouTube",
    watermark: { enabled: true },
    metadata: {
      keywordPhrases: [
        "motivational shorts",
        "mindset through pain",
        "daily discipline",
        "stoic quotes",
        "success advice",
        "life lessons",
        "short philosophy",
      ],
      titleTemplates: [
        "The Brutal TRUTH About Growth 🧠",
        "Why You MUST Embrace The Pain",
        "One line that will change your perspective.",
        "Stop Being Average. ⚡",
        "A 60-second mindset reset.",
        "Mastering Stoic Discipline.",
        "What They Don't Tell You About Success.",
        "The Secret to Unshakable Focus.",
        "How to Stay Disciplined When it Hurts.",
        "The Philosophy of Champions.",
      ],
      descriptionLeads: [
        "Success isn't found in comfort. This reminder is for those chasing growth.",
        "A brutal perspective on discipline you won't forget. Subscribe for daily fuel.",
        "This is why most people stay stuck. Don't be one of them.",
        "The philosophy of the 1%. Learn it or be left behind.",
        "Growth requires the death of your comfort zone.",
        "The journey is lonely, but the destination is worth it.",
      ],
      hashtags: {
        core: ["Shorts", "MindsetThroughPain", "Wisdom"],
        rotational: [
          ["Motivation", "StoicQuotes", "PersonalGrowth"],
          ["SelfImprovement", "Success", "DailyQuotes"],
          ["MentalHealth", "Mindset", "Discipline"],
          ["Inspiration", "LifeAdvice", "Philosophy"],
        ],
        maxCount: 3,
      },
    },
  },
});

export const getPlatformConfig = (p) => {
  const config = platformLibrary[p.toLowerCase()];
  if (!config) throw new Error(`Unsupported platform: ${p}`);
  return config;
};

export const getPlatformPayloadStorage = (p) =>
  `${OUTPUT_PATH}/payload.${p}.json`;
