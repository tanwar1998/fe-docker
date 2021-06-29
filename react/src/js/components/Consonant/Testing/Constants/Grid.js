
import { collection } from '../Mocks/config.json';
import cards from '../Mocks/cards.json';

export const DEFAULT_PROPS = {
    cards,

    pages: 10,
    resultsPerPage: 1,

    onCardBookmark: jest.fn(),
};

export const GRID_PROPS = [
    'one-half',
    'three-fourth',
    'none',
    'full-card',
].map(cardStyle => ({ ...collection, cardStyle }));
