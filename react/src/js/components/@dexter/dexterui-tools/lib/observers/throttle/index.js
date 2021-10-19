/**
 * @file throttle/index.js
 * @desc Throttle / Debounce hybrid utility method
 * @author augur
 * @since 09/15/17 16:20
 *
 * @exports throttle
 */

/**
 * @func thottle
 * @desc Based on Timeout MS slows occurence of method calls
 *
 * @memberof Utilities
 *
 * @param delay {Integer} in MS
 * @param throttled
 * @param opts {Object} confs for the callback
 * @param args
 * @example
 * window.addEventListener('scroll', this.utils.throttle(250, method, {options}))
 *
 * @returns {Lambda}
 */

var throttle = function throttle() {
    for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        args[_key - 3] = arguments[_key];
    }

    var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 250;
    var throttled = arguments[1];
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var previousCall = null;
    return function () {
        var time = new Date().getTime();
        var timeout = null;

        if (!previousCall || time - previousCall >= delay) {
            previousCall = time;
            throttled.apply(null, [opts, args]);
            timeout = setTimeout(function () {
                throttled.apply(null, [opts, args]);
                timeout = null;
            }, delay * 2);
        }
    };
};

export default throttle;