import { type FC, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Input from '../form/Input';

interface IProps {
    className?: string;
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    extraNode?: ReactNode;
}

const styles = {
    slider: {
        flex: '1',
        height: '6rem',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '6rem',
        position: 'relative',
        cursor: 'pointer',
        margin: '10rem 0',
    },
    thumb: {
        position: 'absolute',
        top: '0',
        width: '16rem',
        height: '16rem',
        background: '#ffffff',
        borderRadius: '50%',
        transform: 'translateX(-50%) translateY(-6rem)',
        cursor: 'pointer',
        opacity: '0.8',
    },
    track: {
        height: '6rem',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '6rem',
        position: 'absolute',
        top: '0',
        left: '0',
    },
};

const Slider: FC<IProps> = ({ className, value, onChange, min, max, extraNode }) => {
    const sliderRef = useRef<any>(null);
    const isDragging = useRef<boolean>(false);
    const rectCache = useRef<any>(null);

    const sliderClassName = useMemo(() => {
        return className ? `slider-input ${className}` : 'slider-input';
    }, [className]);

    // Determine if we're using min/max or default 0-1 range
    const hasMinMax = min !== undefined && max !== undefined;

    // Calculate initial local value based on mode
    const [localValue, setLocalValue] = useState(() => {
        if (hasMinMax) {
            return Math.round(value);
        } else {
            // For 0-1 range, display as 0-100 percentage
            return Math.round(value * 100);
        }
    });

    // Update local value when external value changes
    useEffect(() => {
        if (!isDragging.current) {
            if (hasMinMax) {
                setLocalValue(Math.round(value));
            } else {
                setLocalValue(Math.round(value * 100));
            }
        }
    }, [value, hasMinMax]);

    // Cache rect to avoid repeated getBoundingClientRect calls
    const updateRectCache = useCallback(() => {
        if (sliderRef.current) {
            rectCache.current = sliderRef.current.getBoundingClientRect();
        }
    }, []);

    const updateSliderValue = useCallback(
        (e: any) => {
            if (!rectCache.current) return;

            const x = e.clientX - rectCache.current.left;
            let percentage = Math.max(0, Math.min(100, (x / rectCache.current.width) * 100));

            // Round percentage to avoid floating point precision issues
            percentage = Math.round(percentage * 100) / 100;

            if (hasMinMax) {
                // Convert percentage to min-max range
                const rawValue = (percentage / 100) * (max - min) + min;
                const newValue = Math.round(rawValue);
                const clampedValue = Math.max(min, Math.min(max, newValue));

                setLocalValue(clampedValue);
                onChange(clampedValue);
            } else {
                // For 0-1 range, work with percentages
                const newValue = Math.round(percentage);

                setLocalValue(newValue);
                onChange(newValue / 100); // Convert back to 0-1 range
            }
        },
        [onChange, hasMinMax, min, max]
    );

    const handleMouseDown = useCallback(
        (e: any) => {
            e.preventDefault();
            isDragging.current = true;

            // Cache rect once at start of drag
            updateRectCache();
            updateSliderValue(e);

            const handleMouseMove = (moveEvent: any) => {
                if (isDragging.current) {
                    updateSliderValue(moveEvent);
                }
            };

            const handleMouseUp = () => {
                isDragging.current = false;
                rectCache.current = null;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },
        [updateSliderValue, updateRectCache]
    );

    const handleSliderClick = useCallback(
        (e: any) => {
            if (!isDragging.current) {
                updateRectCache();
                updateSliderValue(e);
            }
        },
        [updateSliderValue, updateRectCache]
    );

    const onInputChange = useCallback(
        (e: any) => {
            let inputValue = e.target.value;

            if (inputValue === '') {
                if (hasMinMax) {
                    setLocalValue(min);
                    onChange(min);
                } else {
                    setLocalValue(0);
                    onChange(0);
                }
                return;
            }

            if (hasMinMax) {
                // Handle min-max range
                const allowNegative = min < 0;
                const regex = allowNegative ? /[^0-9-]/g : /[^0-9]/g;
                inputValue = inputValue.replace(regex, '');

                if (inputValue === '' || inputValue === '-') {
                    inputValue = min.toString();
                }

                let numValue = parseInt(inputValue, 10) || min;

                // Clamp to min-max range
                if (numValue > max) {
                    numValue = max;
                    e.target.value = max.toString();
                } else if (numValue < min) {
                    numValue = min;
                    e.target.value = min.toString();
                }

                setLocalValue(numValue);
                onChange(numValue);
            } else {
                // Handle 0-100 percentage display (0-1 internal)
                inputValue = inputValue.replace(/[^0-9]/g, '');
                if (inputValue === '') inputValue = '0';

                let numValue = parseInt(inputValue, 10) || 0;
                if (numValue > 100) {
                    numValue = 100;
                    e.target.value = '100';
                }

                setLocalValue(numValue);
                onChange(numValue / 100); // Convert to 0-1 range
            }
        },
        [onChange, hasMinMax, min, max]
    );

    // Calculate percentage for visual positioning (0-100%)
    const percentage = useMemo(() => {
        if (hasMinMax) {
            return ((localValue - min) / (max - min)) * 100;
        } else {
            return localValue; // localValue is already a percentage (0-100)
        }
    }, [localValue, hasMinMax, min, max]);

    // Memoize dynamic styles
    const thumbStyleWithPosition = useMemo(
        () => ({
            ...styles.thumb,
            left: `${percentage}%`,
        }),
        [styles.thumb, percentage]
    );

    const trackStyleWithWidth = useMemo(
        () => ({
            ...styles.track,
            width: `${percentage}%`,
        }),
        [styles.track, percentage]
    );

    // Calculate maxLength for input field
    const inputMaxLength = useMemo(() => {
        if (hasMinMax) {
            return Math.max(min.toString().length, max.toString().length) + (min < 0 ? 1 : 0);
        } else {
            return 3; // For 0-100 percentage
        }
    }, [hasMinMax, min, max]);

    return (
        <div className={sliderClassName}>
            <Input
                className="slider-value"
                type="text"
                maxLength={inputMaxLength}
                onChange={onInputChange}
                value={localValue}
            />
            <div ref={sliderRef} style={styles.slider as any} onMouseDown={handleMouseDown} onClick={handleSliderClick}>
                <div style={trackStyleWithWidth as any} />
                <div style={thumbStyleWithPosition as any} />
                {extraNode}
            </div>
        </div>
    );
};
export default Slider;
