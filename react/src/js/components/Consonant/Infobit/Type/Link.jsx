import React from 'react';
import { string } from 'prop-types';
import { getLinkTarget } from '../../Helpers/general';

const linkType = {
    linkHint: string,
    href: string.isRequired,
    text: string.isRequired,
};

const defaultProps = {
    linkHint: '',
};

/**
 * Link Infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    href: String,
    linkHint: String,
    text: String,
 * }
 * return (
 *   <Link {...props}/>
 * )
 */
const Link = ({
    href,
    linkHint,
    text,
}) => {
    const target = getLinkTarget(href);
    return (
        <a
            className="consonant-LinkInfobit"
            data-testid="consonant-LinkInfobit"
            href={href}
            target={target}
            title={linkHint}
            rel="noopener noreferrer"
            tabIndex="0">
            {text}
        </a>
    );
};

Link.propTypes = linkType;
Link.defaultProps = defaultProps;

export default Link;
