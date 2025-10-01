import React, { memo } from 'react';
import { MdCloudDone, MdCloudDownload, MdCloudOff, MdCloudSync } from 'react-icons/md';

import { UpdateError } from '../../constants/UpdateError';
import { UpdateState } from '../../constants/UpdateState';
import useUpdateStore from '../../stores/useUpdateStore';

const UpdateIndicator: React.FC = () => {
    const percentage = useUpdateStore((s) => s.percentage);
    const error = useUpdateStore((s) => s.error);
    const state = useUpdateStore((s) => s.state);

    const renderEmpty = () => {
        return <div />;
    };

    const renderChecking = () => {
        return (
            <div className="update-indicator">
                <div className="update-indicator-container">
                    <span>Starting Update</span>
                    <MdCloudSync />
                </div>
            </div>
        );
    };

    const renderUpdating = () => {
        const _percentage = Math.round(percentage * 100.0);

        if (_percentage >= 99.9) {
            return (
                <div className="update-indicator">
                    <div className="update-indicator-container">
                        <span>Finishing Update</span>
                        <MdCloudDownload />
                    </div>
                </div>
            );
        }

        return (
            <div className="update-indicator">
                <div className="update-indicator-container">
                    <span>Updating {_percentage}%</span>
                    <MdCloudDownload />
                </div>
            </div>
        );
    };

    const renderUpdated = () => {
        return (
            <div className="update-indicator updated">
                <div className="update-indicator-container">
                    <span>Update Ready</span>
                    <MdCloudDone />
                </div>
            </div>
        );
    };

    const renderError = () => {
        let errorText = 'Update Error';

        switch (error) {
            case UpdateError.ACCESS_ERROR:
                errorText = 'Access Error';
                break;

            case UpdateError.DECOMPRESSION_ERROR:
            case UpdateError.DOWNLOAD_ERROR:
                errorText = 'Download Failed';
                break;
        }

        return (
            <div className="update-indicator error">
                <div className="update-indicator-container">
                    <span>{errorText}</span>
                    <MdCloudOff />
                </div>
            </div>
        );
    };

    switch (state) {
        case UpdateState.IDLE: {
            if (error !== UpdateError.NONE) return renderError();

            return renderEmpty();
        }

        case UpdateState.CHECKING_FOR_UPDATES:
        case UpdateState.DOWNLOADING_FILE_LIST:
            return renderChecking();

        case UpdateState.UPDATING:
            return renderUpdating();

        case UpdateState.DONE_UPDATING:
            return renderUpdated();

        default:
            return renderEmpty();
    }
};
export default memo(UpdateIndicator);
