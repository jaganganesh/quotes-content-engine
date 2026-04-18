/**
 * Selects a random item from an array
 * @param {Array} items - Non-empty array of items to pick from
 * @returns {*} A random item from the array
 * @throws {Error} If input is not a non-empty array
 */
const randomPick = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Input must be a non-empty array");
  }
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

export default randomPick;
