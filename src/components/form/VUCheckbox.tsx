import './VUCheckbox.scss';

import type { FC } from 'react';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

interface IProps {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}

const VUCheckbox: FC<IProps> = ({ checked, onChange, label }) => {
    return (
        <div className="vu-checkbox" onClick={() => onChange(!checked)}>
            {checked ? (
                <MdCheckBox style={{ marginRight: '6rem' }} />
            ) : (
                <MdCheckBoxOutlineBlank style={{ marginRight: '6rem' }} />
            )}
            <label>{label}</label>
        </div>
    );
};
export default VUCheckbox;
