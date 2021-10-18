import React, { Fragment } from 'react';
import classNames from 'classnames';
import {
    string,
    shape,
    bool,
    arrayOf,
} from 'prop-types';

import { useConfig, useLazyLoading, useRegistered } from '../Helpers/hooks';
import { hasTag } from '../Helpers/Helpers';
import { getLinkTarget, getEventBanner, isDateBeforeInterval, getCurrentDate } from '../Helpers/general';
import {
    stylesType,
    contentAreaType,
    overlaysType,
    tagsType,
} from '../types/card';
import VideoButton from '../Modal/videoButton';
import prettyFormatDate from '../Helpers/prettyFormat';

const halfHeightCardType = {
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
    tags: arrayOf(shape(tagsType)),
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
    tags: [],
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
        tags,
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
    let videoURLToUse = videoURL;
    let labelToUse = label;

    const getConfig = useConfig();

    /**
     **** Authored Configs ****
     */
    const registrationUrl = getConfig('collection', 'banner.register.url');
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
    const isRegistered = useRegistered(false);
    const isGated = hasTag(/caas:gated/, tags) || hasTag(/caas:card-style\/half-height-featured/, tags);

    if (isGated && !isRegistered) {
        bannerDescriptionToUse = bannerMap.register.description;
        bannerIconToUse = '';
        bannerBackgroundColorToUse = bannerMap.register.backgroundColor;
        bannerFontColorToUse = bannerMap.register.fontColor;
        videoURLToUse = registrationUrl;
    } else if (startDate && endDate) {
        const eventBanner = getEventBanner(startDate, endDate, bannerMap);
        bannerBackgroundColorToUse = eventBanner.backgroundColor;
        bannerDescriptionToUse = eventBanner.description;
        bannerFontColorToUse = eventBanner.fontColor;
        bannerIconToUse = eventBanner.icon;
        const now = getCurrentDate();
        if (isDateBeforeInterval(now, startDate)) {
            labelToUse = prettyFormatDate(startDate, endDate, locale, i18nFormat);
        }
    }

    const target = getLinkTarget(ctaLink);

    /**
     * Inner HTML of the card, which will be included into either div or a tag;
     */
    const renderCardContent = () => (
        <Fragment>
            {bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse
            && (!isGated || !isRegistered) && (!disableBanners || isGated) &&
                <span
                    className="consonant-HalfHeightCard-banner"
                    style={({
                        backgroundColor: bannerBackgroundColorToUse,
                        color: bannerFontColorToUse,
                    })}>
                    {bannerIconToUse &&
                        <div
                            className="consonant-HalfHeightCard-bannerIconWrapper">
                            <img
                                alt=""
                                loading="lazy"
                                src={bannerIconToUse} />
                        </div>
                    }
                    <span>{bannerDescriptionToUse}</span>
                </span>
            }
            <div
                className="consonant-HalfHeightCard-img"
                ref={imageRef}
                style={{ backgroundImage: `url("${lazyLoadedImage}")` }} />
            <div className="consonant-HalfHeightCard-inner">
                {title &&
                    <h2 className="consonant-HalfHeightCard-title">{title}</h2>
                }
                {labelToUse &&
                    <span className="consonant-HalfHeightCard-label">{labelToUse}</span>
                }
                {videoURLToUse && <VideoButton videoURL={videoURLToUse} className="consonant-HalfHeightCard-videoIco" />}
            </div>
        </Fragment>
    );

    return (
        videoURLToUse ?
            <div
                className={cardClassName}
                daa-lh={lh}
                id={id}>{renderCardContent()}
            </div> :
            <a
                href={ctaLink}
                target={target}
                rel="noopener noreferrer"
                className={cardClassName}
                title=""
                daa-lh={lh}
                tabIndex="0"
                id={id}>{renderCardContent()}
            </a>
    );
};

HalfHeightCard.propTypes = halfHeightCardType;
HalfHeightCard.defaultProps = defaultProps;

export default HalfHeightCard;
