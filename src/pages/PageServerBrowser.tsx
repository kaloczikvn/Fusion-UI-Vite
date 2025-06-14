import React, { useEffect, useMemo, useRef, useState } from 'react';

import * as ServerFetchStatus from '../constants/ServerFetchStatus';
import * as ServerConnectStatus from '../constants/ServerConnectStatus';
import * as ActionTypes from '../constants/ActionTypes';
import * as AccountStorageKeys from '../constants/AccountStorageKeys';
import * as ServerSort from '../constants/ServerSort';
import * as SortDirection from '../constants/SortDirection';
import PerfectScrollbar from 'perfect-scrollbar';
import useServerStore from '../stores/useServerStore';
import useUserStore from '../stores/useUserStore';
import ConnectingServerPopup from '../components/popups/ConnectingServerPopup';
import ServerEntry from '../components/server/ServerEntry';
import clsx from 'clsx';
import ServerFilters from '../components/server/ServerFilters';
import { getDefaultFilters, getSortingFunction } from '../utils/server';
import { checkServerCompatibility } from '../utils/server/server';
import useBaseStore from '../stores/useBaseStore';

const PageServerBrowser: React.FC = () => {
    const filters = useServerStore((s) => s.filters);
    const favoriteServersOnly = useServerStore((s) => s.favoriteServersOnly);
    const favoriteServers = useServerStore((s) => s.favoriteServers);
    const connectStatus = useServerStore((s) => s.connectStatus);
    const fetchStatus = useServerStore((s) => s.fetchStatus);
    const sortDirection = useServerStore((s) => s.sortDirection);
    const stateSortBy = useServerStore((s) => s.sortBy);
    const map = useServerStore((s) => s.map);
    const availableXPacks = useServerStore((s) => s.availableXPacks);
    const minServerBuild = useServerStore((s) => s.minServerBuild);
    const build = useBaseStore((s) => s.build);
    const vextVersion = useBaseStore((s) => s.vextVersion);
    const accountStorage = useUserStore((s) => s.accountStorage);

    const [expandedServer, setExpandedServer] = useState<any>(null);
    const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
    const [width, setWidth] = useState<number>(920);
    const [height, setHeight] = useState<number>(580);

    const scrollbarRef = useRef<any>(null);
    const browserRef = useRef<any>(null);
    const headerRef = useRef<any>(null);

    const onResetServerFetch = () => {
        window.DispatchAction(ActionTypes.CHANGE_SERVER_FETCH_STATUS, {
            status: ServerFetchStatus.IDLE,
        });
    };

    const disableBlur = () => {
        window.DispatchAction(ActionTypes.SET_BLUR, {
            blur: false,
        });
    };

    const enableMenu = () => {
        window.DispatchAction(ActionTypes.SET_MENU, {
            menu: true,
        });
    };

    const setConnectionStatus = () => {
        window.DispatchAction(ActionTypes.CHANGE_SERVER_CONNECT_STATUS, {
            status: ServerConnectStatus.CONNECTING,
        });
    };

    const setPopup = (popup: any) => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: popup,
        });
    };

    const sortServersBy = (sortBy: any, sortDirection: any) => {
        window.DispatchAction(ActionTypes.SORT_SERVERS_BY, {
            sortBy,
            sortDirection,
        });
    };

    const cycleServerSortDirection = () => {
        window.DispatchAction(ActionTypes.CYCLE_SERVER_SORT_DIRECTION);
    };

    const toggleCompactView = () => {
        const boolValue = !(accountStorage[AccountStorageKeys.COMPACT_VIEW] === 'true');
        window.DispatchAction(ActionTypes.SET_ACCOUNT_STORAGE_VALUE, {
            key: AccountStorageKeys.COMPACT_VIEW,
            value: boolValue.toString(),
        });
    };

    const toggleFavoritesOnly = () => {
        window.DispatchAction(ActionTypes.TOGGLE_FAVORITE_SERVERS_ONLY);
    };

    const addFavorite = (server: any) => {
        window.DispatchAction(ActionTypes.ADD_FAVORITE_SERVER, {
            server,
        });
    };

    const removeFavorite = (server: any) => {
        window.DispatchAction(ActionTypes.REMOVE_FAVORITE_SERVER, {
            server,
        });
    };

    const _onSortByMap = (e: any) => {
        if (e) e.preventDefault();

        sortBy(ServerSort.MAP);
    };

    const _onSortByGamemode = (e: any) => {
        if (e) e.preventDefault();

        sortBy(ServerSort.GAMEMODE);
    };

    const _onSortByPlayers = (e: any) => {
        if (e) e.preventDefault();

        sortBy(ServerSort.PLAYERS);
    };

    const _onSortByPing = (e: any) => {
        if (e) e.preventDefault();

        sortBy(ServerSort.PING);
    };

    const sortBy = (sortBy: any) => {
        if (stateSortBy !== sortBy) {
            sortServersBy(sortBy, SortDirection.ASC);
            return;
        }

        cycleServerSortDirection();
    };

    const _onServerList = (ref: any) => {
        if (ref === null) {
            scrollbarRef.current = null;
            return;
        }

        scrollbarRef.current = new PerfectScrollbar(ref, {
            wheelSpeed: 3,
            suppressScrollX: true,
        });
    };

    const _hasFilterApplied = () => {
        if (filters === null) return false;

        return JSON.stringify(filters) !== JSON.stringify(getDefaultFilters());
    };

    const _onCloseFilters = () => {
        setFiltersVisible(false);
    };

    const onFetchServers = (e?: any) => {
        if (e) e.preventDefault();

        setExpandedServer(null);

        if (fetchStatus === ServerFetchStatus.FETCHING) {
            onResetServerFetch();
            return;
        }

        window.WebUI.Call('FetchServers');
    };

    const onEditFilters = (e: any) => {
        if (e) e.preventDefault();

        setFiltersVisible(!filtersVisible);
    };

    const onToggleCompactView = (e: any) => {
        if (e) e.preventDefault();

        toggleCompactView();
    };

    const onToggleFavoritesOnly = (e: any) => {
        if (e) e.preventDefault();

        toggleFavoritesOnly();
    };

    const _onExpandServer = (guid: any) => {
        setExpandedServer(guid);
    };

    const _onJoinServer = (guid: any, password?: string) => {
        if (connectStatus === ServerConnectStatus.CONNECTING) return;

        setConnectionStatus();
        setPopup(<ConnectingServerPopup />);

        if (password && password.length > 0) {
            setTimeout(function () {
                window.WebUI.Call('ConnectToServer', guid, password);
            }, 500);
            return;
        }

        setTimeout(function () {
            window.WebUI.Call('ConnectToServer', guid);
        }, 500);
    };

    const _onSpectateServer = (guid: any, password?: string) => {
        if (connectStatus === ServerConnectStatus.CONNECTING) return;

        setConnectionStatus();
        setPopup(<ConnectingServerPopup />);

        if (password && password.length > 0) {
            setTimeout(function () {
                window.WebUI.Call('SpectateServer', guid, password);
            }, 500);
            return;
        }

        setTimeout(function () {
            window.WebUI.Call('SpectateServer', guid);
        }, 500);
    };

    const _onAddRemoveFavorite = (server: any, isFavorite: boolean) => {
        if (isFavorite) {
            removeFavorite(server);
            return;
        }

        addFavorite(server);
    };

    const _onResize = () => {
        if (!browserRef.current || !headerRef.current) {
            return;
        }

        const browserStyle = window.getComputedStyle(browserRef.current);
        const headerStyle = window.getComputedStyle(headerRef.current);

        let requiredHeight = browserRef.current.clientHeight;
        let requiredWidth = headerRef.current.clientWidth;

        requiredHeight -= parseFloat(browserStyle.paddingTop);
        requiredHeight -= parseFloat(browserStyle.paddingBottom);
        requiredHeight -= parseFloat(headerStyle.height);

        setWidth(requiredWidth);
        setHeight(requiredHeight);
    };

    const _onHandleClickOutsideOfFiltersBox = (e: any) => {
        if (!filtersVisible) return;

        let clickedInside = false;
        for (const element of e.path) {
            if (
                element.classList &&
                (element.classList.contains('server-filters') || element.id === 'filters_visible')
            ) {
                clickedInside = true;
                break;
            }
        }

        if (!clickedInside) {
            setFiltersVisible(false);
        }
    };

    useEffect(() => {
        disableBlur();
        enableMenu();

        window.addEventListener('resize', _onResize);
        window.addEventListener('click', _onHandleClickOutsideOfFiltersBox);

        setTimeout(_onResize, 0);

        // Fetch servers on page mount.
        onFetchServers();

        return () => {
            window.removeEventListener('resize', _onResize);
            window.removeEventListener('click', _onHandleClickOutsideOfFiltersBox);
        };
    }, []);

    useEffect(() => {
        if (scrollbarRef.current !== null) scrollbarRef.current.update();
    });

    let sortIcon: any = '';

    if (sortDirection === SortDirection.ASC)
        sortIcon = (
            <svg
                className="sort-indicator"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
            >
                <path d="m280-400 200-200 200 200H280Z" />
            </svg>
        );
    else if (sortDirection === SortDirection.DESC)
        sortIcon = (
            <svg
                className="sort-indicator"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
            >
                <path d="M480-360 280-560h400L480-360Z" />
            </svg>
        );

    const mapSort = stateSortBy === ServerSort.MAP ? sortIcon : '';
    const gamemodeSort = stateSortBy === ServerSort.GAMEMODE ? sortIcon : '';
    const playersSort = stateSortBy === ServerSort.PLAYERS ? sortIcon : '';
    const pingSort = stateSortBy === ServerSort.PING ? sortIcon : '';

    const compactViewMemo: boolean = useMemo(() => {
        return accountStorage[AccountStorageKeys.COMPACT_VIEW] === 'true';
    }, [accountStorage]);

    const serversMemo = useMemo(() => {
        let servers = [];

        for (const guid of Object.keys(map)) {
            const server = map[guid];

            if (favoriteServersOnly) {
                if (favoriteServers.size === 0 || !favoriteServers.has(guid)) continue;
            }

            if (filters !== null) {
                if (filters.minPlayers !== undefined && server.players < filters.minPlayers) continue;
                if (filters.minPlayers !== undefined && server.players < filters.minPlayers) continue;
                if (filters.minPing !== undefined && server.ping < filters.minPing) continue;
                if (filters.maxPing !== undefined && server.ping > filters.maxPing) continue;
                if (filters.hideFull && server.players >= server.variables.maxplayers) continue;
                if (filters.hideEmpty && server.players == 0) continue;
                if (filters.hidePassworded && server.passworded) continue;
                if (filters.hideIncompatible) {
                    const compatibility = checkServerCompatibility(
                        server,
                        availableXPacks,
                        minServerBuild,
                        build,
                        vextVersion
                    );

                    if (compatibility !== null) continue;
                }
                if (!filters.freq30Hz && server.variables.frequency === 'reg') continue;
                if (!filters.freq60Hz && server.variables.frequency === 'high60') continue;
                if (!filters.freq120Hz && server.variables.frequency === 'high120') continue;
                if (
                    filters.serverName.trim().length > 0 &&
                    server.name.toLowerCase().indexOf(filters.serverName.toLowerCase().trim()) === -1
                ) {
                    continue;
                }
                if (filters.maps.length > 0) {
                    let mapFound = false;

                    for (const map of filters.maps) {
                        if (server.variables.mapname.toLowerCase() === map.toLowerCase()) {
                            mapFound = true;
                        }
                    }

                    if (!mapFound) continue;
                }
                if (filters.gamemodes.length > 0) {
                    let gamemodeFound = false;

                    for (const gamemode of filters.gamemodes) {
                        if (server.variables.gamemode.toLowerCase() === gamemode.toLowerCase()) {
                            gamemodeFound = true;
                        }
                    }

                    if (!gamemodeFound) continue;
                }
                if (filters.tags.length > 0) {
                    let tagFound = false;

                    let serverTags = [];

                    if (server.variables.tags && server.variables.tags.length > 0)
                        serverTags = server.variables.tags.split(',');

                    for (const tag of filters.tags) {
                        for (const serverTag of serverTags) {
                            if (serverTag.toLowerCase() === tag.toLowerCase()) {
                                tagFound = true;
                                break;
                            }
                        }
                    }

                    if (!tagFound) continue;
                }
            }

            servers.push(server);
        }

        // Sorting
        const sorter = getSortingFunction(stateSortBy, sortDirection);
        if (sorter !== null) {
            servers.sort(sorter);
        }

        return servers;
    }, [
        map,
        favoriteServersOnly,
        stateSortBy,
        sortDirection,
        filters,
        availableXPacks,
        minServerBuild,
        build,
        vextVersion,
    ]);

    return (
        <div className="server-browser content-wrapper" ref={browserRef}>
            <div className="server-list">
                <div className="list-header" ref={headerRef}>
                    <div className="column column-1">
                        <div className="header-action" onClick={onFetchServers}>
                            <span>
                                {fetchStatus === ServerFetchStatus.FETCHING
                                    ? 'Fetching Servers'
                                    : `Found ${serversMemo.length} server${serversMemo.length !== 1 ? 's' : ''}`}
                            </span>
                            <a href="#" className={clsx({ fetching: fetchStatus === ServerFetchStatus.FETCHING })}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="#e8eaed"
                                >
                                    <path d="M160-160v-80h110l-16-14q-52-46-73-105t-21-119q0-111 66.5-197.5T400-790v84q-72 26-116 88.5T240-478q0 45 17 87.5t53 78.5l10 10v-98h80v240H160Zm400-10v-84q72-26 116-88.5T720-482q0-45-17-87.5T650-648l-10-10v98h-80v-240h240v80H690l16 14q49 49 71.5 106.5T800-482q0 111-66.5 197.5T560-170Z" />
                                </svg>
                            </a>
                        </div>
                        <div
                            id="filters_visible"
                            className={
                                'header-action' +
                                (filtersVisible ? ' active' : '') +
                                (_hasFilterApplied() ? ' hasFilter' : '')
                            }
                        >
                            <span onClick={onEditFilters}>Filters</span>
                            <a href="#" onClick={onEditFilters}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="#e8eaed"
                                >
                                    <path d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z" />
                                </svg>
                            </a>
                            <ServerFilters visible={filtersVisible} onClose={_onCloseFilters} />
                        </div>
                        <div
                            className={clsx('header-action compact', { active: compactViewMemo })}
                            onClick={onToggleCompactView}
                        >
                            <span>Compact view</span>
                            <a href="#">
                                {compactViewMemo ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#e8eaed"
                                    >
                                        <path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-80h400q66 0 113-47t47-113q0-66-47-113t-113-47H280q-66 0-113 47t-47 113q0 66 47 113t113 47Zm400-40q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM480-480Z" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#e8eaed"
                                    >
                                        <path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-80h400q66 0 113-47t47-113q0-66-47-113t-113-47H280q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-40q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm200-120Z" />
                                    </svg>
                                )}
                            </a>
                        </div>
                        <div
                            className={'header-action compact' + (favoriteServersOnly ? ' active' : '')}
                            onClick={onToggleFavoritesOnly}
                        >
                            <span>Favorites</span>
                            <a href="#">
                                {favoriteServersOnly ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#e8eaed"
                                    >
                                        <path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-80h400q66 0 113-47t47-113q0-66-47-113t-113-47H280q-66 0-113 47t-47 113q0 66 47 113t113 47Zm400-40q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM480-480Z" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#e8eaed"
                                    >
                                        <path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-80h400q66 0 113-47t47-113q0-66-47-113t-113-47H280q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-40q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm200-120Z" />
                                    </svg>
                                )}
                            </a>
                        </div>
                    </div>
                    <div className="column column-2 sort-action" onClick={_onSortByMap}>
                        <span>Map</span>
                        {mapSort}
                    </div>
                    <div className="column column-3 sort-action" onClick={_onSortByGamemode}>
                        <span>Gamemode</span>
                        {gamemodeSort}
                    </div>
                    <div className="column column-4 sort-action" onClick={_onSortByPlayers}>
                        <span>Players</span>
                        {playersSort}
                    </div>
                    <div className="column column-5 sort-action" onClick={_onSortByPing}>
                        <span>Ping</span>
                        {pingSort}
                    </div>
                </div>
                <div
                    className={clsx('list-body main-list-body', { compact: compactViewMemo })}
                    style={{
                        overflowX: 'hidden',
                        width: width,
                        height: height,
                    }}
                    ref={_onServerList}
                >
                    {serversMemo.length > 0 ? (
                        <>
                            {serversMemo.map((server) => (
                                <ServerEntry
                                    server={server}
                                    key={server.guid}
                                    expanded={expandedServer === server.guid}
                                    onClick={_onExpandServer}
                                    onJoin={_onJoinServer}
                                    onSpectate={_onSpectateServer}
                                    onAddRemoveFavorite={_onAddRemoveFavorite}
                                    isFavorite={favoriteServers.size > 0 && favoriteServers.has(server.guid)}
                                />
                            ))}
                        </>
                    ) : (
                        <span className="notice no-servers">No servers found</span>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PageServerBrowser;
