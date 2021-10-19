/**
 * @method isNotNumber
 * @desc Checks to see if the provided item is a valid number or not
 *
 * @memberof Lang
 *
 * @param thing {Array|String|Object} item to be tested for its value as a number
 * @returns {Boolean} will return true if thing is a valid number. Otherwise it will return false.
 */
export default function isNumber(thing) {
  return typeof thing === 'number' && !isNaN(thing);
}