export const getGamemodeName = (gamemode: string) => {
    switch (gamemode) {
        case 'ConquestLarge0':
            return 'Conquest Large';
        case 'ConquestSmall0':
            return 'Conquest';
        case 'ConquestAssaultLarge0':
            return 'Conquest Assault Large';
        case 'ConquestAssaultSmall0':
            return 'Conquest Assault';
        case 'ConquestAssaultSmall1':
            return 'Conquest Assault #2';
        case 'RushLarge0':
            return 'Rush';
        case 'SquadRush0':
            return 'Squad Rush';
        case 'SquadDeathMatch0':
            return 'Squad Deathmatch';
        case 'TeamDeathMatch0':
            return 'Team Deathmatch';
        case 'TeamDeathMatchC0':
            return 'Team Deathmatch CQ';
        case 'CaptureTheFlag0':
            return 'Capture the Flag';
        case 'AirSuperiority0':
            return 'Air Superiority';
        case 'GunMaster0':
            return 'Gun Master';
        case 'Scavenger0':
            return 'Scavenger';
        case 'TankSuperiority0':
            return 'Tank Superiority';
        case 'Domination0':
            return 'Conquest Domination';

        default:
            return gamemode
                .replace(/([a-z])([A-Z])/g, '$1 $2') // Add a space before capital letters following a lowercase letter
                .replace(/0$/, '') // Remove trailing 0
                .replace(/([1-9]\d*)$/, ' #$1'); // Parse 1 and greater numbers to "#n" format;
    }
};

export const getMapName = (map: string) => {
    switch (map) {
        case 'Levels/MP_001/MP_001':
            return 'Grand Bazaar';
        case 'Levels/MP_003/MP_003':
            return 'Tehran Highway';
        case 'Levels/MP_007/MP_007':
            return 'Caspian Border';
        case 'Levels/MP_011/MP_011':
            return 'Seine Crossing';
        case 'Levels/MP_012/MP_012':
            return 'Operation Firestorm';
        case 'Levels/MP_013/MP_013':
            return 'Damavand Peak';
        case 'Levels/MP_017/MP_017':
            return 'Noshahr Canals';
        case 'Levels/MP_018/MP_018':
            return 'Kharg Island';
        case 'Levels/MP_Subway/MP_Subway':
            return 'Operation Metro';
        case 'Levels/XP1_001/XP1_001':
            return 'Strike at Karkand';
        case 'Levels/XP1_002/XP1_002':
            return 'Gulf of Oman';
        case 'Levels/XP1_003/XP1_003':
            return 'Sharqi Peninsula';
        case 'Levels/XP1_004/XP1_004':
            return 'Wake Island';
        case 'Levels/XP2_Factory/XP2_Factory':
            return 'Scrapmetal';
        case 'Levels/XP2_Office/XP2_Office':
            return 'Operation 925';
        case 'Levels/XP2_Palace/XP2_Palace':
            return 'Donya Fortress';
        case 'Levels/XP2_Skybar/XP2_Skybar':
            return 'Ziba Tower';
        case 'Levels/XP3_Desert/XP3_Desert':
            return 'Bandar Desert';
        case 'Levels/XP3_Alborz/XP3_Alborz':
            return 'Alborz Mountains';
        case 'Levels/XP3_Shield/XP3_Shield':
            return 'Armored Shield';
        case 'Levels/XP3_Valley/XP3_Valley':
            return 'Death Valley';
        case 'Levels/XP4_FD/XP4_FD':
            return 'Markaz Monolith';
        case 'Levels/XP4_Parl/XP4_Parl':
            return 'Azadi Palace';
        case 'Levels/XP4_Quake/XP4_Quake':
            return 'Epicenter';
        case 'Levels/XP4_Rubble/XP4_Rubble':
            return 'Talah Market';
        case 'Levels/XP5_001/XP5_001':
            return 'Operation Riverside';
        case 'Levels/XP5_002/XP5_002':
            return 'Nebandan Flats';
        case 'Levels/XP5_003/XP5_003':
            return 'Kiasar Railroad';
        case 'Levels/XP5_004/XP5_004':
            return 'Sabalan Pipeline';
        case 'Levels/COOP_002/COOP_002':
            return 'Hit and Run';
        case 'Levels/COOP_003/COOP_003':
            return "Drop 'Em Like Liquid";
        case 'Levels/COOP_006/COOP_006':
            return 'Fire from the Sky';
        case 'Levels/COOP_007/COOP_007':
            return 'Operation Exodus';
        case 'Levels/COOP_009/COOP_009':
            return 'Exfiltration';
        case 'Levels/COOP_010/COOP_010':
            return 'The Eleventh Hour';
        case 'Levels/SP_Bank/SP_Bank':
            return 'Operation Guillotine';
        case 'Levels/SP_Earthquake/SP_Earthquake':
            return 'Operation Swordbreaker';
        case 'Levels/SP_Earthquake2/SP_Earthquake2':
            return 'Uprising';
        case 'Levels/SP_Finale/SP_Finale':
            return 'The Great Destroyer';
        case 'Levels/SP_Interrogation/SP_Interrogation':
            return 'Intro';
        case 'Levels/SP_Jet/SP_Jet':
            return 'Going Hunting';
        case 'Levels/SP_New_York/SP_New_York':
            return 'Semper Fidelis';
        case 'Levels/SP_Paris/SP_Paris':
            return 'Comrades';
        case 'Levels/SP_Sniper/SP_Sniper':
            return 'Night Shift';
        case 'Levels/SP_Tank/SP_Tank':
            return 'Thunder Run';
        case 'Levels/SP_Tank_b/SP_Tank_b':
            return 'Fear No Evil';
        case 'Levels/SP_Valley/SP_Valley':
            return 'Rock and a Hard Place';
        case 'Levels/SP_Villa/SP_Villa':
            return "Kaffarov's Villa";

        default:
            const tokens = map.split('/');
            return tokens[tokens.length - 1];
    }
};

