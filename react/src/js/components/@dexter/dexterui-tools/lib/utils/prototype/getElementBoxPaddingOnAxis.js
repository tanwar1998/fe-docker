/**
 * @file getElementBoxPadding.js
 * @desc Utility method extension of Element.prototype
 * @author augur
 * @since 09/21/17 16:20
 *
 * @extends Element.prototype
 * @exports {}
 */

/**
 * @func Element.prototype.getBoxPaddingOnAxis
 * @desc Get box padding element by designating left, right, x, bottom, top, y
 *
 * @memberof Element.prototype
 *
 * @extends Element.prototype
 * @param prop {Number} Accumulative Computed value from client
 *
 * @example
 * element.getBoxPaddingOnAxis('paddingLeft');
 *
 * @returns {String} || null returns ancestor element when found by selector
 */

Element.prototype.getBoxPaddingOnAxis = function getBoxPadding(sideOraxis) {
    var _this = this;

    var calculatePaddingOnAxis = function calculatePaddingOnAxis() {
        for (var _len = arguments.length, lookups = Array(_len), _key = 0; _key < _len; _key++) {
            lookups[_key] = arguments[_key];
        }

        var theWork = lookups.reduce(function (acc, property) {
            var val = _this.getElementStylePropVal(property).replace('px', '');
            return acc + parseFloat(val);
        }, 0);
        return theWork;
    };
    switch (sideOraxis) {
        case 'left':
            return calculatePaddingOnAxis('paddingLeft');
        case 'right':
            return calculatePaddingOnAxis('paddingRight');
        case 'x':
            return calculatePaddingOnAxis('paddingLeft', 'paddingRight');
        case 'bottom':
            return calculatePaddingOnAxis('paddingBottom');
        case 'top':
            return calculatePaddingOnAxis('paddingTop');
        case 'y':
            return calculatePaddingOnAxis('paddingTop', 'paddingBottom');
        default:
            return 0;
    }
};