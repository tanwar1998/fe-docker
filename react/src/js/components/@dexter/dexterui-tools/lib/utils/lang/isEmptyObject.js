var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import isNullish from './isNullish';

/**
 * @description Checks if an object is empty.
 * @method isEmptyObject
 * @param {Object} obj - The object to check for properties.
 * @return {Boolean} <em>True</em> if the object doesn't have any own properties.
 *                   Otherwise it returns <em>false</em>.
 */
export default function isEmptyObject(obj) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || isNullish(obj)) {
        return true;
    } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !Array.isArray(obj)) {
        return Object.keys(obj).length <= 0;
    } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && Array.isArray(obj)) {
        return obj.length <= 0;
    }
    return false;
}