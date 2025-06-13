import * as ActionTypes from '../../constants/ActionTypes';
import * as ConnectionStatus from '../../constants/ConnectionStatus';
import * as LoginStatus from '../../constants/LoginStatus';
import * as PlayerCreateStatus from '../../constants/PlayerCreateStatus';
import * as PlayerDeleteStatus from '../../constants/PlayerDeleteStatus';
import * as PlayerLoginStatus from '../../constants/PlayerLoginStatus';
import * as ServerFetchStatus from '../../constants/ServerFetchStatus';
import * as ServerConnectStatus from '../../constants/ServerConnectStatus';
import * as OriginLinkStatus from '../../constants/OriginLinkStatus';
import * as UpdateState from '../../constants/UpdateState';
import * as UpdateError from '../../constants/UpdateError';

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
