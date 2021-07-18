import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    screen,
    waitFor,
    fireEvent,
    getByText,
    getByTestId,
    queryAllByTestId,
    act,
    render,
} from '@testing-library/react';


import Container from '../Container';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import config from '../../Testing/Mocks/config.json';
import cards from '../../Testing/Mocks/cards.json';


setupIntersectionObserverMock();

const MOBILE_WIDTH = 601;
const DESKTOP_WIDTH = 1800;
const TABLET_MIN_WIDTH = 768;

const { filterPanel: { filters } } = config;

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ cards }),
    }));


/**
 * This method more than 2 filters with different ids
  * @type {{id: string}[]}
 */
const multipleFilters = [...filters, ...filters]
    .map((item, index) => ({ ...item, id: `${item}_${index}` }));

beforeEach(() => {
    window.history.replaceState(null, '', window.location.pathname);
});
describe('Consonant/Container/Top Filters/Mobile', () => {
    test('Should render Sort Pop up On The Left', async () => {
        global.innerWidth = MOBILE_WIDTH;
        const configToUse = config;
        configToUse.filterPanel.type = 'top';
        await act(async () => render(<Container config={configToUse} />));

        // Need wait for api response and state updating
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        const sortPopup = screen.getByTestId('consonant-Select-btn');
        fireEvent.click(sortPopup);

        const optionsList = screen.queryByTestId('consonant-Select-options');

        expect(optionsList).toHaveClass('consonant-Select-options--left');
    });

    test('Should close filters on blur', async () => {
        global.innerWidth = MOBILE_WIDTH;
        const configToUse = config;
        configToUse.filterPanel.type = 'top';
        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getAllByTestId('consonant-TopFilter'));

        const [firstFilterItem] = screen.queryAllByTestId('consonant-TopFilter');

        const filterItemLink = getByTestId(firstFilterItem, 'consonant-TopFilter-link');

        fireEvent.click(filterItemLink);

        const selectButton = screen.getByTestId('consonant-Select-btn');
        fireEvent.click(selectButton);

        expect(firstFilterItem).not.toHaveClass('consonant-left-filters_opened');
    });
});

describe('Consonant/Container/Top Filters/Tablet', () => {
    test('should show search icon on blur', async () => {
        global.innerWidth = TABLET_MIN_WIDTH;
        const configToUse = config;
        configToUse.filterPanel.type = 'top';
        await act(async () => render(<Container config={configToUse} />));

        const iconElement = screen.queryByTestId('search-icon');

        // SearchIcon should be exists after mount
        expect(iconElement).not.toBeNull();
        // Search field should be exists after mount
        expect(screen.queryByTestId('filtersTopSearch')).toBeNull();

        fireEvent.click(iconElement);
        /**
         * After we click the SearchIcon - The Search field should be rendered
         */
        await waitFor(() => screen.getByTestId('filtersTopSearch'));

        // SearchIcon should be exists after we click on the SearchIcon
        expect(screen.queryByTestId('search-icon')).not.toBeNull();

        // Search field should be exists after we click on SearchIcon
        expect(screen.queryByTestId('filtersTopSearch')).not.toBeNull();

        // We should click on another element, e.g. Select field
        fireEvent.click(screen.getByTestId('consonant-Select-btn'));
        /**
         * After click on a another element
         * The SearchIcon should still exist
         * The search field shouldn't exist, however
         */
        expect(screen.queryByTestId('search-icon')).not.toBeNull();
        expect(screen.queryByTestId('filtersTopSearch')).toBeNull();
    });

    test('should show the search input after we click on the search icon', async () => {
        global.innerWidth = TABLET_MIN_WIDTH;
        const configToUse = config;
        configToUse.filterPanel.type = 'top';
        await act(async () => render(<Container config={configToUse} />));

        const iconElement = screen.queryByTestId('search-icon');

        // SearchIcon should still exist after mounting
        expect(iconElement).not.toBeNull();
        // Search field should still exist after mounting
        expect(screen.queryByTestId('filtersTopSearch')).toBeNull();

        fireEvent.click(iconElement);
        /**
         * After we click on the SearchIcon - The Search field should be rendered
         * Need wait for it
         */
        await waitFor(() => screen.getByTestId('filtersTopSearch'));

        // SearchIcon should still exist after we click on the SearchIcon
        expect(screen.queryByTestId('search-icon')).not.toBeNull();

        // Search field should still exist we after click on the SearchIcon
        expect(screen.queryByTestId('filtersTopSearch')).not.toBeNull();
    });

    test('should toggle all filters', async () => {
        global.innerWidth = TABLET_MIN_WIDTH;
        const configToUse = config;
        configToUse.filterPanel.type = 'top';
        configToUse.filterPanel.filters = multipleFilters;

        const { moreFiltersBtnText } = config.filterPanel.i18n.topPanel;

        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getByText(moreFiltersBtnText));

        screen.queryAllByTestId('consonant-TopFilters-filters').forEach((element) => {
            expect(element).toHaveClass('consonant-TopFilters-filters--truncated');
        });

        const showMoreButton = screen.getByText(moreFiltersBtnText);

        fireEvent.click(showMoreButton);

        screen.queryAllByTestId('consonant-TopFilters-filters').forEach((element) => {
            expect(element).not.toHaveClass('consonant-TopFilters-filters--truncated');
        });
    });
});

