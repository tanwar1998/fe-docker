function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @file getAncestorBySelector.js
 * @desc Utility method extension of Element.prototype
 * @author augur
 * @since 09/15/17 16:20
 *
 * @extends Element.prototype
 * @exports {}
 */

/**
 * @func Element.prototype.parents calls getAncestorBySelector(qury)
 * @desc Equivalent to jQuery "parents" method
 *
 * @memberof Element.prototype
 *
 * @extends Element.prototype
 * @param query {String} Valid DOM selector
 *
 * @example
 * element.parents('.selector||#selector||selector')
 * searchRelatives returns and caches a collection of all elemnts in Body matching the 'qury' string
 * returns internal method "findMe" passing the prototype Element.parentEleme the first ancestor.
 * findeMe returns null when method reaches body and has not found qualified selector
 * if first two checks do not pass recursive call is made on the parentElement of the last pass
 *
 * @returns {element} || null returns ancestor element when found by selector
 */

Element.prototype.parents = function getAncestorBySelector(query) {
    if (!this.parentElement) return undefined;

    var searchRelatives = [].concat(_toConsumableArray(document.querySelectorAll(query)));

    var findMe = function findMe(el) {
        if (!el) return undefined;
        var foundAmongRelatives = searchRelatives.includes(el);

        if (foundAmongRelatives) {
            return el;
        }

        if (el.parentElement.nodeName.toLowerCase() === 'body') {
            return undefined;
        }
        return findMe(el.parentElement);
    };

    return findMe(this.parentElement);
};