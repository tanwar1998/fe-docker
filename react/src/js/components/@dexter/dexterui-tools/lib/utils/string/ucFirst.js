import isStringy from '../lang/isStringy';

/**
 * @func ucFirst
 * @desc Capitalizes the first character of a string.
 * @param {string} string String to be capitalized
 * @returns {String} string with first letter capitalized
 */

export default function ucFirst(string) {
  return isStringy(string) ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}