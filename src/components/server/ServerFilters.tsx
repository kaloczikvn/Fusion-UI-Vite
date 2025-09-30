import { useEffect, useRef, useState } from 'react';

import { ActionTypes } from '../../constants/ActionTypes';
import useServerStore from '../../stores/useServerStore';
import { getDefaultFilters } from '../../utils/server';
import { getGamemodeName, getMapName } from '../../utils/server/server';
import Checkbox from '../form/Checkbox';
import Input from '../form/Input';
import { Select } from '../form/Select';

interface IProps {
    visible: boolean;
    onClose: () => void;
}

const ServerFilters: React.FC<IProps> = ({ visible, onClose }) => {
    const filters = useServerStore((s) => s.filters);
    const [filterState, setFilterState] = useState<any>(filters ? filters : getDefaultFilters());
    const servers = useServerStore((s) => s.map);

    const _onKeyDown = (e: any) => {
        if (e.keyCode === 13) _onApplyFilters(e);
    };

    const _onClose = (e: any) => {
        if (e) e.preventDefault();

        onClose();
    };

    const setServerFilters = (filters: any) => {
        window.DispatchAction(ActionTypes.SET_SERVER_FILTERS, { filters });
    };

    const _onResetFilters = (e: any) => {
        if (e) e.preventDefault();

        setFilterState({
            ...getDefaultFilters(),
        });

        setServerFilters(getDefaultFilters());

        onClose();
    };

    const _onApplyFilters = (e: any) => {
        if (e) e.preventDefault();

        setServerFilters(filterState);

        onClose();
    };

    const _onChangeMaps = (maps: any) => {
        setFilterState((prev: any) => ({
            ...prev,
            maps,
        }));
    };

    const _onChangeGamemodes = (gamemodes: any) => {
        setFilterState((prev: any) => ({
            ...prev,
            gamemodes,
        }));
    };

    const _onChangeTags = (tags: any) => {
        setFilterState((prev: any) => ({
            ...prev,
            tags,
        }));
    };

    const _onChangeServerName = (e: any) => {
        setFilterState((prev: any) => ({
            ...prev,
            serverName: e.target.value,
        }));
    };

    const _onChangeMinPlayers = (e: any) => {
        let value = e.target.value;

        // Make sure to only allow numbers.
        value = value.replace(/[^0-9]/g, '');

        if (value.length === 0) {
            e.target.value = '';

            setFilterState((prev: any) => ({
                ...prev,
                minPlayers: undefined,
            }));
            return;
        }

        setFilterState((prev: any) => ({
            ...prev,
            minPlayers: parseInt(value, 10),
        }));
    };

    const _onChangeMaxPlayers = (e: any) => {
        let value = e.target.value;

        // Make sure to only allow numbers.
        value = value.replace(/[^0-9]/g, '');

        if (value.length === 0) {
            e.target.value = '';

            setFilterState((prev: any) => ({
                ...prev,
                maxPlayers: undefined,
            }));
            return;
        }

        setFilterState((prev: any) => ({
            ...prev,
            maxPlayers: parseInt(value, 10),
        }));
    };

    const _onChangeMinPing = (e: any) => {
        let value = e.target.value;

        // Make sure to only allow numbers.
        value = value.replace(/[^0-9]/g, '');

        if (value.length === 0) {
            e.target.value = '';

            setFilterState((prev: any) => ({
                ...prev,
                minPing: undefined,
            }));
            return;
        }

        setFilterState((prev: any) => ({
            ...prev,
            minPing: parseInt(value, 10),
        }));
    };

    const _onChangeMaxPing = (e: any) => {
        let value = e.target.value;

        // Make sure to only allow numbers.
        value = value.replace(/[^0-9]/g, '');

        if (value.length === 0) {
            e.target.value = '';

            setFilterState((prev: any) => ({
                ...prev,
                maxPing: undefined,
            }));
            return;
        }

        setFilterState((prev: any) => ({
            ...prev,
            maxPing: parseInt(value, 10),
        }));
    };

    const _onChangeFreq30Hz = (value: boolean) => {
        setFilterState((prev: any) => ({
            ...prev,
            freq30Hz: value,
        }));
    };

    const _onChangeFreq60Hz = (value: boolean) => {
        setFilterState((prev: any) => ({
            ...prev,
            freq60Hz: value,
        }));
    };

    const _onChangeFreq120Hz = (value: boolean) => {
        setFilterState((prev: any) => ({
            ...prev,
            freq120Hz: value,
        }));
    };

    const _onChangeHideFull = (value: boolean) => {
        setFilterState((prev: any) => ({
            ...prev,
            hideFull: value,
        }));
    };

    const _onChangeHideEmpty = (value: boolean) => {
        setFilterState((prev: any) => ({
            ...prev,
            hideEmpty: value,
        }));
    };

    const _onChangeHidePassworded = (value: boolean) => {
        setFilterState((prev: any) => ({
            ...prev,
            hidePassworded: value,
        }));
    };

    const _onChangeHideIncompatible = (value: boolean) => {
        setFilterState((prev: any) => ({
            ...prev,
            hideIncompatible: value,
        }));
    };

    const mapSet = new Set<string>();
    const gamemodeSet = new Set<string>();
    const tagSet = new Set<string>();

    for (const guid of Object.keys(servers)) {
        const server = servers[guid];
        mapSet.add(server.variables.mapname);
        gamemodeSet.add(server.variables.gamemode);

        let serverTags: string[] = [];

        if (server.variables.tags && server.variables.tags.length > 0) serverTags = server.variables.tags.split(',');

        for (const tag of serverTags) {
            if (!/^[a-z0-9-]+$/.test(tag)) continue;

            tagSet.add(tag);
        }
    }

    const mapOptions: IDropdownOption[] = [];

    for (const map of mapSet) mapOptions.push({ value: map, label: getMapName(map as string) });

    mapOptions.sort((a, b) => a.label.localeCompare(b.label));

    const gamemodeOptions: IDropdownOption[] = [];

    for (const gamemode of gamemodeSet)
        gamemodeOptions.push({ value: gamemode, label: getGamemodeName(gamemode as string) });

    gamemodeOptions.sort((a, b) => {
        return a.label.localeCompare(b.label);
    });

    const tagOptions: IDropdownOption[] = [];

    for (const tag of tagSet) tagOptions.push({ value: tag, label: tag });

    tagOptions.sort((a: any, b: any) => a.value.localeCompare(b.value));

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        /*const handleClickOutside = (event: MouseEvent) => {
            if (visible && modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (visible) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };*/
    }, [visible]);

    if (!visible) return null;

    return (
        <div className="server-filters" ref={modalRef}>
            <div className="filter">
                <h3>Maps</h3>
                <Select options={mapOptions} onChange={_onChangeMaps} value={filterState.maps} multi />
            </div>
            <div className="filter">
                <h3>Gamemodes</h3>
                <Select options={gamemodeOptions} onChange={_onChangeGamemodes} value={filterState.gamemodes} multi />
            </div>
            <div className="filter">
                <h3>Tags</h3>
                <Select options={tagOptions} onChange={_onChangeTags} value={filterState.tags} multi />
            </div>
            <div className="left-right-flex">
                <div className="left">
                    <div className="filter">
                        <h3>Server name</h3>
                        <Input
                            placeholder="Server name"
                            type="text"
                            value={filterState.serverName}
                            onChange={_onChangeServerName}
                            onKeyDown={_onKeyDown}
                            isCompact
                        />
                    </div>
                    <div className="filter">
                        <h3>Player count</h3>
                        <div className="min-max-ctr">
                            <div>
                                <p>Min</p>
                                <Input
                                    placeholder="Min"
                                    type="number"
                                    value={filterState.minPlayers}
                                    onChange={_onChangeMinPlayers}
                                    onKeyDown={_onKeyDown}
                                    isCompact
                                />
                            </div>
                            {/* */}
                            <div>
                                <p>Max</p>
                                <Input
                                    placeholder="Max"
                                    type="number"
                                    value={filterState.maxPlayers}
                                    onChange={_onChangeMaxPlayers}
                                    onKeyDown={_onKeyDown}
                                    isCompact
                                />
                            </div>
                        </div>
                    </div>
                    <div className="filter">
                        <h3>Ping</h3>
                        <div className="min-max-ctr">
                            <div>
                                <p>Min</p>
                                <Input
                                    placeholder="Min"
                                    type="number"
                                    value={filterState.minPing}
                                    onChange={_onChangeMinPing}
                                    onKeyDown={_onKeyDown}
                                    isCompact
                                />
                            </div>
                            {/* */}
                            <div>
                                <p>Max</p>
                                <Input
                                    placeholder="Max"
                                    type="number"
                                    value={filterState.maxPing}
                                    onChange={_onChangeMaxPing}
                                    onKeyDown={_onKeyDown}
                                    isCompact
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="filter">
                        <h3>Server frequency</h3>
                        <div className="frequency-filters">
                            <Checkbox checked={filterState.freq30Hz} onChange={_onChangeFreq30Hz} label="30Hz" />
                            <Checkbox checked={filterState.freq60Hz} onChange={_onChangeFreq60Hz} label="60Hz" />
                            <Checkbox checked={filterState.freq120Hz} onChange={_onChangeFreq120Hz} label="120Hz" />
                        </div>
                    </div>
                    <div className="filter">
                        <h3>Visibility filters</h3>
                        <Checkbox
                            checked={filterState.hideFull}
                            onChange={_onChangeHideFull}
                            label="Hide full servers"
                        />
                        <Checkbox
                            checked={filterState.hideEmpty}
                            onChange={_onChangeHideEmpty}
                            label="Hide empty servers"
                        />
                        <Checkbox
                            checked={filterState.hidePassworded}
                            onChange={_onChangeHidePassworded}
                            label="Hide password protected servers"
                        />
                        <Checkbox
                            checked={filterState.hideIncompatible}
                            onChange={_onChangeHideIncompatible}
                            label="Hide incompatible servers"
                        />
                    </div>
                </div>
            </div>
            <div className="filter-buttons">
                <a href="#" className="btn border-btn" onClick={_onClose}>
                    Close
                </a>
                <a href="#" className="btn border-btn" onClick={_onResetFilters}>
                    Reset filters
                </a>
                <a href="#" className="btn border-btn primary" onClick={_onApplyFilters}>
                    Apply filters
                </a>
            </div>
        </div>
    );
};
export default ServerFilters;
