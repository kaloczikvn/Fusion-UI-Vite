import React from 'react';
import * as LoginStatus from '../../constants/LoginStatus';

import ExitToAppIcon from '../icons/ExitToAppIcon';
import PowerSettingsNewIcon from '../icons/PowerSettingsNewIcon';
import useUserStore from '../../stores/useUserStore';

interface IProps {
    onQuit: () => void;
    onLogoutQuit: () => void;
}

const TopLeftActions: React.FC<IProps> = ({ onQuit, onLogoutQuit }) => {
    const loginStatus = useUserStore((s) => s.loginStatus);

    const handleQuit = (e: any) => {
        if (e) e.preventDefault();

        if (onQuit) onQuit();
    };

    const handleLogout = (e: any) => {
        if (e) e.preventDefault();

        if (onLogoutQuit) onLogoutQuit();
    };

    return (
        <ul className="top-actions left">
            <li>
                <a href="#" onClick={handleQuit}>
                    <PowerSettingsNewIcon />
                </a>
            </li>
            {loginStatus === LoginStatus.LOGGED_IN ? (
                <li>
                    <a href="#" onClick={handleLogout}>
                        <ExitToAppIcon />
                    </a>
                </li>
            ) : null}
        </ul>
    );
};
export default TopLeftActions;
