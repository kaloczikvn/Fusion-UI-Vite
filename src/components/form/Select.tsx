import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { MdArrowDropDown, MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

export interface Option<T> {
    value: T;
    label: string;
}

interface BaseProps<T> {
    options: Option<T>[];
    placeholder?: string;
}

interface SingleSelectProps<T> extends BaseProps<T> {
    multi?: false;
    value: T | null;
    onChange: (value: T) => void;
}

interface MultiSelectProps<T> extends BaseProps<T> {
    multi: true;
    value: T[];
    onChange: (value: T[]) => void;
}

type SelectProps<T> = SingleSelectProps<T> | MultiSelectProps<T>;

export function Select<T extends string | number | boolean>({
    options,
    placeholder = 'Select...',
    ...props
}: SelectProps<T>) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            // Close dropdown if clicked outside
            if (ref.current && !ref.current.contains(e.target as Node) && ref.current !== e.target) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    const isMulti = props.multi === true;

    const toggleValue = (val: T) => {
        if (isMulti) {
            const values = props.value as T[];
            if (values.includes(val)) {
                props.onChange(values.filter((v) => v !== val));
            } else {
                props.onChange([...values, val]);
            }
        } else {
            props.onChange(val);
            setOpen(false);
        }
    };

    let displayLabel = placeholder;
    let displayPlaceholder = true;

    if (isMulti) {
        const selected = options.filter((opt) => (props.value as T[]).includes(opt.value));
        if (selected.length) {
            if (selected.length > 4) {
                displayLabel = `${selected.length} item selected`;
            } else {
                displayLabel = selected.map((s) => s.label).join(', ');
            }
            displayPlaceholder = false;
        }
    } else {
        const selected = options.find((opt) => opt.value === props.value);
        if (selected) {
            displayLabel = selected.label;
            displayPlaceholder = false;
        }
    }

    return (
        <div ref={ref} className="input-wrapper full-width" onClick={() => setOpen((p) => !p)}>
            <div className="input-wrapper-padding">
                <span className={clsx('input-wrapper-value', { placeholder: displayPlaceholder })}>{displayLabel}</span>
                <MdArrowDropDown />
            </div>

            {open ? (
                <div className="input-wrapper-dropdown">
                    {options.map((opt) => {
                        const isSelected = isMulti
                            ? (props.value as T[]).includes(opt.value)
                            : props.value === opt.value;

                        return (
                            <div
                                key={String(opt.value)}
                                className={clsx('input-wrapper-dropdown-item', { selected: isSelected })}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleValue(opt.value);
                                }}
                            >
                                {isMulti ? (
                                    <>
                                        {isSelected ? (
                                            <MdCheckBox style={{ marginRight: '6rem' }} />
                                        ) : (
                                            <MdCheckBoxOutlineBlank style={{ marginRight: '6rem' }} />
                                        )}
                                    </>
                                ) : null}
                                {opt.label}
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}
