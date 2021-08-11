import React, {
    Fragment,
    useEffect,
    useState,
} from 'react';
import classNames from 'classnames';
import 'whatwg-fetch';
import { shape } from 'prop-types';

import Popup from '../Sort/Popup';
import Search from '../Search/Search';
import Loader from '../Loader/Loader';
import {
    getByPath,
    saveBookmarksToLocalStorage,
    readBookmarksFromLocalStorage,
} from '../Helpers/general';
import { configType } from '../types/config';
import NoResultsView from '../NoResults/View';
import LoadMore from '../Pagination/LoadMore';
import Bookmarks from '../Bookmarks/Bookmarks';
import Paginator from '../Pagination/Paginator';
import Grid from '../Grid/Grid';
import CardFilterer from '../Helpers/CardFilterer';
import FiltersPanelTop from '../Filters/Top/Panel';
import LeftFilterPanel from '../Filters/Left/Panel';
import JsonProcessor from '../Helpers/JsonProcessor';
import { useWindowDimensions, useURLState } from '../Helpers/hooks';
import { Info as LeftInfo } from '../Filters/Left/Info';
import {
    DESKTOP_MIN_WIDTH,
    FILTER_TYPES,
    FILTER_PANEL,
    LOADER_SIZE,
    PAGINATION_COUNT,
    TABLET_MIN_WIDTH,
    TRUNCATE_TEXT_QTY,
    SORT_POPUP_LOCATION,
    THEME_TYPE,
    LAYOUT_CONTAINER,
} from '../Helpers/constants';
import {
    ConfigContext,
    ExpandableContext,
} from '../Helpers/contexts';
import {
    getDefaultSortOption,
    getNumSelectedFilterItems,
    makeConfigGetter,
} from '../Helpers/consonant';

import {
    shouldDisplayPaginator,
    getNumCardsToShow,
    getTotalPages,
    getActiveFilterIds,
    getUpdatedCardBookmarkData,
    removeEmptyFilters,
} from '../Helpers/Helpers';
import {
    trackClearAllClicked,
    trackAllCardsLoaded,
    trackFilterClicked,
    trackFavoritesSelected,
    trackPageChange,
    trackSortChange,
    trackSearchInputChange,
} from '../Analytics/Analytics';

/**
 * Consonant Card Collection
 * Config is implicitly populated by authors
 *
 * @component
 * @example
 * const config= {
    collection: {},
    featuredCards: [{}],
    filterPanel: {},
    sort: {},
    pagination: {},
    bookmarks: {},
    search: {},
    language: ''
 * }
 * return (
 *   <Container config={config}/>
 * )
 */
