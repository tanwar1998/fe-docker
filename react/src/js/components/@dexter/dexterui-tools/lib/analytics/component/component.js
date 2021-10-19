var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import Debug from '../../utils/debug/debug';
import Analytics from '../analytics';

/**
 * @global AnalyticsComponent
 * @desc This sets component specific information to digitalData.component
 *
 * @memberof App
 *
 * @implements Debug {Class}
 *
 */
var AnalyticsComponent = {
    debug: new Debug({ debug: false, control: 'AnalyticsComponent' }),

    /**
     * @function setComponentInfo
     * @desc Sets digitalData.component info
     *
     * @memberof AnalyticsComponent
     * @returns {Boolean} Result of a changed digitalData value, or lack thereof.
     */
    setComponentInfo: function setComponentInfo(componentInfoObj, componentId) {
        window.digitalData = window.digitalData || {};
        this.debug.log('setComponentInfo: checking for valid assets:', typeof componentInfoObj === 'undefined' ? 'undefined' : _typeof(componentInfoObj), 'componentInfoObj:', componentInfoObj, 'componentId:', componentId);
        if (!window.digitalData.component) {
            window.digitalData.component = [];
        }
        var component = window.digitalData.component;

        // Make a copy of componentInfo so that any changes aren't propagated to DD
        var componentInfo = Object.assign({}, componentInfoObj);

        if (!componentInfo.id) {
            componentInfo.id = componentId;
        }

        if (componentId && component.length) {
            // Replace any existing componentInfo in array
            var index = component.findIndex(function (comp) {
                return comp.componentInfo.id === componentId;
            });
            if (index !== -1) {
                component[index] = { componentInfo: componentInfo };
                return false;
            }
        }

        if (componentInfo) {
            // component.push({ componentInfo });
            Analytics.pushToDigitalData('component', { componentInfo: componentInfo });
            return true;
        }

        this.debug.log('setComponentInfo: Invalid, returning false');
        return false;
    }
};

export default AnalyticsComponent;