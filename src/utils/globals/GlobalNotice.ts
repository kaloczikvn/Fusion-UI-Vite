import { ActionTypes } from '../../constants/ActionTypes';

let globalNoticeTimer: number | undefined = undefined;

window.GlobalNotice = (data: any) => {
    if (globalNoticeTimer !== null) {
        clearTimeout(globalNoticeTimer);
        globalNoticeTimer = undefined;
    }

    window.DispatchAction(ActionTypes.SET_GLOBAL_NOTICE, {
        notice: data.notice,
    });

    globalNoticeTimer = setTimeout(() => {
        globalNoticeTimer = undefined;
        window.DispatchAction(ActionTypes.SET_GLOBAL_NOTICE, {
            notice: null,
        });
    }, 10000);
};

declare global {
    interface Window {
        GlobalNotice: (data: any) => void;
    }
}
