/**
 *  @function filter
 *
 * @description implements a curry version of the filter function
 * @param pred a function that test whether the current element should be included
 * in the array
 * @param arr an array of elements
 * @return {Array} of elements that pass a predicate function
 */

/* eslint-disable no-confusing-arrow */
var filter = function filter(pred) {
  return function (arr) {
    return arr.reduce(function (acc, ele) {
      return pred(ele) ? acc.concat([ele]) : acc;
    }, []);
  };
};
export default filter;