import { isType } from '../lang';

function fixSpaceInDate(date) {
    var time = 'T';
    var splitDate = date.split(' ');

    if (splitDate.length > 1) return '' + splitDate[0] + time + splitDate[1];
    return date;
}

var fromToStub = {
    dayOfWeek: '',
    monthAndDay: '',
    localeTimeStart: '',
    localeTimeEnd: '',
    fromTimeToTime: '',
    timeZoneLocalized: '',
    formatted: ''
};

/**
 * @func lcdDateFormat
 * @desc Fixes Date format to work with Safari and IE
 *
 * @param date string representing Date, usually in GMT
 * @returns {Array}
 */
export function lcdDateFormat(date) {
    var tTimeDateFix = fixSpaceInDate(date);
    /* eslint-disable no-useless-escape */
    return tTimeDateFix.replace(/([+\-]\d\d)(\d\d)$/, '$1:$2');
    /* eslint-enable no-useless-escape */
}

/**
 * @func localeDate
 * @desc Formats a Date() object based on browser locale
 *
 * @param dateOb {object} Date()
 * @returns {Array}
 */
export function localeDate(dateOb) {
    return dateOb.toLocaleDateString(navigator.language, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).split(',');
}

/**
 * @func localeTime
 * @desc Formats a Date() object into minutes and hours
 *
 * @param dateOb {object} Date()
 * @returns {String}
 */
export function localeTime(dateOb) {
    return dateOb.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
}

/**
 * @func localeTimeZone
 * @desc Formats a Date() object into a time zone string
 *
 * @param dateOb {object} Date()
 * @returns {String}
 */
export function localeTimeZone(dateOb) {
    return dateOb.toLocaleTimeString(navigator.language, { timeZoneName: 'short' }).split(' ').pop();
}

/**
 * @func isValidDate
 * @desc Checks the validity of the Date() object
 *
 * @param date {object} Date()
 * @returns {Boolean}
 */
export function isValidDate(date) {
    return isType(/Date/, date) && !isNaN(date);
}

function getDayOfWeekShort(dateObj) {
    return dateObj.toLocaleDateString(navigator.language, {
        weekday: 'short'
    });
}

function getMonthAndDay(dateObj) {
    return dateObj.toLocaleDateString(navigator.language, {
        month: 'short',
        day: 'numeric'
    });
}

/**
 * @func dateTimeFromTo
 * @desc Forms a localized date & time range from timestamps. Use the parts in your own format,
 * or use { formatted } to display as "Monday, October 19 | 08:00AM - 09:00AM PST"
 *
 * @param timeEnd {String} "2020-10-20T16:00:00.000+0000"
 * @param timeStart {String} "2020-10-20T16:30:00.000+0000"
 *
 * @returns {Object} stub {Object}
 */
export function dateTimeFromTo(timeEnd, timeStart) {
    var endDate = new Date(lcdDateFormat(timeEnd));
    var startDate = new Date(lcdDateFormat(timeStart));

    if (!isValidDate(endDate) || !isValidDate(startDate)) return fromToStub;

    var dayOfWeek = getDayOfWeekShort(startDate);
    var localeTimeEnd = localeTime(endDate);
    var localeTimeStart = localeTime(startDate);
    var monthAndDay = getMonthAndDay(startDate);
    var timeZoneLocalized = localeTimeZone(startDate);

    return {
        dayOfWeek: dayOfWeek,
        monthAndDay: monthAndDay,
        localeTimeStart: localeTimeStart,
        localeTimeEnd: localeTimeEnd,
        fromTimeToTime: localeTimeStart + ' - ' + localeTimeEnd,
        timeZoneLocalized: timeZoneLocalized,
        formatted: dayOfWeek + ' ' + monthAndDay + ' | ' + localeTimeStart + ' - ' + localeTimeEnd + ' ' + timeZoneLocalized
    };
}