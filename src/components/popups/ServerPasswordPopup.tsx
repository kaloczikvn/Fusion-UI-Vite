import React, { useEffect, useState } from 'react';
import { ActionTypes } from '../../constants/ActionTypes';
import { MdOutlineReport } from 'react-icons/md';

interface IProps {
    server: any;
    onJoin: (guid: any, password: string) => void;
}

const ServerPasswordPopup: React.FC<IProps> = ({ server, onJoin }) => {
    const [password, setPassword] = useState<string>('');
    const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);

    const closePopup = () => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: null,
        });
    };

    const onUpdateCapsLock = (e?: any) => {
        setIsCapsLockOn(e.getModifierState('CapsLock'));
    };

    const onClosePopup = (e?: any) => {
        if (e) e.preventDefault();

        closePopup();
    };

    const onSubmit = (e?: any) => {
        if (e) e.preventDefault();

        closePopup();

        if (onJoin) onJoin(server.guid, password);
    };

    useEffect(() => {
        (document.activeElement as HTMLElement).blur();
    }, []);

    return (
        <div className="center-notice">
            <div className="notice-content">
                <h1>Enter Server Password</h1>
                <form onSubmit={onSubmit}>
                    <div className="label-wrapper">
                        <label htmlFor="password">Server Password</label>
                        <br />
                        {isCapsLockOn ? (
                            <div className="caps-lock-notice">
                                <MdOutlineReport color="#e8eaed" />
                                CAPS LOCK IS ON
                            </div>
                        ) : null}
                    </div>

                    <div className="field-container">
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            onKeyDown={onUpdateCapsLock}
                            onKeyUp={onUpdateCapsLock}
                            onMouseDown={onUpdateCapsLock}
                        />
                    </div>

                    <div className="form-actions">
                        <a href="#" className="btn border-btn" onClick={onClosePopup}>
                            Close
                        </a>
                        <a href="#" className="btn border-btn primary" onClick={onSubmit}>
                            Connect
                        </a>
                    </div>
                    <input type="submit" style={{ position: 'absolute', opacity: 0.0 }} />
                </form>
            </div>
        </div>
    );
};
export default ServerPasswordPopup;
