import { create } from 'zustand';
import {
    SET_CURRENT_SETTINGS,
    SET_MOD_SETTINGS,
    SET_SETTINGS,
    SET_SETTINGS_TAB,
    SHOW_SETTINGS_POPUP,
} from '../constants/ActionTypes';

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
        [SET_SETTINGS]: (action: any) => {
            set(() => {
                return {
                    gameSettings: { ...action.settings },
                    currentSettings: { ...action.settings },
                };
            });
        },
        [SET_CURRENT_SETTINGS]: (action: any) => {
            set((s) => {
                return {
                    currentSettings: {
                        ...s.currentSettings,
                        ...action.settings,
                    },
                };
            });
        },
        [SHOW_SETTINGS_POPUP]: (action: any) => {
            set(() => {
                return {
                    showPopup: action.show,
                };
            });
        },
        [SET_SETTINGS_TAB]: (action: any) => {
            set(() => {
                return {
                    selectedMod: action.selectedMod,
                };
            });
        },
        [SET_MOD_SETTINGS]: (action: any) => {
            set(() => {
                return {
                    modSettings: { ...action.settings },
                };
            });
        },
    },
}));
export default useSettingsStore;
