import React, { useEffect } from 'react';

import { Outlet } from 'react-router';
import useBaseStore from '../../stores/useBaseStore';
import useSettingsStore from '../../stores/useSettingsStore';
import AnimatedBackground from '../global/AnimatedBackground';
import TopLeftActions from '../global/TopLeftActions';
import TopRightActions from '../global/TopRightActions';
import Watermark from '../global/Watermark';
import TopMenu from '../global/TopMenu';
import GlobalNotice from '../global/GlobalNotice';
import QuitConfirmationPopup from '../popups/QuitConfirmationPopup';
import LogoutQuitConfirmationPopup from '../popups/LogoutQuitConfirmationPopup';
import SettingsPopup from '../popups/SettingsPopup';
import useNavigator from '../test/useNavigator';
import useTest from '../test/useTest';
import { ActionTypes } from '../../constants/ActionTypes';

const BaseWrapper: React.FC = () => {
    useTest();
    useNavigator();

    const hasMenu = useBaseStore((s) => s.hasMenu);
    const ingame = useBaseStore((s) => s.ingame);
    const popup = useBaseStore((s) => s.popup);
    const build = useBaseStore((s) => s.build);
    const initialized = useBaseStore((s) => s.initialized);
    const hasBlur = useBaseStore((s) => s.hasBlur);
    const globalNotice = useBaseStore((s) => s.globalNotice);
    const showPopup = useSettingsStore((s) => s.showPopup);

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

    const setPopup = (popup: any) => {
        window.DispatchAction(ActionTypes.SET_POPUP, { popup: popup });
    };

    const onQuit = () => {
        setPopup(<QuitConfirmationPopup />);
    };

    const onLogoutQuit = () => {
        setPopup(<LogoutQuitConfirmationPopup />);
    };

    let topMenu = null;

    if (hasMenu) topMenu = <TopMenu />;

    let _popup = null;
    if (popup !== null) {
        _popup = <div className="popup-container">{popup}</div>;
    }

    let mainContainers = <Watermark build={build} />;

    if (initialized && !ingame) {
        mainContainers = (
            <>
                <AnimatedBackground />
                <div id="app-container" className={hasBlur ? 'has-blur' : ''}>
                    <div className="top-bar">
                        <TopLeftActions onQuit={onQuit} onLogoutQuit={onLogoutQuit} />
                        {topMenu}
                        <TopRightActions />
                    </div>
                    <Outlet />
                    <div id="build-info">{build !== null ? `Build #${build}` : 'Unknown Build'}</div>
                </div>
                {_popup}
            </>
        );
    } else if (initialized && showPopup) {
        mainContainers = (
            <>
                <AnimatedBackground />
                <div id="app-container">
                    <SettingsPopup />
                </div>
            </>
        );
    }

    let _globalNotice = null;

    if (globalNotice !== null) {
        const noticeText = globalNotice.toString().trim();

        if (noticeText.length > 0) {
            _globalNotice = <GlobalNotice notice={noticeText} />;
        }
    }

    return (
        <div id="ui-app">
            {mainContainers}
            {/* <GameConsole/> TODO: Re-enable later */}
            {_globalNotice}
        </div>
    );
};
export default BaseWrapper;
