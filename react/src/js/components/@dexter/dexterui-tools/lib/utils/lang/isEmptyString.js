import isNull from './isNull';
import getStringSafely from './getStringSafely';

/**
 * @method isEmptyString
 * @desc Checks to see if a string provided is empty or not.
 *
 * @memberof Lang
 *
 * @param string {String} string to be tested
 * @returns {Boolean} will return true if thing is null, undefined, NaN.
 *                    Otherwise it will return false.
 */
export default function isEmptyString(string) {
    if (!isNull(getStringSafely(string))) {
        return getStringSafely(string) === '';
    }
    return false;
}