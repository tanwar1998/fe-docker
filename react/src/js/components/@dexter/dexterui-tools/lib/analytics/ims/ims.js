import Debug from '../../utils/debug/debug';
import getPropertySafely from '../../utils/lang/getPropertySafely';
import Analytics from '../analytics';

/**
 * @global IMS
 * @desc This is an Object that interacts with imslib to check
 * user profiles, logged in state and more.
 *
 * @memberof App
 *
 * @implements Debug {Class}
 *
 */
var AnalyticsIMS = {
    debug: new Debug({ debug: false, control: 'AnalyticsIMS' }),
    /**
     * @function init
     * @desc OnLoad of script, sets generic page data
     *
     * @memberof AnalyticsPage
     * @returns {Boolean} Result of a changed digitalData value, or lack thereof.
     */
    init: function init() {
        window.digitalData = window.digitalData || {};
        return this.setDigitalDataClientId();
    },


    /**
     * @function setDigitalDataClientId
     * @desc OnLoad of script, sets generic page data
     *
     * @memberof AnalyticsIMS
     * @returns {Boolean} Result of a changed digitalData value, or lack thereof.
     */
    setDigitalDataClientId: function setDigitalDataClientId() {
        var data = {
            client: {
                clientID: this.getIMSClientID()
            }
        };

        return Analytics.addToDigitalData('ims', data);
    },
    getIMSClientID: function getIMSClientID() {
        var getClientID = getPropertySafely(window, 'feds.utilities.imslib.getClientID');
        return getClientID ? getClientID() : getPropertySafely(window, 'adobeid.client_id');
    }
};

export default AnalyticsIMS;