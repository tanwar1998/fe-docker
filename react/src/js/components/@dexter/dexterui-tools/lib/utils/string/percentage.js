/**
 * @file percentage.js
 * @desc percentages with precision
 * @author augur
 * @since 09/15/17 16:20
 *
 * @exports percentage
 */

/**
 * @func percentage
 * @desc Uses Object.prototype.toString to determing prototype of element
 *
 * @memberof Utilities
 *
 * @param num1 {Number} Smaller number
 * @param num2 {Number} Larger number
 * @param precision {Integer} the number of decimal places
 * @example
 * this.utils.percentage(6, 90, 3) => 6.67;
 * this.utils.percentage(6, 90) => 6.666666666666667;
 * @returns {Number}
 */

var percentage = function percentage(num1, num2) {
  var precision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var raw = num1 / num2 * 100;
  return raw.toFixed(precision);
};

export default percentage;