const shouldDisplayPaginator = [
    // should return false && false && true
    {
        enabled: false,
        resultsPerPage: 0,
        totalResults: 0,
        expectedValue: false,
    },
    // should return true && false && true
    {
        enabled: true,
        resultsPerPage: 0,
        totalResults: 0,
        expectedValue: false,
    },
    // should return false && true && true
    {
        enabled: false,
        resultsPerPage: 1,
        totalResults: 0,
        expectedValue: false,
    },
    // should return false && false && false
    {
        enabled: false,
        resultsPerPage: 0,
        totalResults: 1,
        expectedValue: false,
    },
    // should return true && true && true
    {
        enabled: true,
        resultsPerPage: 1,
        totalResults: 0,
        expectedValue: true,
    },
    // should return fale && true && false
    {
        enabled: false,
        resultsPerPage: 1,
        totalResults: 2,
        expectedValue: false,
    },
    // should return true && true && false
    {
        enabled: true,
        resultsPerPage: 1,
        totalResults: 2,
        expectedValue: false,
    },
];

const getNumCardsToShow = [
    // should return Math.min(1 * 2, 3) => 2
    {
        resultsPerPage: 1,
        currentPage: 2,
        totalResults: 3,
        expectedValue: 2,
    },
    // should return Math.min(2 * 2, 3) => 4
    {
        resultsPerPage: 2,
        currentPage: 2,
        totalResults: 3,
        expectedValue: 3,
    },
];

const getTotalPages = [
    {
        resultsPerPage: 0,
        totalResults: 2,
        expectedValue: 0,
    },
    {
        resultsPerPage: 2,
        totalResults: 5,
        expectedValue: 3,
    },
];

const bookmarkedCards = [{ isBookmarked: true }];
const collectionCards = [{ isBookmarked: false }];

const getCollectionCards = [
    {
        bookmarkedCards,
        collectionCards,
        showBookmarksOnly: true,
        expectedValue: bookmarkedCards,
    },
    {
        bookmarkedCards,
        collectionCards,
        showBookmarksOnly: false,
        expectedValue: collectionCards,
    },
];

const getBookmarkedCards = [
    {
        cards: bookmarkedCards,
        // returned array length
        expectedValue: 1,
    },
    {
        cards: collectionCards,
        // returned array length
        expectedValue: 0,
    },
    {
        cards: [...bookmarkedCards, ...collectionCards],
        // returned array length
        expectedValue: 1,
    },
];

const card1 = { id: 'card-id-1', tags: [{ id: 1 }, { id: 2 }] };
const card2 = { id: 'card-id-2', tags: [{ id: 1 }, { id: 2 }, { id: 3 }] };
const card3 = { id: 'card-id-3' };

const cards = [card1, card2, card3];

const filterTypes = { OR: 'or', AND: 'and' };

const getFilteredCards = [
    {
        cards,
        activeFilters: [],
        filterType: 'or',
        filterTypes,
        expectedValue: cards,
    },
    {
        cards,
        activeFilters: [1, 2, 3],
        filterType: 'or',
        filterTypes,
        expectedValue: [card1, card2],
    },
    {
        cards,
        activeFilters: [1, 2, 3],
        filterType: 'and',
        filterTypes,
        expectedValue: [card2],
    },
    {
        cards,
        activeFilters: [1, 2, 3, 4],
        filterType: 'and',
        filterTypes,
        expectedValue: [],
    },
];

const getFilteredCardsThrowError = {
    cards,
    activeFilters: [1, 2, 3],
    filterType: 'random',
    filterTypes,
    expectedValue: 'Unrecognized filter type: random',
};

const getActiveFilterIds = [
    {
        filters: [
            {
                items: [
                    { id: 1, selected: true },
                    { id: 2, selected: true },
                    { id: 3, selected: false },
                ],
            },
            {
                items: [
                    { id: 4, selected: true },
                    { id: 5, selected: false },
                    { id: 6, selected: true },
                ],
            },
            {
                items: [
                    { id: 7, selected: false },
                    { id: 8, selected: true },
                    { id: 9, selected: true },
                ],
            },
        ],
        expectedValue: [1, 2, 4, 6, 8, 9],
    },
];

const cardToQuery1 = {
    id: 1,
    name: 'first card',
    description: 'some description one',
};
const cardToQuery2 = {
    id: 2,
    name: 'second card',
    description: 'some description one',
};
const cardToQuery3 = {
    id: 3,
    name: 'third card',
    description: 'some description three',
};
const cardsToQuery = [cardToQuery1, cardToQuery1, cardToQuery2, cardToQuery3];

