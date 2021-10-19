/* eslint-disable no-bitwise */
/**
 * Hash a string to a 32 bit signed int.
 * @param {string} s String to be hashed
 *
 * @memberof String
 * @returns {int} 32 bit signed int that is the hash value for the string
 */
var hash = function hash(s) {
    var hashInt = 0;
    var char = void 0;
    if (!s) return hashInt;
    // eslint-disable-next-line no-plusplus
    for (var i = 0, l = s.length; i < l; i++) {
        char = s.charCodeAt(i);
        hashInt = (hashInt << 5) - hashInt + char;
        hashInt |= 0; // Convert to 32bit integer
    }
    return hashInt;
};

export default hash;