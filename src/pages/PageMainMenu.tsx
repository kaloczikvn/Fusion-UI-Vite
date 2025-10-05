import React, { useEffect, useRef } from 'react';
import { MdOpenInNew } from 'react-icons/md';

import { ActionTypes } from '../constants/ActionTypes';
import useBaseStore from '../stores/useBaseStore';

const PageMainMenu: React.FC = () => {
    const news = useBaseStore((s) => s.news);
    // const { setNavigate } = useNavigateStore((s) => s.actions);
    const fetchNewsIntervalRef = useRef<number | null>(null);

    const disableBlur = () => {
        window.DispatchAction(ActionTypes.SET_BLUR, { blur: false });
    };

    const enableMenu = () => {
        window.DispatchAction(ActionTypes.SET_MENU, { menu: true });
    };

    /*
    const openServersListWith = (tag: string) => {
        setNavigate('server-browser');

        window.DispatchAction(ActionTypes.SET_SERVER_FILTERS, {
            filters: {
                ...getDefaultFilters(),
                tags: [tag],
            },
        });
        window.DispatchAction(ActionTypes.SET_FAVORITE_SERVERS_ONLY, { favoriteServersOnly: false });
    };

    const openFavoritServers = () => {
        setNavigate('server-browser');

        window.DispatchAction(ActionTypes.SET_SERVER_FILTERS, {
            filters: getDefaultFilters(),
        });
        window.DispatchAction(ActionTypes.SET_FAVORITE_SERVERS_ONLY, { favoriteServersOnly: true });
    };
    */

    useEffect(() => {
        const fetchNews = () =>
            new Promise((resolve, reject) => {
                fetch('https://veniceunleashed.net/vu-ig-news')
                    .then((response: any) => {
                        response
                            .json()
                            .then((newsJson: any) => {
                                window.DispatchAction(ActionTypes.SET_NEWS, { news: newsJson });
                                resolve(newsJson);
                            })
                            .catch((err: any) => {
                                reject(err);
                            });
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        disableBlur();
        enableMenu();

        fetchNews();
        fetchNewsIntervalRef.current = setInterval(fetchNews, 30 * 60 * 1000);

        return () => {
            if (fetchNewsIntervalRef.current) {
                clearInterval(fetchNewsIntervalRef.current);
                fetchNewsIntervalRef.current = null;
            }
        };
    }, []);

    const openLink = (link: string, e: any) => {
        if (e) e.preventDefault();
        if (link === '#') return;

        window.WebUI.Call('OpenLink', link);
    };

    let newsLeft = {
        title: 'Please wait',
        description: 'Fetching latest news...',
        link: '#',
    };

    let newsRight = {
        title: 'Please wait',
        description: 'Fetching latest news...',
        link: '#',
    };

    if (news !== null) {
        newsLeft = news.newsLeft;
        newsRight = news.newsRight;
    }

    return (
        <div className="main-menu content-wrapper">
            {/*
            <h1 className="separator">Shortcuts</h1>
            <div className="buttons-container">
                <a
                    className="btn border-btn primary"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        openFavoritServers();
                    }}
                >
                    <MdBookmark />
                    <span>Favorites</span>
                </a>
                <a
                    href="#"
                    className="btn border-btn"
                    onClick={(e) => {
                        e.preventDefault();
                        openServersListWith('realitymod');
                    }}
                >
                    <span>Reality Mod</span>
                </a>
                <a
                    href="#"
                    className="btn border-btn"
                    onClick={(e) => {
                        e.preventDefault();
                        openServersListWith('fun-bots');
                    }}
                >
                    <span>Fun Bots</span>
                </a>
                <a
                    href="#"
                    className="btn border-btn"
                    onClick={(e) => {
                        e.preventDefault();
                        openServersListWith('zombies');
                    }}
                >
                    <span>Zombies</span>
                </a>
            </div>
            <h1 className="separator">News</h1>
            */}
            <div className="news-container">
                <a className="news-item" href={newsLeft.link} onClick={(e) => openLink(newsLeft.link, e)}>
                    <MdOpenInNew />
                    <div className="news-item-description">
                        <h2>{newsLeft.title}</h2>
                        <h1>{newsLeft.description}</h1>
                    </div>
                </a>
                <a className="news-item secondary" href={newsRight.link} onClick={(e) => openLink(newsRight.link, e)}>
                    <MdOpenInNew />
                    <div className="news-item-description">
                        <h2>{newsRight.title}</h2>
                        <h1>{newsRight.description}</h1>
                    </div>
                </a>
            </div>
        </div>
    );
};
export default PageMainMenu;
