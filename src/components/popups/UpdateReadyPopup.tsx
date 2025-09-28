import React, { useEffect } from 'react';

import { ActionTypes } from '../../constants/ActionTypes';

const UpdateReadyPopup: React.FC = () => {
    const onClosePopup: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault();

        window.DispatchAction(ActionTypes.SET_POPUP, { popup: null });
    };

    useEffect(() => {
        (document.activeElement as HTMLElement).blur();
    }, []);

    return (
        <div className="center-notice">
            <div className="notice-content">
                <h1>Update Ready</h1>
                <p>An update has been downloaded and will be automatically applied the next time you launch VU.</p>
                <a href="#" className="btn border-btn" onClick={onClosePopup}>
                    Close
                </a>
            </div>
        </div>
    );
};
export default UpdateReadyPopup;
