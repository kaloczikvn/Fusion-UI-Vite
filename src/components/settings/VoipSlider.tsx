import React from 'react';
import clsx from 'clsx';
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

    /*
    const onInputChange = (e?: any) => {
        // Make sure to only allow numbers.
        if (e.target.value.length > 0 && !e.target.value.match(/[0-9]+/g)) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            return;
        }

        if (e.target.value.length === 0) e.target.value = '0';

        let inputValue = parseInt(e.target.value, 10);

        if (inputValue > 100) {
            e.target.value = '100';
            inputValue = 100;
        }

        onChange(inputValue / 100.0);
    };
    */

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
            />
        </>
    );
};
export default VoipSlider;
