import { create } from 'zustand';

import { ActionTypes } from '../constants/ActionTypes';

type State = {
    gameSettings: null | any;
    currentSettings: null | any;
    showPopup: boolean;
    modSettings: any;
    tab: string;
    selectedMod: string;
    //
    actions: { [key: number]: (action: any) => void };
};

const useSettingsStore = create<State>((set) => ({
    gameSettings: null,
    currentSettings: null,
    showPopup: false,
    modSettings: {},
    tab: 'game',
    selectedMod: '',
    //
    actions: {
        [ActionTypes.SET_SETTINGS]: (action: any) => {
            set(() => {
                return {
                    gameSettings: { ...action.settings },
                    currentSettings: { ...action.settings },
                };
            });
        },
        [ActionTypes.SET_CURRENT_SETTINGS]: (action: any) => {
            set((s) => {
                return {
                    currentSettings: {
                        ...s.currentSettings,
                        ...action.settings,
                    },
                };
            });
        },
        [ActionTypes.SHOW_SETTINGS_POPUP]: (action: any) => {
            set(() => {
                return {
                    showPopup: action.show,
                };
            });
        },
        [ActionTypes.SET_SETTINGS_TAB]: (action: any) => {
            set(() => {
                return {
                    tab: action.tab,
                };
            });
        },
        [ActionTypes.SET_SETTINGS_SELECTED_MOD]: (action: any) => {
            set(() => {
                return {
                    selectedMod: action.selectedMod,
                };
            });
        },
        [ActionTypes.SET_MOD_SETTINGS]: (action: any) => {
            set(() => {
                return {
                    modSettings: { ...action.settings },
                };
            });
        },
    },
}));
export default useSettingsStore;