const Container = (props) => {
    const { config } = props;
    const getConfig = makeConfigGetter(config);

    /**
         **** Authored Configs ****
     */
    const filterPanelEnabled = getConfig('filterPanel', 'enabled');
    const filterPanelType = getConfig('filterPanel', 'type');
    const paginationType = getConfig('pagination', 'type');
    const paginationIsEnabled = getConfig('pagination', 'enabled');
    const resultsPerPage = getConfig('collection', 'resultsPerPage');
    const onlyShowBookmarks = getConfig('bookmarks', 'leftFilterPanel.bookmarkOnlyCollection');
    const authoredFilters = getConfig('filterPanel', 'filters');
    const filterLogic = getConfig('filterPanel', 'filterLogic').toLowerCase().trim();
    const collectionEndpoint = getConfig('collection', 'endpoint');
    const totalCardLimit = getConfig('collection', 'totalCardsToShow');
    const searchFields = getConfig('search', 'searchFields');
    const sortOptions = getConfig('sort', 'options');
    const defaultSortOption = getDefaultSortOption(config, getConfig('sort', 'defaultSort'));
    const featuredCards = getConfig('featuredCards', '');
    const leftPanelSearchPlaceholder = getConfig('search', 'i18n.leftFilterPanel.searchPlaceholderText');
    const topPanelSearchPlaceholder = getConfig('search', 'i18n.topFilterPanel.searchPlaceholderText');
    const searchPlaceholderText = getConfig('search', 'i18n.filterInfo.searchPlaceholderText');
    const noResultsTitle = getConfig('search', 'i18n.noResultsTitle');
    const noResultsDescription = getConfig('search', 'i18n.noResultsDescription');
    const apiFailureTitle = getConfig('collection', 'i18n.onErrorTitle');
    const apiFailureDescription = getConfig('collection', 'i18n.onErrorDescription');
    const trackImpressions = getConfig('analytics', 'trackImpressions');
    const collectionIdentifier = getConfig('analytics', 'collectionIdentifier');
    const authoredMode = getConfig('collection', 'mode');
    const authoredLayoutContainer = getConfig('collection', 'layout.container');
    const showEmptyFilters = getConfig('filterPanel', 'showEmptyFilters');

    /**
     **** Constants ****
     */
    const DESKTOP_SCREEN_SIZE = window.innerWidth >= DESKTOP_MIN_WIDTH;
    const isXorFilter = filterLogic.toLowerCase().trim() === FILTER_TYPES.XOR;

    /**
         **** Hooks ****
     */

    /**
     * @typedef {Object} urlState
     * @description — object with url query values
     *
     * @typedef {Function} setUrlState
     * @description - set url query value by key
     *
     * @typedef {Function} clearUrlState
     * @description - clear whole url query state
     *
     * @type {[Object, Function, Function]} OpenDropdown
     */
    const [urlState, setUrlState, clearUrlState] = useURLState();

    /**
     * @typedef {Number} OpenDropdownState - Id of a selected dropdown
     * @description — Passed in Context Provider So All Nested Components can be in sync
     *
     * @typedef {Function} OpenDropdownStateSetter
     * @description
     *
     * @type {[Number, Function]} OpenDropdown
     */
    const [openDropdown, setOpenDropdown] = useState(null);

    /**
     * @typedef {Array} BookmarkedCardIdsState — Initiailzed From Local Storage
     *
     * @typedef {Function} BookmarkedCardIdsSetter — Sets internal state of saved bookmarks
     *
     * @type {[Array, Function]} BookmarkedCardIds
     */
    const [bookmarkedCardIds, setBookmarkedCardIds] = useState(readBookmarksFromLocalStorage());

    /**
     * @typedef {Number} CurrentPageState — Initialized to the first page
     * @description Same page state for 'Load More' or 'Paginator'
     *
     * @typedef {Function} CurrentPageStateSetter — Sets page as user navigates through pages
     *
     * @type {[Number, Function]} CurrentPage
     */
    const [currentPage, setCurrentPage] = useState(1);

    /**
     * @typedef {Array} FiltersState — Contains Filters For Filter Panel
     * @description Same Filter state for Left or Top
     *
     * @typedef {Function} FiltersStateSetter — Sets Authored Filters as State
     *
     * @type {[Array, Function]} Filters
     */
    const [filters, setFilters] = useState([]);

    /**
     * @typedef {String} SearchQueryState — Will be used to search through cards
     * @typedef {Function} SearchQueryStateSetter — Sets user search query
     *
     * @type {[String, Function]} SearchQuery
     */
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * @typedef {String} SortOpenedState — Toggles Sort Popup Opened Or Closed
     * @typedef {Function} SortOpenedStateSetter — Sets Sort Option
     *
     * @type {[Boolean, Function]} SortOpened
     */
    const [sortOpened, setSortOpened] = useState(false);

    /**
     * @typedef {String} SortOptionState — Can be one of a range of types
     * @description 'Title (A-Z)', 'Title (Z-A), Date (New to Old), Date (Old to New), Featured
     *
     * @typedef {Function} SortOptionStateSetter — Sets Sort Option
     *
     * @type {[String, Function]} SortOption
     */
    const [sortOption, setSortOption] = useState(defaultSortOption);

    /**
     * @typedef {Boolean} WindowWidthState — Can either be true or false
     * @description Used to toggle between mobile and desktop layouts
     *
     * @typedef {Function} WindowWidthStateSetter — Updates window width
     *
     * @type {[Number]} WindowWidth
     */
    const { width: windowWidth } = useWindowDimensions();

    /**
     * @typedef {Boolean} ShowMobileFiltersState — Can either be true or false
     * @description When true mobile filters will appear on the page
     *
     * @typedef {Function} ShowMobileFiltersStateSetter
     * @description Toggles mobile filter header/footer to show or hide
     *
     * @type {[Boolean, Function]} ShowMobileFilters
     */
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    /**
     * @typedef {Boolean} ShowBookmarkState — Can either be true or false
     * @description For Top Filter Panel, there is a limit to how many filter groups can show
     *
     * @typedef {Function} ShowBookmarkStateSetter — Sets limit on filter quantity
     * @description When over allowed Filter Group Quantity - A "More +" button appears
     *
     * @type {[Boolean, Function]} ShowBookmarks
     */
    const [showBookmarks, setShowBookmarks] = useState(false);

    /**
     * @typedef {Boolean} LimitFilterQuantityState — Can either be true or false
     * @description For Top Filter Panel, there is a limit to how many filter groups can show
     *
     * @typedef {Function} LimitFilterQuantityStateSetter — Sets limit on filter quantity
     * @description When over allowed Filter Group Quantity - A "More +" button appears
     *
     * @type {[Boolean, Function]} LimitFilterQuantity
     */
    const [showLimitedFiltersQty, setShowLimitedFiltersQty] = useState(filterPanelType === 'top');

    /**
     * @typedef {Array} CardState
     * @description sets cards retrieved either server side render or API call
     *
     * @typedef {Function} CardStateSetter
     * @description E.g. Render Featured Cards Server side, While collection cards from API call
     *
     * @type {[Array, Function]} Cards
     */
    const [cards, setCards] = useState([]);

    /**
     * @typedef {Boolean} LoadingState — Can either be true or false
     * @description When true a loading spinner will appear on the page
     *
     * @typedef {Function} LoadingStateSetter — Sets loader true or false
     * @description True while waiting for API response. False on cards retrieved or api failure
     *
     * @type {[Boolean, Function]} Loading
     */
    const [isLoading, setLoading] = useState(false);

    /**
     * @typedef {Boolean} ApiFailureState — Can either be true or false
     * @description When true an API error has occured
     *
     * @typedef {Function} ApiFailureStateSetter — Sets API failure flag true or false
     * @description True when retrieved or api failure. False otherwise
     *
     * @type {[Boolean, Function]} ApiFailure
     */
    const [isApiFailure, setApiFailure] = useState(false);

    /**
     **** Helper Methods ****
     */

    /**
    * For a given group of filters, it will unselect all of them
    * @param {Array} filterGroups - a group of filters
    * @returns {Array} fitlerGroups - the updated group of filters
    */
    const getAllFiltersClearedState = filterGroups => filterGroups.map(filterGroup => ({
        ...filterGroup,
        items: filterGroup.items.map(filterItem => ({
            ...filterItem,
            selected: false,
        })),
    }));

    /**
    * For a given group of filters, it will unselect the one with a given id
    * @param {Number} id - the id of an individual filter item
    * @param {Array} filterGroups - a group of filters
    * @returns {Array} fitlerGroups - the updated group of filters
    */
    const getFilterItemClearedState = (id, filterGroups) => filterGroups.map((filterGroup) => {
        if (filterGroup.id !== id) {
            return filterGroup;
        }
        return {
            ...filterGroup,
            items: filterGroup.items.map(filterItem => ({
                ...filterItem,
                selected: false,
            })),
        };
    });

    /**
    * Will uncheck a filter with a given id
    * @param {Number} id - the id of an individual filter item
    * @returns {Void} - an updated state
    */
    const clearFilterItem = (id) => {
        setFilters((prevFilters) => {
            const filterClearedState = getFilterItemClearedState(id, prevFilters);
            return filterClearedState;
        });
    };

    /**
    * Will uncheck all filter items
    * @returns {Void} - an updated state
    */
    const clearAllFilters = () => {
        setFilters((prevFilters) => {
            const allFiltersClearedState = getAllFiltersClearedState(prevFilters);
            return allFiltersClearedState;
        });

        clearUrlState();
    };

    /**
    * Resets filters, and search to empty. Hides bookmark filter
    * @returns {Void} - an updated state
    */
    const resetFiltersSearchAndBookmarks = () => {
        trackClearAllClicked();
        clearAllFilters();
        setSearchQuery('');
        setShowBookmarks(false);
    };

    /**
         **** EVENT HANDLERS ****
     */

    /**
     * On Load More Button Click, Increment Page Cuonter By 1
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const onLoadMoreClick = () => {
        setCurrentPage(prevState => prevState + 1);
        window.scrollTo(0, window.pageYOffset);
        trackPageChange(currentPage);
    };

    /**
     * Takes sort user selects and sets it so cards are sorted
     *
     * @param {ClickEvent} e - The observable event.
     * @listens ClickEvent
     */
    const handleSortChange = (option) => {
        setSortOption(option);
        setSortOpened(false);
        trackSortChange(option);
    };

    /**
     * Handles whenever the search box is clicked or input field
     * changes
     *
     * @param {ClickEvent, ChangeEvent} e
     * @listens ClickEvent, ChangeEvent
     */
    const handleSearchInputChange = (val) => {
        clearAllFilters();
        setSearchQuery(val);
        trackSearchInputChange(val);
    };

    /**
     * Handles when a group of filters is clicked. Behavior should be
     * to toggle group open or closed
     *
     * @param {ClickEvent} e - The observable event.
     * @listens ClickEvent
     */
    const handleFilterGroupClick = (filterId) => {
        setFilters((prevFilters) => {
            let opened;
            return prevFilters.map((el) => {
                if (el.id === filterId) {
                    opened = !el.opened;
                } else {
                    // eslint-disable-next-line prefer-destructuring
                    opened = el.opened;
                }
                return { ...el, opened };
            });
        });
    };

    /**
     * Will find and set needed filter to url
     *
     * @param {string} filterId - selected filter group id
     * @param {string} itemId - selected filter item id
     * @param {boolean} isChecked
     * @returns {Void} - an updated url
     */
    const changeUrlState = (filterId, itemId, isChecked) => {
        const { group, items } = filters.find(({ id }) => id === filterId);
        const { label } = items.find(({ id }) => id === itemId);

        const urlStateValue = urlState[group] || [];
        const value = isChecked
            ? [...urlStateValue, label]
            : urlStateValue.filter(item => item !== label);

        setUrlState(group, value);
    };

    /**
     * Handles what happens when a specific filter item (checkbox)
     * is clicked
     *
     * @param {CheckboxClickEvent} e
     * @listens CheckboxClickEvent
     */
    const handleCheckBoxChange = (filterId, itemId, isChecked) => {
        trackFilterClicked(isChecked, itemId, filters);
        if (isXorFilter && isChecked) {
            clearAllFilters();
        }

        setFilters(prevFilters => prevFilters.map((filter) => {
            if (filter.id !== filterId) return filter;

            return {
                ...filter,
                items: filter.items.map(item => ({
                    ...item,
                    selected: item.id === itemId ? !item.selected : item.selected,
                })),
            };
        }));

        changeUrlState(filterId, itemId, isChecked);
    };

    /**
     * Shows/Hides Mobile Filter Panel
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleMobileFiltersToggle = () => setShowMobileFilters(prev => !prev);

    /**
     * When a card's bookmark icon is clicked, save the card
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleCardBookmarking = (id) => {
        // Update bookmarked IDs
        const cardIsBookmarked = bookmarkedCardIds.find(card => card === id);

        if (cardIsBookmarked) {
            setBookmarkedCardIds(prev => prev.filter(el => el !== id));
        } else {
            setBookmarkedCardIds(prev => [...prev, id]);
        }
    };

    /**
     * Will show  or hide all saved bookmarks when clicked
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleShowBookmarksFilterClick = (e) => {
        e.stopPropagation();
        trackFavoritesSelected(showBookmarks);
        setShowBookmarks(prev => !prev);
        setCurrentPage(1);
    };

    /**
     * If top filter panel, toggle or hide more button
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleShowAllTopFilters = () => {
        setShowLimitedFiltersQty(prev => !prev);
    };

    /**
     * On window click, all dropdowns should hide
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleWindowClick = () => {
        setOpenDropdown(null);
    };

    const reformatFilter = authoredFilters.map(filterGroup => ({
        ...filterGroup,
        opened: DESKTOP_SCREEN_SIZE ? filterGroup.openedOnLoad : false,
        items: filterGroup.items.map(filterItem => ({
            ...filterItem,
            selected: false,
        })),
    }));

    /**
         **** Effects ****
     */

    /**
    * Sets authored filters as state
    * @returns {Void} - an updated state
    */

    useEffect(() => {
        if (showEmptyFilters) {
            setFilters(reformatFilter);
        }
    }, []);

    /**
    * Sets filters from url as tate
    * @returns {Void} - an updated state
    */

    useEffect(() => {
        setFilters(origin => origin.map((filter) => {
            const { group, items } = filter;
            const urlStateValue = urlState[group];

            if (!urlStateValue) return filter;

            return {
                ...filter,
                opened: true,
                items: items.map(item => ({
                    ...item,
                    selected: urlStateValue.includes(String(item.label)),
                })),
            };
        }));
    }, []);

    /**
    * Fetches cards from authored API endpoint
    * @returns {Void} - an updated state
    */
    useEffect(() => {
        setLoading(true);
        window.fetch(collectionEndpoint)
            .then(resp => resp.json())
            .then((payload) => {
                setLoading(false);
                if (!getByPath(payload, 'cards.length')) return;

                const jsonProcessor = new JsonProcessor(payload.cards);
                const { processedCards } = jsonProcessor
                    .addFeaturedCards(featuredCards)
                    .removeDuplicateCards()
                    .addCardMetaData(TRUNCATE_TEXT_QTY, onlyShowBookmarks, bookmarkedCardIds);

                setCards(processedCards);
                trackAllCardsLoaded(processedCards);
                if (!showEmptyFilters) {
                    setFilters(removeEmptyFilters(reformatFilter, processedCards));
                }
            }).catch(() => {
                setLoading(false);
                setApiFailure(true);
            });
    }, []);

    /**
    * Saves cards to local storage and updates card w/ bookmarked data
    * @returns {Void} - an updated state
    */
    useEffect(() => {
        saveBookmarksToLocalStorage(bookmarkedCardIds);
        setCards(getUpdatedCardBookmarkData(cards, bookmarkedCardIds));
    }, [bookmarkedCardIds]);


    /**
    * Handles clearing state on showBookmarks
    * @returns {Void} - an updated state
    */
    useEffect(() => {
        if (showBookmarks) {
            clearAllFilters();
            setSearchQuery('');
        }
    }, [showBookmarks]);

    /**
         **** Derived State ****
     */

    /**
     * Array of filters chosen by the user
     * @type {Array}
     */
    const activeFilterIds = getActiveFilterIds(filters);

    /**
     * Instance of CardFilterer class that handles returning subset of cards
     * based off user interactions
     *
     * @type {Object}
     */
    const cardFilterer = new CardFilterer(cards);

    /**
     * Filtered cards based off current state of page
     * @type {Array}
     */
    const { filteredCards } = cardFilterer
        .keepBookmarkedCardsOnly(onlyShowBookmarks, bookmarkedCardIds, showBookmarks)
        .filterCards(activeFilterIds, filterLogic, FILTER_TYPES)
        .sortCards(sortOption)
        .keepCardsWithinDateRange()
        .truncateList(totalCardLimit)
        .searchCards(searchQuery, searchFields);

    /**
     * Subset of cards to show the user
     * @type {Array}
     */
    const gridCards = filteredCards;

    /**
     * Total pages (used by Paginator Component)
     * @type {Number}
     */
    const totalPages = getTotalPages(resultsPerPage, gridCards.length);

    /**
     * Number of cards to show (used by Load More component)
     * @type {Number}
     */
    const numCardsToShow = getNumCardsToShow(resultsPerPage, currentPage, gridCards.length);

    /**
     * How many filters were selected - (used by Left Filter Panel)
     * @type {Number}
     */
    const selectedFiltersItemsQty = getNumSelectedFilterItems(filters);

    /**
     * Conditions to Display A Form Of Pagination
     * @type {Boolean}
     */
    const displayPagination = shouldDisplayPaginator(
        paginationIsEnabled,
        totalCardLimit,
        gridCards.length,
    );
    /**
     * Conditions to display the Load More Button
     * @type {Boolean}
     */
    const displayLoadMore = displayPagination && paginationType === 'loadMore';

    /**
     * Conditions to display the Paginator Component
     * @type {Boolean}
     */
    const displayPaginator = displayPagination && paginationType === 'paginator';

    /**
     * Conditions to display the Left Filter Panel Component
     * @type {Boolean}
     */
    const displayLeftFilterPanel = filterPanelEnabled && filterPanelType === FILTER_PANEL.LEFT;

    /**
     * Whether at lease one card was returned by Card Filterer
     * @type {Boolean}
     */
    const atLeastOneCard = gridCards.length > 0;

    /**
     * Where to place the Sort Popup (either left or right)
     * @type {String} - Location of Sort Popup in Top Filter Panel View
     */
    const topPanelSortPopupLocation = filters.length > 0 && windowWidth < TABLET_MIN_WIDTH ?
        SORT_POPUP_LOCATION.LEFT : SORT_POPUP_LOCATION.RIGHT;

    /**
     * How Long Paginator Component Should Be
     * @type {Number} - Location of Sort Popup in Top Filter Panel View
     */
    const paginatorCount = DESKTOP_SCREEN_SIZE ? PAGINATION_COUNT.DESKTOP : PAGINATION_COUNT.MOBILE;

    /**
     * Whether we are using the top filter panel or not
     * @type {Boolean}
     */
    const isTopFilterPanel = filterPanelType === FILTER_PANEL.TOP;

    /**
     * Whether we are using the top filter panel or not
     * @type {Boolean}
     */
    const isLeftFilterPanel = filterPanelType === FILTER_PANEL.LEFT;

    /**
     **** Class names ****
     */

    /**
     * Class name for the authored theme:
     * light, dark, darkest;
     * @type {String}
     */
    const themeClass = classNames({
        'consonant-u-themeLight': authoredMode === THEME_TYPE.LIGHT,
        'consonant-u-themeDark': authoredMode === THEME_TYPE.DARK,
        'consonant-u-themeDarkest': authoredMode === THEME_TYPE.DARKEST,
    });

    /**
     * Class name for the consonant wrapper:
     * whether consonant wrapper contains left filter;
     * @type {String}
     */
    const wrapperClass = classNames({
        'consonant-Wrapper': true,
        'consonant-Wrapper--32MarginContainer': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_100_VW_32_MARGIN,
        'consonant-Wrapper--83PercentContainier': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_83_VW,
        'consonant-Wrapper--1200MaxWidth': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_1200_PX,
        'consonant-Wrapper--withLeftFilter': filterPanelEnabled && isLeftFilterPanel,
    });

    return (
        <ConfigContext.Provider value={config}>
            <ExpandableContext.Provider value={{ value: openDropdown, setValue: setOpenDropdown }} >
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events */}
                <section
                    role="group"
                    daa-lh={collectionIdentifier}
                    daa-im={String(trackImpressions)}
                    onClick={handleWindowClick}
                    className={`${wrapperClass} ${themeClass}`}>
                    <div className="consonant-Wrapper-inner">
                        {displayLeftFilterPanel && (
                            <div className="consonant-Wrapper-leftFilterWrapper">
                                <LeftFilterPanel
                                    filters={filters}
                                    selectedFiltersQty={selectedFiltersItemsQty}
                                    windowWidth={windowWidth}
                                    onFilterClick={handleFilterGroupClick}
                                    onClearAllFilters={resetFiltersSearchAndBookmarks}
                                    onClearFilterItems={clearFilterItem}
                                    onCheckboxClick={handleCheckBoxChange}
                                    onMobileFiltersToggleClick={handleMobileFiltersToggle}
                                    onSelectedFilterClick={handleCheckBoxChange}
                                    showMobileFilters={showMobileFilters}
                                    resQty={gridCards.length}
                                    bookmarkComponent={(
                                        <Bookmarks
                                            showBookmarks={showBookmarks}
                                            onClick={handleShowBookmarksFilterClick}
                                            savedCardsCount={bookmarkedCardIds.length} />
                                    )}
                                    searchComponent={(
                                        <Search
                                            placeholderText={leftPanelSearchPlaceholder}
                                            name="filtersSideSearch"
                                            value={searchQuery}
                                            autofocus={false}
                                            onSearch={handleSearchInputChange} />
                                    )} />
                            </div>
                        )}
                        <div className="consonant-Wrapper-collection">
                            {
                                isTopFilterPanel &&
                                <FiltersPanelTop
                                    filterPanelEnabled={filterPanelEnabled}
                                    filters={filters}
                                    windowWidth={windowWidth}
                                    resQty={gridCards.length}
                                    onCheckboxClick={handleCheckBoxChange}
                                    onFilterClick={handleFilterGroupClick}
                                    onClearFilterItems={clearFilterItem}
                                    onClearAllFilters={resetFiltersSearchAndBookmarks}
                                    showLimitedFiltersQty={showLimitedFiltersQty}
                                    searchComponent={(
                                        <Search
                                            placeholderText={topPanelSearchPlaceholder}
                                            name="filtersTopSearch"
                                            value={searchQuery}
                                            autofocus={DESKTOP_SCREEN_SIZE}
                                            onSearch={handleSearchInputChange} />
                                    )}
                                    sortComponent={(
                                        <Popup
                                            opened={sortOpened}
                                            id="sort"
                                            val={sortOption}
                                            values={sortOptions}
                                            onSelect={handleSortChange}
                                            name="filtersTopSelect"
                                            autoWidth
                                            optionsAlignment={topPanelSortPopupLocation} />
                                    )}
                                    onShowAllClick={handleShowAllTopFilters} />
                            }
                            {isLeftFilterPanel &&
                                <LeftInfo
                                    enabled={filterPanelEnabled}
                                    filtersQty={filters.length}
                                    filters={filters}
                                    cardsQty={gridCards.length}
                                    selectedFiltersQty={selectedFiltersItemsQty}
                                    windowWidth={windowWidth}
                                    onMobileFiltersToggleClick={handleMobileFiltersToggle}
                                    searchComponent={(
                                        <Search
                                            placeholderText={searchPlaceholderText}
                                            name="searchFiltersInfo"
                                            value={searchQuery}
                                            autofocus={false}
                                            onSearch={handleSearchInputChange} />
                                    )}
                                    sortComponent={(
                                        <Popup
                                            opened={sortOpened}
                                            id="sort"
                                            val={sortOption}
                                            values={sortOptions}
                                            onSelect={handleSortChange}
                                            autoWidth={false}
                                            optionsAlignment="right" />
                                    )}
                                    sortOptions={sortOptions} />
                            }
                            {atLeastOneCard ?
                                <Fragment>
                                    <Grid
                                        resultsPerPage={resultsPerPage}
                                        pages={currentPage}
                                        cards={gridCards}
                                        onCardBookmark={handleCardBookmarking} />
                                    {displayLoadMore && (
                                        <LoadMore
                                            onClick={onLoadMoreClick}
                                            show={numCardsToShow}
                                            total={gridCards.length} />
                                    )}
                                    {displayPaginator &&
                                        <Paginator
                                            pageCount={paginatorCount}
                                            currentPageNumber={currentPage}
                                            totalPages={totalPages}
                                            showItemsPerPage={resultsPerPage}
                                            totalResults={gridCards.length}
                                            onClick={setCurrentPage} />
                                    }
                                </Fragment> : (
                                    isLoading && (
                                        <Loader
                                            size={LOADER_SIZE.BIG}
                                            hidden={!totalCardLimit}
                                            absolute />
                                    )
                                )
                            }
                            {!isApiFailure && !atLeastOneCard && !isLoading &&
                                <NoResultsView
                                    title={noResultsTitle}
                                    description={noResultsDescription}
                                    replaceValue={searchQuery} />
                            }
                            {isApiFailure &&
                                <NoResultsView
                                    title={apiFailureTitle}
                                    description={apiFailureDescription}
                                    replaceValue="" />
                            }
                        </div>
                    </div>
                </section>
            </ExpandableContext.Provider>
        </ConfigContext.Provider>
    );
};

Container.propTypes = {
    config: shape(configType),
};

Container.defaultProps = {
    config: {},
};

export default Container;
