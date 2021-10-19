import Debug from '../../utils/debug/debug';
import getPropertySafely from '../../utils/lang/getPropertySafely';
import Analytics from '../analytics';
import IMS from '../../observers/ims';

/**
 * @global UserState
 * @desc This is an Object that sets page visitor information
 * and appends information to window.digitalData depending on
 * the signed in state, or lack thereof.
 *
 * @memberof App
 *
 * @implements Debug {Class}
 *
 */
var AnalyticsUserState = {
    debug: new Debug({ debug: false, control: 'AnalyticsUserState' }),
    options: {
        dataAttr: 'primaryUser'
    },

    /**
     * @function init
     * @desc OnLoad of script, sets up listeners to IMS events
     *
     * @memberof UserState
     * @returns {Boolean} Result of a changed digitalData value, or lack thereof.
     */
    init: function init() {
        this.setListener();
    },


    /**
     * @function setListener
     * @desc Sets up listeners for IMS to be ready, then takes the appropriate action
     *
     * @memberof UserState
     */
    setListener: function setListener() {
        var _this = this;

        var addData = function addData() {
            return IMS.isSignedIn() ? _this.loggedInData() : _this.loggedOutData();
        };

        IMS.imsReady().then(function (response) {
            _this.debug.log('setListener: imsReady resolved or rejected response:', response);
            _this.debug.log('setListener: is user signed in?:', IMS.isSignedIn());
            addData();
        }).catch(function (err) {
            _this.debug.error('setListener: IMS.imsReady has an error', err);
            _this.debug.log('setListener: Timed out or rejected, but is the user signed in?:', IMS.isSignedIn());
            addData();
        });
    },


    /**
     * @function loggedOutData
     * @desc Sets up digitalData set for the logged out user state
     *
     * @memberof UserState
     */
    loggedOutData: function loggedOutData() {
        var data = {
            primaryProfile: {
                profileInfo: {
                    authState: 'loggedOut',
                    entitlementCreativeCloud: 'unknown',
                    entitlementStatusCreativeCloud: '',
                    profileID: ''
                }
            }
        };

        Analytics.addToDigitalData(this.options.dataAttr, data);
        this.debug.log('loggedOutData: Setting data for the logged out state:', window.digitalData);

        return data;
    },


    /**
     * @function loggedInData
     * @desc Sets up digitalData set for the logged in user state
     *
     * @memberof UserState
     */
    loggedInData: function loggedInData() {
        var _this2 = this;

        return IMS.getProfile().then(function (userData) {
            var entitlements = _this2.checkEntitlements(userData);
            var data = {
                primaryProfile: {
                    profileInfo: {
                        adobeIMSUserProfile: {
                            account_type: getPropertySafely(userData, 'account_type'),
                            countryCode: getPropertySafely(userData, 'countryCode'),
                            preferred_languages: getPropertySafely(userData, 'preferred_languages'),
                            serviceAccounts: getPropertySafely(userData, 'serviceAccounts'),
                            toua: getPropertySafely(userData, 'toua')
                        },
                        authState: 'authenticated', // authenticated or loggedOut
                        entitlementCreativeCloud: getPropertySafely(entitlements, 'entStatus'), // authenticated or unknown
                        entitlementStatusCreativeCloud: getPropertySafely(entitlements, 'serviceStatus'),
                        profileID: getPropertySafely(userData, 'userId')
                    }
                }
            };

            Analytics.addToDigitalData(_this2.options.dataAttr, data);
            _this2.debug.log('loggedInData: userData:', userData);
            _this2.debug.log('loggedInData: Setting data for the logged in state:', window.digitalData);
            return data;
        }).catch(function () {
            _this2.debug.error('loggedInData: Could not retrieve user data');
        });
    },
    isOrgAdmin: function isOrgAdmin(profile) {
        var roles = getPropertySafely(profile, 'roles');
        if (!roles || roles.length === 0) {
            return false;
        }

        return roles.some(function (v) {
            return v.named_role && v.named_role === 'org_admin';
        });
    },


    /**
     * @function checkEntitlements
     * @desc Checks for the User entitlements for creative cloud and their Org Admin status
     **
     * @memberof UserState
     *
     * @returns {Object} Their entitlement and service status
     */
    checkEntitlements: function checkEntitlements(profile) {
        var scope = getPropertySafely(window, 'adobeid.scope');
        var serviceAccounts = getPropertySafely(profile, 'serviceAccounts') && profile.serviceAccounts.length > 0;
        var checkAdmin = this.isOrgAdmin(profile);
        var entStatus = 'notEntitled';
        var serviceStatus = 'unknown';
        if (serviceAccounts && scope && scope.indexOf('creative_cloud') > -1) {
            profile.serviceAccounts.forEach(function (v) {
                if (v.serviceCode === 'creative_cloud') {
                    serviceStatus = v.serviceStatus;

                    if (v.serviceLevel === 'CS_LVL_2') {
                        entStatus = 'paid';
                    } else if (v.serviceLevel === 'CS_LVL_1' && !checkAdmin) {
                        entStatus = 'free';
                    } else if (v.serviceLevel === 'CS_LVL_1' && checkAdmin) {
                        entStatus = 'paid-org';
                    }
                }
            });
        }

        return {
            entStatus: entStatus,
            serviceStatus: serviceStatus
        };
    }
};

export default AnalyticsUserState;