import { create } from 'zustand';

type State = {
    navigate: string | null;
    //
    actions: {
        setNavigate: (value: string | null) => void;
    };
};

const useNavigateStore = create<State>((set) => ({
    navigate: null,
    //
    actions: {
        setNavigate: (value: string | null) => {
            set({ navigate: value });
        },
    },
}));
export default useNavigateStore;
