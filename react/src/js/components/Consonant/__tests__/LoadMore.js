import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import LoadMore from '../LoadMore';

import { DEFAULT_PROPS } from './constants/loadMore';

import makeSetup from './utils/settings';

const setup = makeSetup(LoadMore, DEFAULT_PROPS);

describe('Consonant/LoadMore', () => {
    test('shouldn`t render if total is 0', () => {
        const { wrapper: { container } } = setup({ total: 0 });

        expect(container).toBeEmptyDOMElement();
    });
    test('shouldn`t render if show is 0', () => {
        const { wrapper: { container } } = setup({ show: 0 });

        expect(container).toBeEmptyDOMElement();
    });
    describe('Check snapshots', () => {
        test('should renders correctly with show < total', () => {
            const { tree } = setup();

            expect(tree).toMatchSnapshot();
        });
        test('should renders correctly with show > total', () => {
            const { tree } = setup({ show: 100, total: 1 });

            expect(tree).toMatchSnapshot();
        });
    });

    describe('Interaction with UI', () => {
        test('should call onClick', () => {
            const { props: { onClick } } = setup();

            const buttonElement = screen.getByText('Load more');

            fireEvent.click(buttonElement);

            expect(onClick).toBeCalled();
        });
    });
});