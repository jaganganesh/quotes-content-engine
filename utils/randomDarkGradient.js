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
  const angle = Math.floor(Math.random() * 360);
  const topOpacity = generateOpacity();
  const middleOpacity = generateOpacity();
  const bottomOpacity = generateOpacity();

  const topColor = generateColorString(topOpacity);
  const middleColor = generateColorString(middleOpacity);
  const bottomColor = generateColorString(bottomOpacity);

  console.log("Generated Gradient:", {
    topColor,
    middleColor,
    bottomColor,
    angle,
  });

  return {
    top: topColor,
    middle: middleColor,
    bottom: bottomColor,
    angle: angle,
  };
};

export default randomDarkGradient;
