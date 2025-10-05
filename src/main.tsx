// Polyfills
import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import './utils/globals/GlobalNotice';
import './utils/globals/PrintState';
import './utils/globals/WebUI';
import './utils/globals/GlobalVars';
import './utils/globals/DispatchAction';
import './styles/screen.scss';

import { createRoot } from 'react-dom/client';

import Router from './Router';

document.addEventListener('keydown', (event) => {
    let prevent = false;
    if (event.keyCode === 8) {
        const d: any = event.srcElement || event.target;

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

try {
    createRoot(document.getElementById('root')!).render(<Router />);
} catch (err) {
    console.error(err);
}
