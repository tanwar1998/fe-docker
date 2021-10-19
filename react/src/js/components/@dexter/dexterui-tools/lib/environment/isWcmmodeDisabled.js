/**
 * @func isWcmmodeDisabled
 * @desc returns Boolean that says if wcmmode = disabled or not.
 *
 * @memberof Environment
 *
 * @returns {Boolean} Will return true if in wcmmode equals disabled.
 */

export default function isWcmmodeDisabled() {
  return window.location.href.indexOf('wcmmode=disabled') >= 0;
}