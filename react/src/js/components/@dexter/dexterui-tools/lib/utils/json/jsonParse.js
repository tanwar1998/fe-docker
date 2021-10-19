/* eslint-disable consistent-return */

/**
 * Wrapper for JSON.parse that handles any parsing errors.
 * @param {string} objStr String representaiton of Object to parse
 * @param {func} [debug] method to call if there's an error (optional).
 *                       Method will be called with the error string.
 * @param {*} [debugStr] Error string to use in debug error if JSON.parse throws an error
 *                       Defaults to the JSON error if not specified.
 */
var jsonParse = function jsonParse(objStr, debug, debugStr) {
    if (!objStr) return;

    var obj = void 0;
    try {
        obj = JSON.parse(objStr);
    } catch (err) {
        if (debug) {
            debug(debugStr || err.toString());
        }
    }
    return obj;
};

export default jsonParse;