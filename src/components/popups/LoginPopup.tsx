import React, { useEffect } from 'react';

import { ActionTypes } from '../../constants/ActionTypes';
import { LoginStatus } from '../../constants/LoginStatus';
import useBaseStore from '../../stores/useBaseStore';
import useUserStore from '../../stores/useUserStore';
import LoadingIndicator from '../global/LoadingIndicator';

const LoginPopup: React.FC = () => {
    const loginStatus = useUserStore((s) => s.loginStatus);
    const error = useBaseStore((s) => s.error);

    const closePopup = () => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: null,
        });
    };

    const resetLogin = () => {
        window.DispatchAction(ActionTypes.CHANGE_LOGIN_STATUS, {
            status: LoginStatus.LOGGED_OUT,
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

    if (loginStatus === LoginStatus.LOGIN_FAILED) {
        let errorMessage =
            'Your credentials could not be validated. Please make sure they are entered correctly and try again.';

        if (error && 'code' in error) {
            switch (error.code) {
                case 29: // AlreadyLoggedIn
                    errorMessage = 'This account is in use from another location.';
                    break;

                case 24: // PendingVerification
                    errorMessage = 'You must verify your account before you can log in.';
                    break;

                case 31: // ExpiredToken
                    errorMessage = 'Your session has expired. Please log in again using your credentials.';
                    break;

                case 27: // AccountDisabled
                    errorMessage = 'Your account has been disabled by an administrator.';
                    break;

                case 28: // AccountBanned
                    errorMessage = 'Your account has been banned.';
                    break;

                case 5: // Unauthorized
                    errorMessage = 'Your account does not have access to this branch.';
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

    return (
        <div className="center-notice">
            <div className="notice-content">
                <h1>Logging In</h1>
                <p>Please wait...</p>
                <LoadingIndicator />
            </div>
        </div>
    );
};
export default LoginPopup;
