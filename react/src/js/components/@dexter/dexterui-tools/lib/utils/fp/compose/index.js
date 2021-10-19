/**
 * @function compose
 * @description process any amount of functions starting from right to left,
 * just like its mathematical equivalent: f(g(x)). Data, x, and the tranformation
 * , fns, is provided to compose.
 *
 * @param {fns} functions that take 1 argument at a time, aka, unary function.
 * @param {x} any type of data.
 *
 * @returns {x} any type
 */

var compose = function compose() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (x) {
    return fns.reduceRight(function (acc, fn) {
      return fn(acc);
    }, x);
  };
};
export default compose;