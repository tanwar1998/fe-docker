import jsonParse from './jsonParse';

/**
 * Get the json object from an elements data attribute
 * @param {element|node} el Element that has the data attribute
 * @param {string} dataAttr Data Attribute name (camelCased)
 * @param {func} [debug] method to call if there's an error (optional).
 *                       Method will be called with the error string.
 * @param {*} [debugStr] Error string to use in debug error if JSON.parse throws an error
 *                       Defaults to the JSON error if not specified.
 */
var getJsonObjFromElementData = function getJsonObjFromElementData(el, dataAttr, debug, debugStr) {
  return el && el.dataset[dataAttr] ? jsonParse(el.dataset[dataAttr], debug, debugStr) : undefined;
};

export default getJsonObjFromElementData;