import React from 'react';
import {
    arrayOf,
    shape,
    func,
} from 'prop-types';

import { filterItemType } from '../../types/config';

const ItemsType = {
    handleCheck: func.isRequired,
    items: arrayOf(shape(filterItemType)).isRequired,
};

/**
 * Options of the left filter item
 *
 * @component
 * @example
 * const props= {
    items: Array,
    handleCheck: Function,
 * }
 * return (
 *   <Items {...props}/>
 * )
 */
const Items = (props) => {
    const {
        items,
        handleCheck,
    } = props;

    return (
        <ul
            data-testid="consonant-LeftFilter-items"
            className="consonant-LeftFilter-items">
            {items.map(item => (
                <li
                    key={item.id}
                    data-testid="consonant-LeftFilter-item"
                    className="consonant-LeftFilter-item">
                    <label
                        htmlFor={item.id}
                        className="consonant-LeftFilter-itemLabel">
                        <input
                            data-testid="consonant-LeftFilter-itemCheckbox"
                            id={item.id}
                            value={item.id}
                            type="checkbox"
                            onChange={handleCheck}
                            checked={item.selected}
                            tabIndex="0" />
                        <span
                            className="consonant-LeftFilter-itemCheckmark" />
                        <span
                            className="consonant-LeftFilter-itemName">
                            {item.label}
                        </span>
                    </label>
                </li>
            ))}
        </ul>
    );
};

Items.propTypes = ItemsType;

/* eslint-disable-next-line import/prefer-default-export */
export { Items };
