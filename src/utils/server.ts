import { ServerSort } from '../constants/ServerSort';
import { SortDirection } from '../constants/SortDirection';
import { getGamemodeName, getMapName } from './server/server';

export const getServerSpectators = (server: any) => {
    const spectatorsNum = parseInt(server.variables.spectators, 10);
    return !isNaN(spectatorsNum) ? spectatorsNum : 0;
};

export const getServerPlayersOnly = (server: any) => {
    if ('players' in server.variables) {
        const playersNum = parseInt(server.variables.players, 10);

        if (!isNaN(playersNum)) {
            return playersNum;
        }
    }

    const playersNum = parseInt(server.players);

    const playersCount = !isNaN(playersNum) ? playersNum : 0;

    const spectatorsCount = getServerSpectators(server);

    const playersOnly = playersCount - spectatorsCount;

    return playersOnly > 0 ? playersOnly : 0;
};

export const getDefaultFilters = () => {
    return {
        maps: [],
        gamemodes: [],
        tags: [],
        serverName: '',
        minPlayers: undefined,
        maxPlayers: undefined,
        minPing: undefined,
        maxPing: undefined,
        freq30Hz: true,
        freq60Hz: true,
        freq120Hz: true,
        hideFull: false,
        hideEmpty: false,
        hidePassworded: false,
        hideIncompatible: false,
    };
};

function sortByNameAsc(a: any, b: any) {
    return a.name.localeCompare(b.name);
}

function sortByNameDesc(a: any, b: any) {
    return -a.name.localeCompare(b.name);
}

function sortByMapAsc(a: any, b: any) {
    const mapA = getMapName(a.variables.mapname);
    const mapB = getMapName(b.variables.mapname);
    return mapA.localeCompare(mapB);
}

function sortByMapDesc(a: any, b: any) {
    const mapA = getMapName(a.variables.mapname);
    const mapB = getMapName(b.variables.mapname);
    return -mapA.localeCompare(mapB);
}

function sortByGamemodeAsc(a: any, b: any) {
    const gamemodeA = getGamemodeName(a.variables.gamemode);
    const gamemodeB = getGamemodeName(b.variables.gamemode);
    return gamemodeA.localeCompare(gamemodeB);
}

function sortByGamemodeDesc(a: any, b: any) {
    const gamemodeA = getGamemodeName(a.variables.gamemode);
    const gamemodeB = getGamemodeName(b.variables.gamemode);
    return -gamemodeA.localeCompare(gamemodeB);
}

function sortByPlayersAsc(a: any, b: any) {
    const playerCountLeft = getServerPlayersOnly(a);
    const playerCountRight = getServerPlayersOnly(b);

    if (playerCountLeft < playerCountRight) return -1;

    if (playerCountLeft > playerCountRight) return 1;

    return 0;
}

function sortByPlayersDesc(a: any, b: any) {
    const playerCountLeft = getServerPlayersOnly(a);
    const playerCountRight = getServerPlayersOnly(b);

    if (playerCountLeft < playerCountRight) return 1;

    if (playerCountLeft > playerCountRight) return -1;

    return 0;
}

function sortByPingAsc(a: any, b: any) {
    const pingLeft = a.ping !== '-' ? parseInt(a.ping, 10) : 99999;
    const pingRight = b.ping !== '-' ? parseInt(b.ping, 10) : 99999;

    if (pingLeft < pingRight) return -1;

    if (pingLeft > pingRight) return 1;

    return 0;
}

function sortByPingDesc(a: any, b: any) {
    const pingLeft = a.ping !== '-' ? parseInt(a.ping, 10) : 99999;
    const pingRight = b.ping !== '-' ? parseInt(b.ping, 10) : 99999;

    if (pingLeft < pingRight) return 1;

    if (pingLeft > pingRight) return -1;

    return 0;
}

const sorters: any = {
    [ServerSort.NAME]: {
        [SortDirection.ASC]: sortByNameAsc,
        [SortDirection.DESC]: sortByNameDesc,
    },
    [ServerSort.MAP]: {
        [SortDirection.ASC]: sortByMapAsc,
        [SortDirection.DESC]: sortByMapDesc,
    },
    [ServerSort.GAMEMODE]: {
        [SortDirection.ASC]: sortByGamemodeAsc,
        [SortDirection.DESC]: sortByGamemodeDesc,
    },
    [ServerSort.PLAYERS]: {
        [SortDirection.ASC]: sortByPlayersAsc,
        [SortDirection.DESC]: sortByPlayersDesc,
    },
    [ServerSort.PING]: {
        [SortDirection.ASC]: sortByPingAsc,
        [SortDirection.DESC]: sortByPingDesc,
    },
};

export const getSortingFunction = (sortBy: number, sortDirection: number): any => {
    if (sortBy === ServerSort.NONE || sortDirection === SortDirection.NONE) return null;

    return sorters[sortBy][sortDirection];
};
