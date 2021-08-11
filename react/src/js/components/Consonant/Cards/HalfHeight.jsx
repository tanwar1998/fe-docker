import React, { useState } from 'react';
import {
    string,
    shape,
} from 'prop-types';
import { createPortal } from 'react-dom';

import { useLazyLoading } from '../Helpers/hooks';
import {
    stylesType,
    contentAreaType,
    overlaysType,
} from '../types/card';
import ModalWindow from '../Modal/videoModal';
import Modal from '../../../../../../publish/src/js/components/modal/modal';

const halfHeightCardType = {
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
 * }
 * return (
 *   <HalfHeightCard {...props}/>
 * )
 */
const HalfHeightCard = (props) => {
    const modalContainer = document.querySelector('.modalContainer');
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
                url,
            },
        },
    } = props;

    /**
     * Creates a card image DOM reference
     * @returns {Object} - card image DOM reference
     */
    const imageRef = React.useRef();
    const modalElement = React.useRef(null);

    const [isOpen, setIsOpen] = useState(false);

    const handleModal = () => {
        if (url) {
            setIsOpen(!isOpen);
        } else {
            window.open(ctaLink);
        }
    };

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

    React.useEffect(() => {
        if (isOpen && modalElement && modalElement.current) {
            const videoModal = new Modal(
                modalElement.current,
                { buttonClose: handleModal },
            );

            videoModal.open();
        }
    }, [isOpen, modalElement]);

    return (
        <div
            onKeyPress={handleModal}
            onClick={handleModal}
            role="button"
            rel="noopener noreferrer"
            className="consonant-HalfHeightCard"
            title=""
            daa-lh={lh}
            tabIndex="0"
            id={id}>
            {bannerDescription && bannerFontColor && bannerBackgroundColor &&
                <span
                    className="consonant-HalfHeightCard-banner"
                    style={({
                        backgroundColor: bannerBackgroundColor,
                        color: bannerFontColor,
                    })}>
                    {bannerIcon &&
                        <div
                            className="consonant-HalfHeightCard-bannerIconWrapper">
                            <img
                                alt=""
                                loading="lazy"
                                src={bannerIcon} />
                        </div>
                    }
                    <span>{bannerDescription}</span>
                </span>
            }
            <div
                className="consonant-HalfHeightCard-img"
                ref={imageRef}
                style={{ backgroundImage: `url("${lazyLoadedImage}")` }} />
            {url && <div
                className="consonant-HalfHeightCard-videoIco" />}
            <div className="consonant-HalfHeightCard-inner">
                {label &&
                    <span className="consonant-HalfHeightCard-label">{label}</span>
                }
                {title &&
                    <h2 className="consonant-HalfHeightCard-title">{title}</h2>
                }
                {url && isOpen && createPortal(
                    <ModalWindow
                        name="video-modal"
                        videoURL={url}
                        innerRef={modalElement}
                        videoPolicy="autoplay; fullscreen" />,
                    modalContainer,
                )}
            </div>
        </div>
    );
};

HalfHeightCard.propTypes = halfHeightCardType;
HalfHeightCard.defaultProps = defaultProps;

export default HalfHeightCard;
