import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    MdArrowDropDown,
    MdArrowDropUp,
    MdFilterList,
    MdOutlineToggleOff,
    MdOutlineToggleOn,
    MdSync,
} from 'react-icons/md';

import ConnectingServerPopup from '../components/popups/ConnectingServerPopup';
import ServerEntry from '../components/server/ServerEntry';
import ServerFilters from '../components/server/ServerFilters';
import { COMPACT_VIEW } from '../constants/AccountStorageKeys';
import { ActionTypes } from '../constants/ActionTypes';
import { ServerConnectStatus } from '../constants/ServerConnectStatus';
import { ServerFetchStatus } from '../constants/ServerFetchStatus';
import { ServerSort } from '../constants/ServerSort';
import { SortDirection } from '../constants/SortDirection';
import useBaseStore from '../stores/useBaseStore';
import useServerStore from '../stores/useServerStore';
import useUserStore from '../stores/useUserStore';
import { getDefaultFilters, getSortingFunction } from '../utils/server';
import { checkServerCompatibility } from '../utils/server/server';

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

    // const scrollbarRef = useRef<PerfectScrollbar | null>(null);
    const browserRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);

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
        const boolValue = !(accountStorage[COMPACT_VIEW] === 'true');
        window.DispatchAction(ActionTypes.SET_ACCOUNT_STORAGE_VALUE, {
            key: COMPACT_VIEW,
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
            setTimeout(() => {
                window.WebUI.Call('ConnectToServer', guid, password);
            }, 500);
            return;
        }

        setTimeout(() => {
            window.WebUI.Call('ConnectToServer', guid);
        }, 500);
    };

    const _onSpectateServer = (guid: any, password?: string) => {
        if (connectStatus === ServerConnectStatus.CONNECTING) return;

        setConnectionStatus();
        setPopup(<ConnectingServerPopup />);

        if (password && password.length > 0) {
            setTimeout(() => {
                window.WebUI.Call('SpectateServer', guid, password);
            }, 500);
            return;
        }

        setTimeout(() => {
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
        if (!browserRef.current || !headerRef.current) return;

        const browserStyle = window.getComputedStyle(browserRef.current);
        const headerStyle = window.getComputedStyle(headerRef.current);

        let requiredHeight = browserRef.current.clientHeight;
        const requiredWidth = headerRef.current.clientWidth;

        requiredHeight -= parseFloat(browserStyle.paddingTop);
        requiredHeight -= parseFloat(browserStyle.paddingBottom);
        requiredHeight -= parseFloat(headerStyle.height);

        if (isNaN(requiredHeight) || isNaN(requiredWidth)) return;

        setWidth(requiredWidth || 920);
        setHeight(requiredHeight || 580);
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

    let sortIcon: any = '';

    if (sortDirection === SortDirection.ASC) sortIcon = <MdArrowDropUp />;
    else if (sortDirection === SortDirection.DESC) sortIcon = <MdArrowDropDown />;

    const mapSort = stateSortBy === ServerSort.MAP ? sortIcon : '';
    const gamemodeSort = stateSortBy === ServerSort.GAMEMODE ? sortIcon : '';
    const playersSort = stateSortBy === ServerSort.PLAYERS ? sortIcon : '';
    const pingSort = stateSortBy === ServerSort.PING ? sortIcon : '';

    const compactViewMemo: boolean = useMemo(() => {
        return accountStorage[COMPACT_VIEW] === 'true';
    }, [accountStorage]);

    const serversMemo = useMemo(() => {
        const servers = [];

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

    const hasFilterAppliedMemo = useMemo(() => {
        if (filters === null) return false;
        return JSON.stringify(filters) !== JSON.stringify(getDefaultFilters());
    }, [filters]);

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
                                <MdSync className="header-action-icon" />
                            </a>
                        </div>
                        <div
                            id="filters_visible"
                            className={clsx('header-action', {
                                active: filtersVisible,
                                hasFilter: hasFilterAppliedMemo,
                            })}
                        >
                            <span onClick={onEditFilters}>Filters</span>
                            <a href="#" onClick={onEditFilters}>
                                <MdFilterList className="header-action-icon" />
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
                                    <MdOutlineToggleOn className="header-action-icon" />
                                ) : (
                                    <MdOutlineToggleOff className="header-action-icon" />
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
                                    <MdOutlineToggleOn className="header-action-icon" />
                                ) : (
                                    <MdOutlineToggleOff className="header-action-icon" />
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
