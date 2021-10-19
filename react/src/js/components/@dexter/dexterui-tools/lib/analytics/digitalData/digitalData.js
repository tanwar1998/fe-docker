import getPropertySafely from '../../utils/lang/getPropertySafely';
import AnalyticsComponent from '../component';
import AnalyticsPage from '../page';
import AnalyticsIMS from '../ims';
import AnalyticsUserState from '../userState';
import AnalyticsCurrency from '../currency';
import Debug from '../../utils/debug/debug';
import deepMerge from '../../utils/fp/deepMerge';

var hasAdobeLaunchLoaded = function hasAdobeLaunchLoaded() {
    return window.digitalData && typeof window.digitalData._snapshot === 'function';
};
var ready = function ready() {
    return window._satellite && hasAdobeLaunchLoaded();
};

export var AnalyticsDigitalData = {
    debug: new Debug({ debug: false, control: 'DigitalData' }),
    queue: [],
    init: function init() {
        if (getPropertySafely(window, 'dexter.DigitalData') === undefined) {
            this.debug.log('init: Setting up Analytics...');
            this.setDigitalData();
            this.setAnalyticsListener();
            return true;
        }

        this.debug.log('init: window.dexter.DigitalData already set, skipping setup.\n', window.dexter.DigitalData);
        return false;
    },


    /**
     * Creates the digitalData object if not available already.
     */
    setDigitalData: function setDigitalData() {
        window.dexter = window.dexter || {};
        window.dexter.DigitalData = this;
        window.dexter.DigitalDataLaunch = this; // Legacy safety
        window.digitalData = window.digitalData || {};
        window.dexter.DigitalData.debug.log('setDigitalData: DigitalData namespaces set.\nwindow.digitalData:\n', window.digitalData, '\nwindow.dexter.DigitalData:\n', window.dexter.DigitalData);
        return true;
    },


    /**
     * Call _satellite.track
     */
    satelliteTrack: function satelliteTrack() {
        var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'event';

        // Add new events to the queue
        this.debug.info('satelliteTrack: New event found:', event, 'adding to queue:', window.dexter.DigitalData.queue);

        window.dexter.DigitalData.merge(event);
        window.dexter.DigitalData.checkSatellite(event);

        return true;
    },
    checkSatellite: function checkSatellite(event) {
        var _this = this;

        if (ready()) {
            this.debug.log('checkSatellite: _satellite ready, processing queue');
            window.dexter.DigitalData.processQueue();
        } else if (event === 'pageload') {
            // Repeat the check until it's ready, but only once,
            // hence the check for only the `pageload` event
            setTimeout(function () {
                _this.debug.log('checkSatellite: _satellite NOT ready, checking again...', '\nwindow._satellite', window._satellite, '\nhasAdobeLaunchLoaded', hasAdobeLaunchLoaded());
                window.dexter.DigitalData.checkSatellite(event);
            }, 200);
        }
    },


    /**
     * @function merge
     * @desc Takes a snapshot of the window.digitalData object as it was when the event was
     * triggered, then adds all the data to the event queue.
     *
     * @memberof DigitalData
     */
    merge: function merge(event) {
        var snapshot = Object.assign({}, window.digitalData);
        this.debug.info('merge: Current digitalData snapshot:', snapshot);

        window.dexter.DigitalData.queue.push({ event: event, digitalData: snapshot });
    },


    /**
     * @function processQueue
     * @desc Loops through the queued up events, combines queued digitalData with the current
     * digitalData object and then sends it to _satellite.track()
     *
     * @memberof DigitalData
     */
    processQueue: function processQueue() {
        var _this2 = this;

        this.debug.log('processQueue: _satellite is ready, sending queued events:', window.dexter.DigitalData.queue);

        window.dexter.DigitalData.queue.forEach(function (queuedEvent) {
            var mergedData = deepMerge(window.digitalData._snapshot(), queuedEvent.digitalData);
            var DigitalDataInstance = new window.DigitalData(mergedData);

            _this2.debug.log('processQueue: sending queued event data:', queuedEvent, '\nmergedData:', mergedData, '\nDigitalDataInstance:', DigitalDataInstance);

            window._satellite.track(queuedEvent.event, {
                digitalData: DigitalDataInstance
            });
        });

        // Empty the queue after sending all queued events
        window.dexter.DigitalData.queue = [];
    },


    /**
     * @function setAnalyticsListener
     * @desc Checks if both Adobe Launch and all DXF's have
     * loaded before firing specific Analytics items. Set's up listeners to recheck
     * if they are not loaded on first check.
     *
     * @memberof DigitalData
     */
    setAnalyticsListener: function setAnalyticsListener() {
        var _this3 = this;

        var readyCheck = this.readyCheck();
        this.debug.log('setAnalyticsListener: Are both Adobe Launch and all DXFs loaded?', readyCheck);

        if (!readyCheck) {
            window.addEventListener('dexter:AdobeLaunchReady', function () {
                _this3.debug.log('setAnalyticsListener: Launch loaded via event listener: dexter:AdobeLaunchReady, checking the readyCheck()');
                _this3.readyCheck();
            });
            window.addEventListener('dexter:DXFsReady', function () {
                _this3.debug.log('setAnalyticsListener: Heard dexter:DXFsReady event, checking the readyCheck()');
                _this3.readyCheck();
            });
        }
    },


    /**
     * @function readyCheck
     * @desc Checks if both Adobe Launch and all DXF's have
     * loaded before firing specific Analytics items.
     *
     * @memberof DigitalData
     *
     * @returns {Boolean}
     */
    readyCheck: function readyCheck() {
        var isReady = this.isReady();
        if (isReady) {
            this.debug.log('readyCheck: ready confirmed, running runAnalyticsEvents()', isReady);
            this.runAnalyticsEvents();
            return true;
        }

        this.debug.warn('readyCheck: Not ready yet', isReady);

        return false;
    },


    /**
     * @function isReady
     * @desc Checks if both Adobe Launch and all DXF's have
     * loaded and set their global properties
     *
     * @memberof DigitalData
     *
     * @returns {Boolean|String} True or False values from checking
     * window.dexter.Analytics.launchLoaded and window.dexter.dxf.ready,
     * otherwise returns `undefined`
     */
    isReady: function isReady() {
        return getPropertySafely(window, 'dexter.Analytics.launchLoaded') && getPropertySafely(window, 'dexter.dxf.ready');
    },


    /**
     * @function runAnalyticsEvents
     * @desc Fires specific Analytics items.
     *
     * @memberof DigitalData
     */
    runAnalyticsEvents: function runAnalyticsEvents() {
        this.debug.log('runAnalyticsEvents: Running runAnalyticsEvents()');
        AnalyticsPage.init();
        AnalyticsIMS.init();
        AnalyticsUserState.init();
        AnalyticsCurrency.init();
        this.controlPageLoad();
    },


    /**
     * @function checkControl
     * @desc Checks for Dexter and Project level overrides to see
     * who should run the _satellite.track('pageload') event
     *
     * @memberof DigitalData
     */
    checkControl: function checkControl() {
        var dexterControl = getPropertySafely(window, 'marketingtech.adobe.launch.controlPageLoad') === true;
        var projectControl = getPropertySafely(window, 'dexter.Analytics.controlPageLoad') === true;
        this.debug.log('checkControl: Checking `pageload` event overrides. dexterControl:', dexterControl, 'projectControl', projectControl);

        // Run the `pageload` event here if Dexter says we should,
        // and Projects don't want control themselves.
        if (dexterControl && !projectControl) {
            this.debug.log('checkControl: `pageload` event controlled by Dexter, sending to satelliteTrack:', dexterControl && !projectControl);
            this.satelliteTrack('pageload');
        } else if (!dexterControl) {
            this.debug.log('checkControl: dexterControl returned', dexterControl, 'letting Adobe Launch control `pageload` event');
        } else {
            this.debug.log('checkControl: dexterControl && projectControl returned', dexterControl && projectControl, 'letting consuming projects control `pageload` event');
        }
    },


    /**
     * @function controlPageLoad
     * @desc Checks for Dexter and Project level overrides to see
     * who should run the _satellite.track('pageload') event
     *
     * @memberof DigitalData
     */
    controlPageLoad: function controlPageLoad() {
        var _this4 = this;

        if (getPropertySafely(window, 'dexter.dxf.ready')) {
            this.debug.log('controlPageLoad: Found window.dexter.dxf.ready:', window.dexter.dxf.ready, 'Running check()');
            this.checkControl();
        } else {
            window.addEventListener('dexter:DXFsReady', function () {
                _this4.debug.log('controlPageLoad:', 'All DXFs loaded via dexter:DXFsReady event. Running check()');
                _this4.checkControl();
            });
        }
    },


    /**
     * @function setProp
     * @desc Adds a generic function to add objects and values to window.digitalData
     * but keep it managed by @dexterui-tools
     *
     * @param {String} prop Name of the new prop being added to window.digitalData
     * @param {String|Object|Array|Function} val Takes any type for a value
     *
     * @memberof DigitalData
     * @returns {Boolean} Result of a changed or not
     */
    setProp: function setProp(prop, val) {
        if (prop && val && typeof prop === 'string') {
            window.digitalData[prop] = val;
            return true;
        }

        return false;
    },


    /**
     * @function getProp
     * @desc Get a digitalData property value
     *
     * @param {string} prop prop path as string
     *
     * @memberof DigitalData
     * @returns {Object|Function|String} Returns the value of the prop, which can be almost any type
     */
    getProp: function getProp(prop) {
        return getPropertySafely(window.digitalData, prop);
    },


    /**
     * @function setComponentInfo
     * @desc Get a digitalData property value
     *
     * @param {Object} obj data to set for digitalData.component
     * @param {String} id Component ID
     *
     * @memberof DigitalData
     * @returns {Boolean} value of success of failure from AnalyticsComponent.setComponentInfo
     */
    setComponentInfo: function setComponentInfo(obj, id) {
        return AnalyticsComponent.setComponentInfo(obj, id);
    },


    /**
     * @function clearEvents
     * @desc Reset digitalData.event to empty array
     *
     * @memberof DigitalData
     * @returns {Boolean}
     */
    clearEvents: function clearEvents() {
        window.dexter.DigitalData.debug.log('clearEvents: Clearing what was in window.digitalData.event:', Object.assign({}, window.digitalData.event));
        window.digitalData.event = [];
        window.dexter.DigitalData.debug.log('clearEvents: window.digitalData.event is now cleared:', Object.assign({}, window.digitalData.event));
        return true;
    }
};

var DigitalData = getPropertySafely(window, 'dexter.DigitalData') ? window.dexter.DigitalData : AnalyticsDigitalData;

export default DigitalData;