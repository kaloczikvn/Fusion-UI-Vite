import { create } from 'zustand';

import { ActionTypes } from '../constants/ActionTypes';

type State = {
    devices: Array<{ id: number; name: string }>;
    selectedDevice: number;
    cutoffVolume: number;
    volume: number;
    volumeMultiplier: number;
    //
    actions: { [key: number]: (action: any) => void };
};

const useVoipStore = create<State>((set) => ({
    devices: [],
    selectedDevice: 0,
    cutoffVolume: 0.5,
    volume: 0,
    volumeMultiplier: 1.0,
    //
    actions: {
        [ActionTypes.SET_VOIP_DATA]: (action: any) => {
            set({ ...action.data });
        },
    },
}));
export default useVoipStore;
