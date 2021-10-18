import React from 'react';
import classNames from 'classnames';
import {
    string,
    shape,
    bool,
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
import { getEventBanner, getLinkTarget } from '../Helpers/general';

const threeFourthCardType = {
    ctaLink: string,
    id: string.isRequired,
    lh: string,
    styles: shape(stylesType),
    overlays: shape(overlaysType),
    contentArea: shape(contentAreaType),
    renderBorder: bool,
    startDate: string,
    endDate: string,
    bannerMap: shape(Object).isRequired,
};

const defaultProps = {
    styles: {},
    ctaLink: '',
    overlays: {},
    contentArea: {},
    lh: '',
    renderBorder: true,
    startDate: '',
    endDate: '',
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
    renderBorder: Boolean,
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
        renderBorder,
        startDate,
        endDate,
        bannerMap,
    } = props;

    let bannerBackgroundColorToUse = bannerBackgroundColor;
    let bannerIconToUse = bannerIcon;
    let bannerFontColorToUse = bannerFontColor;
    let bannerDescriptionToUse = bannerDescription;

    const getConfig = useConfig();
    /**
     **** Authored Configs ****
     */
    const i18nFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    const locale = getConfig('language', '');
    const disableBanners = getConfig('collection', 'disableBanners');

    /**
     * Class name for the card:
     * whether card border should be rendered or no;
     * @type {String}
     */
    const cardClassName = classNames({
        'consonant-Card': true,
        'consonant-ThreeFourthCard': true,
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

    if (startDate && endDate) {
        const eventBanner = getEventBanner(startDate, endDate, bannerMap);
        bannerBackgroundColorToUse = eventBanner.backgroundColor;
        bannerDescriptionToUse = eventBanner.description;
        bannerFontColorToUse = eventBanner.fontColor;
        bannerIconToUse = eventBanner.icon;
    }

    const target = getLinkTarget(ctaLink);

    return (
        <div
            daa-lh={lh}
            className={cardClassName}
            data-testid="consonant-ThreeFourthCard"
            id={id}>
            <div
                data-testid="consonant-ThreeFourthCard-img"
                className="consonant-ThreeFourthCard-img"
                ref={imageRef}
                style={{ backgroundImage: `url("${lazyLoadedImage}")` }}>
                {bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse
                && !disableBanners &&
                    <span
                        data-testid="consonant-ThreeFourthCard-banner"
                        className="consonant-ThreeFourthCard-banner"
                        style={({
                            backgroundColor: bannerBackgroundColorToUse,
                            color: bannerFontColorToUse,
                        })}>
                        {bannerIconToUse &&
                            <div
                                className="consonant-ThreeFourthCard-bannerIconWrapper">
                                <img
                                    alt=""
                                    loading="lazy"
                                    src={bannerIconToUse}
                                    data-testid="consonant-Card-bannerImg" />
                            </div>
                        }
                        <span>{bannerDescriptionToUse}</span>
                    </span>
                }
                {badgeText &&
                    <span
                        className="consonant-ThreeFourthCard-badge">
                        {badgeText}
                    </span>
                }
                {videoURL && <VideoButton videoURL={videoURL} className="consonant-ThreeFourthCard-videoIco" /> }
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
                target={target}
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
