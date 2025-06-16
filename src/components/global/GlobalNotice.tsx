import React from 'react';
import { MdOutlineReport } from 'react-icons/md';

interface IProps {
    notice: string;
}

const GlobalNotice: React.FC<IProps> = ({ notice }) => {
    return (
        <div id="global-notice">
            <div className="header">
                <MdOutlineReport color="#fff" />
                <span>Global message</span>
                <MdOutlineReport color="#fff" />
            </div>
            <div className="notice">{notice}</div>
        </div>
    );
};
export default GlobalNotice;
