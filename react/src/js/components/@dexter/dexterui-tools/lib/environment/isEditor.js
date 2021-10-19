/**
 * @func isEditor
 * @desc returns Boolean that says if you're in edit mode or not.
 *
 * @memberof Environment
 *
 * @returns {Boolean} Will return true if in edit mode on TouchUI.
 */

export default function isEditor() {
    // This is wrapped in a try block to catch a DOMException that can be thrown
    // if the page is loaded in a cross domain iframe.
    try {
        return window.parent.location.href.indexOf('/editor.html/') >= 0;
    } catch (e) {
        return false;
    }
}