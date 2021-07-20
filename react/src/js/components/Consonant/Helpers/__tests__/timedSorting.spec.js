// eslint-disable-next-line react/prop-types
import '@testing-library/jest-dom/extend-expect';
import { dateOnDemandTest, dateUpcomingTest, currentTimeStr, defineIsLiveExpiredTags, sessionsTest } from '../TestingConstants/timedSorting';

import { defineIsOnDemand, convertDateStrToMs, defineIsLiveExpired, defineIsOnDemandScheduled, eventTiming, defineIsUpcoming } from '../timedSorting';

describe('utils/timedSorting', () => {
    describe('defineIsOnDemand', () => {
        dateOnDemandTest.forEach(({
            currentTime, endTimeMls, expectedValue,
        }) => {
            test(`should return ${expectedValue}`, () => {
                const value = defineIsOnDemand(currentTime, endTimeMls);
                expect(expectedValue).toEqual(value);
            });
        });
    });
    describe('defineIsUpcoming', () => {
        dateUpcomingTest.forEach(({
            currentTime, endTimeMls, expectedValue,
        }) => {
            test(`should return ${expectedValue}`, () => {
                const value = defineIsUpcoming(currentTime, endTimeMls);
                expect(expectedValue).toEqual(value);
            });
        });
    });
    describe('convertDateStrToMs', () => {
        currentTimeStr.forEach(({
            dateString, expectedValue,
        }) => {
            test(`should return ${expectedValue}`, () => {
                const value = convertDateStrToMs(dateString);
                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('defineIsLiveExpired', () => {
        defineIsLiveExpiredTags.forEach(({
            tags, expectedValue,
        }) => {
            test(`should return ${expectedValue}`, () => {
                const value = defineIsLiveExpired(tags);
                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('defineIsOnDemandScheduled', () => {
        defineIsLiveExpiredTags.forEach(({
            tags, expectedValue,
        }) => {
            test(`should return ${expectedValue}`, () => {
                const value = defineIsOnDemandScheduled(tags);
                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('eventTiming', () => {
        test(`should return ${sessionsTest.expectedValue}`, () => {
            const value = eventTiming(sessionsTest.session);
            expect(value).toEqual(sessionsTest.expectedValue);
        });
    });
});
