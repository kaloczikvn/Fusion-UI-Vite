import React, { useEffect } from 'react';
import LoadingIndicator from '../global/LoadingIndicator';
import * as ActionTypes from '../../constants/ActionTypes';
import useUserStore from '../../stores/useUserStore';
import * as PlayerDeleteStatus from '../../constants/PlayerDeleteStatus';

const DeletingPlayerPopup: React.FC = () => {
    const playerDeleteStatus = useUserStore((s) => s.playerDeleteStatus);

    const closePopup = () => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: null,
        });
    };

    const resetLogin = () => {
        window.DispatchAction(ActionTypes.CHANGE_PLAYER_DELETE_STATUS, {
            status: PlayerDeleteStatus.NO_STATUS,
        });
    };

    const onClosePopup = (e?: any) => {
        if (e) e.preventDefault();

        closePopup();
        resetLogin();
    };

    useEffect(() => {
        (document.activeElement as any)?.blur();
    }, []);

    if (playerDeleteStatus === PlayerDeleteStatus.DELETION_FAILED) {
        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Deletion Failed</h1>
                    <p>Your Soldier could not be deleted. Please try again later.</p>
                    <a href="#" className="btn border-btn" onClick={onClosePopup}>
                        Close
                    </a>
                </div>
            </div>
        );
    }

    if (playerDeleteStatus === PlayerDeleteStatus.NO_STATUS) {
        setTimeout(() => {
            closePopup();
        }, 50);
        return <div></div>;
    }

    return (
        <div className="center-notice">
            <div className="notice-content">
                <h1>Deleting Soldier</h1>
                <p>Please wait...</p>
                <LoadingIndicator />
            </div>
        </div>
    );
};
export default DeletingPlayerPopup;
