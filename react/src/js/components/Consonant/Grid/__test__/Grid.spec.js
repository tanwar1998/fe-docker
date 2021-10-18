import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Grid from '../Grid';

import { DEFAULT_PROPS, GRID_ANALYTICS } from '../../Testing/Constants/Grid';

import setup from '../../Testing/Utils/Settings';

const renderCardsGrid = setup(Grid, DEFAULT_PROPS);

describe('Consonant/Grid', () => {
    test('should render 1 card if on page 1 and 1 card rendered per page', () => {
        renderCardsGrid({ page: 1 });

        const cardElementList = screen.queryAllByTestId('consonant-OneHalfCard');

        expect(cardElementList).toHaveLength(1);
    });
    test('should be able to render all cards', () => {
        const {
            props: { cards },
        } = renderCardsGrid({ resultsPerPage: Number.MAX_SAFE_INTEGER }, { pagination: { type: 'loadMore' } });

        const threeByTwoCards = screen.queryAllByTestId('consonant-OneHalfCard');
        const oneByOneCards = screen.queryAllByTestId('consonant-ThreeFourthCard');
        const fullCards = screen.queryAllByTestId('consonant-FullCard');

        const totalCards = threeByTwoCards.length + oneByOneCards.length + fullCards.length;
        expect(totalCards).toEqual(cards.length);
    });
    test('should load analytics onto cards', () => {
        const {
            props: { cards },
        } = renderCardsGrid({ resultsPerPage: Number.MAX_SAFE_INTEGER }, { pagination: { type: 'loadMore' } });
        const fullCards = screen.queryAllByTestId('consonant-OneHalfCard');
        fullCards.forEach( (card, index) => {
            expect(card).toHaveAttribute('daa-lh', GRID_ANALYTICS[index]);
        });
    });
});
