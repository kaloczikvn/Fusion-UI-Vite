interface IServer {
    guid: string;
    name: string;
    players: number;
    maxplayers: number;
    public: boolean;
    passworded: boolean;
    ping: number;
    variables: {
        maxplayers: number;
        mapname: string;
        gamemode: string;
        frequency: any;
        maxspectators: number;
        spectators: any;
        buildno: any;
        min_buildno: any;
        vext_req: any;
    };
}

interface IDropdownOption {
    label: string;
    value: any;
}
