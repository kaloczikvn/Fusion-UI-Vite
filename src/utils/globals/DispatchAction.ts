import useBaseStore from '../../stores/useBaseStore';
import useConsoleStore from '../../stores/useConsoleStore';
import useServerStore from '../../stores/useServerStore';
import useSettingsStore from '../../stores/useSettingsStore';
import useUpdateStore from '../../stores/useUpdateStore';
import useUserStore from '../../stores/useUserStore';
import useVoipStore from '../../stores/useVoipStore';

window.DispatchAction = (action: number, data?: any) => {
    const actions = {
        ...useBaseStore.getState().actions,
        ...useSettingsStore.getState().actions,
        ...useUpdateStore.getState().actions,
        ...useServerStore.getState().actions,
        ...useUserStore.getState().actions,
        ...useConsoleStore.getState().actions,
        ...useVoipStore.getState().actions,
    };

    const func = actions[action];
    if (!func) {
        console.error(`No zustand function implemented for action: ${action}`);
        return;
    }

    func(data);
};

declare global {
    interface Window {
        DispatchAction: (action: number, data?: any) => void;
    }
}
