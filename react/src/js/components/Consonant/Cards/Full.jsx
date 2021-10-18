import React from 'react';
import classNames from 'classnames';
import {
    string,
    shape,
    bool,
} from 'prop-types';

import {
    useConfig,
    useLazyLoading,
} from '../Helpers/hooks';
import { getLinkTarget, getEventBanner } from '../Helpers/general';
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
    renderBorder: bool,
    startDate: string,
    endDate: string,
    bannerMap: shape(Object).isRequired,
};

const defaultProps = {
    styles: {},
    lh: '',
    ctaLink: '',
    overlays: {},
    contentArea: {},
    renderBorder: true,
    startDate: '',
    endDate: '',
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
    renderBorder: Boolean,
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
    const disableBanners = getConfig('collection', 'disableBanners');

    /**
     * Class name for the card:
     * whether card border should be rendered or no;
     * @type {String}
     */
    const cardClassName = classNames({
        'consonant-Card': true,
        'consonant-FullCard': true,
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
            data-testid="consonant-FullCard"
            id={id}>
            <div
                data-testid="consonant-FullCard-img"
                className="consonant-FullCard-img"
                ref={imageRef}
                style={{ backgroundImage: `url("${lazyLoadedImage}")` }}>
                {bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse &&
                !disableBanners &&
                    <span
                        data-testid="consonant-FullCard-banner"
                        className="consonant-FullCard-banner"
                        style={({
                            backgroundColor: bannerBackgroundColorToUse,
                            color: bannerFontColorToUse,
                        })}>
                        {bannerIconToUse &&
                            <div
                                className="consonant-FullCard-bannerIconWrapper">
                                <img
                                    alt=""
                                    loading="lazy"
                                    data-testid="consonant-Card-bannerImg"
                                    src={bannerIconToUse} />
                            </div>
                        }
                        <span>{bannerDescriptionToUse}</span>
                    </span>
                }
                {badgeText &&
                    <span
                        className="consonant-FullCard-badge">
                        {badgeText}
                    </span>
                }

                {videoURL && <VideoButton videoURL={videoURL} className="consonant-FullCard-videoIco" /> }
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
                target={target}
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
