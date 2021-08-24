import { bookmarks, collection } from '../Mocks/config.json';

import cardList from '../Mocks/cards.json';

const { i18n: { prettyDateIntervalFormat } } = collection;
const {
    leftFilterPanel: {
        bookmarkOnlyCollection,
    },
} = bookmarks;
const [{
    id,
    badgeText,
    footer,
    styles,
    contentArea,
    overlays,
}] = cardList;

const CARD_PROPS = {
    id,
    styles,
    overlays,
    badgeText,
    contentArea,
};

export const DEFAULT_PROPS_ONE_HALF = {
    ...CARD_PROPS,

    footer,
    isBookmarked: false,
    dateFormat: prettyDateIntervalFormat,
    disableBookmarkIco: Boolean(bookmarkOnlyCollection),

    onClick: jest.fn(),
};

export const DEFAULT_PROPS_1_1 = {
    ...CARD_PROPS,

    ctaLink: 'some_link',
};

export const DEFAULT_PROPS_FULL = {
    ...CARD_PROPS,
};