const getCardsMatchingQuery = [
    {
        cards: cardsToQuery,
        searchFields: ['name'],
        query: 'first card',
        expectedValue: [cardToQuery1],
    },
    {
        cards: cardsToQuery,
        searchFields: ['description'],
        query: 'some description',
        expectedValue: [cardToQuery1, cardToQuery2, cardToQuery3],
    },
    {
        cards: cardsToQuery,
        searchFields: ['description'],
        query: 'some description one',
        expectedValue: [cardToQuery1, cardToQuery2],
    },
];

const getCardsMatchingSearch = [
    ...getCardsMatchingQuery,
    {
        cards: cardsToQuery,
        expectedValue: cardsToQuery,
    },
];

const cardToTitleAscSortA = { contentArea: { title: 'A title' } };
const cardToTitleAscSortB = { contentArea: { title: 'B title' } };
const cardToTitleAscSortC = { contentArea: { title: 'C title' } };

const getTitleAscSort = [
    {
        cards: [cardToTitleAscSortB, cardToTitleAscSortA, cardToTitleAscSortC],
        expectedValue: [
            cardToTitleAscSortA,
            cardToTitleAscSortB,
            cardToTitleAscSortC,
        ],
    },
];

const getTitleDescSort = [
    {
        cards: [cardToTitleAscSortB, cardToTitleAscSortA, cardToTitleAscSortC],
        expectedValue: [
            cardToTitleAscSortC,
            cardToTitleAscSortB,
            cardToTitleAscSortA,
        ],
    },
];

const getFeaturedSort = [
    {
        cards: [
            {
                id: 1,
                isFeatured: true,
                initialTitle: 'c title',
                contentArea: { title: 'a title' },
            },
            {
                id: 2,
                isFeatured: true,
                initialTitle: 'c title',
                contentArea: { title: 'b title' },
            },
            {
                id: 3,
                isFeatured: true,
                initialTitle: 'c title',
                contentArea: { title: 'c title' },
            },
            {
                id: 4,
                isFeatured: true,
                initialTitle: 'a title',
                contentArea: { title: 'a title' },
            },
            {
                id: 5,
                isFeatured: true,
                initialTitle: 'a title',
                contentArea: { title: 'b title' },
            },
            {
                id: 6,
                isFeatured: true,
                initialTitle: 'a title',
                contentArea: { title: 'c title' },
            },
            {
                id: 7,
                isFeatured: false,
                initialTitle: 'c title',
                contentArea: { title: 'a title' },
            },
            {
                id: 8,
                isFeatured: false,
                initialTitle: 'c title',
                contentArea: { title: 'b title' },
            },
            {
                id: 9,
                isFeatured: false,
                initialTitle: 'c title',
                contentArea: { title: 'c title' },
            },
            {
                id: 10,
                isFeatured: true,
                initialTitle: 'b title',
                contentArea: { title: 'a title' },
            },
            {
                id: 11,
                isFeatured: true,
                initialTitle: 'b title',
                contentArea: { title: 'b title' },
            },
            {
                id: 12,
                isFeatured: true,
                initialTitle: 'b title',
                contentArea: { title: 'c title' },
            },
            {
                id: 13,
                isFeatured: false,
                initialTitle: 'a title',
                contentArea: { title: 'a title' },
            },
            {
                id: 14,
                isFeatured: false,
                initialTitle: 'a title',
                contentArea: { title: 'b title' },
            },
            {
                id: 15,
                isFeatured: false,
                initialTitle: 'a title',
                contentArea: { title: 'c title' },
            },
            {
                id: 16,
                isFeatured: false,
                initialTitle: 'b title',
                contentArea: { title: 'a title' },
            },
            {
                id: 17,
                isFeatured: false,
                initialTitle: 'b title',
                contentArea: { title: 'b title' },
            },
            {
                id: 18,
                isFeatured: false,
                initialTitle: 'b title',
                contentArea: { title: 'c title' },
            },
        ],
        expectedValue: [
            {
                id: 1,
                isFeatured: true,
                initialTitle: 'c title',
                contentArea: { title: 'a title' },
            },
            {
                id: 2,
                isFeatured: true,
                initialTitle: 'c title',
                contentArea: { title: 'b title' },
            },
            {
                id: 3,
                isFeatured: true,
                initialTitle: 'c title',
                contentArea: { title: 'c title' },
            },
            {
                id: 4,
                isFeatured: true,
                initialTitle: 'a title',
                contentArea: { title: 'a title' },
            },
            {
                id: 5,
                isFeatured: true,
                initialTitle: 'a title',
                contentArea: { title: 'b title' },
            },
            {
                id: 6,
                isFeatured: true,
                initialTitle: 'a title',
                contentArea: { title: 'c title' },
            },
            {
                id: 7,
                isFeatured: false,
                initialTitle: 'c title',
                contentArea: { title: 'a title' },
            },
            {
                id: 8,
                isFeatured: false,
                initialTitle: 'c title',
                contentArea: { title: 'b title' },
            },
            {
                id: 9,
                isFeatured: false,
                initialTitle: 'c title',
                contentArea: { title: 'c title' },
            },
            {
                id: 10,
                isFeatured: true,
                initialTitle: 'b title',
                contentArea: { title: 'a title' },
            },
            {
                id: 11,
                isFeatured: true,
                initialTitle: 'b title',
                contentArea: { title: 'b title' },
            },
            {
                id: 12,
                isFeatured: true,
                initialTitle: 'b title',
                contentArea: { title: 'c title' },
            },
            {
                id: 13,
                isFeatured: false,
                initialTitle: 'a title',
                contentArea: { title: 'a title' },
            },
            {
                id: 14,
                isFeatured: false,
                initialTitle: 'a title',
                contentArea: { title: 'b title' },
            },
            {
                id: 15,
                isFeatured: false,
                initialTitle: 'a title',
                contentArea: { title: 'c title' },
            },
            {
                id: 16,
                isFeatured: false,
                initialTitle: 'b title',
                contentArea: { title: 'a title' },
            },
            {
                id: 17,
                isFeatured: false,
                initialTitle: 'b title',
                contentArea: { title: 'b title' },
            },
            {
                id: 18,
                isFeatured: false,
                initialTitle: 'b title',
                contentArea: { title: 'c title' },
            },
        ],
    },
];

