import React from 'react';
import Slider from 'rc-slider';
import clsx from 'clsx';

interface IProps {
    value: number;
    volume: number;
    onChange: (value: number) => void;
}

const VoipSlider: React.FC<IProps> = ({ value, volume, onChange }) => {
    const onSliderChange = (sliderValue: number) => {
        onChange(sliderValue / 100.0);
    };

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
    return (
        <div className="slider-input voip-slider">
            <input
                className="slider-value"
                type="text"
                maxLength={3}
                onChange={onInputChange}
                value={Math.round(value * 100)}
            />
            <Slider onChange={(number) => onSliderChange(number as number)} value={value * 100} />
            <div className={clsx('voip-volume', { active: volume > value })} style={{ width: volume * 100.0 + '%' }} />
        </div>
    );
};
export default VoipSlider;