export const getLevelName = (map: string) => {
    const tokens = map.split('/');
    return tokens[tokens.length - 1];
};

export const hasMapImage = (map: string) => {
    switch (map) {
        case 'Levels/MP_001/MP_001':
        case 'Levels/MP_003/MP_003':
        case 'Levels/MP_007/MP_007':
        case 'Levels/MP_011/MP_011':
        case 'Levels/MP_012/MP_012':
        case 'Levels/MP_013/MP_013':
        case 'Levels/MP_017/MP_017':
        case 'Levels/MP_018/MP_018':
        case 'Levels/MP_Subway/MP_Subway':
        case 'Levels/XP1_001/XP1_001':
        case 'Levels/XP1_002/XP1_002':
        case 'Levels/XP1_003/XP1_003':
        case 'Levels/XP1_004/XP1_004':
        case 'Levels/XP2_Factory/XP2_Factory':
        case 'Levels/XP2_Office/XP2_Office':
        case 'Levels/XP2_Palace/XP2_Palace':
        case 'Levels/XP2_Skybar/XP2_Skybar':
        case 'Levels/XP3_Desert/XP3_Desert':
        case 'Levels/XP3_Alborz/XP3_Alborz':
        case 'Levels/XP3_Shield/XP3_Shield':
        case 'Levels/XP3_Valley/XP3_Valley':
        case 'Levels/XP4_FD/XP4_FD':
        case 'Levels/XP4_Parl/XP4_Parl':
        case 'Levels/XP4_Quake/XP4_Quake':
        case 'Levels/XP4_Rubble/XP4_Rubble':
        case 'Levels/XP5_001/XP5_001':
        case 'Levels/XP5_002/XP5_002':
        case 'Levels/XP5_003/XP5_003':
        case 'Levels/XP5_004/XP5_004':
        case 'Levels/COOP_002/COOP_002':
        case 'Levels/COOP_003/COOP_003':
        case 'Levels/COOP_006/COOP_006':
        case 'Levels/COOP_007/COOP_007':
        case 'Levels/COOP_009/COOP_009':
        case 'Levels/COOP_010/COOP_010':
        case 'Levels/SP_Bank/SP_Bank':
        case 'Levels/SP_Earthquake/SP_Earthquake':
        case 'Levels/SP_Earthquake2/SP_Earthquake2':
        case 'Levels/SP_Finale/SP_Finale':
        case 'Levels/SP_Interrogation/SP_Interrogation':
        case 'Levels/SP_Jet/SP_Jet':
        case 'Levels/SP_New_York/SP_New_York':
        case 'Levels/SP_Paris/SP_Paris':
        case 'Levels/SP_Sniper/SP_Sniper':
        case 'Levels/SP_Tank/SP_Tank':
        case 'Levels/SP_Tank_b/SP_Tank_b':
        case 'Levels/SP_Valley/SP_Valley':
        case 'Levels/SP_Villa/SP_Villa':
            return true;
        default:
            return false;
    }
};

