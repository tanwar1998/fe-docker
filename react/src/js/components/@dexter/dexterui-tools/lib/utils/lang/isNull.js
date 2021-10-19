var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @method isNull
 * @desc Checks to see if the provided item is null or not
 *
 * @memberof Lang
 *
 * @param thing {Object} item to be tested
 * @returns {Boolean} will return true if thing is a valid object. Otherwise it will return false.
 */
export default function isNull(thing) {
  return (typeof thing === 'undefined' ? 'undefined' : _typeof(thing)) === 'object' && thing === null;
}