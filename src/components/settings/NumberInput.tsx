import React from 'react';
import clsx from 'clsx';
import Slider from 'rc-slider';
import './NumberInput.scss';

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

    const _onInputChange = (e?: any) => {
        // Make sure to only allow numbers.
        if (e.target.value.length > 0 && !e.target.value.match(/[0-9]+/g)) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            return;
        }

        if (e.target.value.length === 0) {
            e.target.value = 0;
        }

        let value = parseInt(e.target.value, 10);

        if (max !== undefined && value > max) {
            e.target.value = max;
            value = max;
        }

        if (min !== undefined && value < min) {
            e.target.value = min;
            value = min;
        }

        onChange(value);
    };

    return (
        <div className={clsx('slider-input', className)}>
            <input className="slider-value" type="text" onChange={_onInputChange} value={value} />
            <Slider onChange={_onSliderChange} value={value} min={min} max={max} />
        </div>
    );
};
export default NumberInput;
