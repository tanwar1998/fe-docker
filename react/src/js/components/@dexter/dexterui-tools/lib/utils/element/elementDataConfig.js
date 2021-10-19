function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/**
 * @file elementDataConfig.js
 * @desc Organizes dataconfig of element into a structured relationship of "controls" and "configs"
 * @author augur
 * @since 06/25/18 16:20
 *
 * @exports dataConf
 * @exports dataConfMethodInit
 */

/**
  * @func checkForControlPresence
  * @desc checks to see if data config has other poperties associated with it
  *
  * @memberof elementDataConfig
  *
  * @param str {string} representing the "middle" of data-control-property
  * @param arr {array} representing the keys of all the data properties for an element
  *
  * @returns {Boolean}
  */
function checkForControlPresence(str, arr) {
    return arr.reduce(function (acc, prop) {
        var reg = new RegExp(str, 'g');
        var check = reg.test(prop);
        var match = prop === str;

        if (check && !match) return check;
        return acc;
    }, false);
}

/**
 * @func dataConf
 * @desc see file description
 *
 * @memberof Utilities
 *
 * @param { dataset } {Object} from HTML Eleemnt
 * @example
 * <div data-faas="true" data-faas-cid="65" data-ec=true>
 * </div>
 *
 * dataConf(div)
 *
 * returns {faas:{ cid: "65"}, ec: true}
 * @returns {Object} || undefined
 */
export function dataConf() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        dataset = _ref.dataset;

    var dataKeys = dataset ? Object.keys(dataset) : [];

    if (dataKeys.length === 0) return {};

    return dataKeys.reduce(function (acc, prop) {
        var _prop$split = prop.split(/(?=[A-Z])/),
            _prop$split2 = _toArray(_prop$split),
            control = _prop$split2[0],
            config = _prop$split2[1],
            modifiers = _prop$split2.slice(2);

        var confFix = config ? config.toLowerCase().concat(modifiers.join('')) : '';
        var controlGroup = checkForControlPresence(control, dataKeys);

        if (!acc[control] && controlGroup) acc[control] = {};

        if (config && controlGroup) {
            acc[control][confFix] = dataset[prop];
            return acc;
        }

        if (!config && controlGroup && !!dataset[prop] && typeof dataset[prop] === 'string') {
            acc[control].id = dataset[prop];
            return acc;
        }

        if (!config && !controlGroup) {
            acc[control] = dataset[prop];
            return acc;
        }

        return acc;
    }, {});
}

export function dataConfMethodInit(targ, conf, context) {
    var keys = Object.keys(conf) || [];

    return keys.reduce(function (acc, key) {
        if (context[key] && typeof context[key] === 'function') return context[key](targ, conf[key]);

        return acc;
    }, null);
}