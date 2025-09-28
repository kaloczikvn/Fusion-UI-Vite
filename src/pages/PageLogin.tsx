import React, { useEffect, useState } from 'react';
import { MdOutlineReport } from 'react-icons/md';

import VUCheckbox from '../components/form/VUCheckbox';
import LoginPopup from '../components/popups/LoginPopup';
import { ActionTypes } from '../constants/ActionTypes';
import { LoginStatus } from '../constants/LoginStatus';
import useUserStore from '../stores/useUserStore';

const PageLogin: React.FC = () => {
    const loginData = useUserStore((s) => s.loginData);
    const loginToken = useUserStore((s) => s.loginToken);

    const [capsLock, setCapsLock] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(false);

    const enableBlur = () => {
        window.DispatchAction(ActionTypes.SET_BLUR, {
            blur: true,
        });
    };

    const disableMenu = () => {
        window.DispatchAction(ActionTypes.SET_MENU, {
            menu: false,
        });
    };

    const setPopup = (popup: any) => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: popup,
        });
    };

    const onSetLogin = () => {
        window.DispatchAction(ActionTypes.CHANGE_LOGIN_STATUS, {
            status: LoginStatus.LOGGING_IN,
        });
    };

    const onUpdateCapsLock = (e: any) => {
        const capsLockState = e.getModifierState('CapsLock');
        setCapsLock(capsLockState);
    };

    const onForgotPassword = (e: any) => {
        if (e) e.preventDefault();

        window.WebUI.Call('Forgot');
    };

    const onSubmit = (e: any) => {
        e.preventDefault();

        onSetLogin();
        setPopup(<LoginPopup />);

        window.WebUI.Call('Login', username, password, remember);
    };

    const onSignUp = (e: any) => {
        e.preventDefault();
        window.WebUI.Call('Signup');
    };

    useEffect(() => {
        enableBlur();
        disableMenu();

        if (loginData !== null) {
            onSetLogin();
            setPopup(<LoginPopup />);

            window.WebUI.Call('Login', loginData.username, loginData.password, false);
        } else if (loginToken !== null) {
            onSetLogin();
            setPopup(<LoginPopup />);

            window.WebUI.Call('TokenLogin', loginToken.token);
        }

        return () => {
            setPopup(null);
        };
    }, []);

    return (
        <div id="login-page">
            <form onSubmit={onSubmit}>
                <img src="/assets/img/logo.svg" />

                <label htmlFor="username">Username</label>
                <br />
                <div className="field-container">
                    <input
                        type="text"
                        key="username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={onUpdateCapsLock}
                        onKeyUp={onUpdateCapsLock}
                        onMouseDown={onUpdateCapsLock}
                    />
                    <br />
                </div>
                <label htmlFor="password">Password</label>
                <br />
                <div className="field-container">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        key="password"
                        id="password"
                        onKeyDown={onUpdateCapsLock}
                        onKeyUp={onUpdateCapsLock}
                        onMouseDown={onUpdateCapsLock}
                    />
                    <br />
                </div>
                {capsLock ? (
                    <div className="caps-lock-notice">
                        <MdOutlineReport color="#e8eaed" />
                        CAPS LOCK IS ON
                    </div>
                ) : null}
                <div className="login-actions">
                    <div className="left-actions">
                        <VUCheckbox checked={remember} onChange={(value) => setRemember(value)} label="Remember Me" />
                    </div>
                    <div className="right-actions">
                        <a href="#" onClick={onForgotPassword}>
                            Forgot Password
                        </a>
                    </div>
                </div>
                <a href="#" className="btn border-btn primary" onClick={onSubmit}>
                    Login
                </a>
                <a href="#" className="btn border-btn" onClick={onSignUp}>
                    Sign Up
                </a>
                <input
                    type="submit"
                    style={{
                        position: 'absolute',
                        opacity: 0.0,
                        left: '-999999999px',
                    }}
                />
            </form>
        </div>
    );
};
export default PageLogin;
