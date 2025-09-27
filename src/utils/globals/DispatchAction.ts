import useBaseStore from '../../stores/useBaseStore';
import useConsoleStore from '../../stores/useConsoleStore';
import useServerStore from '../../stores/useServerStore';
import useSettingsStore from '../../stores/useSettingsStore';
import useUpdateStore from '../../stores/useUpdateStore';
import useUserStore from '../../stores/useUserStore';
import useVoipStore from '../../stores/useVoipStore';

window.DispatchAction = (action: number, data?: any) => {
    const stores: any = [
        useBaseStore.getState().actions,
        useSettingsStore.getState().actions,
        useUpdateStore.getState().actions,
        useServerStore.getState().actions,
        useUserStore.getState().actions,
        useConsoleStore.getState().actions,
        useVoipStore.getState().actions,
    ];

    for (const store of stores) {
        const func = store[action];
        if (!func) continue;

        // console.log(`${action} was called with: ${JSON.stringify(data)}`);
        func(data);
    }
};

declare global {
    interface Window {
        DispatchAction: (action: number, data?: any) => void;
        actions: any;
    }
}
