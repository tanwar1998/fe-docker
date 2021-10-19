/**
 * @func isAuthor
 * @desc returns Boolean that says if you're in author or not.
 *
 * @memberof Environment
 *
 * @returns {Boolean} Will return true if in author on TouchUI.
 */

export default function isAuthor() {
  return typeof window.Granite !== 'undefined';
}