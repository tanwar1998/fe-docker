import React from 'react';
import classNames from 'classnames';
import {
    arrayOf,
    shape,
    func,
    number,
} from 'prop-types';

import { filterItemType } from '../../types/config';

const itemsType = {
    handleCheck: func.isRequired,
    stopPropagation: func.isRequired,
    clipWrapperItemsCount: number.isRequired,
    items: arrayOf(shape(filterItemType)).isRequired,
};

/**
 * Options of the top filter
 *
 * @component
 * @example
 * const props= {
    items: Array,
    handleCheck: Function,
    stopPropagation: Function,
    clipWrapperItemsCount: Number,
 * }
 * return (
 *   <Items {...props}/>
 * )
 */
const Items = (props) => {
    const {
        items,
        handleCheck,
        stopPropagation,
        clipWrapperItemsCount,
    } = props;

    /**
     **** Constants ****
     */

    /**
     * Whether the top filter options should be blurred at the bottom of the parent container
     * @type {Boolean}
     */
    const shouldClipItems = items.length >= clipWrapperItemsCount;

    /**
     * Class name for the top filter options wrapper:
     * whether the top filter options should be blurred at the bottom of the parent container
     * @type {String}
     */
    const clipFilterItemsClass = classNames({
        'consonant-TopFilter-items': true,
        'consonant-TopFilter-items--clipped': shouldClipItems,
    });

    return (
        <ul
            data-testid="consonant-TopFilter-items"
            className={clipFilterItemsClass}>
            {items.map(item => (
                <li
                    key={item.id}
                    data-testid="consonant-TopFilter-item"
                    daa-ll={item.label}
                    className="consonant-TopFilter-item">
                    {/* eslint-disable-next-line max-len */}
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                    <label
                        htmlFor={item.id}
                        className="consonant-TopFilter-itemLabel"
                        onClick={stopPropagation}>
                        <input
                            data-testid="consonant-TopFilter-itemCheckbox"
                            id={item.id}
                            value={item.id}
                            type="checkbox"
                            onChange={handleCheck}
                            checked={item.selected}
                            tabIndex="0" />
                        <span
                            className="consonant-TopFilter-itemCheckmark" />
                        <span
                            className="consonant-TopFilter-itemName">
                            {item.label}
                        </span>
                    </label>
                </li>
            ))}
        </ul>
    );
};

Items.propTypes = itemsType;

/* eslint-disable-next-line import/prefer-default-export */
export { Items };
