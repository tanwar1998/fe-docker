import React from 'react';
import classNames from 'classnames';
import {
    string,
    shape,
    bool,
} from 'prop-types';

import { useLazyLoading } from '../Helpers/hooks';
import {
    stylesType,
    contentAreaType,
    overlaysType,
} from '../types/card';

const halfHeightCardType = {
    ctaLink: string,
    id: string.isRequired,
    lh: string,
    styles: shape(stylesType),
    overlays: shape(overlaysType),
    contentArea: shape(contentAreaType),
    renderBorder: bool,
};

const defaultProps = {
    styles: {},
    lh: '',
    ctaLink: '',
    overlays: {},
    contentArea: {},
    renderBorder: true,
};

/**
 * Half height card
 *
 * @component
 * @example
 * const props= {
    id: String,
    ctaLink: String,
    styles: Object,
    contentArea: Object,
    overlays: Object,
    renderBorder: Boolean,
 * }
 * return (
 *   <HalfHeightCard {...props}/>
 * )
 */
const HalfHeightCard = (props) => {
    const {
        id,
        lh,
        ctaLink,
        styles: {
            backgroundImage: image,
        },
        contentArea: {
            title,
            detailText: label,

        },
        overlays: {
            banner: {
                description: bannerDescription,
                fontColor: bannerFontColor,
                backgroundColor: bannerBackgroundColor,
                icon: bannerIcon,
            },
        },
        renderBorder,
    } = props;

    /**
     * Class name for the card:
     * whether card border should be rendered or no;
     * @type {String}
     */
    const cardClassName = classNames({
        'consonant-HalfHeightCard': true,
        'consonant-u-noBorders': !renderBorder,
    });

    /**
     * Creates a card image DOM reference
     * @returns {Object} - card image DOM reference
     */
    const imageRef = React.useRef();

    /**
     * @typedef {Image} LazyLoadedImageState
     * @description — Has image as state after image is lazy loaded
     *
     * @typedef {Function} LazyLoadedImageStateSetter
     * @description - Sets state once image is lazy loaded
     *
     * @type {[Image]} lazyLoadedImage
     */
    const [lazyLoadedImage] = useLazyLoading(imageRef, image);

    return (
        <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cardClassName}
            title=""
            daa-lh={lh}
            tabIndex="0"
            id={id}>
            {bannerDescription && bannerFontColor && bannerBackgroundColor &&
                <span
                    className="consonant-HalfHeightCard-banner"
                    style={({
                        backgroundColor: bannerBackgroundColor,
                        color: bannerFontColor,
                    })}>
                    {bannerIcon &&
                        <div
                            className="consonant-HalfHeightCard-bannerIconWrapper">
                            <img
                                alt=""
                                loading="lazy"
                                src={bannerIcon} />
                        </div>
                    }
                    <span>{bannerDescription}</span>
                </span>
            }
            <div
                className="consonant-HalfHeightCard-img"
                ref={imageRef}
                style={{ backgroundImage: `url("${lazyLoadedImage}")` }} />
            <div className="consonant-HalfHeightCard-inner">
                {label &&
                    <span className="consonant-HalfHeightCard-label">{label}</span>
                }
                {title &&
                    <h2 className="consonant-HalfHeightCard-title">{title}</h2>
                }
            </div>
        </a>
    );
};

HalfHeightCard.propTypes = halfHeightCardType;
HalfHeightCard.defaultProps = defaultProps;

export default HalfHeightCard;
