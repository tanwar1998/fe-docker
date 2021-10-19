var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * @description create an HTML script tag. Sets defaults and accepts attributes.
 * for more detils: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
 * @param {string} src JS to load
 * @param {string} id to identify the script
 * @param {boolean} defer execute script after DOM is parsed
 * @param {boolean} async execute script after loaded, but may interrupt parsing
 * @param {function} callback a function to handle the onload event
 */

export default function buildScriptTag() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$src = _ref.src,
        src = _ref$src === undefined ? '' : _ref$src,
        _ref$id = _ref.id,
        id = _ref$id === undefined ? '' : _ref$id,
        defer = _ref.defer,
        async = _ref.async,
        onloadCallback = _ref.onloadCallback;

    var scriptTag = document.createElement('script');

    return Object.assign(scriptTag, _extends({
        language: 'javascript',
        type: 'application/javascript',
        src: src,
        id: id
    }, defer && { defer: true }, async && { async: true }, typeof onloadCallback === 'function' && { onload: onloadCallback }));
}