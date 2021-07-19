export const hasTag = (compare = '', tags = []) => {
    if (!tags.length || !compare) return false;

    return tags.some(({ id = '' } = {}) => id && compare.test(id));
};

function fixSpaceInDate(date) {
    const time = 'T';
    const splitDate = date.split(' ');

    if (splitDate.length > 1) return `${splitDate[0]}${time}${splitDate[1]}`;
    return date;
}

function lcdDateFormat(date) {
    const tTimeDateFix = fixSpaceInDate(date);
    /* eslint-disable no-useless-escape */
    return tTimeDateFix.replace(/([+\-]\d\d)(\d\d)$/, '$1:$2');
    /* eslint-enable no-useless-escape */
}

/**
 * @func convertDateStrToMs
 * @desc Converts Date String to MS
 *
 * @param {String} dateStr, valid date string to be converted
 * @returns {Number} convertDateStrToMs
 */
const convertDateStrToMs = (dateStr = '') => {
    if (!dateStr) return 0;

    return new Date(lcdDateFormat(dateStr)).getTime();
};
// Definitions
/* eslint-disable no-useless-escape */
const liveExpiredRegEx = /[a-zA-Z0-9-]+:[a-zA-Z0-9-\/]+live-expired/;
const isOnDemandScheduledRegEx = /[a-zA-Z0-9-]+:[a-zA-Z0-9-\/]+on-demand-scheduled/;
/* eslint-enable no-useless-escape */
/**
 * @func defineIsLiveExpired
 * @desc Specific "Session (Card)" has "live expired" tag
 *
 * @param {Array} tags current session tags to seach for "live expired" tag
 * @returns {Boolean} isLiveExpired
 */
const defineIsLiveExpired = tags => hasTag(liveExpiredRegEx, tags);
/**
 * @func defineIsOnDemand
 * @desc Current Time is Greater than EndTime
 *
 * @param {Number} currentTime representation of current time in MS
 * @param {Number} endTime representation of session EndTime in MS
 * @returns {Boolean} isOnDemand
 */
const defineIsOnDemand = (currentTime, endTimeMls) => {
    if (endTimeMls && currentTime) {
        return currentTime > endTimeMls;
    }

    return false;
};
/**
 * @func defineIsOnDemandScheduled
 * @desc Specific "Session (Card)" has "onDemand scheduled" tag
 *
 * @param {Array} tags current session tags to seach for "onDemand scheduled" tag
 * @returns {Boolean} isLiveExpired
 */
const defineIsOnDemandScheduled = tags => hasTag(isOnDemandScheduledRegEx, tags);
/**
 * @func defineIsUpcoming
 * @desc Current Time is Less than startTime
 *
 * @param {Number} currentTime representation of current time in MS
 * @param {Number} startTime representation of session StartTime in MS
 * @returns {Boolean} isOnDemand
 */
const defineIsUpcoming = (currentTime, startTimeMls) => {
    if (startTimeMls) {
        return startTimeMls > currentTime;
    }

    return false;
};
/**
 * @func eventTiming
 * @desc First Sorts sessions by startDate, and then partitions them by category
 *
 * @param {Array} sessions sessions to be sorted
 * @returns {Object} nextTransitionMs, value for setTimeout.
 * visibleSessions, sorted cards/sessions to be rendered.
 */
function eventTiming(sessions = []) {
    let nextTransitionMs;

    function setNextTransitionMs(compareTime, curMs) {
        if (compareTime < curMs) return 0;
        // Therefore current time should be less than transTimeMs
        const countDownMs = compareTime - curMs;
        /* if the countdown > 1 day (86400000ms) do not set a timer
         * The max number of MS a timer can have is 2147483647ms
         * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
         */
        if (countDownMs > 86400000) return 0;

        return (!nextTransitionMs && countDownMs > 0) ||
        (countDownMs < nextTransitionMs) ?
            countDownMs : nextTransitionMs;
    }

    const curMs = Date.now();
    // Stack per category
    const live = [];
    const notTimed = [];
    const onDemand = [];
    const upComing = [];
    /*
        The data has no default order, therefore have to sort according to
        session data before partitioning be category
    */
    sessions.sort((
        {
            contentArea: {
                dateDetailText: {
                    startTime: aStart = '',
                } = {},
            } = {},
        } = {},
        {
            contentArea: {
                dateDetailText: {
                    startTime: bStart = '',
                } = {},
            } = {},
        } = {},
    ) => {
        // "a" is what sort uses for the first item
        // converting the value to MS, therefore aMs
        const aMs = convertDateStrToMs(aStart);
        // "b" is what sort uses for the second item
        // converting the value to MS, therefore aMs
        const bMs = convertDateStrToMs(bStart);

        if (aMs === 0) return 1;

        if (bMs === 0) return -1;

        if (aMs < bMs) return -1;

        if (aMs > bMs) return 1;

        return 0;
    }).forEach((session = {}) => {
        const {
            contentArea: {
                dateDetailText: {
                    endTime = '',
                    startTime = '',
                } = {},
            } = {},
            tags = [],
        } = session;
        // Session Times in milliseconds
        const endMs = convertDateStrToMs(endTime);
        const startMs = convertDateStrToMs(startTime);
        // Timed categories
        const isTimed = !!(endMs && startMs);
        const isUpComing = isTimed ?
            defineIsUpcoming(curMs, startMs) : false;
        const isOnDemand = isTimed && !isUpComing ?
            defineIsOnDemand(curMs, endMs) : false;
        const isLive = !!(isTimed && !isUpComing && !isOnDemand && startMs);
        // Tagged Exceptions
        const isOnDemandScheduled = defineIsOnDemandScheduled(tags);
        const isLiveExpired = defineIsLiveExpired(tags);

        // Cards with no Date information, pushed to back of stack
        if (!isTimed) {
            notTimed.push(session);
        }
        // Upcoming and not tagged with On Demand Scheduled tag
        if (isUpComing && !isOnDemandScheduled) {
            upComing.push(session);
            // GET Upcoming Badge here
            nextTransitionMs = setNextTransitionMs(startMs, curMs);
        }
        // On demand and not tagged with Live Expired tag
        if (isOnDemand && !isLiveExpired) {
            // Get OnDemand Badge here
            onDemand.push(session);
        }
        // Currently Live
        if (isLive) {
            live.push(session);
            // GET Live Badge here
            nextTransitionMs = setNextTransitionMs(endMs, curMs);
        }

        if (isUpComing && isOnDemandScheduled) {
            nextTransitionMs = setNextTransitionMs(startMs, curMs);
        }
    });

    // If no transitions are needed zero out transition time
    if ((!live.length && !upComing.length) || !nextTransitionMs) {
        nextTransitionMs = 0;
    }

    /*
        returns object
        - conditionally adds next sort transition time to returns
        - returns an Array of cards sorted by Category and then Date ASC
    */
    return {
        ...((nextTransitionMs && { nextTransitionMs })),
        visibleSessions: [].concat(live, upComing, onDemand, notTimed),
    };
}

export {
    eventTiming,
    convertDateStrToMs,
    defineIsLiveExpired,
    defineIsOnDemand,
    defineIsOnDemandScheduled,
    defineIsUpcoming,
};
