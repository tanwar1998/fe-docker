/**
 * Replace all spaces in the string with underscores.
 * @param {string} str with spaces
 *
 * @memberof String
 * @returns {string} str with underscores
 */
export default function spaceToUnderscore(str) {
    if (str && typeof str === 'string') {
        return str.replace(/ /g, '_');
    }
    return str;
}