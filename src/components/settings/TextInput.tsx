import React from 'react';

import './TextInput.scss';

interface IProps {
    value: string;
    onChange: (e?: any) => void;
    placeholder?: string;
}

const TextInput: React.FC<IProps> = ({ value, onChange, placeholder }) => {
    return (
        <input type="text" value={value} onChange={onChange} placeholder={placeholder ?? ''} className="text-input" />
    );
};
export default TextInput;
