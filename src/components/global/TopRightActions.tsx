import React, { memo } from 'react';

import UpdateIndicator from './UpdateIndicator';

const TopRightActions: React.FC = () => {
    return (
        <ul className="top-actions right">
            <li>
                <UpdateIndicator />
            </li>
        </ul>
    );
};
export default memo(TopRightActions);
