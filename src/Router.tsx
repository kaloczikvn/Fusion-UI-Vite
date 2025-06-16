import { Navigate, RouterProvider, createBrowserRouter } from 'react-router';
import PageLogin from './pages/PageLogin';
import PageConnection from './pages/PageConnection';
import PageOriginLink from './pages/PageOriginLink';
import BaseWrapper from './components/wrapper/BaseWrapper';
import PageMainMenu from './pages/PageMainMenu';
import PageCredits from './pages/PageCredits';
import PageServerBrowser from './pages/PageServerBrowser';
import PagePlayers from './pages/PagePlayers';

const router = createBrowserRouter([
    {
        path: '/',
        element: <BaseWrapper />,
        children: [
            {
                path: 'login',
                element: <PageLogin />,
            },
            {
                path: 'players',
                element: <PagePlayers />,
            },
            {
                path: 'connection',
                element: <PageConnection />,
            },
            {
                path: 'origin-link',
                element: <PageOriginLink />,
            },
            {
                path: 'main-menu',
                element: <PageMainMenu />,
            },
            {
                path: 'server-browser',
                element: <PageServerBrowser />,
            },
            {
                path: 'credits',
                element: <PageCredits />,
            },
            {
                path: '*',
                element: <Navigate to="/" />,
            },
        ],
    },
]);

const Router: React.FC = () => {
    return <RouterProvider router={router} />;
};
export default Router;
