/**
 * Creates a debounced function that delays invoking func until after wait
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a cancel method to cancel delayed
 * func invocations.
 * @param {function} fn : function to debounce
 * @param {int} wait : number of ms to delay
 * @returns {function} : debounced function
 */
var debounce = function debounce(fn, wait) {
    var timeout = void 0;

    var cancel = function cancel() {
        if (timeout) {
            clearTimeout(timeout);
        }
    };

    // Return non-arrow func to preserve this context
    var debounceFunc = function debounceFunc() {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var functionCall = function functionCall() {
            return fn.apply(_this, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, wait);
    };

    debounceFunc.cancel = cancel;

    return debounceFunc;
};

export default debounce;