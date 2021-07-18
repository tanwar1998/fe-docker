import React, { Fragment } from 'react';
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

const threeFourthCardType = {
    ctaLink: string,
    id: string.isRequired,
    lh: string,
    styles: shape(stylesType),
    overlays: shape(overlaysType),
    contentArea: shape(contentAreaType),
    renderBorder: bool,
    isSmallDevice: bool,
};

const defaultProps = {
    styles: {},
    ctaLink: '',
    overlays: {},
    contentArea: {},
    lh: '',
    renderBorder: true,
    isSmallDevice: false,
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
    isSmallDevice: Boolean,
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
        isSmallDevice,
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

    /**
     * Inner HTML of the inner block of the card, which will be included into either div or a tag;
     */
    const renderCardInnerContent = () => (
        <Fragment>
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
        </Fragment>
    );

    /**
     * Inner HTML of the whole card, which will be included into either div or a tag;
     */
    const renderCardContent = () => (
        <Fragment>
            <div
                data-testid="consonant-ThreeFourthCard-img"
                className="consonant-ThreeFourthCard-img"
                ref={imageRef}
                style={{ backgroundImage: `url("${lazyLoadedImage}")` }}>
                {bannerDescription && bannerFontColor && bannerBackgroundColor &&
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
            {
                isSmallDevice ?
                    <div className="consonant-ThreeFourthCard-inner">{renderCardInnerContent()}</div> :
                    <a
                        href={ctaLink}
                        target="_blank"
                        className="consonant-ThreeFourthCard-inner"
                        rel="noopener noreferrer"
                        title="Click to open in a new tab"
                        tabIndex="0">{renderCardInnerContent()}
                    </a>
            }
        </Fragment>
    );

    return (
        isSmallDevice ?
            <a
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                title="Click to open in a new tab"
                tabIndex="0"
                daa-lh={lh}
                className={cardClassName}
                data-testid="consonant-ThreeFourthCard"
                id={id}>{renderCardContent()}
            </a> :
            <div
                daa-lh={lh}
                className={cardClassName}
                data-testid="consonant-ThreeFourthCard"
                id={id}>{renderCardContent()}
            </div>
    );
};

ThreeFourthCard.propTypes = threeFourthCardType;
ThreeFourthCard.defaultProps = defaultProps;

export default ThreeFourthCard;
