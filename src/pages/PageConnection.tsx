import React, { useEffect } from 'react';

import LoadingIndicator from '../components/global/LoadingIndicator';
import { ActionTypes } from '../constants/ActionTypes';
import { ConnectionStatus } from '../constants/ConnectionStatus';
import useBaseStore from '../stores/useBaseStore';

const PageConnection: React.FC = () => {
    const connectionStatus = useBaseStore((s) => s.connectionStatus);
    const error = useBaseStore((s) => s.error);

    const enableBlur = () => {
        window.DispatchAction(ActionTypes.SET_BLUR, {
            blur: true,
        });
    };

    const disableMenu = () => {
        window.DispatchAction(ActionTypes.SET_BLUR, {
            menu: false,
        });
    };

    useEffect(() => {
        enableBlur();
        disableMenu();
    }, []);

    const onReconnect = (e: any) => {
        e.preventDefault();
        window.WebUI.Call('Reconnect');
    };

    if (connectionStatus === ConnectionStatus.DISCONNECTED) {
        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Connection Error</h1>
                    <p>You have been disconnected from the Zeus Backend.</p>
                    <a href="#" className="btn border-btn" onClick={onReconnect}>
                        Reconnect
                    </a>
                </div>
            </div>
        );
    }

    if (connectionStatus === ConnectionStatus.CONNECTING || connectionStatus === ConnectionStatus.CONNECTED) {
        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Connecting</h1>
                    <p>Connecting to the Zeus Backend. Please wait...</p>
                    <LoadingIndicator />
                </div>
            </div>
        );
    }

    let errorCode = 'Unknown';

    if (error && 'code' in error) {
        switch (error.code) {
            case 0:
                errorCode = 'Connection timed out.';
                break;

            case 4:
                errorCode = 'No servers available.';
                break;

            case 23:
                errorCode = 'Servers are busy. Keep retrying.';
                break;

            default:
                errorCode = 'Unknown (' + error.code + ')';
        }
    }

    return (
        <div className="center-notice">
            <div className="notice-content">
                <h1>Connection Failed</h1>
                <p>Could not connect to the Zeus Backend. Reason: {errorCode}.</p>
                <a href="#" className="btn border-btn" onClick={onReconnect}>
                    Reconnect
                </a>
            </div>
        </div>
    );
};
export default PageConnection;
