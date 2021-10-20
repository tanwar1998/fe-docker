/* eslint-disable */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import slice from '../../@dexter/dexterui-tools/lib/utils/dom/slice';
import scroller from '../Helpers/scroller';
import { useConfig } from '../Helpers/hooks';
import Grid from '../Grid/Grid';
import { RenderTotalResults } from '../Helpers/rendering';

const ANIMATION_PAGED = 'paged';
const MIN_INCREMENT = 1;
const NEXT_BUTTON_NAME = 'next';
const PAGE_INCREMENT_VAL = 1;
const PREV_BUTTON_NAME = 'previous';

function CardsCarousel({
    cards,
    onCardBookmark,
    resQty,
} = {}) {
    const getConfig = useConfig();
    const cardsUp = getConfig('collection', 'layout.type');
    const cardsGridGutter = getConfig('collection', 'layout.gutter');
    const carouselAnimationStyle = getConfig('pagination', 'animationStyle');
    const title = getConfig('collection', 'i18n.title');
    const showTotalResults = getConfig('collection', 'showTotalResults');
    const showTotalResultsText = getConfig('collection', 'i18n.totalResultsText');
    const useLightText = getConfig('collection', 'useLightText');
    const isPaged = carouselAnimationStyle === ANIMATION_PAGED;
    // Properties derived from Config Values
    /*
      Ties pageSize to layout instead of cardsPerPage, making sure pageSize
      does not get out of sync which causes calculation errors
    */
    const cardsPerPage = 55;
    window.cards = cards;
    const gutterSize = parseInt(cardsGridGutter, 10) * MIN_INCREMENT;
    // State Stuff
    /**
      * @typedef {Object} controlsStatus
      * @description —
            @attribute {Bool} next: true/false, true show & false hide
            @attribute {Bool} previous: true/false,  true show & false hide
      * @param {Function} setControlsStatus: controlsStatus
      * @description - set Show Hide values next/prevsious buttons
    */
    const [controlsStatus, setControlsStatus] = useState({
        previous: true,
        next: false,
    });
    /**
      * @typedef {Number} pages
      * @description — current page number, default is PAGE_INCREMENT_VAL and is
      incremented by the same value.
      * @param {Function} setPages: setter for pages
      * @description - Update grid thru incrementing number of pages,
      this is used for loading a min number of resources on any individual
      collection load, and works like the "loadMore" functionality.
    */
    const [pages, setPages] = useState(PAGE_INCREMENT_VAL);
    /**
      * @typedef {Number} scrollValue
      * @description — offsetLeft getCurrentZero.nextZero
      * @param {Function} setScrollValue: setter for scrollValue
      * @description - sets next scroll postion based on feedback from getCurrentZero
    */
    const [scrollValue, setScrollValue] = useState(0);
    /**
      * @typedef {HTMLElement} zeroItemEl
      * @description — current value of getCurrentZero.nextZero
      * @param {Function} setScrollValue: setter for zeroItem
      * @description - sets HTMLElement based on getCurrentZero.nextZero
    */
    const [zeroItemEl, setZeroItemEl] = useState({});
    /**
      * @typedef {Number} zeroItemIndex
      * @description — tracks next and previous clicks, default 0
      * @param {Function} setZeroItemIndex: setter for zeroItemIndex
      * @description - sets zeroItemIndex based on Next/Prev button clicks
      tracked in handlePositionChange
    */
    const [zeroItemIndex, setZeroItemIndex] = useState(0);
    const scrollElementRef = useRef(null);
    const nextButtonRef = useRef(null);

    function getCurrentPageSize(cardWidth) {
        const {
            offsetWidth,
        } = scrollElementRef.current;
        /*
         On the return trip considerations have to be made for less than a
         full page of viewable cards and also the gutters.
        */
        const actualPageSize = Math.floor(offsetWidth / (cardWidth + gutterSize));
        /* Give positive integer, 0, or negative integer */
        const pageSizeMod = (actualPageSize - cardsPerPage);
        const adjustedPageSize = (cardsPerPage + pageSizeMod);

        return { adjustedPageSize, pageSizeMod };
    }
    /**
     * @func getCurrentZero
     * @desc really the engine of the interaction meets "State" with
     "Rendered Reality" using what is currently rendered in the scrollElementRef
     *
     * @param {string} direction: next or previous depending on the name of the
     button clicked as determined by handlePositionChange
     * @returns {Object} {}
        getMorePages: Enact paginaiton behaviours, or not,
        nextLeft: stores offsetLeft of nextZero
        nextZero: Stores a representation of the next Zero HTMLElement used in
        calculating updateControls,
    */
    function getCurrentZero(direction) {
        const {
            firstElementChild: {
                children: renderedCards = [],
            } = {},
            scrollWidth,
        } = scrollElementRef.current;
        const { length: collectionLength = 0 } = cards;
        const currentRenderedCards = slice(renderedCards);
        const { length: renderedCardsLength = 0 } = currentRenderedCards;
        const { offsetWidth: cardWidth } = currentRenderedCards[zeroItemIndex];
        const { adjustedPageSize = cardsPerPage, pageSizeMod } = getCurrentPageSize(cardWidth);

        let nextLeftEl = {};
        let incrementalChange = 0;

        if (!isPaged) {
            const {
                nextSibling,
                previousSibling,
            } = currentRenderedCards[zeroItemIndex];

            incrementalChange = direction === NEXT_BUTTON_NAME ?
                zeroItemIndex + 1 : zeroItemIndex - 1;

            nextLeftEl = direction === NEXT_BUTTON_NAME ?
                nextSibling : previousSibling;
        } else {
            incrementalChange = direction === NEXT_BUTTON_NAME ?
                zeroItemIndex + adjustedPageSize :
                zeroItemIndex - adjustedPageSize;

            // Incremental change cannot be less than Zero, if it is, it is zero
            incrementalChange = incrementalChange < 0 ? 0 : incrementalChange;

            nextLeftEl = currentRenderedCards[incrementalChange];
        }

        const clarifyAtEnd = nextLeftEl.offsetLeft +
            (adjustedPageSize * (nextLeftEl.offsetWidth + gutterSize)) > scrollWidth;

        if (isPaged && clarifyAtEnd) {
            const adjustPageSizeMod = pageSizeMod === 0 ? 1 : pageSizeMod;

            // Incremental change cannot be less than Zero, if it is, it is zero
            incrementalChange = incrementalChange - adjustPageSizeMod < 0 ?
                0 : incrementalChange - adjustPageSizeMod;
            // Incremental change cannot be more than cards.length
            const cleanTheOver = (incrementalChange + adjustedPageSize) - cards.length;
            incrementalChange = cleanTheOver >= 0 ?
                incrementalChange - cleanTheOver : incrementalChange - adjustPageSizeMod;

            nextLeftEl = currentRenderedCards[incrementalChange];
        }

        return {
            getMorePages: renderedCardsLength < collectionLength,
            nextIndex: incrementalChange,
            nextLeftVal: nextLeftEl.offsetLeft,
            nextLeftEl,
        };
    }

    let doNotShowNextButton;
    /**
     * @func updateControls
     * @desc updates visbility of controls based on zeroItemIndex,
     the postion and geometry of scrollElementRef and zeroItem
     *
     * @returns {Void} - updates controlsStatus State with setControlsStatus
    */
    function updateControls() {
        /*
         * Offset Width Changes if screen size changes always need current value
         at time of each click. Used in determining "true" page size
        */
        const {
            offsetWidth,
        } = scrollElementRef.current;

        const {
            offsetWidth: zeroItemWidth = 0,
        } = zeroItemEl;

        let pageSizeAdjustOverFlow;
        /*
         This accounts for layouts which essentially fill the viewer minus the
         gutterWidth
         */
        const { adjustedPageSize, pageSizeMod } = getCurrentPageSize(zeroItemWidth);
        const filledUp = offsetWidth - ((zeroItemWidth * cardsPerPage) +
            (gutterSize * adjustedPageSize));
        // If the filledUp remainder is less than the gutterSize
        const isGutterOverflowing = Math.abs(filledUp) <= gutterSize;
        // Makes consideration for filledUp in the adjustedPageSize
        if (!isPaged) {
            pageSizeAdjustOverFlow = pageSizeMod < 0 && isGutterOverflowing ?
                adjustedPageSize + 1 : adjustedPageSize;

            doNotShowNextButton = cards.length -
                (zeroItemIndex + pageSizeAdjustOverFlow) === 0;
        } else {
            pageSizeAdjustOverFlow = pageSizeMod < 0 && isGutterOverflowing ?
                adjustedPageSize + 1 : adjustedPageSize;

            doNotShowNextButton = zeroItemIndex !== 0 &&
                zeroItemIndex + pageSizeAdjustOverFlow >= cards.length;
        }

        // setControlsStatus({
        //     previous: zeroItemIndex >= 1,
        //     next: !(doNotShowNextButton),
        // });
    }
    /**
     * @func handlePositionChange
     * @desc updates the scrollPostion of the scrollElementRef. It interfaces
     getCurrentZero and sets state updates to zeroItem and zeroItemIndex used
     in updateControls. It also updates scrollValue used in an effect to cause
     an update to the scroll position of the scrollElementRef. Also sets pages
     updates for loadMore functionality.
     *
     * @returns {Void} - updates:
     zeroItem with setZeroItem
     zeroItemIndex with setZeroItemIndex
     pages with setPages
     scrollValue with setScrollValue
    */
    let i = 0;

    function handlePositionChange({
        target: {
            name: direction = '',
        },
    } = {}) {
        // const {
        //     getMorePages,
        //     nextIndex,
        //     nextLeftVal,
        //     nextLeftEl,
        // } = getCurrentZero(direction);
        //
        // setZeroItemEl(nextLeftEl);
        //
        // setZeroItemIndex(nextIndex);
        //
        // if (getMorePages) setPages(lastState => lastState + PAGE_INCREMENT_VAL);
        debugger;
        if(direction === 'next'){
            i++;
        } else {
            i--;
        }

        if(i < 0){
            i = 0;
        }

        const totalCardsToShow = 3;
        if(i < totalCardsToShow){
            i = totalCardsToShow;
        }


        let nextLeftVal = (376 + 32) * i;
        /*
            The 8px adjustment is a min increment and allows for hover effects
            to be visible on the outer edges of the visible area.
        */
        setScrollValue(nextLeftVal);
    }

    const carouselTitleClass = classNames({
        'consonant-CarouselInfo-collectionTitle': true,
        'consonant-CarouselInfo-collectionTitle--withLightText': useLightText,
    });

    const carouselTotalResultsClass = classNames({
        'consonant-CarouselInfo-results': true,
        'consonant-CarouselInfo-results--withLightText': useLightText,
    });

    const totalResultsHtml = RenderTotalResults(showTotalResultsText, resQty);

    window.foo = {
        scroller,
        current: scrollElementRef.current,
        value: scrollValue,
    };

    useEffect(() => {
        updateControls();

        scroller(
            scrollElementRef.current,
            scrollValue,
            {
                duration: isPaged ? 500 : 200,
            },
        );
    }, [scrollValue]);

    useEffect(() => {
        if (cards.length) {
            const {
                firstElementChild: {
                    children: renderedCards = [],
                } = {},
            } = scrollElementRef.current;

            setZeroItemEl(slice(renderedCards)[0]);
            updateControls();
        }

    }, []);

    window.addEventListener('resize', handleResize);

    function handleResize() {
        const flag = true;
        if (flag) {
            try {
                debugger;
                let lastCardPosL = scrollElementRef.current.querySelector(".consonant-CardsGrid")
                    .lastChild
                    .getBoundingClientRect().left;
                let containerR = scrollElementRef.current.getBoundingClientRect().right;

                if (containerR - lastCardPosL < 378 && containerR - lastCardPosL > 0) {
                    setControlsStatus({
                        previous: zeroItemIndex >= 1,
                        next: true,
                    });
                }
            } catch (e) {
            }
        }
    }

    return (
        <Fragment>
            <nav className="consonant-Navigation--carousel">
                {controlsStatus.previous &&
                <button
                    aria-label="Previous button"
                    className="consonant-Button--previous"
                    onClick={handlePositionChange}
                    daa-ll="Previous"
                    daa-state="true"
                    name={PREV_BUTTON_NAME}
                    type="button" />}
                {controlsStatus.next &&
                <button
                    ref={nextButtonRef}
                    aria-label="Next button"
                    className="consonant-Button--next"
                    daa-ll="Next"
                    daa-state="true"
                    onClick={handlePositionChange}
                    name={NEXT_BUTTON_NAME}
                    type="button" /> }
            </nav>
            <div
                className="consonant-CarouselInfo">
                {title &&
                    <h2
                        data-testid="consonant-CarouselInfo-collectionTitle"
                        className={carouselTitleClass}>
                        {title}
                    </h2>
                }
                {showTotalResults &&
                    <div
                        data-testid="consonant-CarouselInfo-results"
                        className={carouselTotalResultsClass}>
                        {totalResultsHtml}
                    </div>
                }
            </div>
            <div
                className="consonant-Container--carousel"
                ref={scrollElementRef}>
                <Grid
                    cards={cards}
                    containerType="carousel"
                    resultsPerPage={cardsPerPage}
                    onCardBookmark={onCardBookmark}
                    pages={pages} />
            </div>
        </Fragment>
    );
}

export default CardsCarousel;


CardsCarousel.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
    onCardBookmark: PropTypes.func.isRequired,
    resQty: PropTypes.number.isRequired,
};