const getDateAscSort = [
    {
        cards: [
            { cardDate: '2021-10-12T21:00:00.000Z' },
            { cardDate: '2021-10-12T21:00:00.000Z' },
            { cardDate: '2021-10-10T21:00:00.000Z' },
            { cardDate: null },
            { cardDate: '2021-10-20T21:00:00.000Z' },
        ],
        expectedValue: [
            { cardDate: '2021-10-10T21:00:00.000Z' },
            { cardDate: '2021-10-12T21:00:00.000Z' },
            { cardDate: '2021-10-12T21:00:00.000Z' },
            { cardDate: null },
            { cardDate: '2021-10-20T21:00:00.000Z' },
        ],
    },
];

const getDateDescSort = [
    {
        cards: [
            { cardDate: '2021-10-12T21:00:00.000Z' },
            { cardDate: '2021-10-12T21:00:00.000Z' },
            { cardDate: '2021-10-10T21:00:00.000Z' },
            { cardDate: null },
            { cardDate: '2021-10-20T21:00:00.000Z' },
        ],
        expectedValue: [
            { cardDate: '2021-10-20T21:00:00.000Z' },
            { cardDate: null },
            { cardDate: '2021-10-12T21:00:00.000Z' },
            { cardDate: '2021-10-12T21:00:00.000Z' },
            { cardDate: '2021-10-10T21:00:00.000Z' },
        ],
    },
];

const processCards = [
    {
        featuredCards: [{ id: 1 }, { id: 2 }],
        rawCards: [{ id: 1 }, { id: 3 }],
        expectedValue: [{ id: 1 }, { id: 2 }, { id: 3 }],
    },
];

const getUpdatedCardBookmarkData = [
    {
        cards: [{ id: 1 }, { id: 2 }],
        bookmarkedCardIds: [1],
        expectedValue: [{ id: 1, isBookmarked: true }, { id: 2, isBookmarked: false }],
    },
];

/* eslint-disable */
const hasTag = {
    compareRegExp1: /[a-zA-Z0-9-]+:[a-zA-Z0-9-\/]+live-expired/,
    passedTags1: [
        {id: 'caas:events/live-expired'},
        {id: 'caas:events/purple-people-eater'}
    ],
    compareRegExp2: /[a-zA-Z0-9-]+:[a-zA-Z0-9-\/]+on-demand-scheduled/,
    passedTags2: [
        {id: 'caas:events/on-demand-scheduled'},
        {id: 'caas:events/green-eggs-and-ham'}
    ],
};
/* eslint-enable */

export default {
    processCards,
    getTotalPages,
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
    getFilteredCardsThrowError,
    hasTag,
};
