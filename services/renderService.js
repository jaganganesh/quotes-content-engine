import { createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs-extra";
import path from "path";
import {
  OVERLAY_WIDTH,
  OVERLAY_HEIGHT,
  TEMP_GRADIENT_OVERLAY_STORAGE,
  FONT_PATH,
  AUTHOR_FONT_START,
  AUTHOR_FONT_MIN,
  AUTHOR_FONT_GAP,
  QUOTE_FONT_START,
  QUOTE_FONT_MIN,
  OVERLAY_SAFE_TOP,
  OVERLAY_SAFE_BOTTOM,
  OVERLAY_SAFE_SIDES_PADDING,
  WATERMARK_IMAGE_PATH,
  WATERMARK_SIZE,
  WATERMARK_MARGIN_RIGHT,
  WATERMARK_MARGIN_BOTTOM,
  WATERMARK_OPACITY,
} from "../configuration.js";
import fontLibrary from "../libraries/fontLibrary.js";
import randomPick from "../utils/randomPick.js";
import randomDarkGradient from "../utils/randomDarkGradient.js";

const registeredFonts = new Set();
const outputPath = TEMP_GRADIENT_OVERLAY_STORAGE;
const availableTextHeight =
  OVERLAY_HEIGHT - OVERLAY_SAFE_TOP - OVERLAY_SAFE_BOTTOM;

/**
 * Ensures a font is registered with the canvas context
 * @param {Object} font - Font object with slug and fontName
 */
const ensureFontRegistered = (font) => {
  if (registeredFonts.has(font.slug)) {
    console.log(`Font "${font.fontName}" is already registered.`);
    return;
  }

  registerFont(path.resolve(`${FONT_PATH}/${font.slug}.ttf`), {
    family: font.fontName,
  });
  registeredFonts.add(font.slug);
  console.log(`Registered font: ${font.fontName} (slug: ${font.slug})`);
};

/**
 * Wraps text into lines that fit within the maximum width
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Text to wrap
 * @param {number} maxWidth - Maximum width for each line
 * @returns {string[]} Array of wrapped lines
 */
const getWrappedLines = (ctx, text, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;

    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines;
};

/**
 * Fits text into a block by adjusting font size to fit within dimensions
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Text to fit
 * @param {string} fontFamily - Font family name
 * @param {Object} options - Fitting options
 * @param {number} options.fontStart - Starting font size
 * @param {number} options.fontMin - Minimum font size
 * @param {number} options.maxWidth - Maximum width
 * @param {number} options.maxHeight - Maximum height
 * @returns {Object} Layout object with fontSize, lineHeight, and lines
 */
const fitTextBlock = (
  ctx,
  text,
  fontFamily,
  { fontStart, fontMin, maxWidth, maxHeight }
) => {
  for (let fontSize = fontStart; fontSize >= fontMin; fontSize -= 4) {
    ctx.font = `700 ${fontSize}px "${fontFamily}"`;
    const lineHeight = Math.round(fontSize * 1.2);
    const lines = getWrappedLines(ctx, text, maxWidth);

    if (lines.length * lineHeight <= maxHeight) {
      return {
        fontSize,
        lineHeight,
        lines,
      };
    }
  }

  ctx.font = `700 ${fontMin}px "${fontFamily}"`;

  return {
    fontSize: fontMin,
    lineHeight: Math.round(fontMin * 1.2),
    lines: getWrappedLines(ctx, text, maxWidth),
  };
};

/**
 * Draws centered text lines on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string[]} lines - Array of text lines
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} lineHeight - Height of each line
 */
const drawCenteredLines = (ctx, lines, x, y, lineHeight) => {
  const blockHeight = lines.length * lineHeight;
  const startY = y - blockHeight / 2 + lineHeight / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, x, startY + index * lineHeight);
  });
};

/**
 * Draws a watermark on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @returns {Promise<Object>} Watermark data object
 */
const drawWatermark = async (ctx) => {
  const watermarkImage = await loadImage(path.resolve(WATERMARK_IMAGE_PATH));
  const watermarkX = OVERLAY_WIDTH - WATERMARK_SIZE - WATERMARK_MARGIN_RIGHT;
  const watermarkY = OVERLAY_HEIGHT - WATERMARK_SIZE - WATERMARK_MARGIN_BOTTOM;

  ctx.save();
  ctx.globalAlpha = WATERMARK_OPACITY;
  ctx.drawImage(
    watermarkImage,
    watermarkX,
    watermarkY,
    WATERMARK_SIZE,
    WATERMARK_SIZE
  );
  ctx.restore();

  return {
    enabled: true,
    path: WATERMARK_IMAGE_PATH,
    opacity: WATERMARK_OPACITY,
    size: WATERMARK_SIZE,
    position: {
      x: watermarkX,
      y: watermarkY,
    },
  };
};

