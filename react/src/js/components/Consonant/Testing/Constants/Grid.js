
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

export const GRID_ANALYTICS = [
    'Card 0 | 3 - Infobit | 3',
    'Card 1 | Some Title 5 | 4',
    'Card 2 | 5 - infobit | 5',
    'Card 3 | 6 - infobit | 6',
    'Card 4 | 10 - Infobit | 10',
    'Card 5 | 12 - Infobit | 12',
    'Card 6 | 14 Infobit | N',
    'Card 7 | 11 - Infobit | 11',
    'Card 8 | 7 - Infobit | 7',
    'Card 9 | 13 Infobit | 13',
    'Card 10 | 14 - Infobit | 14',
    'Card 11 | 8 - Infobit | 8',
    'Card 12 | Infobit 15 | 9',
    'Card 13 | 15 Infobit | 15',
    'Card 14 | 16 - Infobit | 16',
    'Card 15 | 16 - Infobit | 17',
    'Card 16 | 18 - Infobit: Link w/ Icon use case | 18',
    'Card 17 | No Footer Defined | 19',
    'Card 18 | No Footer Defined | 20',
    'Card 19 | No Footer Defined | 21',
    'Card 20 | No Footer Defined | 22',
    'Card 21 | No Footer Defined | 23'
]
