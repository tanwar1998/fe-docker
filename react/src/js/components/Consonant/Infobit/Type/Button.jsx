import React from 'react';
import className from 'classnames';
import { string } from 'prop-types';

import { Button as ButtonSpectrum } from '@adobe/react-spectrum';

import { useConfig } from '../../Helpers/hooks';

const buttonType = {
    text: string,
    href: string,
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
};

/**
 * Button Infobit (shown in 1:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    href: String,
    text: String,
    iconSrc: String,
    iconAlt: String,
    iconPos: String,
 * }
 * return (
 *   <Button {...props}/>
 * )
 */
const Button = ({
    text,
    href,
    iconSrc,
    iconAlt,
    iconPos,
}) => {
    const getConfig = useConfig();
    const buttonStyle = getConfig('collection', 'button');

    const iconClass = className({
        'consonant-Button-ico': true,
        'consonant-Button-ico--last': iconPos.toLowerCase() === 'aftertext',
    });

    return (
        <ButtonSpectrum
            variant={buttonStyle.style || 'cta'}
            type="button"
            elementType="a"
            className="consonant-BtnInfobit"
            data-testid="consonant-BtnInfobit"
            tabIndex="0"
            target="_blank"
            href={href}
            isQuiet={buttonStyle.modifier === 'isQuiet'}
            isDisabled={buttonStyle.state === 'disabled'}
            {...buttonStyle.props}>
            {iconSrc &&
                <img
                    data-testid="consonant-BtnInfobit-ico"
                    src={iconSrc}
                    width="20"
                    height="20"
                    className={iconClass}
                    alt={iconAlt}
                    loading="lazy" />}
            <span>{text}</span>
        </ButtonSpectrum>
    );
};

Button.propTypes = buttonType;
Button.defaultProps = defaultProps;

export default Button;
