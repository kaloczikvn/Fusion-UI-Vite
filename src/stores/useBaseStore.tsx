import { create } from 'zustand';
import {
    CHANGE_CONNECTION_STATUS,
    CHANGE_INGAME,
    CHANGE_UPDATE_STATE,
    SET_BLUR,
    SET_BUILD_NUMBER,
    SET_ERROR,
    SET_GLOBAL_NOTICE,
    SET_INITIALIZED,
    SET_MENU,
    SET_NEWS,
    SET_PENDING_SERVER,
    SET_POPUP,
    SET_PRODUCT_CODE,
    SET_PRODUCT_NAME,
    SET_VERSION_NUMBER,
    SET_VEXT_VERSION,
} from '../constants/ActionTypes';
import UpdateReadyPopup from '../components/popups/UpdateReadyPopup';
import ConnectToPendingServerPopup from '../components/popups/ConnectToPendingServerPopup';
import useNavigateStore from './useNavigateStore';
import * as ConnectionStatus from '../constants/ConnectionStatus';
import * as UpdateState from '../constants/UpdateState';

type State = {
    initialized: boolean;
    productName: string;
    productCode: string;
    error: any | null;
    ingame: boolean;
    connectionStatus: number;
    hasBlur: boolean;
    hasMenu: boolean;
    popup: any | null;
    build: any;
    version: any;
    vextVersion: any;
    pendingServer: any;
    pendingServerSpectate: boolean;
    pendingServerPassword: any;
    news: any | null;
    globalNotice: string | null;
    //
    actions: { [key: number]: (action: any) => void };
};

const useBaseStore = create<State>((set) => ({
    initialized: false,
    productName: '',
    productCode: '',
    error: null,
    ingame: false,
    connectionStatus: 0,
    hasBlur: true,
    hasMenu: false,
    popup: null,
    build: 0,
    version: '',
    vextVersion: '',
    pendingServer: null,
    pendingServerSpectate: false,
    pendingServerPassword: '',
    news: null,
    globalNotice: null,
    //
    actions: {
        [SET_GLOBAL_NOTICE]: (action: any) => {
            set({ globalNotice: action.notice });
        },
        [SET_INITIALIZED]: () => {
            set((s) => {
                setTimeout(() => {
                    if (s.connectionStatus === ConnectionStatus.CONNECTED) {
                        useNavigateStore.getState().actions.setNavigate('/login');
                    } else {
                        useNavigateStore.getState().actions.setNavigate('/connection');
                    }
                }, 50);

                return { initialized: true };
            });
        },
        [SET_PRODUCT_NAME]: (action: any) => {
            set({ productName: action.name });
        },
        [SET_PRODUCT_CODE]: (action: any) => {
            set({ productCode: action.code });
        },
        [SET_BUILD_NUMBER]: (action: any) => {
            set({ build: action.build });
        },
        [SET_VERSION_NUMBER]: (action: any) => {
            set({ version: action.version });
        },
        [SET_VEXT_VERSION]: (action: any) => {
            set({ vextVersion: action.version });
        },
        [SET_ERROR]: (action: any) => {
            set({ error: action.error });

            if (action.page && action.page.length > 0) {
                setTimeout(() => {
                    useNavigateStore.getState().actions.setNavigate(`/${action.page}`);
                }, 50);
            }
        },
        [CHANGE_INGAME]: (action: any) => {
            set((s) => {
                if (!s.ingame && s.pendingServer !== null) {
                    return {
                        popup: <ConnectToPendingServerPopup />,
                        ingame: action.ingame,
                    };
                }

                return {
                    ingame: action.ingame,
                };
            });
        },
        [CHANGE_CONNECTION_STATUS]: (action: any) => {
            set({ connectionStatus: action.status });

            setTimeout(() => {
                if (action.status === ConnectionStatus.CONNECTED) {
                    useNavigateStore.getState().actions.setNavigate('/login');
                } else {
                    useNavigateStore.getState().actions.setNavigate('/connection');
                }
            }, 50);
        },
        [SET_BLUR]: (action: any) => {
            set({ hasBlur: action.blur });
        },
        [SET_MENU]: (action: any) => {
            set({ hasMenu: action.menu });
        },
        [SET_POPUP]: (action: any) => {
            set({ popup: action.popup });
        },
        [SET_PENDING_SERVER]: (action: any) => {
            set((s) => {
                let obj: any = {
                    pendingServer: action.server,
                    pendingServerSpectate: action.spectate,
                    pendingServerPassword: action.password,
                };

                if (!s.ingame) {
                    obj.popup = <ConnectToPendingServerPopup />;
                }

                return obj;
            });
        },
        [CHANGE_UPDATE_STATE]: (action: any) => {
            set((s) => {
                if (action.state !== UpdateState.DONE_UPDATING) return {};
                if (s.popup !== null) return {};

                return {
                    popup: <UpdateReadyPopup />,
                };
            });
        },
        [SET_NEWS]: (action: any) => {
            set({ news: action.news });
        },
    },
}));
export default useBaseStore;
