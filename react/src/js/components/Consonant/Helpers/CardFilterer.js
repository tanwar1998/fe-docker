import {
    getFilteredCards,
    getCardsMatchingSearch,
    highlightCard,
    getDateAscSort,
    getDateDescSort,
    getFeaturedSort,
    getTitleAscSort,
    getTitleDescSort,
    getRandomSort,
} from './Helpers';
import { SORT_TYPES } from './constants';
import { filterCardsByDateRange } from './cards';
import { truncateList } from './general';

/**
 * Class that will constrain result set based on current state of the component
 *
 * @export
 * @class CardFilterer
 */
export default class CardFilterer {
    /**
     * Creates an instance of a CardFilterer
     *
     * @param {*} cardsToFilter
     * @memberof CardFilterer
     */
    constructor(cardsToFilter) {
        this.filteredCards = cardsToFilter;
        this.randomSort = null;
    }

    /**
     * Given a set of filters a user selected, this method will return all cards that contain
     * those filtlers
     *
     * @param {*} activeFilters
     * @param {*} filterType
     * @param {*} filterTypes
     * @return {*} Chainable
     * @memberof CardFilterer
     */
    filterCards(activeFilters, filterType, filterTypes) {
        this.filteredCards = getFilteredCards(
            this.filteredCards,
            activeFilters,
            filterType,
            filterTypes,
        );
        return this;
    }

    /**
     * Given a user search query and the fields to search, this method will return all cards that
     * match that query.
     *
     * @param {*} searchQuery
     * @param {*} searchFields
     * @return {*} Chainable
     * @memberof CardFilterer
     */
    searchCards(searchQuery, searchFields) {
        const query = searchQuery.trim().toLowerCase();
        const cardsMatchingSearch = getCardsMatchingSearch(
            searchQuery,
            this.filteredCards,
            searchFields,
        );

        if (query.length >= 3) {
            this.filteredCards = cardsMatchingSearch
                .map(card => searchFields.reduce((baseCard, searchField) => highlightCard(
                    baseCard,
                    searchField,
                    query,
                ), card));
        } else {
            this.filteredCards = cardsMatchingSearch;
        }

        return this;
    }

    /**
     * This method will return a chainable of all cards sorted by a given sort option
     *
     * @param {*} sortOption
     * @return {*} Chainable
     * @memberof CardFilterer
     */
    sortCards(sortOption) {
        const sortType = sortOption ? sortOption.sort.toLowerCase() : null;

        switch (sortType) {
            case SORT_TYPES.DATEASC:
                this.filteredCards = getDateAscSort(this.filteredCards);
                break;
            case SORT_TYPES.DATEDESC:
                this.filteredCards = getDateDescSort(this.filteredCards);
                break;
            case SORT_TYPES.FEATURED:
                this.filteredCards = getFeaturedSort(this.filteredCards);
                break;
            case SORT_TYPES.TITLEASC:
                this.filteredCards = getTitleAscSort(this.filteredCards);
                break;
            case SORT_TYPES.TITLEDESC:
                this.filteredCards = getTitleDescSort(this.filteredCards);
                break;
            case SORT_TYPES.RANDOM:
                if (this.randomSort === null) {
                    this.randomSort = getRandomSort(this.filteredCards);
                }
                this.filteredCards = this.randomSort;
                break;
            default:
                return this;
        }

        return this;
    }

    /**
     * If cards were authored to be shown or hidden based off a given date range, this method
     * constrains the result set to only cards that should be shown within that date interval.
     *
     * @return {*} Chainable
     * @memberof CardFilterer
     */
    keepCardsWithinDateRange() {
        this.filteredCards = filterCardsByDateRange(this.filteredCards);
        return this;
    }
    /**
     * If a bookmark only collection is authored, this method will constrain result set to only
     * cards that were saved.
     *
     * @param {*} onlyShowBookmarks
     * @param {*} bookmarkedCardIds
     * @param {*} showBookmarks
     * @return {*} Chainable
     * @memberof CardFilterer
     */
    keepBookmarkedCardsOnly(onlyShowBookmarks, bookmarkedCardIds, showBookmarks) {
        if (onlyShowBookmarks || showBookmarks) {
            this.filteredCards = this.filteredCards
                .filter(card => bookmarkedCardIds.includes(card.id));
        }
        return this;
    }

    /**
     * If a total card limit is authored, this method will truncate returned cards to adhere to
     * that limit.
     *
     * @param {*} totalCardLimit
     * @return {*} Chainable
     * @memberof CardFilterer
     */
    truncateList(totalCardLimit) {
        this.filteredCards = truncateList(totalCardLimit, this.filteredCards);
        return this;
    }
}
