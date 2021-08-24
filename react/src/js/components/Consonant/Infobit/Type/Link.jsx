import React from 'react';
import {
    oneOfType,
    string,
    bool,
} from 'prop-types';

const linkType = {
    linkHint: string,
    href: string.isRequired,
    text: string.isRequired,
    openInNewTab: oneOfType([bool, string]),
};

const defaultProps = {
    linkHint: '',
    openInNewTab: true,
};

/**
 * Link Infobit (shown in OneHalf Card Footer)
 *
 * @component
 * @example
 * const props= {
    href: String,
    openInNewTab: Boolean,
    linkHint: String,
    text: String,
 * }
 * return (
 *   <Link {...props}/>
 * )
 */
const Link = ({
    href,
    openInNewTab,
    linkHint,
    text,
}) => {
    const target = openInNewTab ? '_blank' : '_self';
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
