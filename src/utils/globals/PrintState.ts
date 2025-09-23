import useBaseStore from '../../stores/useBaseStore';
import useConsoleStore from '../../stores/useConsoleStore';
import useServerStore from '../../stores/useServerStore';
import useSettingsStore from '../../stores/useSettingsStore';
import useUpdateStore from '../../stores/useUpdateStore';
import useUserStore from '../../stores/useUserStore';
import useVoipStore from '../../stores/useVoipStore';

window.PrintState = function () {
    const stores: any = [
        useBaseStore.getState(),
        useSettingsStore.getState(),
        useUpdateStore.getState(),
        useServerStore.getState(),
        useUserStore.getState(),
        useConsoleStore.getState(),
        useVoipStore.getState(),
    ];

    console.log(stores);
};

declare global {
    interface Window {
        PrintState: () => void;
    }
}
