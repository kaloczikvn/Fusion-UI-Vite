import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface IProps {
    percentage: number;
    completed?: boolean;
    error?: boolean;
}

const ProgressIndicator: React.FC<IProps> = ({ percentage, completed, error }) => {
    let roundedPercentage = Math.round(percentage);
    let pathStroke = '#fff';

    if (completed) pathStroke = 'rgba(176, 255, 136, 0.82)';
    if (error) pathStroke = 'rgb(255, 95, 95)';

    return (
        <div className="progress-indicator">
            <CircularProgressbar
                value={roundedPercentage}
                strokeWidth={13}
                styles={{
                    path: {
                        stroke: pathStroke,
                        strokeLinecap: 'butt',
                    },
                    trail: {
                        stroke: 'rgba(255, 255, 255, 0.2)',
                    },
                }}
            />
        </div>
    );
};
export default ProgressIndicator;
