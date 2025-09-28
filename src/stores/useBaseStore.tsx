import { create } from 'zustand';

import ConnectToPendingServerPopup from '../components/popups/ConnectToPendingServerPopup';
import UpdateReadyPopup from '../components/popups/UpdateReadyPopup';
import { ActionTypes } from '../constants/ActionTypes';
import { ConnectionStatus } from '../constants/ConnectionStatus';
import { UpdateState } from '../constants/UpdateState';
import useNavigateStore from './useNavigateStore';

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
        [ActionTypes.SET_GLOBAL_NOTICE]: (action: any) => {
            set({ globalNotice: action.notice });
        },
        [ActionTypes.SET_INITIALIZED]: () => {
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
        [ActionTypes.SET_PRODUCT_NAME]: (action: any) => {
            set({ productName: action.name });
        },
        [ActionTypes.SET_PRODUCT_CODE]: (action: any) => {
            set({ productCode: action.code });
        },
        [ActionTypes.SET_BUILD_NUMBER]: (action: any) => {
            set({ build: action.build });
        },
        [ActionTypes.SET_VERSION_NUMBER]: (action: any) => {
            set({ version: action.version });
        },
        [ActionTypes.SET_VEXT_VERSION]: (action: any) => {
            set({ vextVersion: action.version });
        },
        [ActionTypes.SET_ERROR]: (action: any) => {
            set({ error: action.error });

            if (action.page && action.page.length > 0) {
                setTimeout(() => {
                    useNavigateStore.getState().actions.setNavigate(`/${action.page}`);
                }, 50);
            }
        },
        [ActionTypes.CHANGE_INGAME]: (action: any) => {
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
        [ActionTypes.CHANGE_CONNECTION_STATUS]: (action: any) => {
            set({ connectionStatus: action.status });

            setTimeout(() => {
                if (action.status === ConnectionStatus.CONNECTED) {
                    useNavigateStore.getState().actions.setNavigate('/login');
                } else {
                    useNavigateStore.getState().actions.setNavigate('/connection');
                }
            }, 50);
        },
        [ActionTypes.SET_BLUR]: (action: any) => {
            set({ hasBlur: action.blur });
        },
        [ActionTypes.SET_MENU]: (action: any) => {
            set({ hasMenu: action.menu });
        },
        [ActionTypes.SET_POPUP]: (action: any) => {
            set({ popup: action.popup });
        },
        [ActionTypes.SET_PENDING_SERVER]: (action: any) => {
            set((s) => {
                const obj: any = {
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
        [ActionTypes.CHANGE_UPDATE_STATE]: (action: any) => {
            set((s) => {
                if (action.state !== UpdateState.DONE_UPDATING) return {};
                if (s.popup !== null) return {};

                return {
                    popup: <UpdateReadyPopup />,
                };
            });
        },
        [ActionTypes.SET_NEWS]: (action: any) => {
            set({ news: action.news });
        },
    },
}));
export default useBaseStore;
