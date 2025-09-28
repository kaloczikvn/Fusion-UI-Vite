import React, { useEffect } from 'react';

import { ActionTypes } from '../../constants/ActionTypes';
import useBaseStore from '../../stores/useBaseStore';

const QuitConfirmationPopup: React.FC = () => {
    const productName = useBaseStore((s) => s.productName);

    const onConfirmQuit = (e: any) => {
        e.preventDefault();

        onClosePopup(e);

        window.WebUI.Call('Quit');
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
                <h1>Quit Game</h1>
                <p>Are you sure you want to quit {productName}?</p>
                <div className="action-buttons">
                    <a href="#" className="btn border-btn" onClick={onClosePopup}>
                        Cancel
                    </a>
                    <a href="#" className="btn border-btn primary" onClick={onConfirmQuit}>
                        Quit
                    </a>
                </div>
            </div>
        </div>
    );
};
export default QuitConfirmationPopup;
