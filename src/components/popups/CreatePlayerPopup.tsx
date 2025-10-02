import React, { useEffect, useRef, useState } from 'react';

import { ActionTypes } from '../../constants/ActionTypes';
import { PlayerCreateStatus } from '../../constants/PlayerCreateStatus';
import useBaseStore from '../../stores/useBaseStore';
import useUserStore from '../../stores/useUserStore';
import Input from '../form/Input';
import LoadingIndicator from '../global/LoadingIndicator';

const CreatePlayerPopup: React.FC = () => {
    const playerCreateStatus = useUserStore((s) => s.playerCreateStatus);
    const error = useBaseStore((s) => s.error);

    const inputRef = useRef<any>(null);
    const [inputValue, setInputValue] = useState<string>('');

    const closePopup = () => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: null,
        });
    };

    const resetLogin = () => {
        window.DispatchAction(ActionTypes.CHANGE_PLAYER_CREATE_STATUS, {
            status: PlayerCreateStatus.NO_STATUS,
        });
    };

    const setCreating = () => {
        window.DispatchAction(ActionTypes.CHANGE_PLAYER_CREATE_STATUS, {
            status: PlayerCreateStatus.CREATING,
        });
    };

    const resetPopup = () => {
        window.DispatchAction(ActionTypes.CHANGE_PLAYER_CREATE_STATUS, {
            status: PlayerCreateStatus.CREATION_INIT,
        });
    };

    const onResetPopup = (e?: any) => {
        if (e) e.preventDefault();

        resetPopup();
    };

    const onClosePopup = (e?: any) => {
        if (e) e.preventDefault();

        closePopup();
        resetLogin();
    };

    const onSubmit = (e?: any) => {
        if (e) e.preventDefault();

        setCreating();

        window.WebUI.Call('CreatePlayer', inputValue);
    };

    useEffect(() => {
        (document.activeElement as HTMLElement).blur();

        inputRef.current?.focus();
    }, []);

    if (playerCreateStatus === PlayerCreateStatus.CREATION_FAILED) {
        let errorMessage = 'Could not create soldier. Please try again later.';

        if (error && 'code' in error) {
            switch (error.code) {
                case 16: // InvalidPlayerName
                    errorMessage =
                        'The soldier name you entered is invalid. Names must be between 3 and 16 characters and can contain latin letters, numbers, spaces, and the following characters: ._"\'$:-|[]<>!?*@;/\\(){}~^';
                    break;

                case 20: // PlayerAlreadyExists
                    errorMessage = 'The soldier name you entered is already in use.';
                    break;

                case 21: // MaximumPlayersReached
                    errorMessage = 'You have reached the limit of soldiers you can create.';
                    break;

                case 29: // MissingLink
                    errorMessage =
                        'You must link your Origin account to your VU account before being able to create soldiers. Restart the VU client to link your accounts.';
                    break;

                case 30: // LinkUnauthorized
                    errorMessage =
                        'You must have BF3 in your Origin account to your VU account before being able to create soldiers. Restart the VU client to relink your accounts.';
                    break;

                case 31: // LinkNeedsRefresh
                    errorMessage =
                        'Your Origin account link has expired because you own BF3 through EA Play. You must refresh your link before creating a soldier. Restart the VU client to refresh your link.';
                    break;
            }
        }

        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Creation Failed</h1>
                    <p>{errorMessage}</p>
                    <a href="#" className="btn border-btn" onClick={onResetPopup}>
                        Close
                    </a>
                </div>
            </div>
        );
    }

    if (playerCreateStatus === PlayerCreateStatus.CREATING) {
        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Creating Soldier</h1>
                    <p>Please wait while your new Soldier is being created...</p>
                    <LoadingIndicator />
                </div>
            </div>
        );
    }

    if (playerCreateStatus !== PlayerCreateStatus.CREATION_INIT) {
        setTimeout(() => {
            closePopup();
        }, 50);
        return <div></div>;
    }

    return (
        <div className="center-notice">
            <div className="notice-content">
                <h1>Create new Soldier</h1>
                <form onSubmit={onSubmit}>
                    <label htmlFor="name">Soldier name</label>
                    <div style={{ margin: '4rem 0 16rem' }}>
                        <Input
                            type="text"
                            name="name"
                            placeholder="Enter a name for your solider"
                            ref={inputRef}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onSubmit();
                                }
                            }}
                            value={inputValue}
                            id="name"
                            autoFocus
                        />
                    </div>
                    <div className="form-actions">
                        <a href="#" className="btn border-btn" onClick={onClosePopup}>
                            Close
                        </a>
                        <a href="#" className="btn border-btn primary" onClick={onSubmit}>
                            Create
                        </a>
                    </div>
                    <input type="submit" style={{ position: 'absolute', opacity: 0.0 }} />
                </form>
            </div>
        </div>
    );
};
export default CreatePlayerPopup;
