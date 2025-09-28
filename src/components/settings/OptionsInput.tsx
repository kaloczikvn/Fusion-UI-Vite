import React from 'react';
import Select from 'react-select';

import { SELECT_STYLE } from '../../constants/Styles';

interface IProps {
    value: any;
    options: any;
    onChange: (e?: any) => void;
    allowEmpty?: boolean;
}

const OptionsInput: React.FC<IProps> = ({ value, options, onChange, allowEmpty }) => {
    let _value = null;
    if (value) {
        _value = {
            value: value.value,
            label: value,
        };
    }

    let _options = [];
    if (options) {
        _options = options.map((t: any) => ({ value: t, label: t }));
    }

    return (
        <Select
            isSearchable={false}
            styles={SELECT_STYLE}
            value={_value}
            options={_options}
            onChange={onChange}
            isClearable={!!allowEmpty}
        />
    );
};
export default OptionsInput;
