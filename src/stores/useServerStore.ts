import { create } from 'zustand';

import { ActionTypes } from '../constants/ActionTypes';
import { ConnectionStatus } from '../constants/ConnectionStatus';
import { ServerConnectStatus } from '../constants/ServerConnectStatus';
import { ServerFetchStatus } from '../constants/ServerFetchStatus';
import { ServerSort } from '../constants/ServerSort';
import { SortDirection } from '../constants/SortDirection';
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
    favoriteServers: new Set([]),
    favoriteServersOnly: false,
};

const useServerStore = create<State>((set) => ({
    ...initialState,
    //
    actions: {
        [ActionTypes.SET_FAVORITE_SERVERS]: (action: any) => {
            set({ favoriteServers: new Set([...action.servers]) });
        },
        [ActionTypes.CHANGE_CONNECTION_STATUS]: (action: any) => {
            set(() => {
                if (action.status === ConnectionStatus.DISCONNECTED) {
                    return {
                        ...initialState,
                    };
                }

                return {};
            });
        },
        [ActionTypes.CHANGE_SERVER_FETCH_STATUS]: (action: any) => {
            set({ fetchStatus: action.status });
        },
        [ActionTypes.SET_SERVERS]: (action: any) => {
            set(() => {
                const map: any = {};

                for (const server of action.servers) {
                    map[server.guid] = server;
                }

                return {
                    map: map,
                };
            });
        },
        [ActionTypes.ADD_SERVER]: (action: any) => {
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
        [ActionTypes.CHANGE_SERVER_CONNECT_STATUS]: (action: any) => {
            set({ connectStatus: action.status });
        },
        [ActionTypes.SET_AVAILABLE_XPACKS]: (action: any) => {
            set({ availableXPacks: [...action.xpacks] });
        },
        [ActionTypes.SET_MIN_SERVER_BUILD]: (action: any) => {
            set({ minServerBuild: action.build });
        },
        [ActionTypes.SET_SERVER_DATA]: (action: any) => {
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
        [ActionTypes.SET_SERVER_DOWNLOAD_PROGRESS]: (action: any) => {
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
        [ActionTypes.SORT_SERVERS_BY]: (action: any) => {
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
        [ActionTypes.CYCLE_SERVER_SORT_DIRECTION]: () => {
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
        [ActionTypes.SET_SERVER_FILTERS]: (action: any) => {
            set((s) => {
                if (s.filters === action.filters) {
                    return {};
                }

                return {
                    filters: action.filters,
                };
            });
        },
        [ActionTypes.ADD_FAVORITE_SERVER]: (action: any) => {
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
        [ActionTypes.REMOVE_FAVORITE_SERVER]: (action: any) => {
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
        [ActionTypes.TOGGLE_FAVORITE_SERVERS_ONLY]: () => {
            set((s) => ({
                favoriteServersOnly: !s.favoriteServersOnly,
            }));
        },
        [ActionTypes.SET_FAVORITE_SERVERS_ONLY]: (action: any) => {
            set(() => ({
                favoriteServersOnly: action.favoriteServersOnly,
            }));
        },
    },
}));
export default useServerStore;
