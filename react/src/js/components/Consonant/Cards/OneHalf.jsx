import React, { Fragment } from 'react';
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
    isSmallDevice: bool,
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
    isSmallDevice: false,
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
    isSmallDevice: Boolean,
 * }
 * return (
 *   <OneHalfCard {...props}/>
 * )
 */
const OneHalfCard = (props) => {
    const {
        id,
        footer,
        lh,
        disableBookmarkIco,
        isBookmarked,
        onClick,
        dateFormat,
        isSmallDevice,
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
    } = props;

    const getConfig = useConfig();

    /**
     **** Authored Configs ****
     */
    const i18nFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    const locale = getConfig('language', '');

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

    /**
     * Loops through array of footer infobits and returns link for the mobile variant of the card
     * @param {Array} data - Array of the infobits
     * @return {String} - URI set in the last infobit via authored configs by user
    */
    function getMobileCardLink(data) {
        let res = '';

        if (data) {
            for (let index = 0; index < data.length; index += 1) {
                const infobits = [...data[index].left, ...data[index].center, ...data[index].right];

                for (let idx = 0; idx < infobits.length; idx += 1) {
                    if (infobits[idx].type === 'button') res = infobits[idx].href;
                }
            }
        }

        return res;
    }

    /**
     * Inner HTML of the card, which will be included into either div or a tag;
     */
    const renderCardContent = () => (
        <Fragment>
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
                {!isSmallDevice && badgeText &&
                    <span
                        className="consonant-OneHalfCard-badge">
                        {badgeText}
                    </span>
                }
                {!isSmallDevice && videoURL &&
                    <VideoButton videoURL={videoURL} className="consonant-OneHalfCard-videoIco" />
                }
                {!isSmallDevice && logoSrc &&
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
                {!isSmallDevice && detailText &&
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
                {!isSmallDevice && description &&
                    <p
                        className="consonant-OneHalfCard-text">
                        {description}
                    </p>
                }
                {!isSmallDevice && footer.map(footerItem => (
                    <CardFooter
                        divider={footerItem.divider}
                        isFluid={footerItem.isFluid}
                        key={cuid()}
                        left={extendFooterData(footerItem.left)}
                        center={extendFooterData(footerItem.center)}
                        right={extendFooterData(footerItem.right)} />
                ))}
            </div>
        </Fragment>
    );

    /**
     * Whether we need to detect mobile card link;
     */
    let mobileCardLink;

    if (isSmallDevice) mobileCardLink = getMobileCardLink(footer);

    return (
        isSmallDevice ?
            <a
                href={mobileCardLink}
                target="_blank"
                rel="noopener noreferrer"
                daa-lh={lh}
                title=""
                data-testid="consonant-OneHalfCard"
                className="consonant-OneHalfCard"
                tabIndex="0"
                id={id}>{renderCardContent()}
            </a> :
            <div
                daa-lh={lh}
                data-testid="consonant-OneHalfCard"
                className="consonant-OneHalfCard"
                id={id}>{renderCardContent()}
            </div>
    );
};

OneHalfCard.propTypes = oneHalfCardType;
OneHalfCard.defaultProps = defaultProps;

export default OneHalfCard;
