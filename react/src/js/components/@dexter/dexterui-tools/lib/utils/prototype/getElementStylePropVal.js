/**
 * @file getElementStylePropVal.js
 * @desc Utility method extension of Element.prototype
 * @author augur
 * @since 09/21/17 16:20
 *
 * @extends Element.prototype
 * @exports {}
 */

/**
 * @func Element.prototype.getElementStylePropVal getStylePropertyValue(prop)
 * @desc Get the string value of any computed property
 *
 * @memberof Element.prototype
 *
 * @extends Element.prototype
 * @param prop {String} Valid JS getComputedStyle api property bame
 *
 * @example
 * element.getElementStylePropVal('paddingLeft');
 *
 * @returns {String} || null returns ancestor element when found by selector
 */

Element.prototype.getElementStylePropVal = function getStylePropertyValue(prop) {
  return window.getComputedStyle(this, null)[prop];
};