export const getGamemodes = () => {
    return [
        'ConquestLarge0',
        'ConquestSmall0',
        'ConquestAssaultLarge0',
        'ConquestAssaultSmall0',
        'ConquestAssaultSmall1',
        'RushLarge0',
        'SquadRush0',
        'SquadDeathMatch0',
        'TeamDeathMatch0',
        'TeamDeathMatchC0',
        'CaptureTheFlag0',
        'AirSuperiority0',
        'GunMaster0',
        'Scavenger0',
        'TankSuperiority0',
        'Domination0',
        'KingOfTheHill0',
    ];
};

export const getMaps = () => {
    return [
        'Levels/MP_001/MP_001',
        'Levels/MP_003/MP_003',
        'Levels/MP_007/MP_007',
        'Levels/MP_011/MP_011',
        'Levels/MP_012/MP_012',
        'Levels/MP_013/MP_013',
        'Levels/MP_017/MP_017',
        'Levels/MP_018/MP_018',
        'Levels/MP_Subway/MP_Subway',
        'Levels/XP1_001/XP1_001',
        'Levels/XP1_002/XP1_002',
        'Levels/XP1_003/XP1_003',
        'Levels/XP1_004/XP1_004',
        'Levels/XP2_Factory/XP2_Factory',
        'Levels/XP2_Office/XP2_Office',
        'Levels/XP2_Palace/XP2_Palace',
        'Levels/XP2_Skybar/XP2_Skybar',
        'Levels/XP3_Desert/XP3_Desert',
        'Levels/XP3_Alborz/XP3_Alborz',
        'Levels/XP3_Shield/XP3_Shield',
        'Levels/XP3_Valley/XP3_Valley',
        'Levels/XP4_FD/XP4_FD',
        'Levels/XP4_Parl/XP4_Parl',
        'Levels/XP4_Quake/XP4_Quake',
        'Levels/XP4_Rubble/XP4_Rubble',
        'Levels/XP5_001/XP5_001',
        'Levels/XP5_002/XP5_002',
        'Levels/XP5_003/XP5_003',
        'Levels/XP5_004/XP5_004',
        'Levels/COOP_002/COOP_002',
        'Levels/COOP_003/COOP_003',
        'Levels/COOP_006/COOP_006',
        'Levels/COOP_007/COOP_007',
        'Levels/COOP_009/COOP_009',
        'Levels/COOP_010/COOP_010',
        'Levels/SP_Bank/SP_Bank',
        'Levels/SP_Earthquake/SP_Earthquake',
        'Levels/SP_Earthquake2/SP_Earthquake2',
        'Levels/SP_Finale/SP_Finale',
        'Levels/SP_Interrogation/SP_Interrogation',
        'Levels/SP_Jet/SP_Jet',
        'Levels/SP_New_York/SP_New_York',
        'Levels/SP_Paris/SP_Paris',
        'Levels/SP_Sniper/SP_Sniper',
        'Levels/SP_Tank/SP_Tank',
        'Levels/SP_Tank_b/SP_Tank_b',
        'Levels/SP_Valley/SP_Valley',
        'Levels/SP_Villa/SP_Villa',
    ];
};

