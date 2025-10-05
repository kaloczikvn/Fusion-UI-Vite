import clsx from 'clsx';
import React from 'react';

import Slider from './Slider';

interface IProps {
    value: number;
    volume: number;
    onChange: (value: number) => void;
}

const VoipSlider: React.FC<IProps> = ({ value, volume, onChange }) => {
    const onSliderChange = (sliderValue: number) => {
        onChange(sliderValue / 100.0);
    };

    return (
        <>
            <Slider
                onChange={(number) => onSliderChange(number as number)}
                value={value * 100}
                extraNode={
                    <div
                        className={clsx('voip-volume', { active: volume > value })}
                        style={{ width: `${volume * 100.0}%` }}
                    />
                }
                min={0}
                max={100}
            />
        </>
    );
};
export default VoipSlider;
