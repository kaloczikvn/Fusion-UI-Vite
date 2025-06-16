import React, { useEffect } from 'react';
import useUserStore from '../stores/useUserStore';
import * as PlayerCreateStatus from '../constants/PlayerCreateStatus';
import * as PlayerDeleteStatus from '../constants/PlayerDeleteStatus';
import * as PlayerLoginStatus from '../constants/PlayerLoginStatus';
import * as ActionTypes from '../constants/ActionTypes';
import LoggingPlayerPopup from '../components/popups/LoggingPlayerPopup';
import PlayerDeleteConfirmationPopup from '../components/popups/PlayerDeleteConfirmationPopup';
import CreatePlayerPopup from '../components/popups/CreatePlayerPopup';
import SoldierEntry from '../components/players/SoldierEntry';

const PagePlayers: React.FC = () => {
    const players = useUserStore((s) => s.players);

    const onSetPlayerCreate = () => {
        window.DispatchAction(ActionTypes.CHANGE_PLAYER_CREATE_STATUS, {
            status: PlayerCreateStatus.CREATION_INIT,
        });
    };

    const onSetPlayerDelete = () => {
        window.DispatchAction(ActionTypes.CHANGE_PLAYER_DELETE_STATUS, {
            status: PlayerDeleteStatus.DELETING,
        });
    };

    const onSetPlayerLogin = () => {
        window.DispatchAction(ActionTypes.CHANGE_PLAYER_LOGIN_STATUS, {
            status: PlayerLoginStatus.LOGGING_IN,
        });
    };

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

    const onDeletePlayer = (name: string, guid: string, e?: any) => {
        if (e) e.preventDefault();

        onSetPlayerDelete();
        setPopup(<PlayerDeleteConfirmationPopup name={name} guid={guid} />);
    };

    const onLoginPlayer = (guid: string, e?: any) => {
        if (e) e.preventDefault();

        onSetPlayerLogin();
        setPopup(<LoggingPlayerPopup />);

        window.WebUI.Call('LoginPlayer', guid);
    };

    const onCreatePlayer = (e?: any) => {
        if (e) e.preventDefault();

        onSetPlayerCreate();
        setPopup(<CreatePlayerPopup />);
    };

    useEffect(() => {
        enableBlur();
        disableMenu();

        return () => {
            setPopup(null);
        };
    }, []);

    // Handle player creation.
    let playersRender = [];

    for (let i = 0; i < players.length; ++i) {
        playersRender.push(
            <SoldierEntry
                key={players[i].guid}
                name={players[i].name}
                actions={[
                    {
                        icon: 'exit_to_app',
                        callback: (e?: any) => {
                            onLoginPlayer(players[i].guid, e);
                        },
                    },
                ]}
                deleteCallback={(e) => {
                    onDeletePlayer(players[i].name, players[i].guid, e);
                }}
                title="Soldier"
            />
        );
    }

    let playerCount = playersRender.length;

    for (let i = 0; i < 4 - playerCount; ++i) {
        playersRender.push(
            <SoldierEntry
                key={'create-' + i}
                actions={[
                    {
                        icon: 'library_add',
                        callback: (e?: any) => {
                            onCreatePlayer(e);
                        },
                    },
                ]}
                title="Create new Soldier"
                className="empty"
            />
        );
    }

    return <div className="soldier-listing">{playersRender}</div>;
};
export default PagePlayers;
