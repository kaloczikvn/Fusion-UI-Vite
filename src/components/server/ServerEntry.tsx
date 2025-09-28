import clsx from 'clsx';
import { useRef, useState } from 'react';
import {
    MdBookmark,
    MdBookmarkBorder,
    MdHourglassDisabled,
    MdLock,
    MdPlayArrow,
    MdSell,
    MdSpeed,
    MdVideocam,
} from 'react-icons/md';

import { ActionTypes } from '../../constants/ActionTypes';
import useBaseStore from '../../stores/useBaseStore';
import useServerStore from '../../stores/useServerStore';
import { getServerPlayersOnly, getServerSpectators } from '../../utils/server';
import {
    checkServerCompatibility,
    getGamemodeName,
    getLevelName,
    getMapName,
    hasMapImage,
} from '../../utils/server/server';
import ServerPasswordPopup from '../popups/ServerPasswordPopup';
import ServerPerformancePopup from '../popups/ServerPerformancePopup';

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
        /*
        style.background =
            'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 35%,rgba(0,0,0,0.3) 65%,rgba(0,0,0,0.8) 100%), url(' +
            server.variables.banner +
            ') no-repeat top center';
        style.backgroundSize = '100% auto';
        */
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
        spectatorPlayerCount = <h4>{`${spectatorCount} / ${server.variables.maxspectators}`}</h4>;
        spectateButton = (
            <a href="#" onClick={_onSpectate} className="btn border-btn spec-btn">
                <MdVideocam style={{ marginRight: '5rem' }} />
                <span>Spec</span>
            </a>
        );
    }

    const serverIcons = [];

    if (server.passworded) {
        serverIcons.push(
            <span className="server-icon locked" key="locked">
                <MdLock />
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
                    <MdHourglassDisabled />
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
                <MdSpeed />
                <span>60Hz</span>
            </span>
        );
    } else if (server.variables.frequency === 'high120') {
        if (fps !== null && fps <= 132) {
            serverIcons.push(
                <span className="server-icon lag" key="lag">
                    <MdHourglassDisabled />
                </span>
            );

            if (compatibilityNotice === null) {
                compatibilityNotice = (
                    <span className="compat-notice lag">
                        <MdHourglassDisabled />
                        This server is having performance issues. You might experience lag.
                    </span>
                );
            }
        }

        serverIcons.push(
            <span className="server-icon freq" key="freq">
                <MdSpeed />
                <span>120Hz</span>
            </span>
        );
    } else {
        if (fps !== null && fps <= 33) {
            serverIcons.push(
                <span className="server-icon lag" key="lag">
                    <MdHourglassDisabled />
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

    const serverInfo = [];
    let onlyTags = false;

    if (tags.length > 0) {
        tags.splice(tags.length - 1, 1);
        serverInfo.push(
            <h3 key="tags" className="tags">
                <MdSell />
                {tags}
            </h3>
        );

        onlyTags = serverIcons.length === 0;
        serverIcons.unshift(
            <span className="server-icon compact-tags" key="tags">
                <MdSell />
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
                    <h3>{`${playerCount} / ${server.variables.maxplayers}`}</h3>
                    {spectatorPlayerCount}
                </div>
                <div className="column column-5">
                    <span>{server.ping}</span>
                </div>
            </div>
            <div className="bottom-content">
                <div className="left-content">{compatibilityNotice}</div>
                <div className="right-content">
                    <a
                        href="#"
                        onClick={_onAddRemoveFavorite}
                        className={clsx('btn border-btn favorite-btn', { 'is-favorite': isFavorite })}
                    >
                        {isFavorite ? (
                            <MdBookmark style={{ marginRight: '5rem' }} />
                        ) : (
                            <MdBookmarkBorder style={{ marginRight: '5rem' }} />
                        )}
                        <span>{isFavorite ? 'Remove' : 'Add'}</span>
                    </a>
                    {spectateButton}
                    <a href="#" onClick={_onJoin} className="btn border-btn join-btn">
                        <MdPlayArrow style={{ marginRight: '5rem' }} />
                        <span>Join</span>
                    </a>
                </div>
            </div>
        </div>
    );
};
export default ServerEntry;
