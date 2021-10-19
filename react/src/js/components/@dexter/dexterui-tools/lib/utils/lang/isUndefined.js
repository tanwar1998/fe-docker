/**
 * @method isUndefined
 * @desc Checks to see if the provided item is undefined or not
 *
 * @memberof Lang
 *
 * @param thing {Array|String|Object} item to be tested for its existense
 * @returns {Boolean} will return true if thing is null, undefined, NaN.
 *                    Otherwise it will return null.
 */
export default function isUndefined(thing) {
  return typeof thing === 'undefined';
}