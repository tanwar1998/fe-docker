function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @function map
 * @description implements a curry version of the map function
 *
 * @param xform a transformation function to be applied to every element
 * @param arr an array
 *
 * @return {Array} of elements after applying a function to each one.
 */

/* eslint-disable no-confusing-arrow */
var map = function map(xform) {
  return function (arr) {
    return arr.reduce(function (acc, ele) {
      return [].concat(_toConsumableArray(acc), [xform(ele)]);
    }, []);
  };
};
export default map;