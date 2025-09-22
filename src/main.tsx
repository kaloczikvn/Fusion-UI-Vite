// Polyfills
/*
import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
*/

import { createRoot } from 'react-dom/client';
import Router from './Router';
import './utils/globals/GlobalNotice';
import './utils/globals/PrintState';
import './utils/globals/WebUI';

import 'perfect-scrollbar/css/perfect-scrollbar.css';
import 'rc-slider/assets/index.css';
import './styles/screen.scss';

import type { ActionTypes } from './constants/ActionTypes';
import useBaseStore from './stores/useBaseStore';
import useConsoleStore from './stores/useConsoleStore';
import useServerStore from './stores/useServerStore';
import useSettingsStore from './stores/useSettingsStore';
import useUpdateStore from './stores/useUpdateStore';
import useUserStore from './stores/useUserStore';
import useVoipStore from './stores/useVoipStore';

window.DispatchAction = (action: ActionTypes, data?: any) => {
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

        console.log(`${action} was called with: ${JSON.stringify(data)}`);
        func(data);
    }
};

document.addEventListener('keydown', (event) => {
    let prevent = false;
    if (event.keyCode === 8) {
        let d: any = event.srcElement || event.target;

        if (
            (d.tagName.toUpperCase() === 'INPUT' &&
                (d.type.toUpperCase() === 'TEXT' ||
                    d.type.toUpperCase() === 'PASSWORD' ||
                    d.type.toUpperCase() === 'FILE' ||
                    d.type.toUpperCase() === 'SEARCH' ||
                    d.type.toUpperCase() === 'EMAIL' ||
                    d.type.toUpperCase() === 'NUMBER' ||
                    d.type.toUpperCase() === 'DATE')) ||
            d.tagName.toUpperCase() === 'TEXTAREA'
        ) {
            prevent = d.readOnly || d.disabled;
        } else {
            prevent = true;
        }
    }

    if (prevent) event.preventDefault();
});

const onResize = () => {
    const designHeight = 1080;
    const actualHeight = window.innerHeight;
    const scaleFactor = actualHeight / designHeight;

    // Let's say 1rem = 1px at 1080p. So we scale this.
    document.documentElement.style.fontSize = `${scaleFactor}px`;
};

onResize();
window.addEventListener('resize', onResize);

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
});

try {
    createRoot(document.getElementById('root')!).render(<Router />);
} catch (err) {
    console.error(err);
}
