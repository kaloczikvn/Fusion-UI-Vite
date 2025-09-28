import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';

import { ActionTypes } from '../../constants/ActionTypes';
import useServerStore from '../../stores/useServerStore';
import { getDefaultFilters } from '../../utils/server';
import { getGamemodeName, getMapName } from '../../utils/server/server';
import VUCheckbox from '../form/VUCheckbox';

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

    const _onChangeMaps = (mapsValues: any) => {
        const maps: any = [];

        if (mapsValues !== null) for (const map of mapsValues) maps.push(map.value);

        setFilterState((prev: any) => ({
            ...prev,
            maps,
        }));
    };

    const _onChangeGamemodes = (gamemodesValues: any) => {
        const gamemodes: any = [];

        if (gamemodesValues !== null) for (const gamemode of gamemodesValues) gamemodes.push(gamemode.value);

        setFilterState((prev: any) => ({
            ...prev,
            gamemodes,
        }));
    };

    const _onChangeTags = (tagsValues: any) => {
        const tags: any = [];

        if (tagsValues !== null) for (const tag of tagsValues) tags.push(tag.value);

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

    const selectStyle = {
        control: (provided: any) => ({
            ...provided,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: 0,
            border: '0.1574074074074074vh solid rgba(255, 255, 255, 0.7)',
            '&:hover': {
                borderColor: 'rgba(255, 255, 255, 1)',
            },
            minHeight: '3.703703703703704vh', // 40px
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: '#fff',
            fontWeight: 300,
            fontSize: '1.851851851851852vh', // 20px
        }),
        option: (provided: any, state: any) => {
            let backgroundColor = 'transparent';
            let color = '#fff';
            let fontWeight = 300;

            if (state.isFocused && !state.isSelected) {
                backgroundColor = 'rgba(255, 255, 255, 0.2)';
            } else if (state.isSelected) {
                backgroundColor = 'rgba(255, 255, 255, 0.8)';
                color = '#000';
                fontWeight = 500;
            }

            return {
                ...provided,
                backgroundColor,
                color,
                fontWeight,
                fontSize: '1.851851851851852vh', // 20px
                padding: '0.7407407407407407vh 1.111111111111111vh', // 8px 12px,
            };
        },
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            willChange: 'top',
            borderRadius: 0,
            boxShadow: 'none',
            border: '0.1574074074074074vh solid rgba(255, 255, 255, 0.4)',
        }),
        dropdownIndicator: (provided: any) => ({
            ...provided,
            padding: '0.7407407407407407vh', // 8px
            svg: {
                height: '1.851851851851852vh', // 20px
                width: '1.851851851851852vh', // 20px
            },
        }),
        indicatorSeparator: (provided: any) => ({
            ...provided,
            width: '0.1574074074074074vh', // 1.7px
            marginTop: '0.7407407407407407vh', // 8px
            marginBottom: '0.7407407407407407vh', // 8px
        }),
        valueContainer: (provided: any) => ({
            ...provided,
            padding: '0 0.7407407407407407vh', // 0 8px
            minHeight: '3.546296296296296vh', // 38.3px
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: 0,
            margin: '0.1851851851851852vh', // 2px
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: '#fff',
            padding: 0,
            fontWeight: 300,
            paddingLeft: '0.5555555555555556vh', // 6px
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            paddingLeft: '0.3703703703703704vh', // 4px
            paddingRight: '0.3703703703703704vh', // 4px
            svg: {
                width: '1.296296296296296vh', // 14px
                height: '1.296296296296296vh', // 14px
            },
        }),
        clearIndicator: (provided: any) => ({
            ...provided,
            padding: '0.7407407407407407vh', // 8px
            svg: {
                width: '1.851851851851852vh', // 20px
                height: '1.851851851851852vh', // 20px
            },
        }),
        input: (provided: any) => ({
            ...provided,
            color: '#fff',
            fontSize: '1.666666666666667vh', // 18px
        }),
        noOptionsMessage: (provided: any) => ({
            ...provided,
            padding: '0.7407407407407407vh 1.111111111111111vh', // 8px 12px,
            fontSize: '1.851851851851852vh', // 20px
        }),
    };

    const mapSet = new Set();
    const gamemodeSet = new Set();
    const tagSet = new Set();

    for (const guid of Object.keys(servers)) {
        const server = servers[guid];
        mapSet.add(server.variables.mapname);
        gamemodeSet.add(server.variables.gamemode);

        let serverTags = [];

        if (server.variables.tags && server.variables.tags.length > 0) serverTags = server.variables.tags.split(',');

        for (const tag of serverTags) {
            if (!/^[a-z0-9-]+$/.test(tag)) continue;

            tagSet.add(tag);
        }
    }

    const mapOptions = [];

    for (const map of mapSet) mapOptions.push({ value: map, label: getMapName(map as string) });

    mapOptions.sort((a, b) => a.label.localeCompare(b.label));

    const selectedMaps = [];

    for (const map of filterState.maps) selectedMaps.push({ value: map, label: getMapName(map) });

    const gamemodeOptions = [];

    for (const gamemode of gamemodeSet)
        gamemodeOptions.push({ value: gamemode, label: getGamemodeName(gamemode as string) });

    gamemodeOptions.sort((a, b) => {
        return a.label.localeCompare(b.label);
    });

    const selectedGamemodes = [];

    for (const gamemode of filterState.gamemodes)
        selectedGamemodes.push({ value: gamemode, label: getGamemodeName(gamemode) });

    const tagOptions = [];

    for (const tag of tagSet) tagOptions.push({ value: tag, label: tag });

    tagOptions.sort((a: any, b: any) => a.value.localeCompare(b.value));

    const selectedTags = [];

    for (const tag of filterState.tags) selectedTags.push({ value: tag, label: tag });

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (visible && modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (visible) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [visible]);

    if (!visible) return null;

    return (
        <div className="server-filters">
            <div className="filter">
                <h3>Maps</h3>
                <Select
                    options={mapOptions}
                    isSearchable
                    onChange={_onChangeMaps}
                    styles={selectStyle}
                    closeMenuOnSelect={false}
                    value={selectedMaps}
                    isMulti
                />
            </div>
            <div className="filter">
                <h3>Gamemodes</h3>
                <Select
                    options={gamemodeOptions}
                    isSearchable
                    onChange={_onChangeGamemodes}
                    styles={selectStyle}
                    closeMenuOnSelect={false}
                    value={selectedGamemodes}
                    isMulti
                />
            </div>
            <div className="filter">
                <h3>Tags</h3>
                <Select
                    options={tagOptions}
                    isSearchable
                    onChange={_onChangeTags}
                    styles={selectStyle}
                    closeMenuOnSelect={false}
                    value={selectedTags}
                    isMulti
                />
            </div>
            <div className="left-right-flex">
                <div className="left">
                    <div className="filter">
                        <h3>Server name</h3>
                        <div className="field-container">
                            <input
                                type="text"
                                value={filterState.serverName}
                                onChange={_onChangeServerName}
                                onKeyDown={_onKeyDown}
                            />
                        </div>
                    </div>
                    <div className="filter">
                        <h3>Player count</h3>
                        <div className="min-max-ctr">
                            <div>
                                <p>Min</p>
                                <div className="field-container">
                                    <input
                                        type="number"
                                        value={filterState.minPlayers}
                                        onChange={_onChangeMinPlayers}
                                        onKeyDown={_onKeyDown}
                                    />
                                </div>
                            </div>
                            {/* */}
                            <div>
                                <p>Max</p>
                                <div className="field-container">
                                    <input
                                        type="number"
                                        value={filterState.maxPlayers}
                                        onChange={_onChangeMaxPlayers}
                                        onKeyDown={_onKeyDown}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="filter">
                        <h3>Ping</h3>
                        <div className="min-max-ctr">
                            <div>
                                <p>Min</p>
                                <div className="field-container">
                                    <input
                                        type="number"
                                        value={filterState.minPing}
                                        onChange={_onChangeMinPing}
                                        onKeyDown={_onKeyDown}
                                    />
                                </div>
                            </div>
                            {/* */}
                            <div>
                                <p>Max</p>
                                <div className="field-container">
                                    <input
                                        type="number"
                                        value={filterState.maxPing}
                                        onChange={_onChangeMaxPing}
                                        onKeyDown={_onKeyDown}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="filter">
                        <h3>Server frequency</h3>
                        <div className="frequency-filters">
                            <VUCheckbox checked={filterState.freq30Hz} onChange={_onChangeFreq30Hz} label="30Hz" />
                            <VUCheckbox checked={filterState.freq60Hz} onChange={_onChangeFreq60Hz} label="60Hz" />
                            <VUCheckbox checked={filterState.freq120Hz} onChange={_onChangeFreq120Hz} label="120Hz" />
                        </div>
                    </div>
                    <div className="filter">
                        <h3>Visibility filters</h3>
                        <VUCheckbox
                            checked={filterState.hideFull}
                            onChange={_onChangeHideFull}
                            label="Hide full servers"
                        />
                        <VUCheckbox
                            checked={filterState.hideEmpty}
                            onChange={_onChangeHideEmpty}
                            label="Hide empty servers"
                        />
                        <VUCheckbox
                            checked={filterState.hidePassworded}
                            onChange={_onChangeHidePassworded}
                            label="Hide password protected servers"
                        />
                        <VUCheckbox
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
