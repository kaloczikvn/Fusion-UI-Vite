import React, { memo } from 'react';
import { MdOutlineReport } from 'react-icons/md';

import useBaseStore from '../../stores/useBaseStore';

const GlobalNotice: React.FC = () => {
    const globalNotice = useBaseStore((s) => s.globalNotice);

    if (!globalNotice) {
        return null;
    }

    const noticeText = globalNotice.toString().trim();

    if (noticeText.length === 0) {
        return null;
    }

    return (
        <div id="global-notice">
            <div className="header">
                <MdOutlineReport color="#fff" />
                <span>Global message</span>
                <MdOutlineReport color="#fff" />
            </div>
            <div className="notice">{noticeText}</div>
        </div>
    );
};
export default memo(GlobalNotice);
