import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    render,
    screen
} from '@testing-library/react';

import Link from '../Link';

const props = {
    href: 'https://www.someTestUrl.com/',
    linkHint: 'Some Link Hint',
    text: 'Click Here',
};

describe('Consonant/Infobits/Type/Link', () => {
    test('Loads with default props', async () => {
        const propsToUse = props;
        const { getByText } = render(<Link {...propsToUse} />);

        const linkWithIcon = screen.getByTestId('consonant-LinkInfobit');
        expect(linkWithIcon).not.toBeNull();
        expect(linkWithIcon.target).toBe('_blank');
        expect(getByText('Click Here').innerHTML).toContain('Click Here');

    });

    test('Can be authored to open in a new tab', async () => {
        const propsToUse = props;
        render(<Link {...propsToUse} />);

        const linkWithIcon = screen.getByTestId('consonant-LinkInfobit');

        expect(linkWithIcon.target).toBe('_blank');
    });
});
