import React from 'react';
import className from 'classnames';
import { string } from 'prop-types';

import { useConfig } from '../../Helpers/hooks';

const BUTTON_STYLE = {
    PRIMARY: 'primary',
    CTA: 'call-to-action',
};

const buttonType = {
    text: string,
    href: string,
    style: string,
    iconSrc: string,
    iconAlt: string,
    iconPos: string,
};

const defaultProps = {
    href: '',
    text: '',
    iconSrc: '',
    iconAlt: '',
    iconPos: '',
    style: BUTTON_STYLE.CTA,
};

/**
 * Button Infobit (shown in OneHalf Card Footer)
 *
 * @component
 * @example
 * const props= {
    style: String,
    href: String,
    text: String,
 * }
 * return (
 *   <Button {...props}/>
 * )
 */
const Button = ({
    style,
    text,
    href,
    iconSrc,
    iconAlt,
    iconPos,
}) => {
    /**
     **** Authored Configs ****
     */
    const getConfig = useConfig();
    const cardButtonStyle = getConfig('collection', 'button.style');

    /**
     * Whether we should render cta button or not
     * cardButtonStyle has higher priority than style
     * @type {Boolean}
     */
    const isCtaButton = (style === BUTTON_STYLE.CTA && cardButtonStyle !== BUTTON_STYLE.PRIMARY) ||
         (cardButtonStyle === BUTTON_STYLE.CTA);

    /**
     * Class name for button:
     * Whether we should render cta button or not
     * @type {String}
     */
    const buttonClass = className({
        'consonant-BtnInfobit': true,
        'consonant-BtnInfobit--cta': isCtaButton,
    });

    /**
     * Class name for button icon:
     * Whether icon should be placed before or after the text
     * @type {String}
     */
    const iconClass = className({
        'consonant-BtnInfobit-ico': true,
        'consonant-BtnInfobit-ico--last': iconPos.toLowerCase() === 'aftertext',
    });

    return (
        <a
            className={buttonClass}
            data-testid="consonant-BtnInfobit"
            tabIndex="0"
            rel="noopener noreferrer"
            target="_blank"
            href={href}>
            {iconSrc &&
                <img
                    data-testid="consonant-BtnInfobit-ico"
                    src={iconSrc}
                    width="20"
                    height="20"
                    className={iconClass}
                    alt={iconAlt}
                    loading="lazy" />
            }
            <span>{text}</span>
        </a>
    );
};

Button.propTypes = buttonType;
Button.defaultProps = defaultProps;

export default Button;
