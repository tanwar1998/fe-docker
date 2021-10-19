/**
 * @function asyncPipe
 * @description process any amount of functions asynchronously starting left to right
 * or top / down
 *
 * @param {fns} functions These functions are usually unary functions, taking one
 * argument only, but functions with multiple arities could work.
 * @param {x} any type.
 *
 * @returns {promise}
 */

var asyncPipe = function asyncPipe() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return fns.reduce(function (f, g) {
    return function (x) {
      return f(x).then(g);
    };
  });
};
export default asyncPipe;