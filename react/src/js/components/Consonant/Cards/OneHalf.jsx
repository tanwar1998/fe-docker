/* eslint-disable prefer-const */
import React from 'react';
import classNames from 'classnames';
import cuid from 'cuid';
import {
    string,
    shape,
    bool,
    func,
    arrayOf,
} from 'prop-types';

import CardFooter from './CardFooter/CardFooter';
import prettyFormatDate from '../Helpers/prettyFormat';
import { INFOBIT_TYPE } from '../Helpers/constants';
import { getEventBanner } from '../Helpers/general';
import {
    useConfig,
    useLazyLoading,
} from '../Helpers/hooks';
import {
    stylesType,
    contentAreaType,
    overlaysType,
    footerType,
} from '../types/card';
import VideoButton from '../Modal/videoButton';

const oneHalfCardType = {
    isBookmarked: bool,
    dateFormat: string,
    id: string.isRequired,
    lh: string,
    styles: shape(stylesType),
    disableBookmarkIco: bool,
    onClick: func.isRequired,
    overlays: shape(overlaysType),
    footer: arrayOf(shape(footerType)),
    contentArea: shape(contentAreaType),
    renderBorder: bool,
    startDate: string,
    endDate: string,
    bannerMap: shape(Object).isRequired,
};

const defaultProps = {
    footer: [],
    styles: {},
    overlays: {},
    dateFormat: '',
    contentArea: {},
    lh: '',
    isBookmarked: false,
    disableBookmarkIco: false,
    renderBorder: true,
    startDate: '',
    endDate: '',
};

/**
 * 1/2 image aspect ratio card
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
 *   <OneHalfCard {...props}/>
 * )
 */
const OneHalfCard = (props) => {
    let {
        id,
        footer,
        lh,
        disableBookmarkIco,
        isBookmarked,
        onClick,
        dateFormat,
        styles: {
            backgroundImage: image,
        },
        contentArea: {
            title,
            detailText: label,
            description,
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

    const getConfig = useConfig();

    /**
     **** Authored Configs ****
     */
    const i18nFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    const locale = getConfig('language', '');

    /**
     * Class name for the card:
     * whether card border should be rendered or no;
     * @type {String}
     */
    const cardClassName = classNames({
        'consonant-OneHalfCard': true,
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

    /**
     * Extends infobits with the configuration data
     * @param {Array} data - Array of the infobits
     * @return {Array} - Array of the infobits with the configuration data added
     */
    function extendFooterData(data) {
        if (!data) return [];

        return data.map((infobit) => {
            if (infobit.type === INFOBIT_TYPE.BOOKMARK) {
                return {
                    ...infobit,
                    cardId: id,
                    disableBookmarkIco,
                    isBookmarked,
                    onClick,
                };
            } else if (infobit.type === INFOBIT_TYPE.DATE) {
                return {
                    ...infobit,
                    dateFormat,
                    locale,
                };
            }
            return infobit;
        });
    }

    if (startDate && endDate) {
        const eventBanner = getEventBanner(startDate, endDate, bannerMap);
        bannerBackgroundColor = eventBanner.backgroundColor;
        bannerDescription = eventBanner.description;
        bannerFontColor = eventBanner.fontColor;
        bannerIcon = eventBanner.icon;
    }

    return (
        <div
            daa-lh={lh}
            className={cardClassName}
            data-testid="consonant-OneHalfCard"
            id={id}>
            <div
                data-testid="consonant-OneHalfCard-img"
                className="consonant-OneHalfCard-img"
                ref={imageRef}
                style={{ backgroundImage: `url("${lazyLoadedImage}")` }}>
                {bannerDescription && bannerFontColor && bannerBackgroundColor &&
                    <span
                        data-testid="consonant-OneHalfCard-banner"
                        className="consonant-OneHalfCard-banner"
                        style={({
                            backgroundColor: bannerBackgroundColor,
                            color: bannerFontColor,
                        })}>
                        {bannerIcon &&
                            <div
                                className="consonant-OneHalfCard-bannerIconWrapper">
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
                        className="consonant-OneHalfCard-badge">
                        {badgeText}
                    </span>
                }
                {videoURL && <VideoButton videoURL={videoURL} className="consonant-OneHalfCard-videoIco" /> }
                {logoSrc &&
                    <div
                        style={({
                            backgroundColor: logoBg,
                            borderColor: logoBorderBg,
                        })}
                        className="consonant-OneHalfCard-logo">
                        <img
                            src={logoSrc}
                            alt={logoAlt}
                            loading="lazy"
                            width="32" />
                    </div>
                }
            </div>
            <div
                className="consonant-OneHalfCard-inner">
                {detailText &&
                    <span
                        data-testid="consonant-OneHalfCard-label"
                        className="consonant-OneHalfCard-label">
                        {detailText}
                    </span>
                }
                <h2
                    className="consonant-OneHalfCard-title">
                    {title}
                </h2>
                {
                    description &&
                    <p
                        className="consonant-OneHalfCard-text">
                        {description}
                    </p>
                }
                {footer.map(footerItem => (
                    <CardFooter
                        divider={footerItem.divider}
                        isFluid={footerItem.isFluid}
                        key={cuid()}
                        left={extendFooterData(footerItem.left)}
                        center={extendFooterData(footerItem.center)}
                        right={extendFooterData(footerItem.right)} />
                ))}
            </div>
        </div>
    );
};

OneHalfCard.propTypes = oneHalfCardType;
OneHalfCard.defaultProps = defaultProps;

export default OneHalfCard;
