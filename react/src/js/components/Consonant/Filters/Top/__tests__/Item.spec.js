import '@testing-library/jest-dom/extend-expect';
import {
    screen,
    fireEvent,
} from '@testing-library/react';

import { Group as Item } from '../Group';
import setup from '../../../Testing/Utils/Settings';
import {
    DEFAULT_PROPS,
    selectedAllItems,
    ANALYTICS_ITEMS,
} from '../../../Testing/Constants/FilterItem';

const renderTopFilterItem = setup(Item, DEFAULT_PROPS);

describe('Consonant/Filters/Top/Item', () => {
    test('Should be able to render without an item count badge', () => {
        renderTopFilterItem();

        const badgeElement = screen.queryByTestId('consonant-TopFilter-itemBadge');
        expect(badgeElement).toBeNull();
    });

    test('Should be able to render all list items', () => {
        const { props: { items } } = renderTopFilterItem();

        const filterItemElement = screen.queryAllByTestId('consonant-TopFilter-item');
        expect(filterItemElement).toHaveLength(items.length);
    });

    test('Items should NOT be clipped if item length is less than 9', () => {
        const defaultItems = [...DEFAULT_PROPS.items];
        defaultItems.length = 5;

        renderTopFilterItem({ items: defaultItems });

        const filterGroupElement = screen.getByTestId('consonant-TopFilter-items');
        expect(filterGroupElement).not.toHaveClass('consonant-TopFilter-items--clipped');
    });

    test('Clicking filter checkboxes should work', () => {
        const { props: { onCheck } } = renderTopFilterItem();

        const [checkboxElement] = screen.queryAllByTestId('consonant-TopFilter-itemCheckbox');
        expect(checkboxElement).toBeDefined();

        fireEvent.click(checkboxElement);
        expect(onCheck).toBeCalled();
    });

    test('Clicking the clear all button should work', () => {
        const { props: { onClearAll } } = renderTopFilterItem(selectedAllItems);

        const clearBtn = screen.queryByTestId('consonant-TopFilter-footerClearBtn');
        expect(clearBtn).not.toBeNull();

        fireEvent.click(clearBtn);
        expect(onClearAll).toBeCalled();
    });

    test('should be able to render analytics on filter items', () => {
        const { props: { onCheck } } = renderTopFilterItem();
        const topFilterItems = screen.queryAllByTestId('consonant-TopFilter-item');
        topFilterItems.forEach( (item, index) => {
            expect(item).toHaveAttribute('daa-ll', ANALYTICS_ITEMS['itemsItem'][index]);
        });
    });
});
