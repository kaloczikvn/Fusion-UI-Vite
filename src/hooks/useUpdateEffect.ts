import { type DependencyList, type EffectCallback, useEffect, useRef } from 'react';

const useUpdateEffect = (effect: EffectCallback, deps: DependencyList) => {
    const isFirstRender = useRef<boolean>(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        return effect();
    }, deps);
};
export default useUpdateEffect;
