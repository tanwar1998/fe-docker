import buildScriptTag from './buildScriptTag';

var loadScript = function loadScript(src, id, onloadCallback) {
    var docHead = document.querySelector('head');
    var scriptTag = buildScriptTag({ src: src, id: id, onloadCallback: onloadCallback });
    docHead.appendChild(scriptTag);
};

export default loadScript;