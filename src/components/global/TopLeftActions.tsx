import React from 'react';

import ExitToAppIcon from '../icons/ExitToAppIcon';
import PowerSettingsNewIcon from '../icons/PowerSettingsNewIcon';
import useUserStore from '../../stores/useUserStore';
import { LoginStatus } from '../../constants/LoginStatus';

interface IProps {
    onQuit: () => void;
    onLogoutQuit: () => void;
}

const TopLeftActions: React.FC<IProps> = ({ onQuit, onLogoutQuit }) => {
    const loginStatus = useUserStore((s) => s.loginStatus);

    const handleQuit: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault();

        if (onQuit) onQuit();
    };

    const handleLogout: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault();

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
