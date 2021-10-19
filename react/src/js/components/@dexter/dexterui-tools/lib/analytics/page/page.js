import getPropertySafely from '../../utils/lang/getPropertySafely';
import Debug from '../../utils/debug/debug';
import Analytics from '../analytics';

/**
 * @global AnalyticsPage
 * @desc This is an object that adds information to window.digitalData with general page data
 *
 * @memberof App
 *
 */
var AnalyticsPage = {
    /**
     * @function init
     * @desc OnLoad of script, sets generic page data
     *
     * @memberof AnalyticsPage
     * @returns {Boolean} Result of a changed digitalData value, or lack thereof.
     */
    init: function init() {
        this.debug = new Debug({ debug: false, control: 'AnalyticsPage' });
        window.dexter = window.dexter || {};
        window.dexter.Analytics = window.dexter.Analytics || {};
        var lang = this.getLanguage();

        var data = {
            pageInfo: {
                breadcrumbs: this.getBreadcrumbInfo(),
                geoRegion: this.getGeoRegion(),
                language: lang,
                legacyMarketSegment: '',
                pageName: this.getPageName(lang),
                pageContentId: this.getPageContentId(),
                siteSection: document.title,
                template: ''
            }
        };

        return Analytics.addToDigitalData('page', data);
    },
    getLanguage: function getLanguage() {
        var iso = getPropertySafely(window, 'dexter.Analytics.language');
        var sep = '-';
        var lang = '';
        var region = '';

        if (iso) {
            var splitIt = iso.split('_');
            lang = splitIt[0];
            region = splitIt[1] ? sep + splitIt[1].toUpperCase() : '';
        }
        return lang + region;
    },


    /**
     * Get pageName in the required format for analytics.
     * Eg: If the URL is 'https://www.adobe.com/fr/products/photoshop.html`,
     * the resulting pageName will be 'adobe.com:products:photoshop'.
     *
     * @returns {string} pageName in the format as expected for analytics.
     */
    getPageName: function getPageName(language) {
        var loc = window.location;
        var hostname = loc.hostname;
        var pathname = loc.pathname;

        pathname = pathname.replace(/\//g, ':').replace('.html', '');
        hostname = hostname.replace('www.', '');

        if (language !== 'en-US') {
            // Remove locale information
            var pathnameSplitArr = pathname.split(':');
            if (pathnameSplitArr.length >= 2) {
                pathnameSplitArr.splice(1, 1);
            }
            pathname = pathnameSplitArr.join(':');
        }
        return hostname + pathname;
    },
    getPageContentId: function getPageContentId() {
        return getPropertySafely(window, 'dexter.Analytics.pageContentId');
    },
    getGeoRegion: function getGeoRegion() {
        var region = getPropertySafely(window, 'dexter.Analytics.geoRegion');

        region = region !== undefined ? region.toUpperCase() : '';
        return region;
    },


    /**
     * Get breadcrumb info required for analytics.
     * @returns {array} breadcrumb information in the format as expected for analytics.
     */
    getBreadcrumbInfo: function getBreadcrumbInfo() {
        var breadcrumbCollection = Array.from(document.getElementsByClassName('Footernav-breadcrumb-link'));
        return breadcrumbCollection.map(function (el) {
            return el.text;
        });
    }
};

export default AnalyticsPage;