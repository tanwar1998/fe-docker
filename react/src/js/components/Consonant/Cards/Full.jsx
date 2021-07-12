import React from 'react';
import {
    string,
    shape,
} from 'prop-types';
import classNames from 'classnames';

import {
    useConfig,
    useLazyLoading,
} from '../Helpers/hooks';
import {
    stylesType,
    contentAreaType,
    overlaysType,
} from '../types/card';
import VideoButton from '../Modal/videoButton';

const fullCardType = {
    ctaLink: string,
    id: string.isRequired,
    lh: string,
    styles: shape(stylesType),
    overlays: shape(overlaysType),
    contentArea: shape(contentAreaType),
};

const defaultProps = {
    styles: {},
    lh: '',
    ctaLink: '',
    overlays: {},
    contentArea: {},
};

/**
 * Full card
 *
 * @component
 * @example
 * const props= {
    id: String,
    ctaLink: String,
    styles: Object,
    contentArea: Object,
    overlays: Object,
 * }
 * return (
 *   <FullCard {...props}/>
 * )
 */
const FullCard = (props) => {
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
            videoButton: {
                url: videoURL,
            },
            logo: {
                src: logoSrc,
                alt: logoAlt,
                backgroundColor: logoBg,
                borderColor: logoBorderBg,
            },
            label: {
                description: badgeText,
            },
        },
    } = props;

    const getConfig = useConfig();

    /**
     **** Authored Configs ****
     */
    const setCardBorders = getConfig('collection', 'setCardBorders');

    /**
     * Class name for the card:
     * @type {String}
    */
    const cardClass = classNames({
        'consonant-FullCard': true,
        'consonant-noneBorders': !setCardBorders,
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
        <div
            daa-lh={lh}
            className={cardClass}
            data-testid="consonant-FullCard"
            id={id}>
            <div
                data-testid="consonant-FullCard-img"
                className="consonant-FullCard-img"
                ref={imageRef}
                style={{ backgroundImage: `url("${lazyLoadedImage}")` }}>
                {bannerDescription && bannerFontColor && bannerBackgroundColor &&
                    <span
                        data-testid="consonant-FullCard-banner"
                        className="consonant-FullCard-banner"
                        style={({
                            backgroundColor: bannerBackgroundColor,
                            color: bannerFontColor,
                        })}>
                        {bannerIcon &&
                            <div
                                className="consonant-FullCard-bannerIconWrapper">
                                <img
                                    alt=""
                                    loading="lazy"
                                    data-testid="consonant-Card-bannerImg"
                                    src={bannerIcon} />
                            </div>
                        }
                        <span>{bannerDescription}</span>
                    </span>
                }
                {badgeText &&
                    <span
                        className="consonant-FullCard-badge">
                        {badgeText}
                    </span>
                }

                {videoURL && <VideoButton videoURL={videoURL} className="consonant-FullCard-videoIco" />}
                {logoSrc &&
                    <div
                        style={({
                            backgroundColor: logoBg,
                            borderColor: logoBorderBg,
                        })}
                        className="consonant-FullCard-logo">
                        <img
                            src={logoSrc}
                            alt={logoAlt}
                            loading="lazy"
                            width="32" />
                    </div>
                }
            </div>
            <a
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                title=""
                className="consonant-FullCard-inner"
                tabIndex="0">
                {label &&
                    <span
                        className="consonant-FullCard-label">
                        {label}
                    </span>
                }
                <h2
                    className="consonant-FullCard-title">
                    {title}
                </h2>
            </a>
        </div>
    );
};

FullCard.propTypes = fullCardType;
FullCard.defaultProps = defaultProps;

export default FullCard;
