import Debug from '../../utils/debug/debug';
import getPropertySafely from '../../utils/lang/getPropertySafely';
import Url from '../../utils/string/url';

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
var IMS = {
    debug: new Debug({ debug: false, control: 'IMS' }),

    /**
     * @func imsReady
     * @desc Sets a Promise to look for IMS events.
     *
     * @memberof IMS
     * @returns {Promise} a Promise, resolved or rejected
     */
    imsReady: function imsReady() {
        var onReady = getPropertySafely(window, 'feds.utilities.imslib.onReady');
        return onReady ? onReady() : Promise.reject();
    },


    /**
     * @func isSignedIn
     * @desc Checks to see if a user is signed in
     *
     * @memberof IMS
     * @returns {Boolean} a Boolean value for if a user is signed in or not
     */
    isSignedIn: function isSignedIn() {
        var isSignedInUser = getPropertySafely(window, 'feds.utilities.imslib.isSignedInUser');
        return isSignedInUser ? isSignedInUser() : false;
    },


    /**
     * @deprecated
     * @func getUserData
     * @desc Retrieves current user profile data
     *
     * @memberof IMS
     * @returns {Promise} Promise that's resolved with user data
     */
    getUserData: function getUserData() {
        var getProfile = getPropertySafely(window, 'feds.utilities.imslib.getProfile');
        return getProfile ? getProfile() : Promise.reject();
    },


    /**
     * @func getProfile
     * @desc Retrieves current user profile data
     *
     * @memberof IMS
     * @returns {Promise} Promise that's resolved with user data
     */
    getProfile: function getProfile() {
        var getProfile = getPropertySafely(window, 'feds.utilities.imslib.getProfile');
        return getProfile ? getProfile() : Promise.reject();
    },


    /**
     * @func isOrgAdmin
     * @desc Checks to see if a user is an Admin of their Organization
     *
     * @memberof IMS
     * @returns {Promise} Promise that's resolved with user admin status
     */
    isOrgAdmin: function isOrgAdmin() {
        var _this = this;

        return this.getProfile().then(function (profile) {
            _this.debug.log('isOrgAdmin: profile', profile);
            var roles = getPropertySafely(profile, 'roles');
            if (!roles || roles.length === 0) return false;

            return roles.some(function (v) {
                return v.named_role && v.named_role === 'org_admin';
            });
        }).catch(function () {
            return false;
        });
    },


    /**
     * @function getJumpToken
     * @desc Ajax call to get an IMS jump token
     *
     *
     * @memberof IMS
     * @returns {Promise} Promise resolution to the ajax fetch
     */
    getJumpToken: function getJumpToken(jumpTokenRequest, externalParameters) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
            var getToken = getPropertySafely(window, 'feds.utilities.imslib.getJumpToken');
            if (!getToken) {
                _this2.debug.log('getJumpToken: Couldn\'t find imslib.getJumpToken');
                return reject(new Error('Couldn\'t find imslib.getJumpToken'));
            }

            _this2.debug.log('getJumpToken: calling imslib.getJumpToken');
            return getToken(jumpTokenRequest, externalParameters).then(function (jumpData) {
                var jumpURL = getPropertySafely(jumpData, 'jump');
                _this2.debug.log('getJumpToken: jump url:', jumpURL);
                if (typeof jumpURL === 'string' && !!jumpURL.length) return resolve(jumpURL);
                return reject();
            }).catch(function () {
                return reject();
            });
        });
    },


    /**
     * @function oobeCheck
     * @desc Looks at the link URL and checks for an external link to oobe.adobe.com
     * If it exists, swap the `external_link` parameter instead of the entire URL, then
     * saves the link to oobe.adobe.com for later use in this.jump()
     *
     * @memberof IMS
     *
     * @param url {String} URL to check for oobe address
     *
     * @returns {Object} {url:string, hasOobe:bool}
     * Sends back an object with the URL properly formed,
     * and a Boolean value for hasOobe to pass back to calling functions
     *
     */
    oobeCheck: function oobeCheck(url) {
        if (!Url.isValidUrl(url)) return url;
        var fullURL = new URL(url);
        var search = new URLSearchParams(fullURL.search);
        var params = '?';
        var eq = '=';
        var paramVal = 'external_url';
        var hasOobe = null;
        var result = {
            url: url,
            hasOobe: hasOobe
        };
        var searchString = decodeURIComponent(search.toString());

        this.debug.log('oobeCheck: fullURL:', fullURL);
        this.debug.log('oobeCheck: searchString:', searchString);

        if (fullURL.hostname === 'oobe.adobe.com' && search.has(paramVal)) {
            var destination = encodeURIComponent(searchString.replace('external_url=', ''));

            this.debug.log('oobeCheck: Found oobe link:', fullURL.href);
            this.debug.log('oobeCheck: destination:', destination);

            hasOobe = fullURL.origin + fullURL.pathname + params + paramVal + eq;
            this.debug.log('oobeCheck: Setting this.hasOobe for use in this.jump():', hasOobe);

            result = {
                url: destination,
                hasOobe: hasOobe
            };
        }

        return result;
    },


    /**
     * @function getEntitlementStatus
     * @desc Get the entitlement status of the current user.
     *
     * @memberof IMS
     *
     * @return {string} entitlement status string
     */
    getEntitlementStatus: function getEntitlementStatus() {
        var _this3 = this;

        var scope = getPropertySafely(window, 'adobeid.scope');
        var entStatus = 'notEntitled';

        return new Promise(function (resolve) {
            if (!scope || scope.indexOf('creative_cloud') === -1 || !_this3.isSignedIn()) {
                entStatus = 'unknown';
                resolve(entStatus);
                return;
            }

            _this3.getProfile().then(function (profile) {
                if (profile && profile.serviceAccounts && profile.serviceAccounts.length) {
                    profile.serviceAccounts.some(function (serviceAccount) {
                        if (serviceAccount.serviceCode === 'creative_cloud') {
                            if (serviceAccount.serviceLevel === 'CS_LVL_2') {
                                entStatus = 'paid';
                            } else if (serviceAccount.serviceLevel === 'CS_LVL_1') {
                                entStatus = 'free';
                            }
                            return true;
                        }
                        return false;
                    });
                }
                resolve(entStatus);
            }).catch(function () {
                return resolve(entStatus);
            });
        });
    },


    /**
     * @function getIMSClientID
     * @desc Get the client_id from the window.adobeid object
     *
     * @memberof IMS
     *
     * @return {string} Value for adobeid.client_id
     */
    getIMSClientID: function getIMSClientID() {
        var getClientID = getPropertySafely(window, 'feds.utilities.imslib.getClientID');
        return getClientID ? getClientID() : getPropertySafely(window, 'adobeid.client_id');
    }
};

export default IMS;