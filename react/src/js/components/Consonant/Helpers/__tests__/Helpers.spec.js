import { render, queryByTestId } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import PROPS from '../TestingConstants/Helpers';

import {
    processCards,
    getTotalPages,
    highlightCard,
    getDateAscSort,
    getDateDescSort,
    getFeaturedSort,
    getTitleAscSort,
    getFilteredCards,
    getTitleDescSort,
    getNumCardsToShow,
    getCollectionCards,
    getBookmarkedCards,
    getActiveFilterIds,
    getCardsMatchingQuery,
    shouldDisplayPaginator,
    getCardsMatchingSearch,
    getUpdatedCardBookmarkData,
    hasTag,
} from '../Helpers';

describe('utils/Helpers', () => {
    describe('shouldDisplayPaginator', () => {
        PROPS.shouldDisplayPaginator.forEach(({
            enabled, resultsPerPage, totalResults, expectedValue,
        }) => {
            test(`should return ${expectedValue} value`, () => {
                const value = shouldDisplayPaginator(enabled, resultsPerPage, totalResults);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('getNumCardsToShow', () => {
        PROPS.getNumCardsToShow.forEach(({
            resultsPerPage, currentPage, totalResults, expectedValue,
        }) => {
            test(`should return ${expectedValue} value`, () => {
                const value = getNumCardsToShow(resultsPerPage, currentPage, totalResults);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('getTotalPages', () => {
        PROPS.getTotalPages.forEach(({
            resultsPerPage, totalResults, expectedValue,
        }) => {
            test(`should return ${expectedValue} value`, () => {
                const value = getTotalPages(resultsPerPage, totalResults);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('getCollectionCards', () => {
        PROPS.getCollectionCards.forEach(({
            showBookmarksOnly, bookmarkedCards, collectionCards, expectedValue,
        }) => {
            test(`should return ${expectedValue} value`, () => {
                const value = getCollectionCards(
                    showBookmarksOnly,
                    bookmarkedCards,
                    collectionCards,
                );

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('getBookmarkedCards', () => {
        PROPS.getBookmarkedCards.forEach(({
            cards, expectedValue,
        }) => {
            test(`should return array length === ${expectedValue}`, () => {
                const value = getBookmarkedCards(cards);

                expect(value).toHaveLength(expectedValue);
            });
        });
    });
    describe('getActiveFilterIds', () => {
        PROPS.getActiveFilterIds.forEach(({
            filters, expectedValue,
        }) => {
            test('should return active filter Ids', () => {
                const idList = getActiveFilterIds(filters);

                expect(idList).toEqual(expectedValue);
            });
        });
    });
    describe('getFilteredCards', () => {
        PROPS.getFilteredCards.forEach(({
            cards, activeFilters, filterType, filterTypes, expectedValue,
        }) => {
            test('should return filtered cards', () => {
                const filteredCards = getFilteredCards(
                    cards,
                    activeFilters,
                    filterType,
                    filterTypes,
                );

                expect(filteredCards).toEqual(expectedValue);
            });
        });
        test('should return throw error when invalid filterType', () => {
            const {
                cards,
                activeFilters,
                filterType,
                filterTypes,
                expectedValue,
            } = PROPS.getFilteredCardsThrowError;

            function throwError() {
                getFilteredCards(
                    cards,
                    activeFilters,
                    filterType,
                    filterTypes,
                );
            }

            expect(throwError).toThrowError(new Error(expectedValue));
        });
    });
    describe('highlightCard', () => {
        test('should highlight searched field correctly', () => {
            const baseCard = { title: 'title name' };
            const searchField = 'title';
            const query = 'name';

            const { title } = highlightCard(
                baseCard,
                searchField,
                query,
            );

            const { container } = render(title);

            const highlightElement = queryByTestId(container, 'consonant-SearchResult');

            expect(highlightElement).not.toBeNull();
            expect(highlightElement).toHaveTextContent('name');
        });
        test('shouldn`t highlight search field', () => {
            const baseCard = { description: 'title name' };
            const searchField = 'title';
            const query = 'name';

            const { title } = highlightCard(
                baseCard,
                searchField,
                query,
            );

            const { container } = render(title);

            const highlightElement = queryByTestId(container, 'consonant-SearchResult');

            expect(highlightElement).toBeNull();
        });
    });
    describe('getCardsMatchingQuery', () => {
        PROPS.getCardsMatchingQuery.forEach(({
            cards, searchFields, query, expectedValue,
        }) => {
            test('should return filtered cards', () => {
                const filteredCards = getCardsMatchingQuery(
                    cards,
                    searchFields,
                    query,
                );

                expect(filteredCards).toEqual(expectedValue);
            });
        });
    });
    describe('getTitleAscSort', () => {
        PROPS.getTitleAscSort.forEach(({
            cards, expectedValue,
        }) => {
            test('should return ASC sorted cards by title', () => {
                const sortedCards = getTitleAscSort(cards);

                expect(sortedCards).toEqual(expectedValue);
            });
        });
    });
    describe('getTitleDescSort', () => {
        PROPS.getTitleDescSort.forEach(({
            cards, expectedValue,
        }) => {
            test('should return DESC sorted cards by title', () => {
                const sortedCards = getTitleDescSort(cards);

                expect(sortedCards).toEqual(expectedValue);
            });
        });
    });
    describe('getFeaturedSort', () => {
        PROPS.getFeaturedSort.forEach(({
            cards, expectedValue,
        }) => {
            test('should return featured sorted cards', () => {
                const sortedCards = getFeaturedSort(cards);

                expect(sortedCards).toEqual(expectedValue);
            });
        });
    });
    describe('getDateAscSort', () => {
        PROPS.getDateAscSort.forEach(({
            cards, expectedValue,
        }) => {
            test('should return ASC sorted cards by title', () => {
                const sortedCards = getDateAscSort(cards);

                expect(sortedCards).toEqual(expectedValue);
            });
        });
    });
    describe('getDateDescSort', () => {
        PROPS.getDateDescSort.forEach(({
            cards, expectedValue,
        }) => {
            test('should return DESC sorted cards by title', () => {
                const sortedCards = getDateDescSort(cards);

                expect(sortedCards).toEqual(expectedValue);
            });
        });
    });
    describe('getCardsMatchingSearch', () => {
        PROPS.getCardsMatchingSearch.forEach(({
            cards, searchFields, query, expectedValue,
        }) => {
            test('should return searched cards', () => {
                const filteredCards = getCardsMatchingSearch(
                    query,
                    cards,
                    searchFields,
                );

                expect(filteredCards).toEqual(expectedValue);
            });
        });
    });
    describe('processCards', () => {
        PROPS.processCards.forEach(({
            featuredCards, rawCards, expectedValue,
        }) => {
            test('should return merged cards', () => {
                const mergedCards = processCards(featuredCards, rawCards);

                expect(mergedCards).toEqual(expectedValue);
            });
        });
    });
    describe('getUpdatedCardBookmarkData', () => {
        PROPS.getUpdatedCardBookmarkData.forEach(({
            cards, bookmarkedCardIds, expectedValue,
        }) => {
            test('should return cards with isBookmarked value', () => {
                const updatedCards = getUpdatedCardBookmarkData(cards, bookmarkedCardIds);

                expect(updatedCards).toEqual(expectedValue);
            });
        });
    });
    describe('hasTag', () => {
        test('has Live Expired tag', () => {
            const hasLiveExpired = hasTag(PROPS.hasTag.compareRegExp1, PROPS.hasTag.passedTags1);

            expect(hasLiveExpired).toBe(true);
        });

        test('has On Demand Schedules tag', () => {
            const hasLiveExpired = hasTag(PROPS.hasTag.compareRegExp2, PROPS.hasTag.passedTags2);

            expect(hasLiveExpired).toBe(true);
        });

        test('does not have DrSuess tag', () => {
            const hasLiveExpired = hasTag(PROPS.hasTag.compareRegExp3, PROPS.hasTag.passedTags3);

            expect(hasLiveExpired).toBe(false);
        });
    });
});
