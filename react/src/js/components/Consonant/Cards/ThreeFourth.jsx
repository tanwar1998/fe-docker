import React from 'react';
import {
    string,
    shape,
} from 'prop-types';

import prettyFormatDate from '../Helpers/prettyFormat';
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

const threeFourthCardType = {
    ctaLink: string,
    id: string.isRequired,
    lh: string,
    styles: shape(stylesType),
    overlays: shape(overlaysType),
    contentArea: shape(contentAreaType),
};

const defaultProps = {
    styles: {},
    ctaLink: '',
    overlays: {},
    contentArea: {},
    lh: '',
};

/**
 * 3/4 image aspect ratio card
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
 *   <ThreeFourthCard {...props}/>
 * )
 */
const ThreeFourthCard = (props) => {
    const {
        id,
        ctaLink,
        lh,
        styles: {
            backgroundImage: image,
        },
        contentArea: {
            title,
            description,
            detailText: label,
            dateDetailText: {
                startTime,
                endTime,
            },
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
    const i18nFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    const locale = getConfig('language', '');
    const disableBanners = getConfig('collection', 'disableBanners');

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

    /**
     * Formatted date string
     * @type {String}
     */
    const prettyDate = startTime ? prettyFormatDate(startTime, endTime, locale, i18nFormat) : '';

    /**
     * Detail text
     * @type {String}
     */
    const detailText = prettyDate || label;

    return (
        <div
            daa-lh={lh}
            className="consonant-ThreeFourthCard"
            data-testid="consonant-ThreeFourthCard"
            id={id}>
            <div
                data-testid="consonant-ThreeFourthCard-img"
                className="consonant-ThreeFourthCard-img"
                ref={imageRef}
                style={{ backgroundImage: `url("${lazyLoadedImage}")` }}>
                {bannerDescription && bannerFontColor && bannerBackgroundColor && !disableBanners &&
                    <span
                        data-testid="consonant-ThreeFourthCard-banner"
                        className="consonant-ThreeFourthCard-banner"
                        style={({
                            backgroundColor: bannerBackgroundColor,
                            color: bannerFontColor,
                        })}>
                        {bannerIcon &&
                            <div
                                className="consonant-ThreeFourthCard-bannerIconWrapper">
                                <img
                                    alt=""
                                    loading="lazy"
                                    src={bannerIcon}
                                    data-testid="consonant-Card-bannerImg" />
                            </div>
                        }
                        <span>{bannerDescription}</span>
                    </span>
                }
                {badgeText &&
                    <span
                        className="consonant-ThreeFourthCard-badge">
                        {badgeText}
                    </span>
                }
                {videoURL && <VideoButton videoURL={videoURL} className="consonant-ThreeFourthCard-videoIco" />}
                {logoSrc &&
                    <div
                        style={({
                            backgroundColor: logoBg,
                            borderColor: logoBorderBg,
                        })}
                        className="consonant-ThreeFourthCard-logo">
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
                title="Click to open in a new tab"
                className="consonant-ThreeFourthCard-inner"
                tabIndex="0">
                {detailText &&
                    <span
                        data-testid="consonant-ThreeFourthCard-label"
                        className="consonant-ThreeFourthCard-label">
                        {detailText}
                    </span>
                }
                {
                    title &&
                    <h2
                        className="consonant-ThreeFourthCard-title">
                        {title}
                    </h2>
                }
                {
                    description &&
                    <p
                        className="consonant-ThreeFourthCard-text">
                        {description}
                    </p>
                }
            </a>
        </div>
    );
};

ThreeFourthCard.propTypes = threeFourthCardType;
ThreeFourthCard.defaultProps = defaultProps;

export default ThreeFourthCard;