export const isVextCompatible = (server: any, vextVersion: string) => {
    const currentVextParts = vextVersion.split('.');
    const serverVextParts = server.variables.vext_req.split('.');

    let currentMajor = currentVextParts.length > 0 ? parseInt(currentVextParts[0], 10) : 1;
    let currentMinor = currentVextParts.length > 1 ? parseInt(currentVextParts[1], 10) : 0;
    let currentPatch = currentVextParts.length > 2 ? parseInt(currentVextParts[2], 10) : 0;

    let serverMajor = serverVextParts.length > 0 ? parseInt(serverVextParts[0], 10) : 1;
    let serverMinor = serverVextParts.length > 1 ? parseInt(serverVextParts[1], 10) : 0;
    let serverPatch = serverVextParts.length > 2 ? parseInt(serverVextParts[2], 10) : 0;

    if (isNaN(currentMajor)) currentMajor = 1;

    if (isNaN(currentMinor)) currentMinor = 0;

    if (isNaN(currentPatch)) currentPatch = 0;

    if (isNaN(serverMajor)) serverMajor = 1;

    if (isNaN(serverMinor)) serverMinor = 0;

    if (isNaN(serverPatch)) serverPatch = 0;

    if (currentMajor !== serverMajor) return false;

    if (currentMinor < serverMinor) return false;

    if (currentMinor === serverMinor && currentPatch < serverPatch) return false;

    return true;
};

export const isServerBuildNewer = (server: any, build: any) => {
    const currentBuild = parseInt(build, 10);
    const requiredServerBuild = parseInt(server.variables.min_buildno, 10);

    return currentBuild < requiredServerBuild;
};

export const isServerBuildOlder = (server: any, minServerBuild: any) => {
    const minimumServerBuild = parseInt(minServerBuild, 10);
    const currentServerBuild = parseInt(server.variables.buildno, 10);

    return currentServerBuild < minimumServerBuild;
};

export const areXPacksAvailable = (server: any, availableXPacks: any) => {
    // Try to extract the XPack from the map.
    const xpacks = server.variables.xpacks;

    let xpackList = [];

    if (xpacks && xpacks.length > 0) xpackList = xpacks.split(',').map((val: any) => parseInt(val, 10));

    for (const xpack of xpackList) {
        if (isNaN(xpack)) continue;

        if (availableXPacks.indexOf(xpack) === -1) return false;
    }

    return true;
};

export const isMapAvailable = (server: any, availableXPacks: any) => {
    // Try to extract the XPack from the map.
    const mapname = server.variables.mapname;

    if (!mapname.startsWith('Levels/XP')) return true;

    const xpack = parseInt(mapname.substr(9, 1));

    if (isNaN(xpack)) return true;

    return availableXPacks.indexOf(xpack) !== -1;
};

/**
 * This method checks for join compatibility with this server and
 * returns an appropriate error message or `null` if compatible.
 * @returns {string|null}
 */
export const checkServerCompatibility = (
    server: any,
    availableXPacks: any,
    minServerBuild: any,
    build: any,
    vextVersion: any
) => {
    if (!isMapAvailable(server, availableXPacks))
        return 'This server is running a map you do not currently have installed.';

    if (!areXPacksAvailable(server, availableXPacks))
        return 'This server is using DLC content you do not currently have installed.';

    if (isServerBuildOlder(server, minServerBuild)) return 'This server is running an outdated build of VU.';

    if (isServerBuildNewer(server, build))
        return 'This server is running a newer build of VU. You need to update your client to join.';

    if (!isVextCompatible(server, vextVersion))
        return 'This server is running mods incompatible with your current build of VU. You may need to update.';

    return null;
};
