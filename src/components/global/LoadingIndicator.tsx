import React, { memo,useEffect, useState } from 'react';

const LoadingIndicator: React.FC = () => {
    const [style, setStyle] = useState({});

    useEffect(() => {
        const timeout = setTimeout(() => {
            setStyle({ borderRadius: '52%' });
        }, 150);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return <i className="loading-indicator" style={style} />;
};
export default memo(LoadingIndicator);
