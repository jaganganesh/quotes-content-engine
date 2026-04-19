import {
  GRADIENT_MIN_OPACITY,
  GRADIENT_MAX_OPACITY,
  GRADIENT_MIN_RGB_VALUE,
  GRADIENT_MAX_RGB_VALUE,
} from "../configuration.js";

/**
 * Generates a random opacity value within the configured range
 * @returns {string} Opacity value as a string with 2 decimal places
 */
const generateOpacity = () =>
  (
    Math.random() * (GRADIENT_MAX_OPACITY - GRADIENT_MIN_OPACITY) +
    GRADIENT_MIN_OPACITY
  ).toFixed(2);

/**
 * Generates a random RGBA color string with the given opacity
 * @param {string} opacity - Opacity value as string
 * @returns {string} RGBA color string
 */
const generateColorString = (opacity) =>
  `rgba(${Math.floor(Math.random() * (GRADIENT_MAX_RGB_VALUE - GRADIENT_MIN_RGB_VALUE) + GRADIENT_MIN_RGB_VALUE)}, ${Math.floor(
    Math.random() * (GRADIENT_MAX_RGB_VALUE - GRADIENT_MIN_RGB_VALUE) +
      GRADIENT_MIN_RGB_VALUE
  )}, ${Math.floor(Math.random() * (GRADIENT_MAX_RGB_VALUE - GRADIENT_MIN_RGB_VALUE) + GRADIENT_MIN_RGB_VALUE)}, ${opacity})`;

/**
 * Generates a random dark gradient with three color stops and a random angle
 * @returns {Object} Gradient object with top, middle, bottom colors and angle
 */
const randomDarkGradient = () => {
  const primaryOpacity = generateOpacity();
  const secondaryOpacity = generateOpacity();

  const primaryGradient = generateColorString(primaryOpacity);
  const secondaryGradient = `rgba(0, 0, 0, ${secondaryOpacity})`;

  console.log("Generated Gradient:", {
    primaryGradient: primaryGradient,
    secondaryGradient: secondaryGradient,
  });

  return {
    primaryGradient: primaryGradient,
    secondaryGradient: secondaryGradient,
  };
};

export default randomDarkGradient;
