import React, { useEffect } from 'react';
import useBaseStore from '../stores/useBaseStore';
import useUserStore from '../stores/useUserStore';

const PageOriginLink: React.FC = () => {
    const productName = useBaseStore((s) => s.productName);
    const originLinkStatus = useUserStore((s) => s.originLinkStatus);

    const enableBlur = () => {
        // TODO: dispatch({ type: ActionTypes.SET_BLUR, blur: true });
    };

    const disableMenu = () => {
        // TODO: dispatch({ type: ActionTypes.SET_MENU, menu: false });
    };

    const setPopup = (popup: any) => {
        // TODO: dispatch({ type: ActionTypes.SET_POPUP, popup: popup });
    };

    const onRetry = (e: any) => {
        if (e) e.preventDefault();

        window.WebUI.Call('LinkOrigin');
    };

    useEffect(() => {
        enableBlur();
        disableMenu();
        window.WebUI.Call('LinkOrigin');

        return () => {
            setPopup(null);
        };
    }, []);

    let originState = 'Waiting for Origin / EA Desktop...';
    let canRetry = false;
    let spinning = false;

    switch (originLinkStatus) {
        case window.originLinkStatus.IDLE:
            originState = 'Waiting for Origin / EA Desktop...';
            spinning = true;
            break;

        case window.originLinkStatus.LINKING:
            originState = 'Linking Account...';
            spinning = true;
            break;

        case window.originLinkStatus.LINK_SUCCESSFUL:
            originState = 'Successfully Linked!';
            break;

        case window.originLinkStatus.CHECKING_OWNERSHIP:
            originState = 'Checking Ownership...';
            spinning = true;
            break;

        case window.originLinkStatus.LINK_FAILED:
            originState = 'Link Failed, Try later';
            canRetry = true;
            break;

        case window.originLinkStatus.PRODUCT_MISSING:
            originState = 'Your account does not own Battlefield 3';
            canRetry = true;
            break;

        case window.originLinkStatus.LINK_TAKEN:
            originState = 'This EA Account is already linked to another account';
            canRetry = true;
            break;

        case window.originLinkStatus.LINK_UNAVAILABLE:
            originState = 'Link Service Unavailable';
            canRetry = true;
            break;

        case window.originLinkStatus.ORIGIN_ERROR:
            originState = 'An error occurred while communicating with Origin / EA Desktop';
            canRetry = true;
            break;
    }

    let retryButton = canRetry ? (
        <a href="#" className="btn border-btn" onClick={onRetry}>
            Retry
        </a>
    ) : null;

    return (
        <div id="origin-link-page">
            <div className="middle-container">
                <h1>Ownership Verification</h1>
                <p>
                    In order to use {productName} we will first need to verify your game ownership through your EA
                    account. Please launch the EA Desktop app or the Origin client on your computer and log in with your
                    account. This is a one-time process and will link your EA account with your Venice Unleashed
                    account.
                </p>
                <div className="status-container">
                    <img src="/assets/img/common/origin.svg" className={spinning ? 'spinning' : ''} />
                    <h2>{originState}</h2>
                    {retryButton}
                </div>
            </div>
        </div>
    );
};
export default PageOriginLink;
