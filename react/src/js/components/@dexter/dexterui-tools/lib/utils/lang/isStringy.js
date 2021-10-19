import getStringSafely from './getStringSafely';

/**
 * @method isStringy
 * @desc Using the same rules as getStringSafely returns true if a string can be safely coerced,
 *       false if not.
 *
 * @memberof Lang
 *
 * @param thing {String|Object} thing to be tested.
 * @returns {Boolean} true if it can be safely coersed into a string. false if not.
 */
export default function isStringy(thing) {
  return getStringSafely(thing) !== null;
}