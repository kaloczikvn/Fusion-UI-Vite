import { useRef, useState } from 'react';
import useBaseStore from '../../stores/useBaseStore';
import useServerStore from '../../stores/useServerStore';
import {
    checkServerCompatibility,
    getGamemodeName,
    getLevelName,
    getMapName,
    hasMapImage,
} from '../../utils/server/server';
import { getServerPlayersOnly, getServerSpectators } from '../../utils/server';
import * as ActionTypes from '../../constants/ActionTypes';
import ServerPerformancePopup from '../popups/ServerPerformancePopup';
import ServerPasswordPopup from '../popups/ServerPasswordPopup';

interface IProps {
    server: any;
    expanded: boolean;
    onClick: (guid: any) => void;
    onJoin: (guid: any, password?: string) => void;
    onSpectate: (guid: any, password?: string) => void;
    onAddRemoveFavorite: (server: any, isFavorite: boolean) => void;
    isFavorite: boolean;
}

const ServerEntry: React.FC<IProps> = ({
    server,
    expanded,
    onClick,
    onJoin,
    onSpectate,
    onAddRemoveFavorite,
    isFavorite,
}) => {
    const minServerBuild = useServerStore((s) => s.minServerBuild);
    const availableXPacks = useServerStore((s) => s.availableXPacks);
    const vextVersion = useBaseStore((s) => s.vextVersion);
    const build = useBaseStore((s) => s.build);
    const [hasClicked, setHasClicked] = useState<any>(false);
    const clickTimeout = useRef<any>(null);

    const setPopup = (popup: any) => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: popup,
        });
    };

    const _onClick = (e?: any) => {
        if (e) e.preventDefault();

        if (clickTimeout.current) {
            clearTimeout(clickTimeout.current);
            clickTimeout.current = null;
        }

        if (hasClicked) {
            setHasClicked(false);
            _onJoin(e);
            return;
        }

        setHasClicked(true);
        clickTimeout.current = setTimeout(() => {
            clickTimeout.current = null;
            setHasClicked(false);
        }, 350);

        if (onClick) onClick(server.guid);
    };

    const _onSpectate = (e?: any) => {
        if (e) e.preventDefault();

        if (checkServerCompatibility(server, availableXPacks, minServerBuild, build, vextVersion) !== null) return;

        let fps = null;

        if ('fps' in server.variables) {
            fps = parseInt(server.variables.fps, 10);

            if (isNaN(fps)) {
                fps = null;
            }
        }

        if (
            (server.variables.frequency === 'high60' && fps !== null && fps <= 66) ||
            (server.variables.frequency === 'high120' && fps !== null && fps <= 132) ||
            (server.variables.frequency === 'reg' && fps !== null && fps <= 33)
        ) {
            setPopup(<ServerPerformancePopup server={server} onJoin={onSpectate} />);
            return;
        }

        if (server.passworded) {
            setPopup(<ServerPasswordPopup server={server} onJoin={onSpectate} />);
            return;
        }

        if (onSpectate) onSpectate(server.guid);
    };

    const _onAddRemoveFavorite = (e?: any) => {
        if (e) e.preventDefault();

        if (onAddRemoveFavorite) onAddRemoveFavorite(server, isFavorite);
    };

    const _onJoin = (e?: any) => {
        if (e) e.preventDefault();

        if (checkServerCompatibility(server, availableXPacks, minServerBuild, build, vextVersion) !== null) return;

        let fps = null;

        if ('fps' in server.variables) {
            fps = parseInt(server.variables.fps, 10);

            if (isNaN(fps)) {
                fps = null;
            }
        }

        if (
            (server.variables.frequency === 'high60' && fps !== null && fps <= 66) ||
            (server.variables.frequency === 'high120' && fps !== null && fps <= 132) ||
            (server.variables.frequency === 'reg' && fps !== null && fps <= 33)
        ) {
            setPopup(<ServerPerformancePopup server={server} onJoin={onJoin} />);
            return;
        }

        if (server.passworded) {
            setPopup(<ServerPasswordPopup server={server} onJoin={onJoin} />);
            return;
        }

        if (onJoin) onJoin(server.guid);
    };

    let serverClassName = 'server-entry';

    if (expanded) serverClassName += ' expanded';

    if (isFavorite) serverClassName += ' favorite';

    const playerCount = getServerPlayersOnly(server);
    const spectatorCount = getServerSpectators(server);

    const compatibility = checkServerCompatibility(server, availableXPacks, minServerBuild, build, vextVersion);

    const compatible = compatibility === null;

    if (!compatible) serverClassName += ' incompatible';

    const style: any = {};

    if (
        server.variables.banner &&
        (server.variables.banner.startsWith('http://') || server.variables.banner.startsWith('https://')) &&
        server.variables.banner.endsWith('.jpg')
    ) {
        style.background =
            'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 35%,rgba(0,0,0,0.3) 65%,rgba(0,0,0,0.8) 100%), url(' +
            server.variables.banner +
            ') no-repeat top center';
        style.backgroundSize = '100% auto';
    } else if (hasMapImage(server.variables.mapname)) {
        style.background =
            "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 35%,rgba(0,0,0,0.3) 65%,rgba(0,0,0,0.8) 100%), url('/assets/img/maps/" +
            getLevelName(server.variables.mapname) +
            ".png') no-repeat top center";
        style.backgroundSize = '100% auto';
    }

    let compatibilityNotice = null;

    if (!compatible) compatibilityNotice = <span className="compat-notice">{compatibility}</span>;

    let spectatorPlayerCount = null;
    let spectateButton = null;

    if (parseInt(server.variables.maxspectators, 10) > 0) {
        spectatorPlayerCount = (
            <h4>
                {spectatorCount} / {server.variables.maxspectators}
            </h4>
        );
        spectateButton = (
            <a href="#" onClick={_onSpectate} className="btn border-btn spec-btn">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e8eaed"
                >
                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Zm0-80h480v-480H160v480Zm0 0v-480 480Z" />
                </svg>{' '}
                Spec
            </a>
        );
    }

    const serverIcons = [];

    if (server.passworded) {
        serverIcons.push(
            <span className="server-icon locked" key="locked">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#e8eaed"
                >
                    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
                </svg>
            </span>
        );
    }

    let fps = null;

    if ('fps' in server.variables) {
        fps = parseInt(server.variables.fps, 10);

        if (isNaN(fps)) {
            fps = null;
        }
    }

    if (server.variables.frequency === 'high60') {
        if (fps !== null && fps <= 66) {
            serverIcons.push(
                <span className="server-icon lag" key="lag">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#e8eaed"
                    >
                        <path d="m819-28-52-52H160v-80h80v-120q0-61 28.5-114.5T348-480q-32-20-54.5-48T257-590L27-820l57-57L876-85l-57 57ZM602-474l-60-59q45-19 71.5-59t26.5-88v-120H320v45l-45-45-80-80h605v80h-80v120q0 64-31 119t-87 87ZM320-160h320v-47L419-428q-45 19-72 59t-27 89v120Zm400 0Z" />
                    </svg>
                </span>
            );

            if (compatibilityNotice === null) {
                compatibilityNotice = (
                    <span className="compat-notice">
                        This server is having performance issues. You might experience lag.
                    </span>
                );
            }
        }

        serverIcons.push(
            <span className="server-icon freq" key="freq">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#e8eaed"
                >
                    <path d="M418-340q24 24 62 23.5t56-27.5l224-336-336 224q-27 18-28.5 55t22.5 61Zm62-460q59 0 113.5 16.5T696-734l-76 48q-33-17-68.5-25.5T480-720q-133 0-226.5 93.5T160-400q0 42 11.5 83t32.5 77h552q23-38 33.5-79t10.5-85q0-36-8.5-70T766-540l48-76q30 47 47.5 100T880-406q1 57-13 109t-41 99q-11 18-30 28t-40 10H204q-21 0-40-10t-30-28q-26-45-40-95.5T80-400q0-83 31.5-155.5t86-127Q252-737 325-768.5T480-800Zm7 313Z" />
                </svg>{' '}
                60Hz
            </span>
        );
    } else if (server.variables.frequency === 'high120') {
        if (fps !== null && fps <= 132) {
            serverIcons.push(
                <span className="server-icon lag" key="lag">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#e8eaed"
                    >
                        <path d="m819-28-52-52H160v-80h80v-120q0-61 28.5-114.5T348-480q-32-20-54.5-48T257-590L27-820l57-57L876-85l-57 57ZM602-474l-60-59q45-19 71.5-59t26.5-88v-120H320v45l-45-45-80-80h605v80h-80v120q0 64-31 119t-87 87ZM320-160h320v-47L419-428q-45 19-72 59t-27 89v120Zm400 0Z" />
                    </svg>
                </span>
            );

            if (compatibilityNotice === null) {
                compatibilityNotice = (
                    <span className="compat-notice lag">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#e8eaed"
                        >
                            <path d="m819-28-52-52H160v-80h80v-120q0-61 28.5-114.5T348-480q-32-20-54.5-48T257-590L27-820l57-57L876-85l-57 57ZM602-474l-60-59q45-19 71.5-59t26.5-88v-120H320v45l-45-45-80-80h605v80h-80v120q0 64-31 119t-87 87ZM320-160h320v-47L419-428q-45 19-72 59t-27 89v120Zm400 0Z" />
                        </svg>{' '}
                        This server is having performance issues. You might experience lag.
                    </span>
                );
            }
        }

        serverIcons.push(
            <span className="server-icon freq" key="freq">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#e8eaed"
                >
                    <path d="M418-340q24 24 62 23.5t56-27.5l224-336-336 224q-27 18-28.5 55t22.5 61Zm62-460q59 0 113.5 16.5T696-734l-76 48q-33-17-68.5-25.5T480-720q-133 0-226.5 93.5T160-400q0 42 11.5 83t32.5 77h552q23-38 33.5-79t10.5-85q0-36-8.5-70T766-540l48-76q30 47 47.5 100T880-406q1 57-13 109t-41 99q-11 18-30 28t-40 10H204q-21 0-40-10t-30-28q-26-45-40-95.5T80-400q0-83 31.5-155.5t86-127Q252-737 325-768.5T480-800Zm7 313Z" />
                </svg>{' '}
                120Hz
            </span>
        );
    } else {
        if (fps !== null && fps <= 33) {
            serverIcons.push(
                <span className="server-icon lag" key="lag">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#e8eaed"
                    >
                        <path d="m819-28-52-52H160v-80h80v-120q0-61 28.5-114.5T348-480q-32-20-54.5-48T257-590L27-820l57-57L876-85l-57 57ZM602-474l-60-59q45-19 71.5-59t26.5-88v-120H320v45l-45-45-80-80h605v80h-80v120q0 64-31 119t-87 87ZM320-160h320v-47L419-428q-45 19-72 59t-27 89v120Zm400 0Z" />
                    </svg>
                </span>
            );

            if (compatibilityNotice === null) {
                compatibilityNotice = (
                    <span className="compat-notice">This server has low fps. You might experience lag.</span>
                );
            }
        }
    }

    let serverTags = [];

    if (server.variables.tags && server.variables.tags.length > 0) serverTags = server.variables.tags.split(',');

    const tags = [];

    for (const tag of new Set(serverTags)) {
        if (!/^[a-z0-9-]+$/.test(tag as string)) continue;

        tags.push(<strong key={tag as string}>{tag as string}</strong>);
        tags.push(<span key={tag + 's'}>, </span>);
    }

    let serverInfo = [];
    let onlyTags = false;

    if (tags.length > 0) {
        tags.splice(tags.length - 1, 1);
        serverInfo.push(
            <h3 key="tags" className="tags">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#e8eaed"
                >
                    <path d="M856-390 570-104q-12 12-27 18t-30 6q-15 0-30-6t-27-18L103-457q-11-11-17-25.5T80-513v-287q0-33 23.5-56.5T160-880h287q16 0 31 6.5t26 17.5l352 353q12 12 17.5 27t5.5 30q0 15-5.5 29.5T856-390ZM513-160l286-286-353-354H160v286l353 354ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Zm220 160Z" />
                </svg>
                {tags}
            </h3>
        );

        onlyTags = serverIcons.length === 0;
        serverIcons.unshift(
            <span className="server-icon compact-tags" key="tags">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#e8eaed"
                >
                    <path d="M856-390 570-104q-12 12-27 18t-30 6q-15 0-30-6t-27-18L103-457q-11-11-17-25.5T80-513v-287q0-33 23.5-56.5T160-880h287q16 0 31 6.5t26 17.5l352 353q12 12 17.5 27t5.5 30q0 15-5.5 29.5T856-390ZM513-160l286-286-353-354H160v286l353 354ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Zm220 160Z" />
                </svg>
            </span>
        );
    }

    let serverIconsClass = 'server-icons';

    if (serverIcons.length === 0) {
        serverIconsClass += ' empty';
    }

    if (onlyTags) {
        serverIconsClass += ' only-tags';
    }

    serverInfo.unshift(
        <h1 key="info">
            <div className={serverIconsClass}>{serverIcons}</div>
            {server.name.length > 50 ? server.name.substring(0, 50) + '..' : server.name}
        </h1>
    );

    let favoriteButtonClassName = 'favorite-btn';
    if (isFavorite) {
        favoriteButtonClassName += ' is-favorite';
    }

    return (
        <div className={serverClassName} style={style} onClick={_onClick}>
            <div className="top-content">
                <div className="column column-1">{serverInfo}</div>
                <div className="column column-2">
                    <h3>{getMapName(server.variables.mapname)}</h3>
                </div>
                <div className="column column-3">
                    <h3>{getGamemodeName(server.variables.gamemode)}</h3>
                </div>
                <div className="column column-4">
                    <h3>
                        {playerCount} / {server.variables.maxplayers}
                    </h3>
                    {spectatorPlayerCount}
                </div>
                <div className="column column-5">
                    <span>{server.ping}</span>
                </div>
            </div>
            <div className="bottom-content">
                <div className="left-content">{compatibilityNotice}</div>
                <div className="right-content">
                    <a href="#" onClick={_onAddRemoveFavorite} className={favoriteButtonClassName}>
                        {isFavorite ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#e14d43"
                            >
                                <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#e8eaed"
                            >
                                <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
                            </svg>
                        )}
                    </a>
                    {spectateButton}
                    <a href="#" onClick={_onJoin} className="btn border-btn join-btn">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#e8eaed"
                        >
                            <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" />
                        </svg>
                        Join
                    </a>
                </div>
            </div>
        </div>
    );
};
export default ServerEntry;
