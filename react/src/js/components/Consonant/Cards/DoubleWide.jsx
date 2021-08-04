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

const doubleWideCardType = {
    ctaLink: string,
    id: string.isRequired,
    lh: string,
    styles: shape(stylesType),
    contentArea: shape(contentAreaType),
    overlays: shape(overlaysType),g
    renderBorder: bool,
};

const defaultProps = {
    styles: {},
    lh: '',
    ctaLink: '',
    contentArea: {},
    overlays: {},
    renderBorder: true,
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
        },
        renderBorder,
    } = props;

    /**
     * Class name for the card:
     * whether card text content should be rendered or no;
     * whether card border should be rendered or no;     
     * @type {String}
     */
    const cardClassName = classNames({
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

    return (
        <div
            className={cardClassName}
            daa-lh={lh}
            id={id}>
            <div
                className="consonant-DoubleWideCard-img"
                ref={imageRef}
                style={{ backgroundImage: `url("${lazyLoadedImage}")` }}>
                {videoURL && <VideoButton videoURL={videoURL} className="consonant-DoubleWideCard-videoIco" />}
            </div>
            <a
                href={ctaLink}
                target="_blank"
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
