/**
 * @file osBrowsersDetection.js
 * @desc Utility method assigns .os_{os} and .browser_{browser} class to body if mapped
 * @author augur
 * @since 01/25/18 16:20
 *
 */
var bod = document.querySelector('body');
var agentString = window.navigator.userAgent;
var osMap = {
    'iOs10-x': /(iPhone OS 10)|(CPU OS 10)/,
    'iOs11-x': /(iPhone OS 11)|(CPU OS 11)/,
    iOs: 'iPhone OS',
    'osX_10-11': 'Mac OS X 10_11',
    'osX_10-12': 'Mac OS X 10_12',
    'osX_10-13': 'Mac OS X 10_13',
    osX: 'Mac OS X',
    windows10: 'Windows NT 10.0',
    'windows8-1': 'Windows NT 6.3',
    windows8: 'Windows NT 6.2'
};
/* eslint-disable no-useless-escape */
var browserMap = {
    'safariMobile-11': /Version\/11.\d(.\d+)?\sMobile/,
    'safariMobile-10': /Version\/10.\d(.\d+)?\sMobile/,
    'safari-11': /Version\/11.\d(.\d+)?\sSafari/,
    'safart-10': /Version\/10.\d(.\d+)?\sSafari/,
    chrome: 'Chrome',
    firefox: 'Firefox',
    edge: 'Edge',
    ie11: 'Trident\/7'
};
/* eslint-enable no-useless-escape */

// Generic lookup of to map versus navigator.userAgent
var lookup = function mapLookup(map) {
    return Object.keys(map).reduce(function (acc, item) {
        var itemMatch = agentString.match(map[item]);
        var validMatch = itemMatch && itemMatch[0];
        return validMatch && acc.length === 0 ? acc.concat(item) : acc;
    }, '');
};
// OnLoad do lookup and append classes to Body if needed.
window.addEventListener('load', function () {
    var os = lookup(osMap);
    var browser = lookup(browserMap);
    if (os.length) {
        bod.classList.add('os_' + os);
    }
    if (browser.length) {
        bod.classList.add('browser_' + browser);
    }
});