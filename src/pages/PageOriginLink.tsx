import React, { useEffect } from 'react';

import LoadingIndicator from '../components/global/LoadingIndicator';
import { ActionTypes } from '../constants/ActionTypes';
import { OriginLinkStatus } from '../constants/OriginLinkStatus';
import useBaseStore from '../stores/useBaseStore';
import useUserStore from '../stores/useUserStore';

const PageOriginLink: React.FC = () => {
    const productName = useBaseStore((s) => s.productName);
    const originLinkStatus = useUserStore((s) => s.originLinkStatus);

    const enableBlur = () => {
        window.DispatchAction(ActionTypes.SET_BLUR, {
            blur: true,
        });
    };

    const disableMenu = () => {
        window.DispatchAction(ActionTypes.SET_MENU, {
            menu: false,
        });
    };

    const setPopup = (popup: any) => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: popup,
        });
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

    let originState = 'Waiting for EA Desktop / Origin...';
    let canRetry = false;
    let spinning = false;

    switch (originLinkStatus) {
        case OriginLinkStatus.IDLE:
            originState = 'Waiting for EA Desktop / Origin...';
            spinning = true;
            break;

        case OriginLinkStatus.LINKING:
            originState = 'Linking Account...';
            spinning = true;
            break;

        case OriginLinkStatus.LINK_SUCCESSFUL:
            originState = 'Successfully Linked!';
            break;

        case OriginLinkStatus.CHECKING_OWNERSHIP:
            originState = 'Checking Ownership...';
            spinning = true;
            break;

        case OriginLinkStatus.LINK_FAILED:
            originState = 'Link Failed, Try later';
            canRetry = true;
            break;

        case OriginLinkStatus.PRODUCT_MISSING:
            originState = 'Your account does not own Battlefield 3';
            canRetry = true;
            break;

        case OriginLinkStatus.LINK_TAKEN:
            originState = 'This EA Account is already linked to another account';
            canRetry = true;
            break;

        case OriginLinkStatus.LINK_UNAVAILABLE:
            originState = 'Link Service Unavailable';
            canRetry = true;
            break;

        case OriginLinkStatus.ORIGIN_ERROR:
            originState = 'An error occurred while communicating with EA Desktop / Origin';
            canRetry = true;
            break;
    }

    return (
        <div id="origin-link-page" className="content-wrapper">
            <h1>Ownership Verification</h1>
            <p>
                {`In order to use ${productName} we will first need to verify your game ownership through your EA account. Please launch the EA Desktop app or the Origin client on your computer and log in with your account. This is a one-time process and will link your EA account with your ${productName} account.`}
            </p>
            <div className="status-container">
                <div className="status-container-logos">
                    <img src="/assets/img/common/ea-desktop.svg" style={{ marginRight: '40rem' }} />
                    <img src="/assets/img/common/origin.svg" />
                </div>
                <h2>
                    {spinning ? (
                        <span style={{ marginRight: '8rem' }}>
                            <LoadingIndicator />
                        </span>
                    ) : null}{' '}
                    {originState}
                </h2>
                {canRetry ? (
                    <a href="#" className="btn border-btn" onClick={onRetry}>
                        Retry
                    </a>
                ) : null}
            </div>
        </div>
    );
};
export default PageOriginLink;
