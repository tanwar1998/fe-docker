
import produce, { enableES5 } from 'immer';

import { HighlightSearchField } from './rendering';
import {
    getByPath,
    setByPath,
    isSuperset,
    intersection,
    sanitizeText,
    chainFromIterable,
    removeDuplicatesByKey,
} from './general';

/**
 * Needs to be explicitly called by immer - Needed for IE 11 support
 * @type {Function}
 */
enableES5();

/**
* Determines whether paginator component should display
* @param {Boolean} enabled - Authored flag whether component should display or not
* @param {Number} totalCardLimit - Authored limit for how many cards should display
* @param {Number} totalResults - Total cards in collection
* @returns {Boolean} - Whether Paginator should display or not
*/
export const shouldDisplayPaginator = (enabled, totalCardLimit, totalResults) => {
    const totalCardLimitNotZero = totalCardLimit > 0;
    const cardLengthExceedsDisplayLimit = totalResults > totalCardLimit;

    return enabled &&
        totalCardLimitNotZero &&
        !cardLengthExceedsDisplayLimit;
};


/**
* Determines how many cards to show
* @param {Number} resultsPerPage - How many cards should show per page (Authored Field)
* @param {Number} currentPage - Current page user is on
* @param {Number} totalResults - Total cards in collection
* @returns {Number} - Number of cards to show
*/
export const getNumCardsToShow = (resultsPerPage, currentPage, totalResults) =>
    Math.min(resultsPerPage * currentPage, totalResults);

/**
* Gets Total Page Count (For Paginator Component)
* @param {Number} resultsPerPage - How many cards should show per page (Authored Field)
* @param {Number} totalResults - Total cards in collection
* @returns {Number} - Total number of pages
*/
export const getTotalPages = (resultsPerPage, totalResults) => {
    if (resultsPerPage === 0) return 0;
    return Math.ceil(totalResults / resultsPerPage);
};

/**
* Determines whether to show collection cards or bookmarked cards only
* (If author chooses bookmarks only collection)

* @param {Boolean} showBookmarksOnly - Authored Flag to Force Card Collection To Only Show Bookmarks
* @param {Array} bookmarkedCards - Bookmarked cards only
* @param {Array} collectionCards - All cards
* @returns {Array} - Which collection of cards to show
*/
export const getCollectionCards = (showBookmarksOnly, bookmarkedCards, collectionCards) => (
    showBookmarksOnly ? bookmarkedCards : collectionCards
);

/**
* Filter to get all bookmarked cards
* @param {Array} collectionCards - All cards
* @returns {Array} - All bookmarked cards
*/
export const getBookmarkedCards =
    collectionCards => collectionCards.filter(card => card.isBookmarked);

/**
* Gets all filters checked by a user
* @param {Array} filters - All filters on page
* @returns {Array} - All checked filters by user
*/
export const getActiveFilterIds = filters => chainFromIterable(filters.map(f => f.items))
    .filter(item => item.selected)
    .map(item => item.id);

/**
* Helper method to dermine whether author chose XOR or AND type filtering
* @param {String} filterType - Filter used in collection
* @param {Object} filterTypes - All possible filters
* @returns {Boolean} - Whether collection is using a XOR or AND type filtering
*/
const getUsingXorAndFilter = (filterType, filterTypes) => (
    filterType === filterTypes.XOR || filterType === filterTypes.AND
);

/**
* Helper method to dermine whether author chose OR type filtering
* @param {String} filterType - Filter used in collection
* @param {Object} filterTypes - All possible filters
* @returns {Boolean} - Whether collection is using OR type filtering
*/
const getUsingOrFilter = (filterType, filterTypes) => (
    filterType === filterTypes.OR
);

/**
* Will return all cards that match a set of filters
* @param {Array} cards - All cards in the collection
* @param {Array} activeFilters - All filters selected by user
* @param {String} filterType - Filter used in collection
* @param {Object} filterTypes - All possible filters
* @returns {Array} - All cards that match filter options
*/
export const getFilteredCards = (cards, activeFilters, filterType, filterTypes) => {
    const activeFiltersSet = new Set(activeFilters);

    const usingXorAndFilter = getUsingXorAndFilter(filterType, filterTypes);
    const usingOrFilter = getUsingOrFilter(filterType, filterTypes);

    if (activeFiltersSet.size === 0) return cards;

    return cards.filter((card) => {
        if (!card.tags) {
            return false;
        }

        const tagIds = new Set(card.tags.map(tag => tag.id));

        if (usingXorAndFilter) {
            return isSuperset(tagIds, activeFiltersSet);
        } else if (usingOrFilter) {
            return intersection(tagIds, activeFiltersSet).size;
        }
        throw new Error(`Unrecognized filter type: ${filterType}`);
    });
};

/**
* If a card matches a search query, this method will highlight it
* @param {Array} baseCard - Card to highlight
* @param {Array} searchField - Field that matches Query
* @param {String} query - The users search query
* @returns {Card} The highlighted caard
*/
export const highlightCard = (baseCard, searchField, query) => produce(baseCard, (draftCard) => {
    const searchFieldValue = getByPath(draftCard, searchField, null);
    if (searchFieldValue === null) return;
    const highlightedSearchFieldValue = HighlightSearchField(searchFieldValue, query);
    setByPath(draftCard, searchField, highlightedSearchFieldValue);
});

/**
* If a card matches a search query, this method will highlight it
* @param {Array} searchField - Field that matches Query
* @param {Array} card - Card to check
* @param {String} query - The users search query
* @returns {Boolean} If the card matches the user's search query
*/
const cardMatchesQuery = (searchField, card, searchQuery) => {
    const searchFieldValue = getByPath(card, searchField, '');
    const cleanSearchFieldValue = sanitizeText(searchFieldValue);
    return cleanSearchFieldValue.includes(searchQuery);
};

