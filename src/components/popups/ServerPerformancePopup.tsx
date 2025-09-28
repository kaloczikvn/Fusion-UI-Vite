import React from 'react';

import { ActionTypes } from '../../constants/ActionTypes';
import ServerPasswordPopup from './ServerPasswordPopup';

interface IProps {
    server: any;
    onJoin: (guid: any) => void;
}

const ServerPerformancePopup: React.FC<IProps> = ({ server, onJoin }) => {
    const closePopup = () => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: null,
        });
    };

    const setPopup = (popup: any) => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: popup,
        });
    };

    const onClosePopup = (e?: any) => {
        if (e) e.preventDefault();

        closePopup();
    };

    const _onJoin = (e?: any) => {
        if (e) e.preventDefault();

        closePopup();

        if (server.passworded) {
            setPopup(<ServerPasswordPopup server={server} onJoin={onJoin} />);
            return;
        }

        if (onJoin) onJoin(server.guid);
    };

    return (
        <div className="center-notice">
            <div className="notice-content">
                <h1>Server Performance Warning</h1>
                <p>The server you are trying to join is experiencing performance issues.</p>
                <p>This means that you could experience lag, inconsistent hitreg, rubberbanding, etc.</p>

                <div className="action-buttons">
                    <a href="#" className="btn border-btn" onClick={onClosePopup}>
                        Cancel
                    </a>
                    <a href="#" className="btn border-btn primary" onClick={_onJoin}>
                        Join anyway
                    </a>
                </div>
            </div>
        </div>
    );
};
export default ServerPerformancePopup;
