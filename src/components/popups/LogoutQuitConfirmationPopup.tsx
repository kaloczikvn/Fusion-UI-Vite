import React, { useEffect } from 'react';

import { ActionTypes } from '../../constants/ActionTypes';

const LogoutQuitConfirmationPopup: React.FC = () => {
    const onConfirmQuit = (e: any) => {
        e.preventDefault();

        onClosePopup(e);

        window.WebUI.Call('LogoutQuit');
    };

    const onClosePopup = (e: any) => {
        e.preventDefault();

        window.DispatchAction(ActionTypes.SET_POPUP, { popup: null });
    };

    useEffect(() => {
        (document.activeElement as HTMLElement).blur();
    }, []);

    return (
        <div className="center-notice">
            <div className="notice-content">
                <h1>Logout & Quit</h1>
                <p>Are you sure you want to log out and quit?</p>
                <div className="action-buttons">
                    <a href="#" className="btn border-btn" onClick={onClosePopup}>
                        Cancel
                    </a>
                    <a href="#" className="btn border-btn primary" onClick={onConfirmQuit}>
                        Logout & Quit
                    </a>
                </div>
            </div>
        </div>
    );
};
export default LogoutQuitConfirmationPopup;
