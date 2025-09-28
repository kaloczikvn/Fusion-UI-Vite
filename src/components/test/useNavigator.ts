import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import useNavigateStore from '../../stores/useNavigateStore';

const useNavigator = () => {
    const navigator = useNavigate();
    const navigate = useNavigateStore((s) => s.navigate);
    const { setNavigate } = useNavigateStore((s) => s.actions);

    useEffect(() => {
        if (navigate) {
            navigator(navigate);
            setNavigate(null);
        }
    }, [navigate]);
};
export default useNavigator;
