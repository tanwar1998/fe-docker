import 'url-search-params-polyfill';
import getPropertySafely from '../utils/lang/getPropertySafely';
import { AnalyticsDigitalData } from './digitalData';
import Debug from '../utils/debug/debug';
import { Disable } from '../observers';

/**
 * @global Analytics
 * @desc This is an Object that manages Analytics settings and sub-functions
 *
 * @memberof App
 *
 * @interface AnalyticsDigitalData
 * @interface Debug
 *
 */
var Analytics = {
    debug: new Debug({ debug: false, control: 'Analytics' }),
    options: {
        launchId: 'AdobeLaunch',
        launchReady: 'dexter:AdobeLaunchReady'
    },

    /**
     * @function init
     * @desc This is the digitalData implementation for Adobe Launch.
     * For DTM please use @dexter/dexterui-tools v0.0.10 or lower.
     *
     * @memberof Analytics
     */
    init: function init() {
        window.dexter = window.dexter || {};
        window.digitalData = window.digitalData || {};
        window.dexter.Analytics = window.dexter.Analytics || {};
        this.debug.log('init: Setting window.dexter namespace, or getting previously set object:', window.dexter);

        if (getPropertySafely(window, 'dexter.DigitalData') === undefined) {
            AnalyticsDigitalData.init();
            this.debug.log('init: Ran AnalyticsDigitalData.init(). DigitalData namespace now set:', window.dexter.DigitalData);
            return true;
        }

        this.debug.error('init: window.dexter.DigitalData is already defined:\n', window.dexter);

        return false;
    },


    /**
     * @function checkAdobeLaunch
     * @interface DigitalData
     * @desc This is the bootstrap file for Adobe Launch and digitalData analytics
     *
     * @memberof Analytics
     *
     * @returns {Boolean|Promise}
     */
    checkAdobeLaunch: function checkAdobeLaunch() {
        var _this = this;

        var disabled = new Disable({ disable: false, control: 'AdobeLaunch' }).isDisabled();
        var checkAdobeLaunch = document.querySelector('[data-seed-adobelaunch]');
        var launchScript = document.getElementById(this.options.launchId);
        var checkLaunch = checkAdobeLaunch !== null && checkAdobeLaunch.getAttribute('data-seed-adobelaunch') !== '';
        var adobeLaunch = checkLaunch ? checkAdobeLaunch.getAttribute('data-seed-adobelaunch') : false;
        var isLaunchLoaded = getPropertySafely(window, 'dexter.Analytics.launchLoaded') !== undefined && window.dexter.Analytics.launchLoaded === true || launchScript !== null;

        this.debug.log('checkAdobeLaunch:', 'checkLaunch:', checkLaunch);
        this.debug.log('checkAdobeLaunch:', 'isLaunchLoaded:', isLaunchLoaded);
        this.debug.log('checkAdobeLaunch:', 'disabled:', disabled);

        if (adobeLaunch && !isLaunchLoaded && !disabled) {
            if (getPropertySafely(window, 'dexter.Analytics')) {
                window.dexter.Analytics.launchLoaded = true;
                this.debug.log('checkAdobeLaunch:', 'window.dexter.Analytics.launchLoaded set to true:', window.dexter.Analytics.launchLoaded);
            }

            return this.getAdobeLaunch(adobeLaunch).then(function (result) {
                _this.debug.log('checkAdobeLaunch: Adobe Launch loaded', result);
                _this.fireLaunchReadyEvent();
                return true;
            }).catch(function (err) {
                _this.debug.error('checkAdobeLaunch: Error occurred checking this.getAdobeLaunch', err);
                return new Error('Error occurred checking this.getAdobeLaunch');
            });
        }

        return false;
    },
    fireLaunchReadyEvent: function fireLaunchReadyEvent() {
        window.dispatchEvent(new Event(this.options.launchReady));
    },


    /**
     * @function getAdobeLaunch
     * @desc Ajax call to get Adobe Launch bootstrap
     *
     * @param {String} url
     *
     * @memberof Analytics
     * @returns {Promise} Promise resolution to the ajax fetch
     */
    getAdobeLaunch: function getAdobeLaunch(url) {
        var _this2 = this;

        this.debug.log('getAdobeLaunch: url:', url);

        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            document.body.appendChild(script);
            script.onload = resolve;
            script.onerror = reject;
            script.async = true;
            script.src = url;
            script.id = _this2.options.launchId;
        });
    },

    /**
     * @function addToDigitalData
     * @desc Adds a completely new value to window.digitalData
     *
     * @param {String} attr Attribute name to add to digitalData
     * @param {String|Object|Array} data value of the attr
     *
     * @implements AnalyticsDigitalData {Object}
     *
     * @memberof Analytics
     * @returns {Boolean} Result of a changed digitalData value, or lack thereof.
     */
    addToDigitalData: function addToDigitalData(attr, data) {
        var result = false;

        if (getPropertySafely(window, 'dexter.DigitalData') !== undefined) {
            result = window.dexter.DigitalData.setProp(attr, data);
            this.debug.log('addToDigitalData: Param & val added via window.dexter.DigitalData.setProp:', window.digitalData);
        } else if (getPropertySafely(AnalyticsDigitalData, 'setProp') !== undefined) {
            result = AnalyticsDigitalData.setProp(attr, data);
            this.debug.log('addToDigitalData: Param & val added via AnalyticsDigitalData.setProp:', window.digitalData);
        }

        return result;
    },


    /**
     * @function pushToDigitalData
     * @desc Adds a new array item to window.digitalData.attr
     *
     * @param {Array|String} attr Array or String attribute path to add to digitalData
     * @param {String|Object|Array} data Value of the attr
     *
     * @memberof Analytics
     * @returns {Boolean} Result of a changed digitalData value, or lack thereof.
     */
    pushToDigitalData: function pushToDigitalData(attr, data) {
        var dd = window.digitalData[attr];
        var status = false;

        this.debug.log('pushToDigitalData: attr:', attr);
        this.debug.log('pushToDigitalData: data:', data);
        this.debug.log('pushToDigitalData: dd:', dd);

        if (dd === undefined) {
            dd = [];
            this.addToDigitalData(attr, dd);
            window.digitalData[attr].push(data);
            this.debug.log('pushToDigitalData: dd was undefined, added as an array:', window.digitalData[attr]);
            status = true;
        } else if (Array.isArray(dd)) {
            window.digitalData[attr].push(data);
            this.debug.log('pushToDigitalData: dd is an Array, pushed:', attr);
            status = true;
        }

        return status;
    },


    /**
     * @function addEvent
     * @desc Add an eventInfo object to digitalData.event array
     * @param {string} eventName
     * @param {string} eventAction
     * @param {string} eventType (defaults to 'event')
     * @memberof Analytics
     * @returns {Boolean}
     */
    addEvent: function addEvent() {
        var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var eventAction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var eventType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'event';

        this.debug.log('addEvent: args: eventName:', eventName, 'eventAction:', eventAction, 'eventType:', eventType);
        window.digitalData.event = window.digitalData.event || [];

        var eventInfo = {
            eventName: eventName,
            eventAction: eventAction,
            eventType: eventType
        };

        this.debug.log('addEvent: Current state of window.digitalData.event:', Object.assign({}, window.digitalData.event));
        this.debug.log('addEvent: Adding eventInfo:', eventInfo);

        window.digitalData.event.push({ eventInfo: eventInfo });
        this.debug.log('addEvent: New state of window.digitalData.event:', Object.assign({}, window.digitalData.event));

        return true;
    },


    /**
     * @function sendEventAndTrigger
     * @desc Add an eventInfo object to event array.
     *
     * @param {string} eventName
     * @param {string} eventAction
     * @param {string} eventType
     * @param {boolean} clearEvents[true] Whether to clear the event array after triggering
     *
     * @implements AnalyticsDigitalData {Object}
     *
     * @memberof Analytics
     * @returns {Boolean}
     */
    sendEventAndTrigger: function sendEventAndTrigger() {
        var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var eventAction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var eventType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'event';
        var clearEvents = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

        this.debug.log('sendEventAndTrigger: args: eventName:', eventName, '\neventAction:', eventAction, '\neventType:', eventType, '\nclearEvents:', clearEvents);
        if (eventType === 'pageload') {
            this.debug.error('sendEventAndTrigger: Found invalid event:', eventType, ', we prevented this from running multiple times');
            return false;
        }

        this.addEvent(eventName, eventAction, eventType);

        if (getPropertySafely(window, 'dexter.DigitalData.satelliteTrack')) {
            window.dexter.DigitalData.satelliteTrack(eventType);
        }

        if (clearEvents) {
            this.debug.log('sendEventAndTrigger: clearEvents is true, sending this.clearEvents()');
            return this.clearEvents();
        }

        return false;
    },


    /**
     * @function clearEvents
     * @desc Reset digitalData.event to empty array
     *
     * @memberof Analytics
     * @returns {Boolean}
     */
    clearEvents: function clearEvents() {
        // Had to move this to digitalData.js, keeping this for legacy users calling it directly
        var clear = getPropertySafely(window, 'dexter.DigitalData.clearEvents');

        if (typeof clear === 'function') {
            return clear();
        }

        return false;
    }
};

export default Analytics;