describe('Consonant/Top Filters/Desktop', () => {
    test('should render with the top filter', async () => {
        global.innerWidth = DESKTOP_WIDTH;
        const configToUse = config;
        configToUse.filterPanel.type = 'top';
        await act(async () => render(<Container config={configToUse} />));

        // search for FilterPanelTop in the whole DOM tree
        const filtersTopElement = screen.queryByTestId('consonant-TopFilters');

        // search for FilterPanelTop and FilterInfo in the whole DOM tree
        const filtersLeftElement = screen.queryByTestId('consonant-LeftFilters');
        const filtersInfoElement = screen.queryByTestId('consonant-TopFilters-infoWrapper');

        expect(filtersTopElement).not.toBeNull();

        expect(filtersLeftElement).toBeNull();
        expect(filtersInfoElement).toBeNull();
    });

    test('should render select with right alignment', async () => {
        global.innerWidth = DESKTOP_WIDTH;
        const configToUse = config;
        configToUse.filterPanel.type = 'top';
        await act(async () => render(<Container config={configToUse} />));

        // Need to wait for the api response and state updating
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        const sortPopup = screen.getByTestId('consonant-Select-btn');
        fireEvent.click(sortPopup);

        const optionsList = screen.queryByTestId('consonant-Select-options');

        expect(optionsList).toHaveClass('consonant-Select-options--right');
    });

    test('should filter cards without sort select', async () => {
        global.innerWidth = DESKTOP_WIDTH;
        const configToUse = config;
        configToUse.sort.options = undefined;
        configToUse.filterPanel.type = 'top';
        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        const optionsList = screen.queryByTestId('consonant-Select-options');

        expect(optionsList).toBeNull();
    });

    test('should search cards without filters', async () => {
        global.innerWidth = DESKTOP_WIDTH;
        const configToUse = config;
        configToUse.sort = null;
        configToUse.filterPanel.type = 'top';
        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getAllByTestId('consonant-TopFilter'));

        const [firstFilter] = screen.queryAllByTestId('consonant-TopFilter');

        const [firstFilterCheckbox] = queryAllByTestId(firstFilter, 'consonant-TopFilter-itemCheckbox');

        fireEvent.click(firstFilterCheckbox);

        expect(firstFilterCheckbox.checked).toBeTruthy();
    });

    test('should open only the selected filter', async () => {
        global.innerWidth = DESKTOP_WIDTH;
        const configToUse = config;
        configToUse.filterPanel.type = 'top';
        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getAllByTestId('consonant-TopFilter'));

        const [firstFilterItem, secondFilterItem] = screen.queryAllByTestId('consonant-TopFilter');
        const [firstFilterLink, secondFilterLink] = screen.queryAllByTestId('consonant-TopFilter-link');

        fireEvent.click(firstFilterLink);

        expect(firstFilterItem).toHaveClass('is-opened');

        fireEvent.click(secondFilterLink);

        expect(secondFilterItem).toHaveClass('is-opened');
        expect(firstFilterItem).not.toHaveClass('is-opened');
    });

    test('should clear all selected checkboxes', async () => {
        global.innerWidth = DESKTOP_WIDTH;
        const configToUse = config;
        configToUse.filterPanel.type = 'top';
        const { clearAllFiltersText } = config.filterPanel.i18n.topPanel;
        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getAllByTestId('consonant-TopFilter'));

        const [firstFilter, secondFilter] = screen.queryAllByTestId('consonant-TopFilter');

        const [firstFilterCheckbox] = queryAllByTestId(firstFilter, 'consonant-TopFilter-itemCheckbox');
        const [secondFilterCheckbox] = queryAllByTestId(secondFilter, 'consonant-TopFilter-itemCheckbox');

        fireEvent.click(firstFilterCheckbox);
        fireEvent.click(secondFilterCheckbox);

        expect(firstFilterCheckbox.checked).toBeTruthy();
        expect(secondFilterCheckbox.checked).toBeTruthy();

        const clearAllFiltersButton = screen.getByText(clearAllFiltersText);

        fireEvent.click(clearAllFiltersButton);

        expect(firstFilterCheckbox.checked).toBeFalsy();
        expect(secondFilterCheckbox.checked).toBeFalsy();
    });

    test('should clear all selected checkboxes only in the first filter', async () => {
        global.innerWidth = DESKTOP_WIDTH;
        const configToUse = config;
        configToUse.filterPanel.type = 'top';
        configToUse.filterPanel.filterLogic = 'or';

        const { clearFilterText } = config.filterPanel.i18n.topPanel.mobile.group;
        await act(async () => render(<Container config={configToUse} />));


        await waitFor(() => screen.getAllByTestId('consonant-TopFilter'));

        const [firstFilter, secondFilter] = screen.queryAllByTestId('consonant-TopFilter');

        const [firstFilterCheckbox] = queryAllByTestId(firstFilter, 'consonant-TopFilter-itemCheckbox');
        const [secondFilterCheckbox] = queryAllByTestId(secondFilter, 'consonant-TopFilter-itemCheckbox');

        fireEvent.click(firstFilterCheckbox);
        fireEvent.click(secondFilterCheckbox);

        expect(firstFilterCheckbox.checked).toBeTruthy();
        expect(secondFilterCheckbox.checked).toBeTruthy();

        await waitFor(() => getByText(firstFilter, clearFilterText));

        const firstFilterClearButton = getByText(firstFilter, clearFilterText);

        fireEvent.click(firstFilterClearButton);

        expect(firstFilterCheckbox.checked).toBeFalsy();
        expect(secondFilterCheckbox.checked).toBeTruthy();
    });

    test('No title authored but show total results authored should still show total results', async () => {
        global.innerWidth = DESKTOP_WIDTH;
        const configToUse = config;
        configToUse.filterPanel.type = 'top';
        configToUse.filterPanel.filterLogic = 'or';
        configToUse.collection.i18n.title = '';
        configToUse.collection.showTotalResults = true;

        await act(async () => render(<Container config={configToUse} />));

        expect(screen.queryByTestId('consonant-TopFilters-results')).not.toBeNull();
    });
});

