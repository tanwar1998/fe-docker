/**
 * Return the value if between min & max else return min or max.
 * @param {number} val Value to clamp
 * @param {number} min Min Value
 * @param {number} max Max Value
 */
var clamp = function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
};
export default clamp;