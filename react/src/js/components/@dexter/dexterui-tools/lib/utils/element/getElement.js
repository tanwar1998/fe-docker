function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @file getElement.js
 * @desc Simplified susage of querySelector and querySelectorAll,
 converts Collections to Arrays, and returns null on fail
 * @author augur
 * @since 09/15/17 16:20
 *
 * @exports getElement
 */

/**
 * @func getElement
 * @desc see file description
 *
 * @memberof Utilities
 *
 * @param sel {String} Valid DOM selector
 * @param scope {HTMLElement} default is document
 * @param type {String} 'unique' is default, 'all' must be declared
 * @example
 * this.utils.getElement('.selector||#selector||selector', 'all') for collection as array
 * this.utils.getElement('.selector||#selector||selector')
 *
 * @returns {element} || {Array} || null
 */
var getElement = function getElement(sel) {
  var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'unique';

  if (type === 'all' && sel) {
    var collection = [].concat(_toConsumableArray(scope.querySelectorAll(sel)));
    return collection.length > 0 ? collection : null;
  }
  return sel ? scope.querySelector(sel) : null;
};

export default getElement;