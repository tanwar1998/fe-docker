import React, { memo, Fragment, useState, useEffect, useRef, useCallback } from 'react';
import { string, bool, func } from 'prop-types';
import { createPortal } from 'react-dom';
import ModalWindow from './videoModal';
import Modal from '../../../../../../publish/src/js/components/modal/modal';

const VideoButton = ({
    name,
    videoURL,
    className,
    videoPolicy,
    isOpenParent,
    handleModalParent,
}) => {
    const modalContainer = document.querySelector('.modalContainer');

    const modalElement = useRef(null);
    const [isOpen, setIsOpen] = useState(isOpenParent);

    const handleShowModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleCloseModal = () => {
        setIsOpen(false);
        handleModalParent();
    };

    useEffect(() => {
        if ((isOpen || isOpenParent) && modalElement && modalElement.current) {
            const videoModal = new Modal(
                modalElement.current,
                { buttonClose: handleCloseModal },
            );

            videoModal.open();
        }
    }, [isOpen, modalElement]);

    return (
        <Fragment>
            <button
                className={className}
                onClick={handleShowModal} />
            {(isOpen || isOpenParent) && createPortal(
                <ModalWindow
                    name={name}
                    videoURL={videoURL}
                    innerRef={modalElement}
                    videoPolicy={videoPolicy} />,
                modalContainer,
            )}
        </Fragment>
    );
};

VideoButton.propTypes = {
    name: string,
    videoPolicy: string,
    videoURL: string.isRequired,
    className: string.isRequired,
    isOpenParent: bool,
    handleModalParent: func,
};

VideoButton.defaultProps = {
    name: 'video-modal',
    videoPolicy: 'autoplay; fullscreen',
    isOpenParent: false,
    handleModalParent: () => { },
};

export default memo(VideoButton);
