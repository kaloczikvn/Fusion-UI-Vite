import React, { memo } from 'react';

import useBaseStore from '../../stores/useBaseStore';

const Watermark: React.FC = () => {
    const build = useBaseStore((s) => s.build);

    return (
        <div id="watermark">
            <img src="/assets/img/logo-outline.svg" />
            {build ? <span>{`#${build}`}</span> : null}
        </div>
    );
};
export default memo(Watermark);
