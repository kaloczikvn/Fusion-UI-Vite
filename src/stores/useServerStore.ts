import { create } from 'zustand';

import * as ServerFetchStatus from '../constants/ServerFetchStatus';
import * as ServerSort from '../constants/ServerSort';
import * as SortDirection from '../constants/SortDirection';
import * as ServerConnectStatus from '../constants/ServerConnectStatus';
import * as ConnectionStatus from '../constants/ConnectionStatus';
import {
    ADD_FAVORITE_SERVER,
    ADD_SERVER,
    CHANGE_CONNECTION_STATUS,
    CHANGE_SERVER_CONNECT_STATUS,
    CHANGE_SERVER_FETCH_STATUS,
    CYCLE_SERVER_SORT_DIRECTION,
    REMOVE_FAVORITE_SERVER,
    SET_AVAILABLE_XPACKS,
    SET_BUILD_NUMBER,
    SET_FAVORITE_SERVERS,
    SET_MIN_SERVER_BUILD,
    SET_SERVERS,
    SET_SERVER_DATA,
    SET_SERVER_DOWNLOAD_PROGRESS,
    SET_SERVER_FILTERS,
    SET_VERSION_NUMBER,
    SET_VEXT_VERSION,
    SORT_SERVERS_BY,
    TOGGLE_FAVORITE_SERVERS_ONLY,
} from '../constants/ActionTypes';

type State = {
    map: any;
    filters: any | null;
    sortBy: number;
    sortDirection: number;
    connectStatus: number;
    fetchStatus: number;
    downloadProgress: {
        totalFiles: number;
        currentFileIndex: number;
        setSize: number;
        downloaded: number;
        currentFile: number;
    };
    availableXPacks: any;
    minServerBuild: any;
    build: any;
    version: any;
    vextVersion: any;
    favoriteServers: Set<string>;
    favoriteServersOnly: boolean;
    //
    actions: { [key: number]: (action: any) => void };
};

const initialState = {
    map: {},
    filters: null,
    sortBy: ServerSort.NONE,
    sortDirection: SortDirection.NONE,
    connectStatus: ServerConnectStatus.IDLE,
    fetchStatus: ServerFetchStatus.IDLE,
    downloadProgress: {
        totalFiles: 0,
        currentFileIndex: 0,
        setSize: 0,
        downloaded: 0,
        currentFile: 0,
    },
    availableXPacks: [],
    minServerBuild: 0,
    build: 0,
    version: '',
    vextVersion: '',
    favoriteServers: new Set([]),
    favoriteServersOnly: false,
};

const useServerStore = create<State>((set) => ({
    ...initialState,
    //
    actions: {
        /*
        [SET_BUILD_NUMBER]: (action: any) => {
            set({ build: action.build });
        },
        [SET_VERSION_NUMBER]: (action: any) => {
            set({ version: action.version });
        },
        [SET_VEXT_VERSION]: (action: any) => {
            set({ vextVersion: action.version });
        },
        */
        [SET_FAVORITE_SERVERS]: (action: any) => {
            set({ favoriteServers: new Set([...action.servers]) });
        },
        [CHANGE_CONNECTION_STATUS]: (action: any) => {
            set(() => {
                if (action.status === ConnectionStatus.DISCONNECTED) {
                    return {
                        ...initialState,
                    };
                }

                return {};
            });
        },
        [CHANGE_SERVER_FETCH_STATUS]: (action: any) => {
            set({ fetchStatus: action.status });
        },
        [SET_SERVERS]: (action: any) => {
            set(() => {
                let map: any = {};

                for (const server of action.servers) {
                    map[server.guid] = server;
                }

                return {
                    map: map,
                };
            });
        },
        [ADD_SERVER]: (action: any) => {
            set((s) => {
                let map = { ...s.map };

                map = {
                    ...map,
                    [action.server.guid]: action.server,
                };

                return {
                    map: map,
                };
            });
        },
        [CHANGE_SERVER_CONNECT_STATUS]: (action: any) => {
            set({ connectStatus: action.status });
        },
        [SET_AVAILABLE_XPACKS]: (action: any) => {
            set({ availableXPacks: [...action.xpacks] });
        },
        [SET_MIN_SERVER_BUILD]: (action: any) => {
            set({ minServerBuild: action.build });
        },
        [SET_SERVER_DATA]: (action: any) => {
            set((s) => {
                const map = { ...s.map };

                map[action.server.guid] = {
                    ...map[action.server.guid],
                    ...action.server,
                };

                return {
                    map: map,
                };
            });
        },
        [SET_SERVER_DOWNLOAD_PROGRESS]: (action: any) => {
            set((s) => ({
                downloadProgress: {
                    ...s.downloadProgress,
                    totalFiles: action.totalFiles,
                    currentFileIndex: action.currentFileIndex,
                    setSize: action.setSize,
                    downloaded: action.downloaded,
                    currentFile: action.currentFile,
                },
            }));
        },
        [SORT_SERVERS_BY]: (action: any) => {
            set((s) => {
                if (s.sortBy === action.sortBy && s.sortDirection === action.sortDirection) {
                    return {};
                }

                return {
                    sortBy: action.sortBy,
                    sortDirection: action.sortDirection,
                };
            });
        },
        [CYCLE_SERVER_SORT_DIRECTION]: () => {
            set((s) => {
                if (s.sortBy === ServerSort.NONE) {
                    return {};
                }

                if (s.sortDirection === SortDirection.NONE) {
                    return {
                        sortDirection: SortDirection.ASC,
                    };
                }

                if (s.sortDirection === SortDirection.ASC) {
                    return {
                        sortDirection: SortDirection.DESC,
                    };
                }

                return {
                    sortDirection: SortDirection.NONE,
                };
            });
        },
        [SET_SERVER_FILTERS]: (action: any) => {
            set((s) => {
                if (s.filters === action.filters) {
                    return {};
                }

                return {
                    filters: action.filters,
                };
            });
        },
        [ADD_FAVORITE_SERVER]: (action: any) => {
            set((s) => {
                window.WebUI.Call('AddFavoriteServer', action.server.guid);

                // Optimistic update.
                const favoriteServers = new Set(s.favoriteServers);
                favoriteServers.add(action.server.guid);

                return {
                    favoriteServers,
                };
            });
        },
        [REMOVE_FAVORITE_SERVER]: (action: any) => {
            set((s) => {
                window.WebUI.Call('RemoveFavoriteServer', action.server.guid);

                // Optimistic update.
                const favoriteServers = new Set(s.favoriteServers);
                favoriteServers.delete(action.server.guid);

                return {
                    favoriteServers,
                };
            });
        },
        [TOGGLE_FAVORITE_SERVERS_ONLY]: () => {
            set((s) => {
                return {
                    favoriteServersOnly: !s.favoriteServersOnly,
                };
            });
        },
    },
}));
export default useServerStore;
