import type { FC } from 'react';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

interface IProps {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}

const Checkbox: FC<IProps> = ({ checked, onChange, label }) => {
    return (
        <div className="checkbox" onClick={() => onChange(!checked)}>
            {checked ? (
                <MdCheckBox style={{ marginRight: '6rem' }} />
            ) : (
                <MdCheckBoxOutlineBlank style={{ marginRight: '6rem' }} />
            )}
            <label>{label}</label>
        </div>
    );
};
export default Checkbox;
