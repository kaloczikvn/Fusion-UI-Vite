import './MultiKeybindInput.scss';

import React, { useRef, useState } from 'react';
import { MdKeyboard } from 'react-icons/md';

import { getInputDeviceKeyFromKeyboardEvent, InputDeviceKeyNames } from '../../constants/InputDeviceKey';
import Input from '../form/Input';

interface IProps {
    value: number;
    onChange: (e?: any) => void;
    placeholder?: string;
}

const MultiKeybindInput: React.FC<IProps> = ({ value, onChange, placeholder }) => {
    const [editing, setEditing] = useState<boolean>(false);
    const [originalValue] = useState<any>(value);
    const [currentValue, setCurrentValue] = useState<any>([]);
    const inputRef = useRef<any>(null);

    const _getValue = () => {
        if (editing) {
            if (currentValue.length === 0) {
                return '';
            }
            return currentValue.map((it: any) => InputDeviceKeyNames[it.key]).join(' + ') + ' +';
        }
        return currentValue.map((value: any) => InputDeviceKeyNames[value]).join(' + ');
    };

    const _onStartEditing = () => {
        if (editing) {
            return;
        }

        setCurrentValue([]);
        setEditing(true);
    };

    const _onCancel = (e?: any) => {
        e.preventDefault();

        setEditing(false);
    };

    const _onReset = (e?: any) => {
        e.preventDefault();

        onChange(originalValue);
    };

    const _onKeyDown = (e?: any) => {
        e.preventDefault();

        // Cancel
        if (e.key === 'Escape') {
            inputRef.current.blur();
            return;
        }

        const key = getInputDeviceKeyFromKeyboardEvent(e);
        if (!key) {
            console.warn(`${e.key}(${e.keyCode}) is not a supported InputDeviceKey`);
            return;
        }

        // Check if key was already added to the list
        // const exists = this.state.value.findIndex(it => it.keyCode === e.keyCode) !== -1;
        // if (exists) {
        //     console.warn(`${e.key}(${e.keyCode}) was already registered`);
        //     return;
        // }

        // Filter out any similar modifier key, add the new key and sort it by key code
        const newValue: any = [
            ...currentValue.filter((it: any) => it.keyCode !== e.keyCode),
            { keyCode: e.keyCode, key },
        ].sort((a: any, b: any) => (a.keyCode < b.keyCode ? 1 : 0));

        setCurrentValue(newValue);

        // Check if key is not a moddifer
        if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt') {
            inputRef.current.blur();
            onChange(newValue.map((it: any) => it.key));
        }
    };

    return (
        <div className="multi-keybind-input">
            <Input
                type="text"
                ref={inputRef}
                value={_getValue()}
                placeholder={editing ? 'Press a key...' : placeholder ?? ''}
                onKeyDown={_onKeyDown}
                onClick={_onStartEditing}
                onBlur={_onCancel}
                readOnly
                isFullWidth
                startIcon={<MdKeyboard />}
            />
            {editing ? (
                <button className="keybind-reset" onClick={_onCancel}>
                    Cancel
                </button>
            ) : null}
            {!editing && value !== originalValue ? (
                <button className="keybind-reset" onClick={_onReset}>
                    Reset
                </button>
            ) : null}
        </div>
    );
};
export default MultiKeybindInput;
