import {
  GRADIENT_MIN_OPACITY,
  GRADIENT_MAX_OPACITY,
  GRADIENT_MIN_RGB_VALUE,
  GRADIENT_MAX_RGB_VALUE,
} from "../configuration.js";

/**
 * Creates aesthetic dark gradient layers for text readability.
 * @returns {Object} Primary and secondary RGBA strings
 */
const randomDarkGradient = () => {
  const genVal = () =>
    Math.floor(
      Math.random() * (GRADIENT_MAX_RGB_VALUE - GRADIENT_MIN_RGB_VALUE + 1) +
        GRADIENT_MIN_RGB_VALUE
    );

  const genAlpha = () =>
    (
      Math.random() * (GRADIENT_MAX_OPACITY - GRADIENT_MIN_OPACITY) +
      GRADIENT_MIN_OPACITY
    ).toFixed(2);

  const [r, g, b] = [genVal(), genVal(), genVal()];
  const primaryAlpha = genAlpha();

  // Secondary alpha is always softer to create a natural "fade-in" effect from the top
  const secondaryAlpha = (primaryAlpha * 0.45).toFixed(2);

  return {
    primaryGradient: `rgba(${r}, ${g}, ${b}, ${primaryAlpha})`,
    secondaryGradient: `rgba(0, 0, 0, ${secondaryAlpha})`,
  };
};

export default randomDarkGradient;
