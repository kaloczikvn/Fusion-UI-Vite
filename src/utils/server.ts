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
