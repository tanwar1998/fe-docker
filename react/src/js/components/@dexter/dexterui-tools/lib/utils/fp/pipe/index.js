/**
 * @function pipe
 * @description process any amount of functions starting left to right
 *
 * @param {fns} functions These functions are usually unary functions, taking one
 * argument only, but functions with multiple arities could work.
 * @param {x} any type.
 *
 * @returns {x} any type
 */

var pipe = function pipe() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (x) {
    return fns.reduce(function (acc, fn) {
      return fn(acc);
    }, x);
  };
};
export default pipe;