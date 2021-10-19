/**
 * @desc This is an object contains the breakpoints and MatchMedia expressions
 * for all the supported breakpoints.
 */
var unit = 'rem';
var phoneOnly = 37.4375; // 599px
var tabletPortraitUp = phoneOnly + 0.0625; // 600px
var tabletPortraitMax = 56.1875; // 899px
var tabletLandscapeUp = tabletPortraitMax + 0.0625; // 900px
var tabletLandscapeMax = 74.9375; // 1199px
var desktop = tabletLandscapeMax + 0.0625; // 1200px

var mediaExpression = {
    mobile: '(max-width: ' + phoneOnly + unit + ')',
    tabletPortrait: '(min-width: ' + tabletPortraitUp + unit + ') and (max-width: ' + tabletPortraitMax + unit + ')',
    tabletLandscape: '(min-width: ' + tabletLandscapeUp + unit + ') and (max-width: ' + tabletLandscapeMax + unit + ')',
    desktop: '(min-width: ' + desktop + unit + ')'
};

export default {
    phoneOnly: phoneOnly,
    tabletPortraitUp: tabletPortraitUp,
    tabletPortraitMax: tabletPortraitMax,
    tabletLandscapeUp: tabletLandscapeUp,
    tabletLandscapeMax: tabletLandscapeMax,
    desktop: desktop,
    mediaExpression: mediaExpression
};