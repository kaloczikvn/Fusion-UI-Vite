import React, { memo } from 'react';
import { NavLink } from 'react-router';

const TopMenu: React.FC = () => {
    return (
        <div className="top-menu">
            <ul className="left-items">
                <li>
                    <NavLink to="/main-menu" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/server-browser" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Servers
                    </NavLink>
                </li>
            </ul>
            <div className="menu-logo"></div>
            <ul className="right-items">
                <li>
                    <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Settings
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/credits" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Credits
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};
export default memo(TopMenu);
