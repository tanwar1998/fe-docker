import React from 'react';
import { string, oneOfType, shape, instanceOf } from 'prop-types';

const VideoModal = ({
    name,
    videoURL,
    innerRef,
    videoPolicy,
}) => (
    <div ref={innerRef} className="modal" id="ckkymf1in00004a6h0hfeo8h1-video">
        <div className="dexter-Modal_overlay mobile-place-center mobile-place-middle closePlacement-outsideTopRight is-Open" data-conf-display="onHashChange">
            <div className="dexter-Modal mobile-width-100 mobile-height-auto tablet-width-640 desktop-width-1024 is-Open" id={`video-${name}`}>
                <h6 id={`video-${name}-modalTitle`} className="hide-all">video modal</h6>
                <p id={`video-${name}-modalDescription`} className="hide-all">video modal</p>
                <button className="dexter-CloseButton">
                    <i className="dexter-CloseButton_icon spectrum-close-circle-dark" />
                </button>
                <div className="video aem-Grid aem-Grid--12 aem-Grid--default--12">
                    <div className="videoContainer" data-in-modal="true">
                        <iframe
                            title="Featured Video"
                            // data-video-src={videoURL}
                            data-video-src="https://www.youtube.com/embed/hY7m5jjJ9mM?autoplay=1&amp;rel=0"
                            allow={videoPolicy}
                            frameBorder="0"
                            webkitallowfullscreen="true"
                            mozallowfullscreen="true"
                            allowFullScreen=""
                            // src="https://www.youtube.com/embed/hY7m5jjJ9mM?autoplay=1&amp;rel=0"
                            src={videoURL} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);


VideoModal.propTypes = {
    name: string.isRequired,
    videoURL: string.isRequired,
    videoPolicy: string.isRequired,
    innerRef: oneOfType([
        shape({ current: instanceOf(Element) }),
    ]).isRequired,
};

export default VideoModal;
