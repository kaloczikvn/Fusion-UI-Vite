import clsx from 'clsx';
import React, { memo } from 'react';
import { MdOutlineDelete } from 'react-icons/md';

interface IProps {
    actions: Array<{ icon: React.ReactNode; callback: (e?: any) => void }>;
    name?: string;
    className?: string;
    deleteCallback?: (e?: any) => void;
    title: string;
}

const SoldierEntry: React.FC<IProps> = ({ actions, name, className, deleteCallback, title }) => {
    return (
        <div
            className={clsx('soldier-entry', className)}
            onClick={(e) => {
                e.preventDefault();

                if (!actions || actions.length === 0) return;

                actions[0].callback(e);
            }}
        >
            <div className="actions">
                {actions && actions.length > 0 ? (
                    <>
                        {actions.map((action, index) => (
                            <a
                                key={`action-${index}`}
                                href="#"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();

                                    action.callback(e);
                                }}
                            >
                                {action.icon}
                            </a>
                        ))}
                    </>
                ) : null}
            </div>
            <div className="bottom-content">
                <h2>{title}</h2>
                {name && name.length > 0 ? <h1>{name}</h1> : null}
                {deleteCallback ? (
                    <a
                        href="#"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            deleteCallback(e);
                        }}
                    >
                        <MdOutlineDelete />
                    </a>
                ) : null}
            </div>
        </div>
    );
};
export default memo(SoldierEntry);
