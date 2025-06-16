import React from 'react';

import './BoolInput.scss';

interface IProps {
    value: boolean;
    onChange: (e?: any) => void;
}

const BoolInput: React.FC<IProps> = ({ value, onChange }) => {
    return (
        <label className="bool-input">
            <input type="checkbox" checked={value} onChange={onChange} />
            <span className="slider round"></span>
            <span className="off">Off</span>
            <span className="on">On</span>
        </label>
    );
};
export default BoolInput;
