import React from 'react';

import Slider from './Slider';

interface IProps {
    value: number;
    min?: number;
    max?: number;
    onChange: (e?: any) => void;
    className?: string;
}

const NumberInput: React.FC<IProps> = ({ value, min, max, onChange, className }) => {
    const _onSliderChange = (value: number | number[]) => {
        onChange(value);
    };

    return <Slider onChange={_onSliderChange} value={value} min={min} max={max} className={className} />;
};
export default NumberInput;
