var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @file disable.js
 * @desc A feature flag tool to disable a script or a setting via a URL param
 * @author jisutton
 * @since 10/30/18 16:20
 * @func Disable
 * @constructs Base.Flags.Disable
 * @exports class Disable
 */

import 'url-search-params-polyfill';
import Debug from '../../utils/debug/debug';
import isEmptyString from '../../utils/lang/isEmptyString';

var Disable = function () {
    /**
     * @func constructor
     * @desc initializing Disable constructor
     * @memberof Disable
     * @param properties.disable {Boolean} Default file-based trigger for
     * turning this on or off on instantiation
     * @param properties.control {String} Name given to this calling script so it
     * can be used as a URL param
     */
    function Disable() {
        var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Disable);

        this.param = 'dexter:disable';
        this.urlMode = 'Enabling URL Disable mode for';
        this.fileMode = 'Enabling File Disable mode for';
        this.concatenator = ':';

        this.debug = new Debug({ debug: false, control: 'Disable' });
        var hasControl = !isEmptyString(properties.control);
        var isDisabledOnLoad = properties.disable !== undefined && typeof properties.disable === 'boolean' ? properties.disable : false;
        var decodeSearch = new URLSearchParams(window.location.search);
        this.disabled = isDisabledOnLoad;
        this.control = hasControl ? properties.control : '';
        var findDisabled = decodeSearch.getAll(this.param);
        var isDisabled = decodeSearch.has(this.param);
        var inUrl = hasControl && isDisabled && this.find(findDisabled, properties.control);

        this.setStatus(properties, inUrl, hasControl);
    }

    /**
     * @func find
     * @desc Search all cases of dexter:disable in the search params and match them
     * with the control name.
     *
     * @param findDisabled {Array} List of disabled params
     * @param param {String} Control name to search for
     * @memberof Disable
     *
     * @returns {Boolean} True or False if it's matched the param
     */


    _createClass(Disable, [{
        key: 'find',
        value: function find(findDisabled, param) {
            this.debug.log('find:', 'Looking for', param, 'in', findDisabled);
            return findDisabled.some(function (v) {
                return v === param;
            });
        }

        /**
         * @func setStatus
         * @desc Checks the conditions to which we should disable the feature
         *
         * @param properties {Object} List of disabled params
         * @param inUrl {Boolean} If this.param was found in the URL
         * @param hasControl {Boolean} if properties.control was properly set
         * @memberof Disable
         *
         * @returns {Boolean} True or False if we're disabling the feature
         */

    }, {
        key: 'setStatus',
        value: function setStatus(properties, inUrl, hasControl) {
            var status = false;

            if (this.disabled) {
                this.debug.info(this.fileMode, properties.control);
                status = true;
            } else if (!properties.disable && inUrl) {
                this.disabled = true;
                this.debug.info(this.urlMode, properties.control);
                status = true;
            } else if (properties.disable && hasControl) {
                this.disabled = true;
                this.debug.info(this.fileMode, properties.control);
                status = true;
            }

            return status;
        }

        /**
         * @func isDisabled
         * @desc Returns a Boolean value for calling scripts to
         * take action to disable a script or setting
         * @memberof Disable
         * @returns {Boolean} Returns this.options.disabled
         */

    }, {
        key: 'isDisabled',
        value: function isDisabled() {
            this.debug.log('isDisabled:', this.disabled);
            return this.disabled;
        }
    }]);

    return Disable;
}();

export default Disable;