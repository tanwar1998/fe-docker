/**
* @function isObject
* @desc takes a JS type and checks if it is '[object Object]'
*
* @memberof utilities
*
* @param ele any Javascript type
*
* @returns {Boolean} true if ele '[object Object]' else it returns false
*/
var isObject = function isObject(ele) {
  return Object.prototype.toString.call(ele) === '[object Object]';
};
export default isObject;