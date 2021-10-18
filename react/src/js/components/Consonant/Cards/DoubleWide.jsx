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
import VideoButton from '../Modal/videoButton';
import { getEventBanner, getLinkTarget } from '../Helpers/general';

const doubleWideCardType = {
    ctaLink: string,
    id: string.isRequired,
    lh: string,
    styles: shape(stylesType),
    contentArea: shape(contentAreaType),
    overlays: shape(overlaysType),
    renderBorder: bool,
    startDate: string,
    endDate: string,
    bannerMap: shape(Object).isRequired,
};

const defaultProps = {
    styles: {},
    lh: '',
    ctaLink: '',
    contentArea: {},
    overlays: {},
    renderBorder: true,
    startDate: '',
    endDate: '',
};

/**
 * Double wide card
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
 *   <DoubleWideCard {...props}/>
 * )
 */
const DoubleWideCard = (props) => {
    const {
        id,
        lh,
        ctaLink,
        styles: {
            backgroundImage: image,
        },
        contentArea: {
            title,
            description,
            detailText: label,
        },
        overlays: {
            videoButton: {
                url: videoURL,
            },
            banner: {
                description: bannerDescription,
                fontColor: bannerFontColor,
                backgroundColor: bannerBackgroundColor,
                icon: bannerIcon,
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

    /**
     * Class name for the card:
     * whether card text content should be rendered or no;
     * whether card border should be rendered or no;
     * @type {String}
     */
    const cardClassName = classNames({
        'consonant-Card': true,
        'consonant-DoubleWideCard': true,
        'consonant-DoubleWideCard--noTextInfo': !title && !description && !label,
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
            className={cardClassName}
            daa-lh={lh}
            id={id}>
            {bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse &&
            <span
                data-testid="consonant-OneHalfCard-banner"
                className="consonant-OneHalfCard-banner"
                style={({
                    backgroundColor: bannerBackgroundColorToUse,
                    color: bannerFontColorToUse,
                })}>
                {bannerIconToUse &&
                <div
                    className="consonant-OneHalfCard-bannerIconWrapper">
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
            <div
                className="consonant-DoubleWideCard-img"
                ref={imageRef}
                style={{ backgroundImage: `url("${lazyLoadedImage}")` }}>
                {videoURL && <VideoButton videoURL={videoURL} className="consonant-DoubleWideCard-videoIco" />}
            </div>
            <a
                href={ctaLink}
                target={target}
                rel="noopener noreferrer"
                tabIndex="0"
                className="consonant-DoubleWideCard-inner">
                {label &&
                    <span className="consonant-DoubleWideCard-label">{label}</span>
                }
                {title &&
                    <h2 className="consonant-DoubleWideCard-title">{title}</h2>
                }
                {description &&
                    <p className="consonant-DoubleWideCard-text">{description}</p>
                }
            </a>
        </div>
    );
};

DoubleWideCard.propTypes = doubleWideCardType;
DoubleWideCard.defaultProps = defaultProps;

export default DoubleWideCard;
