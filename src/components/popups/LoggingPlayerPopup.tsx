import React, { useEffect } from 'react';

import { ActionTypes } from '../../constants/ActionTypes';
import { PlayerLoginStatus } from '../../constants/PlayerLoginStatus';
import useBaseStore from '../../stores/useBaseStore';
import useUserStore from '../../stores/useUserStore';
import LoadingIndicator from '../global/LoadingIndicator';

const LoggingPlayerPopup: React.FC = () => {
    const playerLoginStatus = useUserStore((s) => s.playerLoginStatus);
    const error = useBaseStore((s) => s.error);

    const closePopup = () => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: null,
        });
    };

    const resetLogin = () => {
        window.DispatchAction(ActionTypes.CHANGE_PLAYER_LOGIN_STATUS, {
            status: PlayerLoginStatus.LOGGED_OUT,
        });
    };

    const onClosePopup = (e?: any) => {
        if (e) e.preventDefault();

        closePopup();
        resetLogin();
    };

    useEffect(() => {
        (document.activeElement as HTMLElement).blur();
    }, []);

    if (playerLoginStatus === PlayerLoginStatus.LOGIN_FAILED) {
        let errorMessage = 'An error occurred while attempting to login with your Soldier. Please try again later.';

        if (error && 'code' in error) {
            switch (error.code) {
                case 24: // PlayerDisabled
                    errorMessage = 'This soldier has been banned.';
                    break;

                case 29: // MissingLink
                    errorMessage =
                        'You must link your Origin account to your VU account before being able to play. Restart the VU client to link your accounts.';
                    break;

                case 30: // LinkUnauthorized
                    errorMessage =
                        'You must have BF3 in your Origin account to your VU account before being able to play. Restart the VU client to relink your accounts.';
                    break;

                case 31: // LinkNeedsRefresh
                    errorMessage =
                        'Your Origin account link has expired because you own BF3 through EA Play. You must refresh your link before being able to play. Restart the VU client to refresh your link.';
                    break;
            }
        }

        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Login Failed</h1>
                    <p>{errorMessage}</p>
                    <a href="#" className="btn border-btn" onClick={onClosePopup}>
                        Close
                    </a>
                </div>
            </div>
        );
    }

    if (playerLoginStatus !== PlayerLoginStatus.LOGGING_IN) {
        setTimeout(() => {
            closePopup();
        }, 50);
        return <div></div>;
    }

    return (
        <div className="center-notice">
            <div className="notice-content">
                <h1>Logging In</h1>
                <p>Please wait while we login with your Soldier...</p>
                <LoadingIndicator />
            </div>
        </div>
    );
};
export default LoggingPlayerPopup;
