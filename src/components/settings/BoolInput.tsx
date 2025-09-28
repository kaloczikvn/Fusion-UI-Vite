import React from 'react';
import './BoolInput.scss';
import clsx from 'clsx';

interface IProps {
    value: boolean;
    onChange: (e?: any) => void;
}

const BoolInput: React.FC<IProps> = ({ value, onChange }) => {
    return (
        <label className={clsx('bool-input', { checked: value })} onClick={() => onChange(!value)}>
            <span className="slider round"></span>
            <span className="off">Off</span>
            <span className="on">On</span>
        </label>
    );
};
export default BoolInput;
