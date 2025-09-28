import React from 'react';

import PageSettings from '../../pages/PageSettings';

const SettingsPopup: React.FC = () => {
    return (
        <div id="settings-popup">
            <PageSettings popup />
        </div>
    );
};
export default SettingsPopup;
