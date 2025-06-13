import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Router from './Router';
import './utils/globals/constants';
import './utils/globals/DispatchAction';
import './utils/globals/GlobalNotice';
import './utils/globals/PrintState';
import './utils/globals/WebUI';

import 'perfect-scrollbar/css/perfect-scrollbar.css';
import 'rc-slider/assets/index.css';
import './styles/screen.scss';

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

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router />
    </StrictMode>
);
