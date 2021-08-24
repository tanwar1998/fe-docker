import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    screen,
    waitFor,
    fireEvent,
    queryAllByTestId,
    act,
    render,
} from '@testing-library/react';

import Container from '../Container';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import config from '../../Testing/Mocks/config.json';
import cards from '../../Testing/Mocks/cards.json';

const DESKTOP_WIDTH = 1800;
const TABLET_MIN_WIDTH = 768;

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ cards }),
    }));


window.scrollTo = () => { };
jest.setTimeout(30000);


setupIntersectionObserverMock();

beforeEach(() => {
    window.history.replaceState(null, '', window.location.pathname);
});
describe('Consonant/Container/Left Filter', () => {
    test('Should be able to render the left filter', async () => {
        const configToUse = config;
        configToUse.filterPanel.type = 'left';

        await act(async () => render(<Container config={configToUse} />));

        // Top Filter Panel Should NOT Exist
        const filtersTopElement = screen.queryByTestId('consonant-TopFilters');
        expect(filtersTopElement).toBeNull();

        // Grab thee Left Filter Panel and Info Bar
        const filtersLeftElement = screen.queryByTestId('consonant-LeftFilters');
        const filtersInfoElement = screen.queryByTestId('consonant-FiltersInfo');

        expect(filtersLeftElement).not.toBeNull();
        expect(filtersInfoElement).not.toBeNull();
    });

    test('Should be able to render the card collection', async () => {
        const configToUse = config;

        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        expect(screen.getByTestId('consonant-CardsGrid')).not.toBeNull();
    });

    test('Should allow users to check filter checkboxes', async () => {
        const configToUse = config;
        configToUse.filterPanel.filterLogic = 'xor';

        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getAllByTestId('consonant-LeftFilter-itemCheckbox'));

        const filtersLeftElement = screen.getByTestId('consonant-LeftFilters');
        const [firstCheckbox] = queryAllByTestId(filtersLeftElement, 'consonant-LeftFilter-itemCheckbox');

        expect(firstCheckbox.checked).toBeFalsy();

        fireEvent.click(firstCheckbox);

        expect(firstCheckbox.checked).toBeTruthy();

        fireEvent.click(firstCheckbox);

        expect(firstCheckbox.checked).toBeFalsy();
    });

    test('Should be able to show mobile views', async () => {
        const configToUse = config;
        configToUse.filterPanel.filterLogic = 'xor';

        await act(async () => render(<Container config={configToUse} />));
        global.innerWidth = TABLET_MIN_WIDTH;

        const mobileFooterButton = screen.getByTestId('consonant-LeftFilters-mobileFooterBtn');
        const filtersLeftElement = screen.getByTestId('consonant-LeftFilters');

        expect(filtersLeftElement).not.toHaveClass('is-opened');

        fireEvent.click(mobileFooterButton);

        expect(filtersLeftElement).toHaveClass('is-opened');
    });


    test('should be able to search and filter', async () => {
        const configToUse = config;
        configToUse.filterPanel.filterLogic = 'xor';
        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        const searchInput = screen.getByTestId('consonant-Search-input');

        fireEvent.change(searchInput, { target: { value: 'Some Title 5' } });

        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        expect(screen.queryAllByTestId('consonant-OneHalfCard')).toHaveLength(1);

        const [firstFilter] = screen.queryAllByTestId('consonant-LeftFilter');

        const [firstFilterCheckbox] = queryAllByTestId(firstFilter, 'consonant-LeftFilter-itemCheckbox');

        fireEvent.click(firstFilterCheckbox);

        expect(firstFilterCheckbox.checked).toBeTruthy();
        expect(screen.queryAllByTestId('consonant-card')).toHaveLength(0);
    });

    test('should be able to open groups of filters', async () => {
        const configToUse = config;
        configToUse.filterPanel.filterLogic = 'xor';
        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getAllByTestId('consonant-LeftFilter'));

        const [firstFilterGroup, secondFilterGroup] = screen.queryAllByTestId('consonant-LeftFilter');
        const [firstFilterItem, secondFilterItem] = screen.queryAllByTestId('consonant-LeftFilter-link');

        fireEvent.click(firstFilterItem);

        expect(firstFilterGroup).toHaveClass('is-opened');

        fireEvent.click(secondFilterItem);

        expect(firstFilterGroup).toHaveClass('is-opened');
        expect(secondFilterGroup).toHaveClass('is-opened');
    });
});

describe('Consonant/Left Filter/Selected Filter Pills', () => {
    test('testing multiple clicks -- so selected filter pills show', async () => {
        const configToUse = config;
        configToUse.filterPanel.filterLogic = 'or';
        configToUse.filterPanel.type = 'left';
        global.innerWidth = DESKTOP_WIDTH;

        await act(async () => render(<Container config={configToUse} />));
        // Need to wait for all checkboxes to render
        await waitFor(() => screen.getAllByTestId('consonant-LeftFilter-itemCheckbox'));

        const filterElements = screen.getAllByTestId('consonant-LeftFilter');
        const firstFilterElement = filterElements[0];

        const [firstCheckbox] = queryAllByTestId(firstFilterElement, 'consonant-LeftFilter-itemCheckbox');

        fireEvent.click(firstCheckbox);

        await waitFor(() => screen.getAllByTestId('consonant-ChosenFilter'));
        const [selectedFilter] = screen.getAllByTestId('consonant-ChosenFilter');

        expect(selectedFilter).not.toBeNull();
    });
});

