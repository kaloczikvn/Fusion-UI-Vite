import React, { memo } from 'react';
import { MdExitToApp, MdPowerSettingsNew } from 'react-icons/md';

import { LoginStatus } from '../../constants/LoginStatus';
import useUserStore from '../../stores/useUserStore';

interface IProps {
    onQuit: () => void;
    onLogoutQuit: () => void;
}

const TopLeftActions: React.FC<IProps> = ({ onQuit, onLogoutQuit }) => {
    const loginStatus = useUserStore((s) => s.loginStatus);

    const handleQuit: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault();

        onQuit();
    };

    const handleLogout: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault();

        onLogoutQuit();
    };

    return (
        <ul className="top-actions left">
            <li>
                <a href="#" onClick={handleQuit}>
                    <MdPowerSettingsNew />
                </a>
            </li>
            {loginStatus === LoginStatus.LOGGED_IN ? (
                <li>
                    <a href="#" onClick={handleLogout}>
                        <MdExitToApp />
                    </a>
                </li>
            ) : null}
        </ul>
    );
};
export default memo(TopLeftActions);
