import { create } from 'zustand';
import {
    CHANGE_CONNECTION_STATUS,
    CHANGE_LOGIN_STATUS,
    CHANGE_ORIGIN_LINK_STATUS,
    CHANGE_PLAYER_CREATE_STATUS,
    CHANGE_PLAYER_DELETE_STATUS,
    CHANGE_PLAYER_LOGIN_STATUS,
    REMOVE_ACCOUNT_STORAGE_VALUE,
    SET_ACCOUNT_STORAGE,
    SET_ACCOUNT_STORAGE_VALUE,
    SET_LOGIN_DATA,
    SET_LOGIN_TOKEN,
    SET_PLAYER_DATA,
    SET_USER_DATA,
    SET_USER_PLAYERS,
} from '../constants/ActionTypes';
import * as LoginStatus from '../constants/LoginStatus';
import * as PlayerLoginStatus from '../constants/PlayerLoginStatus';
import * as OriginLinkStatus from '../constants/OriginLinkStatus';
import * as ConnectionStatus from '../constants/ConnectionStatus';
import useNavigateStore from './useNavigateStore';

type State = {
    user: null | any;
    loginStatus: number;
    players: null | any;
    player: null | any;
    playerDeleteStatus: number;
    playerCreateStatus: number;
    playerLoginStatus: number;
    originLinkStatus: number;
    loginToken: null | any;
    loginData: null | any;
    accountStorage: any;
    //
    actions: { [key: number]: (action: any) => void };
};

const useUserStore = create<State>((set) => ({
    user: null,
    loginStatus: 0,
    players: null,
    player: null,
    playerDeleteStatus: 0,
    playerCreateStatus: 0,
    playerLoginStatus: 0,
    originLinkStatus: 0,
    loginToken: null,
    loginData: null,
    accountStorage: {},
    //
    actions: {
        [CHANGE_CONNECTION_STATUS]: (action: any) => {
            if (action.status !== ConnectionStatus.DISCONNECTED) return;
            set((s) => {
                return {
                    loginToken: s.loginToken,
                    loginData: s.loginData,
                };
            });
        },
        [SET_USER_DATA]: (action: any) => {
            set((s) => {
                if (
                    s.loginStatus === LoginStatus.LOGGED_IN &&
                    action.data !== null &&
                    s.players !== null &&
                    s.player === null &&
                    s.originLinkStatus === OriginLinkStatus.LINK_SUCCESSFUL
                ) {
                    setTimeout(() => {
                        useNavigateStore.getState().actions.setNavigate('/players');
                    }, 50);
                }

                return {
                    user: action.data,
                };
            });
        },
        [SET_LOGIN_TOKEN]: (action: any) => {
            set({
                loginToken: action.data,
            });
        },
        [SET_LOGIN_DATA]: (action: any) => {
            set({
                loginData: action.data,
            });
        },
        [CHANGE_LOGIN_STATUS]: (action: any) => {
            set((s) => {
                if (
                    action.status === LoginStatus.LOGGED_IN &&
                    s.user !== null &&
                    s.players !== null &&
                    s.player === null &&
                    s.originLinkStatus === OriginLinkStatus.LINK_SUCCESSFUL
                ) {
                    setTimeout(() => {
                        useNavigateStore.getState().actions.setNavigate('/players');
                    }, 50);
                }

                return {
                    loginStatus: action.status,
                };
            });
        },
        [SET_USER_PLAYERS]: (action: any) => {
            set((s) => {
                if (
                    s.loginStatus === LoginStatus.LOGGED_IN &&
                    s.user !== null &&
                    action.players !== null &&
                    s.player === null &&
                    s.originLinkStatus === OriginLinkStatus.LINK_SUCCESSFUL
                ) {
                    setTimeout(() => {
                        useNavigateStore.getState().actions.setNavigate('/players');
                    }, 50);
                }

                return {
                    players: action.players,
                };
            });
        },
        [CHANGE_PLAYER_DELETE_STATUS]: (action: any) => {
            set({
                playerDeleteStatus: action.status,
            });
        },
        [CHANGE_PLAYER_CREATE_STATUS]: (action: any) => {
            set({
                playerCreateStatus: action.status,
            });
        },
        [CHANGE_PLAYER_LOGIN_STATUS]: (action: any) => {
            set((s) => {
                if (
                    s.loginStatus === LoginStatus.LOGGED_IN &&
                    action.status === PlayerLoginStatus.LOGGED_IN &&
                    s.user !== null &&
                    s.players !== null &&
                    s.player !== null
                ) {
                    setTimeout(() => {
                        useNavigateStore.getState().actions.setNavigate('/main-menu');
                    }, 50);
                }

                return {
                    playerLoginStatus: action.status,
                };
            });
        },
        [SET_PLAYER_DATA]: (action: any) => {
            set((s) => {
                if (
                    s.loginStatus === LoginStatus.LOGGED_IN &&
                    s.playerLoginStatus === PlayerLoginStatus.LOGGED_IN &&
                    s.user !== null &&
                    action.players !== null &&
                    s.player !== null
                ) {
                    setTimeout(() => {
                        useNavigateStore.getState().actions.setNavigate('/main-menu');
                    }, 50);
                }

                return {
                    player: action.player,
                };
            });
        },
        [CHANGE_ORIGIN_LINK_STATUS]: (action: any) => {
            set((s) => {
                if (
                    s.loginStatus === LoginStatus.LOGGED_IN &&
                    (action.status === OriginLinkStatus.LINK_MISSING ||
                        action.status === OriginLinkStatus.PRODUCT_MISSING)
                ) {
                    setTimeout(() => {
                        useNavigateStore.getState().actions.setNavigate('/origin-link');
                    }, 50);
                    return {};
                }

                if (
                    s.loginStatus === LoginStatus.LOGGED_IN &&
                    s.user !== null &&
                    s.players !== null &&
                    s.player === null &&
                    action.status === OriginLinkStatus.LINK_SUCCESSFUL
                ) {
                    setTimeout(() => {
                        useNavigateStore.getState().actions.setNavigate('/players');
                    }, 50);
                }

                return {
                    originLinkStatus: action.status,
                };
            });
        },
        [SET_ACCOUNT_STORAGE]: (action: any) => {
            set({
                accountStorage: { ...action.accountStorage },
            });
        },
        [SET_ACCOUNT_STORAGE_VALUE]: (action: any) => {
            window.WebUI.Call('SetAccountStorageObject', action.key, action.value);

            set((s) => ({
                accountStorage: {
                    ...s.accountStorage,
                    [action.key]: action.value,
                },
            }));
        },
        [REMOVE_ACCOUNT_STORAGE_VALUE]: (action: any) => {
            window.WebUI.Call('RemoveAccountStorageObject', action.key);

            set((s) => {
                const accountStorage = {
                    ...s.accountStorage,
                };

                delete accountStorage[action.key];

                return {
                    accountStorage: accountStorage,
                };
            });
        },
    },
}));
export default useUserStore;
