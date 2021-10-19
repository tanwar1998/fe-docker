var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import 'url-search-params-polyfill';
import 'url-polyfill';
import Debug from '../debug/debug';

/**
 * @func objMaker
 * @desc Private utility for converting sets of arrays into an object
 *
 */
var objMaker = function objMaker(entries) {
    var result = {};
    entries.forEach(function (entry) {
        result[entry[0]] = entry[1];
    });
    return result;
};

/**
 * @func getHashArr
 * @desc Private utility for turning hash values into an array
 *
 */
var getHashArr = function getHashArr() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        hash = _ref.location.hash;

    var hashArr = hash ? hash.replace(/^#!|^#/, '').split('&') : [];
    return hashArr.reduce(function (acc, hashItem) {
        if (hashItem !== '') {
            return acc.concat([hashItem]);
        }
        return acc;
    }, []);
};

/**
 * @global Url
 * @desc Utilities for URL detection and manipulation
 *
 * @memberof String
 */
var Url = {
    debug: new Debug({ debug: false, control: 'Url' }),
    /**
     * @string pattern
     * @desc a RegEx of what a valid URL should be.
     * @memberof Url
     * @returns {Object} pattern a Regex object
     */
    /* eslint-disable-next-line */
    pattern: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/gi,

    /**
     * @object PARAM_CMD
     * @desc values for valid params in Url suite functions
     * @memberof Url
     * @returns {Object} An object of valid string values
     */
    PARAM_CMD: {
        APPEND: 'append',
        DELETE: 'delete',
        SET: 'set'
    },

    /**
     * @object PARAM_TYPES
     * @desc values for valid params in getParams()
     * @memberof Url
     * @returns {Object} An object of valid string values
     */
    PARAM_TYPES: {
        INTERFACE: 'interface',
        ENTRIES: 'entries',
        KEYS: 'keys',
        VALUES: 'values',
        STRING: 'string',
        OBJECT: 'object'
    },

    /**
     * @func isValidUrl
     * @desc Checks for a valid URL string.
     * @param str {String} A string to verify as a URL.
     * @memberof Url
     * @returns {Boolean} True or False based on the
     * condition of the string being detected as a URL.
     */
    isValidUrl: function isValidUrl(str) {
        var result = null;
        if (str && typeof str === 'string') {
            result = str.match(this.pattern);
        }
        return result !== null;
    },


    /**
     * @func getParams
     * @desc Returns a list of URL params based on the `type` you ask for
     *
     * @param {string} link url to check, defaults to window.location.href
     * @param {string} type Type of data you want back. Default is 'interface' if omitted.
     * ex with URL: https://example.com?foo=1&bar=2
     *
     * 'interface': {Interface} Returns the URLSearchParams Interface
     * 'object': {Object} An object with param name, param value pairs {foo: '1', bar: '2'}
     * 'entries': {URLSearchParams Iterator} An Array of arrays [[foo, 1], [bar, 2]]
     * 'values': {Array} An array of values to loop through
     * 'keys': {Array} An array of keys to loop through
     * 'string': {String} Full url param string, omitting the ? 'foo=1&bar=2'
     *
     * @param {string} base url to use if link is relative, defaults to window.location.href
     * @memberof Url
     *
     * @returns {iterator|object|array|string} An array, iterator or string of URL params,
     * based on `type` given
     */
    getParams: function getParams() {
        var link = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.href;
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.PARAM_TYPES.INTERFACE;
        var base = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window.location.href;

        this.debug.log('getParams: link', link, 'type:', type);
        var url = link.indexOf('http') === 0 ? new URL(link) : new URL(link, base);
        var params = url.searchParams;
        this.debug.log('getParams: params', params);
        var val = void 0;

        switch (type) {
            case this.PARAM_TYPES.ENTRIES:
                {
                    val = params.entries();
                    break;
                }
            case this.PARAM_TYPES.KEYS:
                {
                    val = [].concat(_toConsumableArray(params.keys()));
                    break;
                }
            case this.PARAM_TYPES.VALUES:
                {
                    val = [].concat(_toConsumableArray(params.values()));
                    break;
                }
            case this.PARAM_TYPES.STRING:
                {
                    val = params.toString();
                    break;
                }
            case this.PARAM_TYPES.OBJECT:
                {
                    val = objMaker([].concat(_toConsumableArray(params.entries())));
                    break;
                }
            case this.PARAM_TYPES.INTERFACE:
            default:
                {
                    val = params;
                    break;
                }
        }

        return val;
    },


    /**
     * @func getPassThruParams
     * @desc Get a query string of parameters defined in paramArr from url
     *
     * @param {array} paramArr whitelist array of parameters to fetch
     * @param {string} url to get parameters from
     * @memberof Url
     *
     * @returns {string} url query string of whitelisted params
     */
    getPassThruParams: function getPassThruParams(paramArr) {
        var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location.href;

        if (paramArr && paramArr.length && Array.isArray(paramArr)) {
            var params = new URL(url).searchParams;
            var paramArrLowerCase = paramArr.map(function (p) {
                return typeof p === 'string' ? p.toLowerCase() : p;
            });
            // Remove any params not in paramArr
            Array.from(params.keys()).forEach(function (key) {
                if (typeof key === 'string' && !paramArrLowerCase.includes(key.toLowerCase())) {
                    params.delete(key);
                }
            });

            return params.toString();
        }
        return '';
    },


    /**
     * @func hasParam
     * @desc Does the given link contain the paramName
     *
     * @param {string} link url to check
     * @param {string} param param name to check in link
     * @memberof Url
     *
     * @returns {boolean} whether the link contains the paramName
     */
    hasParam: function hasParam(link, param) {
        return new URL(link).searchParams.has(param);
    },


    /**
     * @func updateParam
     * @desc Modify / Append / Delete url parameters.
     * Also see the PARAM_CMD object to specify the variant
     *
     * @param {string} link url to modify
     * @param {string} param parameter name
     * @param {string|null} paramVal parameter value (ignored if PARAM_CMD.DELETE, pass 'null')
     * @param {string} cmd URLSearchParams method to invoke.
     * One of set|append|delete. Defaults to set.
     * @memberof Url
     *
     * @returns {string} updated url
     */
    updateParam: function updateParam(link, param, paramVal) {
        var cmd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.PARAM_CMD.SET;

        var url = new URL(link);
        var searchParams = url.searchParams;

        if (cmd === this.PARAM_CMD.APPEND) {
            searchParams.append(param, paramVal);
        } else if (cmd === this.PARAM_CMD.SET) {
            searchParams.set(param, paramVal);
        } else if (cmd === this.PARAM_CMD.DELETE) {
            searchParams.delete(param);
        }
        return '' + url.origin + url.pathname + '?' + searchParams.toString() + url.hash;
    },


    /**
     * @func addParams
     * @desc Add parameters to a URL if they aren't already on the URL
     *
     * @param {string} link url to modify
     * @param {string} url to get params from. Defaults to window.location.href
     * @memberof Url
     *
     * @returns {string} updated url
     */
    addParams: function addParams(link) {
        var _this = this;

        var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location.href;

        var urlParams = this.getParams(url);
        var linkParams = this.getParams(link);
        var params = [].concat(_toConsumableArray(urlParams.keys()));
        var updatedLink = link;

        if (!params.length) return url;

        params.forEach(function (param) {
            if (!linkParams.has(param)) {
                // eslint-disable-next-line max-len
                updatedLink = _this.updateParam(updatedLink, param, urlParams.get(param), _this.PARAM_CMD.APPEND);
            }
        });

        return updatedLink;
    },
    searchHash: function searchHash(quryStr) {
        var hashed = getHashArr(window);
        return hashed.reduce(function (acc, item) {
            if (item === quryStr) {
                return item;
            }
            return acc;
        }, '');
    },
    getSearchQueryObject: function getSearchQueryObject(_ref2) {
        var search = _ref2.location.search;

        var searchArray = search.replace(/\?/g, '').replace(/^&/, '').replace(/=/g, ':').split('&');

        return searchArray.reduce(function (acc, query, index) {
            var _query$split = query.split(':'),
                _query$split2 = _slicedToArray(_query$split, 2),
                queryId = _query$split2[0],
                queryValue = _query$split2[1];

            if (queryId && queryValue) {
                acc[queryId] = queryValue;
                acc.length = index + 1;
            }

            return acc;
        }, {});
    },
    getQueryParam: function getQueryParam(qury) {
        var paramsObject = this.getSearchQueryObject(window);

        if (paramsObject && paramsObject[qury]) {
            return paramsObject[qury];
        }

        return null;
    }
};

export default Url;