import React from 'react';

interface IProps {
    build: number;
}

const Watermark: React.FC<IProps> = ({ build }) => {
    return (
        <div id="watermark">
            <img src="/assets/img/logo-outline.svg" />
            {build && <span>#{build}</span>}
        </div>
    );
};
export default Watermark;
