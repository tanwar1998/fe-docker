var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Debug from '../../utils/debug/debug';
import Analytics from '../analytics';
import { Disable } from '../../observers';

/**
 * @global AnalyticsCurrency
 * @desc This is an Object that checks for a param related to pricing, and if it exists,
 * adds the values to window.digitalData
 *
 * @memberof App
 *
 * @implements Analytics {Object}
 * @implements Debug {Class}
 *
 */
var AnalyticsCurrency = {
    /**
     * @function init
     * @desc OnLoad of script, sets digitalData.currency
     *
     * @memberof AnalyticsCurrency
     * @returns {Boolean} Result of a changed digitalData value, or lack thereof.
     */
    init: function init() {
        this.debug = new Debug({ debug: false, control: 'AnalyticsCurrency' });
        var disabled = new Disable({ disable: false, control: 'AnalyticsCurrency' });
        this.disabled = disabled.isDisabled();

        if (this.disabled) {
            this.debug.log('init: AnalyticsCurrency is disabled:', this.disabled);
            return false;
        }

        var _ref = this.getCurrency() || {},
            code = _ref.code;

        if (!code) {
            this.debug.log('init: No pricing found, or its disabled. code:', code, 'this.disabled:', this.disabled);
            return false;
        }

        var data = { code: code };
        var attr = 'currency';

        this.debug.log('init: Valid config data, adding to DigitalData', attr, ':', data);
        window.digitalData = window.digitalData || {};

        return Analytics.addToDigitalData(attr, data);
    },


    /**
     * @function getCurrency
     * @desc Checks for pricing objects on the page and returns the currencyCode value if it exists
     *
     * @memberof AnalyticsCurrency
     * @returns {Object|Boolean} Returns {code: code} if values are set, otherwise Boolean{false}
     */
    getCurrency: function getCurrency() {
        var _this = this;

        var _ref2 = document.querySelector('[data-analytics-productinfo]') || {},
            _ref2$dataset = _ref2.dataset;

        _ref2$dataset = _ref2$dataset === undefined ? {} : _ref2$dataset;
        var analyticsProductinfo = _ref2$dataset.analyticsProductinfo;

        var currency = { code: '' };

        this.debug.log('getCurrency: currency node:', analyticsProductinfo);
        if (!analyticsProductinfo) return false;

        var info = JSON.parse(analyticsProductinfo);
        this.debug.log('getCurrency: info:', info);

        return info.reduce(function (acc, v) {
            _this.debug.log('getCurrency: each currencyCode:', v);
            return Object.prototype.hasOwnProperty.call(v, 'currencyCode') ? _extends({}, acc, { code: v.currencyCode }) : acc;
        }, currency);
    }
};

export default AnalyticsCurrency;