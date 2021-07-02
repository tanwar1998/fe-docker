import React from 'react';
import {
    number,
    func,
} from 'prop-types';

import { Button as ButtonSpectrum } from '@adobe/react-spectrum';

import { useConfig } from '../Helpers/hooks';

const loadMoreType = {
    show: number.isRequired,
    total: number.isRequired,
    onClick: func.isRequired,
};

/**
 * Load More - Button That Naviates Users To The Next Page
 *
 * @component
 * @example
 * const props= {
    show: Int,
    total: Int,
    onClick: Function,
 * }
 * return (
 *   <LoadMore {...props}/>
 * )
 */
const LoadMore = ({
    show,
    total,
    onClick,
}) => {
    const getConfig = useConfig();

    /**
     * Authored Button Text
     * @type {String}
     */
    const loadMoreButtonText = getConfig('pagination', 'i18n.loadMore.btnText');

    /**
     * Authored Summary Text
     * @type {String}
     */
    const loadMoreQuantityText = getConfig('pagination', 'i18n.loadMore.resultsQuantityText');

    /**
     * Summary Of Load More Results To Show To Users
     * @type {String}
     */
    const summaryText = loadMoreQuantityText
        .replace('{start}', show)
        .replace('{end}', total);

    const shouldDisplayLoadMore = show > 0 && total > 0;
    const shouldDisplayLoadMoreBtn = show < total;

    return (shouldDisplayLoadMore) ? (
        <div
            data-testid="consonant-LoadMore"
            className="consonant-LoadMore">
            <div className="consonant-LoadMore-inner">
                <p
                    data-testid="consonant-LoadMore-text"
                    className="consonant-LoadMore-text">
                    {summaryText}
                </p>
                {shouldDisplayLoadMoreBtn &&
                    <ButtonSpectrum
                        type="button"
                        variant="primary"
                        data-testid="consonant-LoadMore-btn"
                        onPress={onClick}
                        tabIndex="0">
                        {loadMoreButtonText}
                    </ButtonSpectrum>
                }
            </div>
        </div>)
        : null;
};

LoadMore.propTypes = loadMoreType;

export default LoadMore;
