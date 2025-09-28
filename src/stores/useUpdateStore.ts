import { create } from 'zustand';

import { ActionTypes } from '../constants/ActionTypes';
import { UpdateError } from '../constants/UpdateError';
import { UpdateState } from '../constants/UpdateState';

type State = {
    state: number;
    error: number;
    leftFiles: number;
    percentage: number;
    //
    actions: { [key: number]: (action: any) => void };
};

const useUpdateStore = create<State>((set) => ({
    state: UpdateState.IDLE,
    error: UpdateError.NONE,
    leftFiles: 0,
    percentage: 0,
    //
    actions: {
        [ActionTypes.CHANGE_UPDATE_STATE]: (action: any) => {
            set({ state: action.state });
        },
        [ActionTypes.CHANGE_UPDATE_ERROR]: (action: any) => {
            set({ error: action.error });
        },
        [ActionTypes.CHANGE_UPDATE_PROGRESS]: (action: any) => {
            set({
                leftFiles: action.totalFiles - action.doneFiles,
                percentage: action.downloaded / action.total,
            });
        },
    },
}));
export default useUpdateStore;
