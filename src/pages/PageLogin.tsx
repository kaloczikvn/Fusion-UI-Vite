import React, { useState, useEffect, useRef } from 'react';
import useUserStore from '../stores/useUserStore';

const PageLogin: React.FC = () => {
    const loginData = useUserStore((s) => state.loginData);
    const loginToken = useUserStore((s) => state.loginToken);

    const [capsLock, setCapsLock] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(false);

    const enableBlur = () => {
        // TODO: dispatch({ type: ActionTypes.SET_BLUR, blur: true });
    };

    const disableMenu = () => {
        // TODO:dispatch({ type: ActionTypes.SET_MENU, menu: false });
    };

    const setPopup = (popup: any) => {
        // TODO:dispatch({ type: ActionTypes.SET_POPUP, popup: popup });
    };

    const onSetLogin = () => {
        /*
        // TODO:
        dispatch({
            type: ActionTypes.CHANGE_LOGIN_STATUS,
            status: LoginStatus.LOGGING_IN,
        });
        */
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
        // TODO: setPopup(<LoginPopup />);

        // TODO: Fix checkbox...
        // WebUI.Call('Login', usernameRef.current.value, passwordRef.current.value, rememberRef.current.checked);
        window.WebUI.Call('Login', username, password, true);
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
            // TODO: setPopup(<LoginPopup />);

            window.WebUI.Call('Login', loginData.username, loginData.password, false);
        } else if (loginToken !== null) {
            onSetLogin();
            // TODO: setPopup(<LoginPopup />);

            window.WebUI.Call('TokenLogin', loginToken.token);
        }

        return () => {
            setPopup(null);
        };
    }, []);

    let capsLockNoticeClass = 'capslock-notice';

    if (capsLock) {
        capsLockNoticeClass += ' on';
    }

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
                <div className={capsLockNoticeClass}>
                    <strong>WARNING</strong>&nbsp;&nbsp;Caps Lock is on.
                </div>
                <a href="#" className="btn border-btn primary" onClick={onSubmit}>
                    Login
                </a>
                <a href="#" className="btn border-btn" onClick={onSignUp}>
                    Sign Up
                </a>
                <div className="login-actions">
                    <div className="left-actions">
                        <label>
                            Remember Me{' '}
                            <input
                                type="checkbox"
                                name="remember"
                                value="yes"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                        </label>
                    </div>
                    <div className="right-actions">
                        <a href="#" onClick={onForgotPassword}>
                            Forgot Password
                        </a>
                    </div>
                </div>
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
