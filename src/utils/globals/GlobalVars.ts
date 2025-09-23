import { ActionTypes } from '../../constants/ActionTypes';
import { ConnectionStatus } from '../../constants/ConnectionStatus';
import { LoginStatus } from '../../constants/LoginStatus';
import { OriginLinkStatus } from '../../constants/OriginLinkStatus';
import { PlayerCreateStatus } from '../../constants/PlayerCreateStatus';
import { PlayerDeleteStatus } from '../../constants/PlayerDeleteStatus';
import { PlayerLoginStatus } from '../../constants/PlayerLoginStatus';
import { ServerConnectStatus } from '../../constants/ServerConnectStatus';
import { ServerFetchStatus } from '../../constants/ServerFetchStatus';
import { UpdateError } from '../../constants/UpdateError';
import { UpdateState } from '../../constants/UpdateState';

window.actions = ActionTypes;
window.connStatus = ConnectionStatus;
window.loginStatus = LoginStatus;
window.playerCreateStatus = PlayerCreateStatus;
window.playerDeleteStatus = PlayerDeleteStatus;
window.playerLoginStatus = PlayerLoginStatus;
window.serverFetchStatus = ServerFetchStatus;
window.serverConnectStatus = ServerConnectStatus;
window.originLinkStatus = OriginLinkStatus;
window.updateState = UpdateState;
window.updateError = UpdateError;

declare global {
    interface Window {
        DispatchAction: (action: number, data?: any) => void;
        actions: any;
        connStatus: any;
        loginStatus: any;
        playerCreateStatus: any;
        playerDeleteStatus: any;
        playerLoginStatus: any;
        serverFetchStatus: any;
        serverConnectStatus: any;
        originLinkStatus: any;
        updateState: any;
        updateError: any;
    }
}
