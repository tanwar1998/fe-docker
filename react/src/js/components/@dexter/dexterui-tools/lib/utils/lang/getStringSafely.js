var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import isNullish from './isNullish';

/**
 * @method getStringSafely
 * @desc A safer version of toString(). To avoid getting 'NaN' or other
 * non-real string values. It will coerce strings out of booleans,
 * numbers, objects with their own toString() function, and of course
 * strings.
 *
 * @memberof Lang
 *
 * @param thing {Boolean|String|Object} thing to be converted to string.
 * @returns {string|null} the coerced string, null if unable.
 */
export default function getStringSafely(thing) {
    var type = typeof thing === 'undefined' ? 'undefined' : _typeof(thing);

    // it is already a string, return it.
    if (type === 'string') {
        return thing;
    }

    // if it is nullish, return null.
    if (isNullish(thing)) {
        return null;
    }

    // convert numbers and booleans to strings.
    if (type === 'number' || type === 'boolean') {
        return String(thing);
    }

    // it is an object with it's own toString implementation
    // hopefully it is meaningful.
    if (type === 'object' && Object.prototype.hasOwnProperty.call(thing, 'toString') && typeof thing.toString === 'function') {
        return thing.toString();
    }

    // no telling what it is, return null.
    return null;
}