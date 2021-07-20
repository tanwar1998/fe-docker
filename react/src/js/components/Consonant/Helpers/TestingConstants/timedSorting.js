const today = new Date();
const tomorrow = new Date(today);
const yesterday = new Date(today);

tomorrow.setDate(tomorrow.getDate() + 1);
yesterday.setDate(yesterday.getDate() - 1);

export const dateOnDemandTest = [
    { currentTime: today, endTimeMls: yesterday, expectedValue: true },
    { currentTime: today, endTimeMls: tomorrow, expectedValue: false },
    { expectedValue: false },
];

export const dateUpcomingTest = [
    {
        currentTime: today.setDate(today.getDate() + 2),
        endTimeMls: today.setDate(today.getDate() + 3),
        expectedValue: true,
    },
    {
        currentTime: today.setDate(today.getDate() - 3),
        endTimeMls: today.setDate(today.getDate() - 1),
        expectedValue: false,
    },
    { expectedValue: false },
];

export const currentTimeStr = [
    { dateString: '2020-10-20T20:00:00Z', expectedValue: 1603224000000 },
    { dateString: '2021-10-20T20:00:00Z', expectedValue: 1634760000000 },
    { expectedValue: 0 },
];

export const defineIsLiveExpiredTags = [
    {
        tags: [
            { id: 'userid:12312dwdwddlive-expired' },
            { id: 'userid:12312dwdwddon-demand-scheduled' },
        ],
        expectedValue: true,
    },
    { tags: [{ id: 'userid:12312dwdwddlive-expire' }, { id: 123412433213 }, { id: 'userid:12312dwdwdon-demand-schedule' }], expectedValue: false },
    { tags: [], expectedValue: false },
];

const session1 = {
    contentArea: {
        dateDetailText: {
            endTime: '2020-10-25T20:00:00Z',
            startTime: '2020-10-20T20:00:00Z',
        },
    },
};

const session2 = {
    contentArea: {
        dateDetailText: {
            endTime: '2020-10-10T20:00:00Z',
            startTime: '2020-10-15T20:00:00Z',
        },
    },
};

export const sessionsTest = {
    session: [session1, session2],
    expectedValue: { visibleSessions: [session2, session1] },
};

export const endTimeMls = new Date() + 1;