/**
 * Renders an overlay with quote, author, and optional watermark
 * @param {Object} params - Rendering parameters
 * @param {string} params.quote - Quote text
 * @param {string} params.author - Author name
 * @param {boolean} [params.showWatermark=false] - Whether to show watermark
 * @returns {Promise<void>}
 */
const renderOverlay = async ({ quote, author, showWatermark = false }) => {
  if (!quote || typeof quote !== "string" || quote.trim().length === 0) {
    throw new Error("Invalid quote: must be a non-empty string");
  }
  if (!author || typeof author !== "string" || author.trim().length === 0) {
    throw new Error("Invalid author: must be a non-empty string");
  }
  if (typeof showWatermark !== "boolean") {
    throw new Error("Invalid showWatermark: must be a boolean");
  }

  const font = randomPick(fontLibrary);

  console.log("Starting overlay rendering", {
    font: font.fontName,
    outputPath,
    quoteLength: quote.length,
    authorLength: author.length,
    watermarkEnabled: showWatermark,
  });

  try {
    ensureFontRegistered(font);

    const canvas = createCanvas(OVERLAY_WIDTH, OVERLAY_HEIGHT);
    const ctx = canvas.getContext("2d");
    const gradient = randomDarkGradient();

    // Gradient
    const overlayGradient = ctx.createLinearGradient(0, 0, 0, OVERLAY_HEIGHT);
    overlayGradient.addColorStop(0, gradient.top);
    overlayGradient.addColorStop(0.1, gradient.middle);
    overlayGradient.addColorStop(0.98, gradient.middle);
    overlayGradient.addColorStop(1, gradient.bottom);

    ctx.fillStyle = overlayGradient;
    ctx.fillRect(0, 0, OVERLAY_WIDTH, OVERLAY_HEIGHT);

    // Quote
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = 28;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;

    // Author Layout
    const authorLayout = fitTextBlock(ctx, `- ${author}`, font.fontName, {
      fontStart: AUTHOR_FONT_START,
      fontMin: AUTHOR_FONT_MIN,
      maxWidth: OVERLAY_WIDTH - OVERLAY_SAFE_SIDES_PADDING * 2,
      maxHeight: 120,
    });
    const authorBlockHeight =
      authorLayout.lines.length * authorLayout.lineHeight;

    // Quote Layout
    const quoteLayout = fitTextBlock(ctx, `"${quote}"`, font.fontName, {
      fontStart: QUOTE_FONT_START,
      fontMin: QUOTE_FONT_MIN,
      maxWidth: OVERLAY_WIDTH - OVERLAY_SAFE_SIDES_PADDING * 2,
      maxHeight: Math.max(
        availableTextHeight - authorBlockHeight - AUTHOR_FONT_GAP,
        QUOTE_FONT_MIN * 2
      ),
    });
    const quoteBlockHeight = quoteLayout.lines.length * quoteLayout.lineHeight;

    // Calculate Y positions
    const totalTextBlockHeight =
      quoteBlockHeight + AUTHOR_FONT_GAP + authorBlockHeight;
    const contentCenterY = OVERLAY_SAFE_TOP + availableTextHeight / 2;
    const quoteCenterY =
      contentCenterY - totalTextBlockHeight / 2 + quoteBlockHeight / 2;
    const authorCenterY =
      contentCenterY + totalTextBlockHeight / 2 - authorBlockHeight / 2;

    // Render Quote
    ctx.font = `700 ${quoteLayout.fontSize}px "${font.fontName}"`;
    drawCenteredLines(
      ctx,
      quoteLayout.lines,
      OVERLAY_WIDTH / 2,
      quoteCenterY,
      quoteLayout.lineHeight
    );

    // Render Author
    ctx.font = `700 ${authorLayout.fontSize}px "${font.fontName}"`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    drawCenteredLines(
      ctx,
      authorLayout.lines,
      OVERLAY_WIDTH / 2,
      authorCenterY,
      authorLayout.lineHeight
    );

    // Watermark
    const watermarkData = showWatermark
      ? await drawWatermark(ctx)
      : {
          enabled: false,
          path: null,
          opacity: null,
          size: null,
          position: {
            x: null,
            y: null,
          },
        };

    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, canvas.toBuffer("image/png"));

    return {
      overlayPath: outputPath,
      gradient,
      font: font.fontName,
      watermark: watermarkData,
    };
  } catch (error) {
    console.error("Error rendering overlay:", error);
    throw error;
  }
};

export default renderOverlay;
