import { create } from 'zustand';
import * as UpdateError from '../constants/UpdateError';
import * as UpdateState from '../constants/UpdateState';
import { CHANGE_UPDATE_ERROR, CHANGE_UPDATE_PROGRESS, CHANGE_UPDATE_STATE } from '../constants/ActionTypes';

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
        [CHANGE_UPDATE_STATE]: (action: any) => {
            set({ state: action.state });
        },
        [CHANGE_UPDATE_ERROR]: (action: any) => {
            set({ error: action.error });
        },
        [CHANGE_UPDATE_PROGRESS]: (action: any) => {
            set({
                leftFiles: action.totalFiles - action.doneFiles,
                percentage: action.downloaded / action.total,
            });
        },
    },
}));
export default useUpdateStore;
