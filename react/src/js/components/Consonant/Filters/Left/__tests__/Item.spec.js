import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Item from '../Item';

import {
    DEFAULT_PROPS,
    selectedAllItems,
} from '../../../Testing/Constants/FilterItem';

import setup from '../../../Testing/Utils/Settings';

const renderItemComponent = setup(Item, DEFAULT_PROPS);

describe('Consonant/Filters/Left/Item', () => {
    test('should be able to render without an item count badge', () => {
        renderItemComponent();

        const badgeElement = screen.queryByTestId('consonant-LeftFilter-itemBadge');

        expect(badgeElement).toBeNull();
    });

    test('should be able to render with an item count badge', () => {
        renderItemComponent(selectedAllItems);

        const badgeElement = screen.queryByTestId('consonant-LeftFilter-itemBadge');

        expect(badgeElement).not.toBeNull();

        expect(badgeElement).toHaveTextContent(String(selectedAllItems.numItemsSelected));
    });

    test('should be able to render all list items', () => {
        const { props: { items } } = renderItemComponent();

        const filterItemElement = screen.queryAllByTestId('consonant-LeftFilter-item');

        expect(filterItemElement).toHaveLength(items.length);
    });

    test('Checking a checkbox for a filter item should work', () => {
        const { props: { onCheck } } = renderItemComponent();

        const [checkboxElement] = screen.queryAllByTestId('consonant-LeftFilter-itemCheckbox');

        expect(checkboxElement).toBeDefined();

        fireEvent.click(checkboxElement);

        expect(onCheck).toBeCalled();
    });

    test('Clicking a filter item should work', () => {
        const { props: { onClick, name } } = renderItemComponent();

        const itemLinkElement = screen.getByText(name);

        expect(itemLinkElement).not.toBeNull();

        fireEvent.click(itemLinkElement);

        expect(onClick).toBeCalled();
    });

    test('Should be able to clear all filters', () => {
        const { props: { onClearAll } } = renderItemComponent(selectedAllItems);

        const badgeElement = screen.queryByTestId('consonant-LeftFilter-itemBadge');

        expect(badgeElement).not.toBeNull();

        fireEvent.click(badgeElement);

        expect(onClearAll).toBeCalled();
    });
});
