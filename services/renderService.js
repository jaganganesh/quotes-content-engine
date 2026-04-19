import { createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs-extra";
import path from "path";
import {
  OVERLAY_WIDTH,
  OVERLAY_HEIGHT,
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
import { logger } from "../utils/logger.js";

const registeredFonts = new Set();

const ensureFontRegistered = (font) => {
  if (registeredFonts.has(font.slug)) return;
  registerFont(path.resolve(`${FONT_PATH}/${font.slug}.ttf`), {
    family: font.fontName,
  });
  registeredFonts.add(font.slug);
};

const getWrappedLines = (ctx, text, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = testLine;
  }
  if (line) lines.push(line);
  return lines;
};

const fitTextBlock = (
  ctx,
  text,
  fontFamily,
  { fontStart, fontMin, maxWidth, maxHeight }
) => {
  for (let fontSize = fontStart; fontSize >= fontMin; fontSize -= 2) {
    ctx.font = `700 ${fontSize}px "${fontFamily}"`;
    const lineHeight = Math.round(fontSize * 1.2);
    const lines = getWrappedLines(ctx, text, maxWidth);
    if (lines.length * lineHeight <= maxHeight)
      return { fontSize, lineHeight, lines };
  }
  return {
    fontSize: fontMin,
    lineHeight: Math.round(fontMin * 1.2),
    lines: getWrappedLines(ctx, text, maxWidth),
  };
};

/**
 * Renders the canvas overlay with specific platform isolation.
 * @param {Object} params
 * @returns {Promise<Object>}
 */
const renderOverlay = async ({ quote, author, showWatermark, outputPath }) => {
  const font = randomPick(fontLibrary);
  ensureFontRegistered(font);
  logger(`Rendering overlay with font: ${font.fontName}`);

  const canvas = createCanvas(OVERLAY_WIDTH, OVERLAY_HEIGHT);
  const ctx = canvas.getContext("2d");
  const gradient = randomDarkGradient();

  const fill = ctx.createLinearGradient(0, 0, 0, OVERLAY_HEIGHT);
  fill.addColorStop(0, gradient.secondaryGradient);
  fill.addColorStop(0.1, gradient.primaryGradient);
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, OVERLAY_WIDTH, OVERLAY_HEIGHT);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 28;

  const authorLayout = fitTextBlock(ctx, `- ${author}`, font.fontName, {
    fontStart: AUTHOR_FONT_START,
    fontMin: AUTHOR_FONT_MIN,
    maxWidth: OVERLAY_WIDTH - OVERLAY_SAFE_SIDES_PADDING * 2,
    maxHeight: 120,
  });

  const quoteLayout = fitTextBlock(ctx, `"${quote}"`, font.fontName, {
    fontStart: QUOTE_FONT_START,
    fontMin: QUOTE_FONT_MIN,
    maxWidth: OVERLAY_WIDTH - OVERLAY_SAFE_SIDES_PADDING * 2,
    maxHeight:
      OVERLAY_HEIGHT -
      OVERLAY_SAFE_TOP -
      OVERLAY_SAFE_BOTTOM -
      authorLayout.lines.length * authorLayout.lineHeight -
      AUTHOR_FONT_GAP,
  });

  const totalHeight =
    quoteLayout.lines.length * quoteLayout.lineHeight +
    AUTHOR_FONT_GAP +
    authorLayout.lines.length * authorLayout.lineHeight;
  const centerY =
    OVERLAY_SAFE_TOP +
    (OVERLAY_HEIGHT - OVERLAY_SAFE_TOP - OVERLAY_SAFE_BOTTOM) / 2;

  // Draw Quote
  const quoteStartY =
    centerY -
    totalHeight / 2 +
    (quoteLayout.lines.length * quoteLayout.lineHeight) / 2;
  quoteLayout.lines.forEach((line, i) =>
    ctx.fillText(
      line,
      OVERLAY_WIDTH / 2,
      quoteStartY +
        i * quoteLayout.lineHeight -
        (quoteLayout.lines.length * quoteLayout.lineHeight) / 2
    )
  );

  // Draw Author
  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  const authorStartY =
    centerY +
    totalHeight / 2 -
    (authorLayout.lines.length * authorLayout.lineHeight) / 2;
  authorLayout.lines.forEach((line, i) =>
    ctx.fillText(
      line,
      OVERLAY_WIDTH / 2,
      authorStartY + i * authorLayout.lineHeight
    )
  );

  if (showWatermark) {
    const wm = await loadImage(path.resolve(WATERMARK_IMAGE_PATH));
    ctx.globalAlpha = WATERMARK_OPACITY;
    ctx.drawImage(
      wm,
      OVERLAY_WIDTH - WATERMARK_SIZE - WATERMARK_MARGIN_RIGHT,
      OVERLAY_HEIGHT - WATERMARK_SIZE - WATERMARK_MARGIN_BOTTOM,
      WATERMARK_SIZE,
      WATERMARK_SIZE
    );
  }

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, canvas.toBuffer("image/png"));
  return { overlayPath: outputPath };
};

export default renderOverlay;