/**
 * Helper to implement Set() data structure w/ Vanilla Arrays
 * Would've used new Set(), but polyfill has bug in IE11 converting Array.from(new Set())
 *
 * @param {Array} cards
 * @return {Array} - Unique Card Set from Cards (filtering based off unique card ids)
 */
const getUniqueCardSet = (cards) => {
    const uniqueCardSet = [];
    cards.forEach((card) => {
        const cardNotInSet = uniqueCardSet.findIndex(element => element.id === card.id) <= -1;
        if (cardNotInSet) {
            uniqueCardSet.push(card);
        }
    });
    return uniqueCardSet;
};

/**
* Gets all cards that matches a users search query
* @param {Array} cards - All cards in the card collection
* @param {Array} searchFields - All authored search fields to check
* @param {String} query - The users search query
* @returns {Array} - All cards that match the user's query for a given set of search fields
*/
export const getCardsMatchingQuery = (cards, searchFields, query) => {
    const cardsMatchingQuery = [];
    cards.forEach((card) => {
        searchFields.forEach((searchField) => {
            if (cardMatchesQuery(searchField, card, query)) {
                cardsMatchingQuery.push(card);
            }
        });
    });
    return getUniqueCardSet(cardsMatchingQuery);
};
/**
 * @func hasTag
 * @desc Does current entity have a specific tag?
 * @param {RegExp} compare a regEx pattern to test for
 * @param {Array} tags an array of tags
 */
export const hasTag = (compare, tags = []) => {
    if (!tags.length || compare.constructor.name !== 'RegExp') return false;

    return tags.some(({ id = '' } = {}) => id && compare.test(id));
};

/**
* Returns all cards title sorted (A-Z)
* @param {Array} cards - All cards in the card collection
* @returns {Array} - All cards sorted by title
*/
export const getTitleAscSort = cards => cards.sort((cardOne, cardTwo) => {
    const cardOneTitle = getByPath(cardOne, 'contentArea.title');
    const cardTwoTitle = getByPath(cardTwo, 'contentArea.title');
    return cardOneTitle.localeCompare(cardTwoTitle);
});

/**
* Returns all cards title sorted (Z-A)
* @param {Array} cards - All cards in the card collection
* @returns {Array} - All cards sorted by title
*/
export const getTitleDescSort = cards => getTitleAscSort(cards).reverse();

/**
* Returns all cards Feature sorted
* Feature sort is Title (A-Z) sort but with all Featured Cards Injected to Front
* @param {Array} cards - All cards in the card collection
* @returns {Array} - All cards sorted by title
*/
export const getFeaturedSort = cards => getTitleAscSort(cards).sort((a, b) => {
    if (a.isFeatured && b.isFeatured) {
        return a.initialTitle < b.initialTitle ? -1 : 0;
    } else if (a.isFeatured) {
        return -1;
    } else if (b.isFeatured) {
        return 1;
    }
    return 0;
});

/**
* Returns all Cards Date Sorted (Old To New)
* @param {Array} cards - All cards in the card collection
* @returns {Array} - All cards sorted by Date
*/
export const getDateAscSort = cards => cards.sort((cardOne, cardTwo) => {
    const cardOneDate = getByPath(cardOne, 'cardDate');
    const cardTwoDate = getByPath(cardTwo, 'cardDate');
    if (cardOneDate && cardTwoDate) {
        return cardOneDate.localeCompare(cardTwoDate);
    }
    return 0;
});

/**
* Returns all Cards Date Sorted (New To Old)
* @param {Array} cards - All cards in the card collection
* @returns {Array} - All cards sorted by Date
*/
export const getDateDescSort = cards => getDateAscSort(cards).reverse();

/**
* Gets all cards that matches a users search query
* @param {String} query - The users search query
* @param {Array} cards - All cards in the card collection
* @param {Array} searchFields - All authored search fields to check
* @returns {Array} - All cards that match the user's query for a given set of search fields
*/
export const getCardsMatchingSearch = (query, cards, searchFields) => {
    if (!query) {
        return cards;
    }
    const searchQuery = sanitizeText(query);
    const cardsMatchingQuery = getCardsMatchingQuery(cards, searchFields, searchQuery);
    return cardsMatchingQuery;
};

/**
* Joins two sets of cards
* @param {Array} cardSetOne - Set one of cards to join
* @param {Array} cardSetTwo - Set two of cards to join
* @returns {Array} - Cards sets one and two joined
*/
const joinCardSets = (cardSetOne, cardSetTwo) => cardSetOne.concat(cardSetTwo);

/**
* Processes featured cards with raw cards received from API response
* @param {Array} featuredCards - Authored Featured Cards
* @param {Array} rawCards - Cards from API response
* @returns {Array} - Set of cards processed
*/
export const processCards = (featuredCards, rawCards) => removeDuplicatesByKey(joinCardSets(featuredCards, rawCards), 'id');

/**
* Helper method for effect that adds bookmark meta data to cards
* @param {Array} cards - All cards in card collection
* @param {Array} bookmarkedCardIds - All bookmarked card ids
* @returns {Array} - Cards with bookmark meta data
*/
export const getUpdatedCardBookmarkData = (cards, bookmarkedCardIds) => cards.map(card => ({
    ...card,
    isBookmarked: bookmarkedCardIds.some(i => i === card.id),
}));

export const getRandomSort = cards => cards.sort(() => Math.random() - 0.5);
