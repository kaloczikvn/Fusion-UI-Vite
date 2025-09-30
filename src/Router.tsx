import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import BaseWrapper from './components/wrapper/BaseWrapper';
import PageConnection from './pages/PageConnection';
import PageCredits from './pages/PageCredits';
import PageLogin from './pages/PageLogin';
import PageMainMenu from './pages/PageMainMenu';
import PageOriginLink from './pages/PageOriginLink';
import PagePlayers from './pages/PagePlayers';
import PageServerBrowser from './pages/PageServerBrowser';
import PageSettings from './pages/PageSettings';

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
                path: 'settings',
                element: <PageSettings />,
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
