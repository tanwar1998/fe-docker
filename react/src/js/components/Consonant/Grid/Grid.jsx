import React from 'react';
import classNames from 'classnames';
import {
    func,
    shape,
    number,
    arrayOf,
} from 'prop-types';
import parseHTML from 'html-react-parser';

import FullCard from '../Cards/Full';
import { cardType } from '../types/card';
import { getByPath } from '../Helpers/general';
import { useConfig } from '../Helpers/hooks';
import ThreeFourthCard from '../Cards/ThreeFourth';
import OneHalfCard from '../Cards/OneHalf';
import HalfHeightCard from '../Cards/HalfHeight';
import DoubleWideCard from '../Cards/DoubleWide';
import {
    CARD_STYLES,
    DEFAULT_SHOW_ITEMS_PER_PAGE,
    GRID_TYPE,
    GUTTER_SIZE,
} from '../Helpers/constants';


const cardsGridType = {
    pages: number,
    resultsPerPage: number,
    cards: arrayOf(shape(cardType)),
    onCardBookmark: func.isRequired,
};

const defaultProps = {
    pages: 1,
    cards: [],
    resultsPerPage: DEFAULT_SHOW_ITEMS_PER_PAGE,
};

/**
 * Contains a grid of cards (of different styles)
 *
 * @component
 * @example
 * const props= {
    resultPerPage: Int,
    pages: Int,
    onCardBookmark: Boolean,
    cards: [],
 * }
 * return (
 *   <CardsGrid {...props}/>
 * )
 */
const Grid = (props) => {
    const {
        resultsPerPage,
        pages,
        onCardBookmark,
        cards,
    } = props;

    /**
     **** Authored Configs ****
     */
    const getConfig = useConfig();
    const collectionStyleOverride = getConfig('collection', 'cardStyle');
    const cardsGridLayout = getConfig('collection', 'layout.type');
    const cardsGridGutter = getConfig('collection', 'layout.gutter');
    const renderCardsBorders = getConfig('collection', 'setCardBorders');
    const dateFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    const locale = getConfig('language', '');
    const paginationType = getConfig('pagination', 'type');
    const customCard = getConfig('customCard');

    /**
     * Class name for the cards grid:
     * whether the grid should show 2, 3, 4 or 5 cards in a row;
     * whether the grid should have a gutter of 8px, 16px, 24px or 32px;
     * @type {String}
     */
    const gridClass = classNames({
        'consonant-CardsGrid': true,
        'consonant-CardsGrid--2up': cardsGridLayout === GRID_TYPE.TWO_UP,
        'consonant-CardsGrid--3up': cardsGridLayout === GRID_TYPE.THREE_UP,
        'consonant-CardsGrid--4up': cardsGridLayout === GRID_TYPE.FOUR_UP,
        'consonant-CardsGrid--5up': cardsGridLayout === GRID_TYPE.FIVE_UP,
        'consonant-CardsGrid--with1xGutter': cardsGridGutter === GUTTER_SIZE.GUTTER_1_X,
        'consonant-CardsGrid--with2xGutter': cardsGridGutter === GUTTER_SIZE.GUTTER_2_X,
        'consonant-CardsGrid--with3xGutter': cardsGridGutter === GUTTER_SIZE.GUTTER_3_X,
        'consonant-CardsGrid--with4xGutter': cardsGridGutter === GUTTER_SIZE.GUTTER_4_X,
        'consonant-CardsGrid--doubleWideCards': collectionStyleOverride === CARD_STYLES.DOUBLE_WIDE,
    });

    const bannerMap = {
        live: {
            description: getConfig('banner', 'live.description'),
            backgroundColor: '#ffffff',
            fontColor: '#d7373f',
            icon: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Location_dot_red.svg',
        },
        upcoming: {
            description: getConfig('banner', 'upcoming.description'),
            backgroundColor: '#cb6f10',
            fontColor: '#ffffff',
            icon: '',
        },
        onDemand: {
            description: getConfig('banner', 'onDemand.description'),
            backgroundColor: '#1372e5',
            fontColor: '#ffffff',
            icon: '',
        },
    };

    /**
     * Whether the paginator component is being used
     * @type {Boolean}
     */
    const isPaginator = paginationType === 'paginator';
    const isLoadMore = paginationType === 'loadMore';

    /**
     * Total pages to show (used if paginator component is set)
     * @type {Number}
     */
    const totalPages = resultsPerPage * pages;

    /**
     * The final cards to show in the collection
     * @type {Array}
     */
    let cardsToshow = cards;

    /**
     * Current page (used if paginator component is authored)
     * @type {Number}
     */
    const currentPage = resultsPerPage * (pages - 1);

    if (isPaginator) {
        cardsToshow = cards.slice(currentPage, totalPages);
    }

    /**
     * Current page (used if load more button is authored)
     * @type {Number}
     */
    if (isLoadMore) {
        cardsToshow = cards.slice(0, resultsPerPage * pages);
    }

    return cardsToshow.length > 0 && (
        <div
            data-testid="consonant-CardsGrid"
            className={gridClass}>
            {cardsToshow.map((card, index) => {
                const cardStyleOverride = getByPath(card, 'styles.typeOverride');
                const cardStyle = collectionStyleOverride || cardStyleOverride;

                if (cardStyle === CARD_STYLES.FULL) {
                    return (
                        <FullCard
                            lh={`Card ${index} | ${card.contentArea.title}`}
                            key={card.id}
                            {...card}
                            bannerMap={bannerMap}
                            renderBorder={renderCardsBorders} />
                    );
                } else if (cardStyle === CARD_STYLES.SQUARE) {
                    return (
                        <ThreeFourthCard
                            lh={`Card ${index} | ${card.contentArea.title}`}
                            key={card.id}
                            {...card}
                            bannerMap={bannerMap}
                            renderBorder={renderCardsBorders} />
                    );
                } else if (cardStyle === CARD_STYLES.HALF_HEIGHT) {
                    return (
                        <HalfHeightCard
                            lh={`Card ${index} | ${card.contentArea.title}`}
                            key={card.id}
                            {...card}
                            bannerMap={bannerMap}
                            renderBorder={renderCardsBorders} />
                    );
                } else if (cardStyle === CARD_STYLES.DOUBLE_WIDE) {
                    return (
                        <DoubleWideCard
                            lh={`Card ${index} | ${card.contentArea.title}`}
                            key={card.id}
                            {...card}
                            renderBorder={renderCardsBorders} />
                    );
                } else if (cardStyle === CARD_STYLES.CUSTOM) {
                    return parseHTML(customCard(card));
                }
                return (
                    <OneHalfCard
                        lh={`Card ${index} | ${card.contentArea.title}`}
                        key={card.id}
                        {...card}
                        onClick={onCardBookmark}
                        dateFormat={dateFormat}
                        locale={locale}
                        bannerMap={bannerMap}
                        renderBorder={renderCardsBorders} />
                );
            })}
        </div>
    );
};

Grid.propTypes = cardsGridType;
Grid.defaultProps = defaultProps;

export default Grid;
