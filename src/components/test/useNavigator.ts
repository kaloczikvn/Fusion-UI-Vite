import { useEffect } from 'react';
import useNavigateStore from '../../stores/useNavigateStore';
import { useNavigate } from 'react-router';

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
