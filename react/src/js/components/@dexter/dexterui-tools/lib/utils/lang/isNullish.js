var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @method isNullish
 * @desc More specific than falsy. '', 0, and -0 will evaluate
 * as false so that functions that want to validly return
 * these can do so, and be tested for problematic response.
 *
 * @memberof Lang
 *
 * @param thing {Object} thing to be tested
 * @returns {Boolean} will return true if thing is null, undefined, NaN.
 *                    Otherwise it will return false.
 */
export default function isNullish(thing) {
    var type = typeof thing === 'undefined' ? 'undefined' : _typeof(thing);
    return type === 'undefined' || type === 'object' && thing === null || type === 'number' && isNaN(thing) || type === 'string' && thing === '';
}