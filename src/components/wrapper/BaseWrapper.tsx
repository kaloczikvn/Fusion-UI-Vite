import React, { useEffect } from 'react';
import { Outlet } from 'react-router';

import { ActionTypes } from '../../constants/ActionTypes';
import useBaseStore from '../../stores/useBaseStore';
import useSettingsStore from '../../stores/useSettingsStore';
import AnimatedBackground from '../global/AnimatedBackground';
import GameConsole from '../global/GameConsole';
import GlobalNotice from '../global/GlobalNotice';
import TopLeftActions from '../global/TopLeftActions';
import TopMenu from '../global/TopMenu';
import TopRightActions from '../global/TopRightActions';
import Watermark from '../global/Watermark';
import LogoutQuitConfirmationPopup from '../popups/LogoutQuitConfirmationPopup';
import QuitConfirmationPopup from '../popups/QuitConfirmationPopup';
import SettingsPopup from '../popups/SettingsPopup';
import useNavigator from '../test/useNavigator';
import useTest from '../test/useTest';

const BaseWrapper: React.FC = () => {
    useTest();
    useNavigator();

    const hasMenu = useBaseStore((s) => s.hasMenu);
    const ingame = useBaseStore((s) => s.ingame);
    const popup = useBaseStore((s) => s.popup);
    const build = useBaseStore((s) => s.build);
    const initialized = useBaseStore((s) => s.initialized);
    const hasBlur = useBaseStore((s) => s.hasBlur);
    const showPopup = useSettingsStore((s) => s.showPopup);

    const setPopup = (popup: any) => {
        window.DispatchAction(ActionTypes.SET_POPUP, { popup: popup });
    };

    const onQuit = () => {
        setPopup(<QuitConfirmationPopup />);
    };

    const onLogoutQuit = () => {
        setPopup(<LogoutQuitConfirmationPopup />);
    };

    useEffect(() => {
        window.WebUI.Call('Startup');

        setTimeout(() => {
            window.WebUI.Call('InitialConnect');
        }, 2500);
    }, []);

    useEffect(() => {
        const inputTimeout = setInterval(() => {
            if (ingame) return;

            window.WebUI.Call('EnableMouse');
            window.WebUI.Call('EnableKeyboard');
        }, 500);

        return () => {
            clearInterval(inputTimeout);
        };
    }, [ingame]);

    return (
        <div id="ui-app">
            {initialized ? (
                <>
                    {ingame ? (
                        <>
                            <Watermark />
                            {showPopup ? (
                                <>
                                    <AnimatedBackground />
                                    <div id="app-container">
                                        <SettingsPopup />
                                    </div>
                                </>
                            ) : null}
                        </>
                    ) : (
                        <>
                            <AnimatedBackground />
                            <div id="app-container" className={hasBlur ? 'has-blur' : ''}>
                                <div className="top-bar">
                                    <TopLeftActions onQuit={onQuit} onLogoutQuit={onLogoutQuit} />
                                    {hasMenu ? <TopMenu /> : null}
                                    <TopRightActions />
                                </div>
                                <Outlet />
                                <div id="build-info">{build !== null ? `Build #${build}` : 'Unknown Build'}</div>
                            </div>
                            {popup !== null ? <div className="popup-container">{popup}</div> : null}
                        </>
                    )}
                </>
            ) : null}
            <GameConsole />
            <GlobalNotice />
        </div>
    );
};
export default BaseWrapper;
