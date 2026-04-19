/**
 * Safely extracts a random item from any given array.
 * @param {Array} list
 * @returns {*} The selected item or null if empty
 */
const randomPick = (list) => {
  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }
  return list[Math.floor(Math.random() * list.length)];
};

export default randomPick;
