import React, { useEffect, useState } from 'react';

import { ActionTypes } from '../../constants/ActionTypes';
import { ServerConnectStatus } from '../../constants/ServerConnectStatus';
import useBaseStore from '../../stores/useBaseStore';
import useServerStore from '../../stores/useServerStore';
import { checkServerCompatibility } from '../../utils/server/server';
import LoadingIndicator from '../global/LoadingIndicator';
import ConnectingServerPopup from './ConnectingServerPopup';
import ServerPasswordPopup from './ServerPasswordPopup';

const ConnectToPendingServerPopup: React.FC = () => {
    const [compatibility, setCompatibility] = useState<any>(null);
    const [cannotSpectate, setCannotSpectate] = useState<boolean>(false);

    const build = useBaseStore((s) => s.build);
    const vextVersion = useBaseStore((s) => s.vextVersion);
    const minServerBuild = useServerStore((s) => s.minServerBuild);
    const availableXPacks = useServerStore((s) => s.availableXPacks);
    const pendingServer = useBaseStore((s) => s.pendingServer);
    const pendingServerPassword = useBaseStore((s) => s.pendingServerPassword);
    const pendingServerSpectate = useBaseStore((s) => s.pendingServerSpectate);
    const connectStatus = useServerStore((s) => s.connectStatus);

    const closePopup = () => {
        window.DispatchAction(ActionTypes.SET_PENDING_SERVER, {
            server: null,
            spectate: false,
        });
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: null,
        });
    };

    const setPopup = (popup: any) => {
        window.DispatchAction(ActionTypes.SET_PENDING_SERVER, {
            server: null,
        });
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: popup,
        });
    };

    const onClosePopup = (e?: any) => {
        if (e) e.preventDefault();

        closePopup();
    };

    useEffect(() => {
        (document.activeElement as HTMLElement).blur();

        // If we're connecting to another server or didn't get any data cancel.
        if (pendingServer === null || connectStatus === ServerConnectStatus.CONNECTING) {
            closePopup();
            return;
        }

        const compatibility = checkServerCompatibility(
            pendingServer,
            availableXPacks,
            minServerBuild,
            build,
            vextVersion
        );

        let cannotSpectate = false;

        if (parseInt(pendingServer.variables.maxspectators, 10) <= 0 && pendingServerSpectate) cannotSpectate = true;

        setCompatibility(compatibility);
        setCannotSpectate(cannotSpectate);

        // If we're compatible then connect.
        if (compatibility === null) {
            // If we requested to spectate and we cannot spectate then do nothing.
            if (pendingServerSpectate && cannotSpectate) {
                return;
            }

            const joinCallback = (guid: string, password: string) => {
                window.DispatchAction(ActionTypes.SET_PENDING_SERVER, {
                    server: null,
                    spectate: false,
                    password: '',
                });
                window.DispatchAction(ActionTypes.CHANGE_SERVER_CONNECT_STATUS, {
                    status: ServerConnectStatus.CONNECTING,
                });
                window.DispatchAction(ActionTypes.SET_POPUP, {
                    popup: <ConnectingServerPopup />,
                });

                const call = pendingServerSpectate ? 'SpectateServer' : 'ConnectToServer';

                if (password && password.length > 0) {
                    setTimeout(() => {
                        window.WebUI.Call(call, guid, password);
                    }, 500);
                    return;
                }

                setTimeout(() => {
                    window.WebUI.Call(call, guid);
                }, 500);
            };

            // If the server is passworded we need to show the password popup.
            if (pendingServer.passworded && (!pendingServerPassword || pendingServerPassword.length === 0)) {
                setPopup(<ServerPasswordPopup server={pendingServer} onJoin={joinCallback} />);
                return;
            }

            // Otherwise connect immediately.
            joinCallback(pendingServer.guid, pendingServerPassword);
        }
    }, []);

    if (compatibility !== null) {
        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Joining Failed</h1>
                    <p>{compatibility}</p>
                    <a href="#" className="btn border-btn" onClick={onClosePopup}>
                        Close
                    </a>
                </div>
            </div>
        );
    }

    if (cannotSpectate) {
        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Joining Failed</h1>
                    <p>The server you're trying to join does not allow spectators.</p>
                    <a href="#" className="btn border-btn" onClick={onClosePopup}>
                        Close
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="center-notice">
            <div className="notice-content">
                <h1>Connecting</h1>
                <p>Please wait while we connect you to the Game Server...</p>
                <LoadingIndicator />
            </div>
        </div>
    );
};
export default ConnectToPendingServerPopup;
