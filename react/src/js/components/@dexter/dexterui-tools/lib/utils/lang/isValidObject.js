import isObject from './isObject';
import isEmptyObject from './isEmptyObject';

/**
* @function isValidObject
* @desc checks if an element is an object and it is not empty
*
* @memberof utilities
*
* @param ele any Javascript type
*
* @returns {Boolean} true if ele '[object Object]' and not {} else it returns
* false
*/
var isValidObject = function isValidObject(ele) {
  return isObject(ele) && !isEmptyObject(ele);
};
export default isValidObject;